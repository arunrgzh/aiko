import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from your_app.models.assessment import AssessmentQuestion  # adjust import to your project structure
from your_app.database import Base                      # adjust import to your project structure

# 1. Set your database URL
DATABASE_URL = "postgresql+asyncpg://REDACTED:REDACTED@REDACTED:5432/ai_komek"

# 2. Define the new block of questions
QUESTIONS = [
    query for insert data
    # Блок 1: Личностные качества и предпочтения
    {
        "question_text": "Как бы вы охарактеризовали себя в общении с другими людьми?",
        "question_type": "single_choice",
        "assessment_category": "communication_style",
        "options": [
            "Мне комфортно общаться и заводить новые знакомства.",
            "Я предпочитаю общаться только с близкими людьми.",
            "Мне сложно общаться с незнакомыми людьми."
        ],
        "weight": 1.0
    },
    {
        "question_text": "Как вы обычно действуете, столкнувшись с незнакомой задачей?",
        "question_type": "single_choice",
        "assessment_category": "approach_to_tasks",
        "options": [
            "Самостоятельно разбираюсь, ищу информацию.",
            "Предпочитаю спросить совета или помощи.",
            "Теряюсь, испытываю неуверенность."
        ],
        "weight": 1.0
    },
    {
        "question_text": "Что для вас важнее в работе? (выберите не более двух)",
        "question_type": "multiple_choice",
        "assessment_category": "work_values",
        "options": [
            "Комфортная и спокойная атмосфера.",
            "Возможность постоянно учиться новому.",
            "Хороший коллектив и поддержка команды.",
            "Гибкость рабочего графика.",
            "Стабильность и четкие задачи."
        ],
        "weight": 1.0
    },
    {
        "question_text": "Как вы справляетесь со стрессом?",
        "question_type": "single_choice",
        "assessment_category": "stress_management",
        "options": [
            "Хорошо, спокойно реагирую на сложности.",
            "Иногда испытываю трудности, но справляюсь.",
            "Сложно, быстро теряю концентрацию и спокойствие."
        ],
        "weight": 1.0
    },
    {
        "question_text": "Какое утверждение лучше всего вас описывает?",
        "question_type": "single_choice",
        "assessment_category": "work_style",
        "options": [
            "Мне нравится выполнять задачи четко по инструкциям.",
            "Мне нравится свобода в выборе подходов и решений.",
            "Предпочитаю совмещать оба подхода."
        ],
        "weight": 1.0
    },
    # Блок 2: Навыки и умения
    {
        "question_text": "Как бы вы оценили свои компьютерные навыки?",
        "question_type": "single_choice",
        "assessment_category": "computer_skills",
        "options": [
            "Уверенно владею компьютером и многими программами.",
            "Знаю базовые программы и легко осваиваю новые.",
            "Испытываю трудности в работе с компьютером."
        ],
        "weight": 1.0
    },
    {
        "question_text": "Есть ли у вас опыт работы с документами (например, Word, Excel)?",
        "question_type": "single_choice",
        "assessment_category": "document_experience",
        "options": [
            "Хорошо владею и Word, и Excel.",
            "Знаю базовые функции этих программ.",
            "Почти нет опыта работы с такими программами."
        ],
        "weight": 1.0
    },
    {
        "question_text": "Какой формат работы наиболее предпочтителен для вас?",
        "question_type": "single_choice",
        "assessment_category": "work_format",
        "options": [
            "Удалённая работа из дома.",
            "Офисная работа с адаптированными условиями.",
            "Гибридный формат (частично удалённо, частично в офисе)."
        ],
        "weight": 1.0
    },
    {
        "question_text": "Какие из перечисленных навыков вы считаете у себя наиболее развитыми? (выберите до трёх)",
        "question_type": "multiple_choice",
        "assessment_category": "skills_strengths",
        "options": [
            "Работа с людьми, коммуникация",
            "Организация и планирование задач",
            "Творческий подход и креативность",
            "Аналитические способности",
            "Внимательность к деталям",
            "Умение работать в команде",
            "Ответственность и дисциплина"
        ],
        "weight": 1.0
    },
    {
        "question_text": "Как вы относитесь к работе, требующей монотонности и повторяющихся действий?",
        "question_type": "single_choice",
        "assessment_category": "monotony_tolerance",
        "options": [
            "Нормально, комфортно себя чувствую в таком формате.",
            "Могу выполнять такие задачи, но предпочитаю разнообразие.",
            "Очень тяжело справляюсь с монотонной работой."
        ],
        "weight": 1.0
    },
    # Блок 3: Опыт и мотивация
    {
        "question_text": "Был ли у вас ранее опыт работы?",
        "question_type": "single_choice",
        "assessment_category": "experience",
        "options": [
            "Да, работал(-а) ранее.",
            "Нет, но проходил(-а) практику или стажировку.",
            "Нет, опыта совсем нет."
        ],
        "weight": 1.0
    },
    {
        "question_text": "Что вас сильнее всего мотивирует в работе?",
        "question_type": "single_choice",
        "assessment_category": "motivation",
        "options": [
            "Возможность карьерного роста и развития.",
            "Хорошая заработная плата.",
            "Ощущение своей пользы и социальной значимости.",
            "Возможность общаться с людьми и быть частью команды."
        ],
        "weight": 1.0
    },
    {
        "question_text": "Есть ли сферы или профессии, в которых вы точно хотели бы попробовать себя?",
        "question_type": "text",
        "assessment_category": "desired_fields",
        "options": [],
        "weight": 1.0
    },
    # Блок 4: Специфика и потребности (с учётом инвалидности)
    {
        "question_text": "Какие условия на рабочем месте являются для вас необходимыми? (выберите все, что подходят)",
        "question_type": "multiple_choice",
        "assessment_category": "work_conditions",
        "options": [
            "Доступная и адаптированная инфраструктура.",
            "Гибкий график работы.",
            "Возможность частых перерывов.",
            "Работа удаленно, из дома.",
            "Помощь ассистента или наставника."
        ],
        "weight": 1.0
    },
    {
        "question_text": "Какую поддержку со стороны работодателя вы считаете наиболее важной?",
        "question_type": "multiple_choice",
        "assessment_category": "support_needed",
        "options": [
            "Понимание и психологическая поддержка.",
            "Адаптация рабочего пространства и графика.",
            "Четкие и понятные инструкции по задачам.",
            "Регулярная обратная связь и консультации."
        ],
        "weight": 1.0
    },
    # Блок 5: Самооценка и уверенность
    {
        "question_text": "Как вы оцениваете свою способность быстро осваивать новые задачи и навыки?",
        "question_type": "single_choice",
        "assessment_category": "learning_speed",
        "options": [
            "Отлично осваиваю новое.",
            "Требуется время, но обычно справляюсь.",
            "Мне сложно быстро осваивать новое."
        ],
        "weight": 1.0
    },
    {
        "question_text": "Как бы вы оценили свою уверенность при поиске работы на данный момент?",
        "question_type": "single_choice",
        "assessment_category": "job_search_confidence",
        "options": [
            "Уверен(а) в себе, знаю свои сильные стороны.",
            "Испытываю небольшое беспокойство, но хочу попробовать.",
            "Не чувствую уверенности, нужна помощь и поддержка."
        ],
        "weight": 1.0
    },
    {
        "question_text": "Что вызывает у вас наибольшие опасения при трудоустройстве?",
        "question_type": "multiple_choice",
        "assessment_category": "employment_fears",
        "options": [
            "Отношение и принятие со стороны коллег.",
            "Страх не справиться с обязанностями.",
            "Трудности, связанные с доступностью рабочего места.",
            "Недостаток опыта и квалификации."
        ],
        "weight": 1.0
    }
]

async def seed():
    # create engine & session
de_create_missing_lines = False
    engine = create_async_engine(DATABASE_URL, echo=True)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    Session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with Session() as session:
        for q in QUESTIONS:
            exists = await session.execute(
                session.query(AssessmentQuestion).filter_by(question_text=q["question_text"])
            )
            if exists.scalar_one_or_none():
                continue
            session.add(AssessmentQuestion(**q))
        await session.commit()

    await engine.dispose()
    print("✅ Seeded new assessment questions.")

if __name__ == "__main__":
    asyncio.run(seed())
