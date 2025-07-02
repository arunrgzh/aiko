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
    ConversationMessage, SenderInfo, ChatMessageResponse
)
from ..auth.jwt import get_current_user
from ..config import settings

router = APIRouter(prefix="/main/assistants", tags=["assistants"])
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

@router.post("/{assistant_id}/chat", response_model=ChatMessageResponse)
async def send_message_to_assistant(
    assistant_id: int,
    request: SendMessageRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Отправить сообщение ассистенту"""
    
    # Проверяем существование ассистента
    # result = await db.execute(
    #     select(Assistant)
    #     # .where(Assistant.id == assistant_id)
    #     .where(Assistant.user_id == current_user.id)
    # )
    # assistant = result.scalar_one_or_none()
    
    # if not assistant:
    #     raise HTTPException(
    #         status_code=status.HTTP_404_NOT_FOUND,
    #         detail="Assistant not found"
    #     )
    
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
                .where(ChatHistory.assistant_id == assistant_id)
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
            assistant_id=assistant_id,  # Используем правильный assistant_id из URL
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
        recent_messages=list(reversed(recent_messages))  # Переворачиваем для правильной очередности
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
    return ChatMessageResponse(
        id=str(uuid.uuid4()),
        choices=[{
            "finish_reason": "stop",
            "index": 0,
            "message": {
                "content": ai_response_content,
                "role": "assistant"
            }
        }],
        created=int(time.time()),
        model="gpt-4o"
    )

async def generate_ai_response(
    user_message: str, 
    recent_messages: list | None = None
) -> str:
    """Генерирует ответ ассистента используя Azure OpenAI API"""
    
    # Если Azure OpenAI API не настроен, используем мок-ответы
    if not azure_openai_client or not settings.azure_openai_api_key:
        logger.warning("Azure OpenAI API not configured, using mock responses")
        return generate_mock_ai_response(user_message)
    
    logger.info(f"🤖 Calling Azure OpenAI API for message: {user_message[:50]}...")
    
    try:
        # Подготавливаем контекст разговора
        messages = []
        
        # Добавляем системный промпт ассистента
        # if assistant.system_prompt:
        #     messages.append({
        #         "role": "system",
        #         "content": assistant.system_prompt
        #     })
        # else:
        #     # Дефолтный системный промпт для поиска работы
        messages.append({
            "role": "system",
            "content": """Ты - профессиональный консультант по карьере и поиску работы для людей с инвалидностью в AI-Komek. 
            Твоя задача - помогать пользователям с:
            - Поиском подходящих вакансий
            - Составлением резюме
            - Подготовкой к собеседованиям
            - Развитием карьеры
            - Советами по трудоустройству
            
            Отвечай дружелюбно, профессионально и конкретно. Используй русский язык."""
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
            return generate_mock_ai_response(user_message)
            
        logger.info(f"✅ Azure OpenAI API response received: {len(ai_response)} characters")
        return ai_response.strip()
        
    except Exception as e:
        logger.error(f"❌ Error calling Azure OpenAI API: {str(e)}")
        logger.error(f"   Using mock response instead")
        # В случае ошибки возвращаем мок-ответ
        return generate_mock_ai_response(user_message)

def generate_mock_ai_response(user_message: str) -> str:
    """Генерирует мок-ответ ассистента (fallback)"""
    responses = [
        "Это мок-ответ ассистента для демонстрации. В реальном приложении здесь будет интеграция с AI API.",
        "Спасибо за ваше сообщение! Я ассистент AI-Komek и готов помочь вам с поиском работы.",
        "Понятно! Давайте разберем этот вопрос подробнее. Какую именно помощь вам нужна?",
        "Отличный вопрос! Как ваш AI-помощник, я рекомендую следующие шаги...",
        "Я анализирую ваш запрос и готов предложить несколько вариантов решения."
    ]
    
    # Простая логика для разных типов ответов
    user_lower = user_message.lower()
    
    if any(word in user_lower for word in ['код', 'программирование', 'разработка']):
        return "Вот пример кода для вашей задачи:\n\n```python\ndef example():\n    print('Это демонстрационный код')\n```\n\nОбратите внимание, что это мок-ответ для демонстрации."
    elif any(word in user_lower for word in ['список', 'пункты']):
        return "Вот список рекомендаций:\n\n1. Первый пункт\n2. Второй пункт\n3. Третий пункт\n\nЭто демонстрационный список."
    else:
        import random
        return random.choice(responses) 