from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func
from sqlalchemy.orm import selectinload
from typing import Optional, List
import time
import uuid
import logging
from openai import AsyncAzureOpenAI

from ..database import get_db
from ..models.user import User
from ..models.assistant import Assistant
from ..models.chat import ChatHistory, Message, MessageRole
from ..schemas.assistant import (
    AssistantCreate, AssistantUpdate, AssistantResponse, 
    AssistantsListResponse, AssistantListItem, AssistantWithChatHistory
)
from ..schemas.chat import (
    SendMessageRequest, SendMessageResponse, ChatHistoryResponse,
    ConversationMessage, SenderInfo
)
from ..auth.jwt import get_current_user
from ..config import settings

router = APIRouter(prefix="/api/main/assistants", tags=["assistants"])
logger = logging.getLogger(__name__)

# Инициализация Azure OpenAI клиента
azure_openai_client = None
if settings.azure_openai_api_key and settings.azure_openai_base_url:
    try:
        azure_openai_client = AsyncAzureOpenAI(
            api_key=settings.azure_openai_api_key,
            azure_endpoint=settings.azure_openai_base_url,
            api_version=settings.azure_openai_api_version
        )
    except Exception as e:
        logger.error(f"Failed to create Azure OpenAI client: {e}")
        azure_openai_client = None

@router.get("/", response_model=AssistantsListResponse)
async def get_assistants(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить список ассистентов пользователя"""
    result = await db.execute(
        select(Assistant)
        .where(Assistant.user_id == current_user.id)
        .where(Assistant.is_active == True)
        .order_by(desc(Assistant.updated_at))
    )
    assistants = result.scalars().all()
    
    # Преобразуем в нужный формат
    assistant_items = [
        AssistantListItem(
            id=str(assistant.id),
            name=str(assistant.name),
            description=str(assistant.description) if assistant.description is not None else None,
            model=str(assistant.model),
            lastEdited=int(assistant.updated_at.timestamp()) if assistant.updated_at is not None else int(assistant.created_at.timestamp())
        )
        for assistant in assistants
    ]
    
    return AssistantsListResponse(
        data=assistant_items,
        total=len(assistant_items)
    )

@router.get("/{assistant_id}", response_model=AssistantWithChatHistory)
async def get_assistant(
    assistant_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить ассистента с историей чатов"""
    result = await db.execute(
        select(Assistant)
        .options(
            selectinload(Assistant.chat_histories)
            .selectinload(ChatHistory.messages)
        )
        .where(Assistant.id == assistant_id)
        .where(Assistant.user_id == current_user.id)
    )
    assistant = result.scalar_one_or_none()
    
    if not assistant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assistant not found"
        )
    
    # Преобразуем историю чатов в нужный формат
    chat_history = []
    for chat in assistant.chat_histories:
        if chat.enable:
            # Преобразуем сообщения
            conversation = []
            for message in chat.messages:
                conversation.append(ConversationMessage(
                    id=str(message.id),
                    sender=SenderInfo(
                        id=message.sender_id,
                        name=message.sender_name,
                        avatarImageUrl=message.avatar_image_url
                    ),
                    content=message.content,
                    timestamp=message.timestamp,
                    isMyMessage=message.is_my_message,
                    fresh=message.fresh
                ))
            
            chat_history.append(ChatHistoryResponse(
                id=str(chat.id),
                title=chat.title,
                conversation=conversation,
                lastConversation=chat.last_conversation or "",
                createdTime=chat.created_time,
                updatedTime=chat.updated_time,
                enable=chat.enable
            ))
    
    response = AssistantWithChatHistory.model_validate(assistant)
    response.chat_history = chat_history
    
    return response

@router.post("/{assistant_id}/chat", response_model=SendMessageResponse)
async def send_message_to_assistant(
    assistant_id: int,
    request: SendMessageRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Отправить сообщение ассистенту"""
    
    logger.info(f"🔥 Chat request received: assistant_id={assistant_id}, user={current_user.username}")
    logger.info(f"🔥 Message: {request.message[:100]}...")
    if request.images:
        logger.info(f"📸 Images received: {len(request.images)} images")
    else:
        logger.info("📸 No images in request")
    
    try:
        # Check if assistant exists and belongs to user
        result = await db.execute(
            select(Assistant)
            .where(Assistant.id == assistant_id)
            .where(Assistant.user_id == current_user.id)
        )
        assistant = result.scalar_one_or_none()
        
        # If no assistant found, create a default one for this user
        if not assistant:
            logger.info(f"Creating default assistant for user {current_user.id}")
            assistant = Assistant(
                user_id=current_user.id,
                name="AI Помощник по поиску работы",
                description="Ваш персональный AI-ассистент для поиска работы и карьерного консультирования",
                model="gpt-4o",
                system_prompt="Ты - профессиональный консультант по карьере и поиску работы. Помогай пользователям находить подходящие вакансии, составлять резюме и готовиться к собеседованиям. Будь вежливым и профессиональным. Если пользователь прислал изображение, то используй его для анализа и ответа. Помоги пользователю стать увереннее в себе и мягко отвечай на вопросы, морально поддерживай как друга.",
                temperature="0.5",
                max_tokens=4096,
                is_active=True
            )
            db.add(assistant)
            await db.commit()
            await db.refresh(assistant)
    
        # Находим или создаем историю чата
        participant_id = request.participant
        chat_history = None
        
        if participant_id and participant_id != "":
            # Проверяем, является ли participant_id числом (существующий чат)
            try:
                chat_id = int(participant_id)
                # Ищем существующий чат по ID
                chat_result = await db.execute(
                    select(ChatHistory)
                    .where(ChatHistory.id == chat_id)
                    .where(ChatHistory.user_id == current_user.id)
                    .where(ChatHistory.assistant_id == assistant.id)
                    .options(selectinload(ChatHistory.messages))
                )
                chat_history = chat_result.scalar_one_or_none()
            except ValueError:
                # participant_id не является числом - это новый чат с UUID
                # Не ищем существующий чат, создадим новый
                chat_history = None
        
        if not chat_history:
            # Создаем новый чат
            current_time = int(time.time())
            chat_history = ChatHistory(
                assistant_id=assistant.id,
                user_id=current_user.id,
                title=request.message[:50] + "..." if len(request.message) > 50 else request.message,
                last_conversation=request.message,
                created_time=current_time,
                updated_time=current_time,
                enable=True
            )
            db.add(chat_history)
            await db.flush()  # Получаем ID
        
        # Сохраняем сообщение пользователя
        user_message = Message(
            chat_history_id=chat_history.id,
            content=request.message,
            role=MessageRole.USER,
            sender_id="user",
            sender_name=current_user.username,
            is_my_message=True,
            fresh=False
        )
        db.add(user_message)
        
        # Загружаем историю сообщений ПЕРЕД вызовом AI API
        messages_result = await db.execute(
            select(Message)
            .where(Message.chat_history_id == chat_history.id)
            .order_by(Message.id.desc())
            .limit(10)
        )
        recent_messages = messages_result.scalars().all()
        
        # Генерируем ответ ассистента (передаем список сообщений, НЕ chat_history)
        ai_response_content = await generate_ai_response(
            user_message=request.message,
            recent_messages=list(reversed(recent_messages)),  # Переворачиваем для правильной очередности
            images=request.images  # Передаем изображения
        )
        
        # Сохраняем ответ ассистента
        ai_message = Message(
            chat_history_id=chat_history.id,
            content=ai_response_content,
            role=MessageRole.AI,
            sender_id="ai",
            sender_name="BOT",
            avatar_image_url="/img/thumbs/ai.jpg",
            is_my_message=False,
            fresh=True
        )
        db.add(ai_message)
        
        # Сохраняем все изменения
        try:
            await db.commit()
            logger.info(f"💾 Successfully saved message to database")
        except Exception as e:
            logger.error(f"❌ Database error: {str(e)}")
            await db.rollback()
            # Все равно возвращаем ответ, даже если не смогли сохранить в БД
            pass
        
        # Возвращаем ответ в формате, совместимом с фронтендом
        response = SendMessageResponse(
            replies=[ai_response_content]
        )
        
        logger.info(f"✅ Chat response prepared successfully")
        return response
        
    except Exception as e:
        logger.error(f"❌ Error in chat endpoint: {str(e)}")
        logger.exception("Full error traceback:")
        
        # Return error response but in the expected format
        return SendMessageResponse(
            replies=[f"Извините, произошла ошибка при обработке вашего сообщения. Попробуйте еще раз. (Ошибка: {str(e)})"]
        )

async def generate_ai_response(
    user_message: str, 
    recent_messages: list | None = None,
    images: list[str] | None = None
) -> str:
    """Генерирует ответ ассистента используя Azure OpenAI API"""
    
    # Определяем язык пользователя
    user_language = detect_language(user_message)
    
    # Если Azure OpenAI API не настроен, используем мок-ответы
    if not azure_openai_client or not settings.azure_openai_api_key:
        logger.warning("Azure OpenAI API not configured, using mock responses")
        return generate_mock_ai_response(user_message, images, user_language)
    
    logger.info(f"🤖 Calling Azure OpenAI API for message: {user_message[:50]}... (Language: {user_language})")
    
    try:
        # Подготавливаем контекст разговора
        messages = []
        
        # Добавляем системный промпт ассистента на соответствующем языке
        system_prompt = get_system_prompt(user_language)
        messages.append({
            "role": "system",
            "content": system_prompt
        })
        
        # Добавляем историю последних сообщений
        if recent_messages:
            for msg in recent_messages:
                if msg.role == MessageRole.USER:
                    messages.append({
                        "role": "user",
                        "content": msg.content
                    })
                elif msg.role == MessageRole.AI:
                    messages.append({
                        "role": "assistant", 
                        "content": msg.content
                    })
        
        # Добавляем текущее сообщение пользователя
        if images and len(images) > 0:
            # Сообщение с изображениями - используем строку как fallback для совместимости
            content_text = f"{user_message}\n\n[Изображение прикреплено]"
            messages.append({
                "role": "user", 
                "content": content_text
            })
            
            logger.info(f"📸 Received {len(images)} images for analysis")
        else:
            # Обычное текстовое сообщение
            messages.append({
                "role": "user",
                "content": user_message
            })
        
        # Вызываем Azure OpenAI API
        response = await azure_openai_client.chat.completions.create(
            model=settings.azure_openai_deployment_name,  # Используем deployment name
            messages=messages,
            max_tokens=settings.azure_openai_max_tokens,
            temperature=float(settings.azure_openai_temperature),
            stream=False
        )
        
        # Извлекаем ответ
        ai_response = response.choices[0].message.content
        
        if not ai_response:
            logger.error("Empty response from Azure OpenAI")
            return generate_mock_ai_response(user_message, images, user_language)
            
        logger.info(f"✅ Azure OpenAI API response received: {len(ai_response)} characters")
        return ai_response.strip()
        
    except Exception as e:
        logger.error(f"❌ Error calling Azure OpenAI API: {str(e)}")
        logger.error(f"   Using mock response instead")
        # В случае ошибки возвращаем мок-ответ
        return generate_mock_ai_response(user_message, images, user_language)

def detect_language(text: str) -> str:
    """Определяет язык текста (русский, казахский, английский)"""
    text_lower = text.lower()
    
    # Простая эвристика для определения языка
    russian_chars = set('абвгдеёжзийклмнопрстуфхцчшщъыьэюя')
    kazakh_chars = set('әғқңөұүіһ')
    english_chars = set('abcdefghijklmnopqrstuvwxyz')
    
    # Подсчитываем символы каждого языка
    russian_count = sum(1 for char in text_lower if char in russian_chars)
    kazakh_count = sum(1 for char in text_lower if char in kazakh_chars)
    english_count = sum(1 for char in text_lower if char in english_chars)
    
    # Определяем доминирующий язык
    if kazakh_count > 0:
        return "kazakh"
    elif russian_count > english_count:
        return "russian"
    elif english_count > russian_count:
        return "english"
    else:
        return "russian"  # По умолчанию русский

def get_system_prompt(language: str) -> str:
    """Возвращает системный промпт на соответствующем языке"""
    prompts = {
        "russian": """Ты - профессиональный консультант по карьере и поиску работы для людей с инвалидностью в AI-Komekshi. 
        Твоя задача - помогать пользователям с:
        - Поиском подходящих вакансий
        - Составлением резюме
        - Подготовкой к собеседованиям
        - Развитием карьеры
        - Советами по трудоустройству
        - Моральной поддержкой
        - Анализом изображений

        Отвечай дружелюбно, профессионально и конкретно. Используй русский язык.""",
        
        "kazakh": """Сен - AI-Komekshi-де мүгедек адамдарға арналған кәсіп және жұмыс іздеу бойынша кәсіби кеңесшісісің.
        Сенің міндетің - пайдаланушыларға көмектесу:
        - Сәйкес вакансияларды іздеуде
        - Резюме жасауда
        - Сұхбатқа дайындалуда
        - Кәсіп дамуында
        - Жұмысқа орналасу бойынша кеңестерде
        - Моральдық қолдау
        - Суреттерді талдауда
        
        Достық, кәсіби және нақты жауап бер. Қазақ тілін қолдан.""",
        
        "english": """You are a professional career and job search consultant for people with disabilities at AI-Komekshi.
        Your task is to help users with:
        - Finding suitable job vacancies
        - Creating resumes
        - Preparing for interviews
        - Career development
        - Employment advice
        - Moral support
        - Image analysis
        

        Respond in a friendly, professional and specific manner. Use English language."""
    }
    
    return prompts.get(language, prompts["russian"])

def generate_mock_ai_response(user_message: str, images: list[str] | None = None, language: str = "russian") -> str:
    """Генерирует мок-ответ ассистента (fallback) на соответствующем языке"""
    
    logger.info(f"🎭 Mock response called with message: {user_message[:50]}... (Language: {language})")
    if images:
        logger.info(f"🎭 Mock response called WITH {len(images)} images")
    else:
        logger.info("🎭 Mock response called without images")
    
    # Специальный ответ для изображений
    if images and len(images) > 0:
        if language == "kazakh":
            return f"""Керемет! Сіз {len(images)} сурет жібергеніңізді көріп тұрмын.

🔍 **Мен суреттермен не істей аламын:**

📋 **Резюмені талдау** - егер бұл резюменің сканы немесе фотосы болса, құрылымды және мазмұнды жақсарту бойынша кеңес бере аламын

📄 **Құжаттарды талдау** - жұмысқа орналасумен байланысты кез келген құжаттарды талдауға көмектесемін

💼 **Вакансияларды талдау** - егер бұл вакансияның скриншоты болса, оған қалай жақсы дайындалу керектігін айтамын

🎯 **Сұхбатқа дайындалу** - егер бұл компания туралы материалдар болса, сұрақтар дайындауға көмектесемін

Суретте не екенін сипаттаңыз, мен сіздің жұмысқа орналасуыңызға максималды пайдалы кеңестер беремін!"""
        elif language == "english":
            return f"""Great! I can see you've sent {len(images)} image(s).

🔍 **What I can do with images:**

📋 **Resume analysis** - if this is a scan or photo of a resume, I can give advice on improving structure and content

📄 **Document analysis** - help analyze any documents related to employment

💼 **Job vacancy analysis** - if this is a screenshot of a vacancy, I'll tell you how to better prepare for it

🎯 **Interview preparation** - if these are materials about a company, I'll help prepare questions

Describe what exactly is in the image, and I'll give you the most useful advice for your employment!"""
        else:  # russian
            return f"""Отлично! Я вижу, что вы прислали {len(images)} изображение(й). 

🔍 **Что я могу сделать с изображениями:**

📋 **Анализ резюме** - если это скан или фото резюме, я могу дать советы по улучшению структуры и содержания

📄 **Анализ документов** - помогу разобрать любые документы связанные с трудоустройством

💼 **Анализ вакансий** - если это скриншот вакансии, подскажу как лучше к ней подготовиться

🎯 **Подготовка к собеседованию** - если это материалы о компании, помогу подготовить вопросы

Опишите, что именно на изображении, и я дам максимально полезные советы для вашего трудоустройства!"""

    # Ответы на разных языках
    responses = {
        "russian": [
            "Здравствуйте! Если у вас есть вопросы о поиске работы, составлении резюме или развитии карьеры, я готов помочь. Пожалуйста, уточните, чем могу быть полезен! 😊",
            "Спасибо за ваше сообщение! Я ассистент AI-Komekshi и готов помочь вам с поиском работы. О чем хотели бы поговорить?",
            "Понятно! Давайте разберем этот вопрос подробнее. Какую именно помощь вам нужна в поиске работы?",
            "Отличный вопрос! Как ваш AI-помощник, я рекомендую следующие шаги для успешного трудоустройства...",
            "Я анализирую ваш запрос и готов предложить несколько вариантов решения для вашей карьеры."
        ],
        "kazakh": [
            "Сәлеметсіз бе! Егер сізде жұмыс іздеу, резюме жасау немесе кәсіп дамуы туралы сұрақтар болса, мен көмектесуге дайынмын. Қандай көмек керектігін нақтылаңыз! 😊",
            "Хабарламаңыз үшін рахмет! Мен AI-Komekshi көмекшісі және жұмыс іздеуде көмектесуге дайынмын. Не туралы сөйлесгіңіз келеді?",
            "Түсінікті! Бұл сұрақты толығырақ қарастырайық. Жұмыс іздеуде қандай көмек керек?",
            "Керемет сұрақ! Сіздің AI-көмекшіңіз ретінде, сәтті жұмысқа орналасу үшін келесі қадамдарды ұсынамын...",
            "Мен сіздің сұрауыңызды талдап, кәсіпіңіз үшін бірнеше шешім нұсқаларын ұсынуға дайынмын."
        ],
        "english": [
            "Hello! If you have questions about job search, resume writing, or career development, I'm ready to help. Please specify what I can be useful for! 😊",
            "Thank you for your message! I'm an AI-Komekshi assistant and ready to help you with job search. What would you like to talk about?",
            "I understand! Let's analyze this issue in more detail. What specific help do you need in job search?",
            "Great question! As your AI assistant, I recommend the following steps for successful employment...",
            "I'm analyzing your request and ready to offer several solution options for your career."
        ]
    }
    
    # Простая логика для разных типов ответов
    user_lower = user_message.lower()
    
    if language == "kazakh":
        if any(word in user_lower for word in ['резюме', 'cv', 'резюмесі']):
            return "Сәйкес резюме жасау үшін ұсынамын:\n\n1. Жұмысқа орналасу мақсатын нақты көрсетіңіз\n2. Негізгі дағдылар мен жетістіктерді бөліп көрсетіңіз\n3. Білім туралы ақпарат қосыңыз\n4. Жұмыс тәжірибесін хронологиялық ретпен көрсетіңіз\n\nРезюменің нақты бөлімдерімен көмектесе аламын. Не туралы толығырақ білгіңіз келеді?"
        elif any(word in user_lower for word in ['сұхбат', 'интервью', 'сұхбатқа']):
            return "Сұхбатты сәтті өткізу үшін кеңес беремін:\n\n1. Компания туралы ақпаратты зерттеңіз\n2. Типтік сұрақтарға жауаптар дайындаңыз\n3. Жұмыс берушіге сұрақтар туралы ойланыңыз\n4. Жұмыс тәжірибесінен мысалдар дайындаңыз\n\nСұхбатқа дайындалу туралы нақты сұрақтарыңыз бар ма?"
        elif any(word in user_lower for word in ['жұмыс', 'вакансия', 'іздеу']):
            return "Жұмыс іздеуді тиімді жүргізу үшін ұсынамын:\n\n1. Мақсатты лауазымдар мен компанияларды анықтаңыз\n2. Әр вакансияға резюмені жаңартыңыз\n3. Әртүрлі іздеу арналарын пайдаланыңыз\n4. Желілік өзара әрекеттесуге дайындалыңыз\n\nҚай салада жұмыс іздейсіз? Неғұрлым нақты кеңестер бере аламын."
    elif language == "english":
        if any(word in user_lower for word in ['resume', 'cv']):
            return "For creating a quality resume, I recommend:\n\n1. Specify a clear employment goal\n2. Highlight key skills and achievements\n3. Add education information\n4. List work experience in chronological order\n\nI can help with specific resume sections. What would you like to know more about?"
        elif any(word in user_lower for word in ['interview', 'interviews']):
            return "For successful interview preparation, I advise:\n\n1. Study company information\n2. Prepare answers to typical questions\n3. Think about questions for the employer\n4. Prepare examples from work experience\n\nDo you have specific questions about interview preparation?"
        elif any(word in user_lower for word in ['job', 'work', 'search']):
            return "For effective job search, I recommend:\n\n1. Define target positions and companies\n2. Update resume for each vacancy\n3. Use various search channels\n4. Prepare for networking\n\nIn what field are you looking for work? I can give more specific advice."
    else:  # russian
        if any(word in user_lower for word in ['резюме', 'cv']):
            return "Для составления качественного резюме рекомендую:\n\n1. Указать четкую цель трудоустройства\n2. Выделить ключевые навыки и достижения\n3. Добавить информацию об образовании\n4. Указать опыт работы в хронологическом порядке\n\nМогу помочь с конкретными разделами резюме. О чем хотели бы узнать подробнее?"
        elif any(word in user_lower for word in ['собеседование', 'интервью']):
            return "Для успешного прохождения собеседования советую:\n\n1. Изучить информацию о компании\n2. Подготовить ответы на типичные вопросы\n3. Подумать о вопросах работодателю\n4. Подготовить примеры из опыта работы\n\nЕсть конкретные вопросы о подготовке к собеседованию?"
        elif any(word in user_lower for word in ['работа', 'вакансии', 'поиск']):
            return "Для эффективного поиска работы рекомендую:\n\n1. Определить целевые должности и компании\n2. Обновить резюме под каждую вакансию\n3. Использовать различные каналы поиска\n4. Подготовиться к сетевому взаимодействию\n\nВ какой сфере ищете работу? Могу дать более конкретные советы."
    
    # Если не найдено специальных слов, возвращаем случайный ответ на соответствующем языке
    import random
    return random.choice(responses.get(language, responses["russian"])) 