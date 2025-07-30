# AI-Komekshi - Платформа поиска работы с ИИ-помощником

Полнофункциональная платформа для поиска работы с встроенным ИИ-ассистентом для консультирования по карьере.

## 🚀 Быстрый запуск чат-бота

### Бэкенд (FastAPI)

1. **Установите зависимости:**

    ```bash
    cd backend
    pip install -r requirements.txt
    ```

2. **Создайте файл `.env` в папке `backend/`:**

    ```env
    # Database
    DATABASE_URL=sqlite+aiosqlite:///./ai_komek.db

    # Security
    SECRET_KEY=your-secret-key-here-change-this-in-production-make-it-long-and-random
    ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=30
    REFRESH_TOKEN_EXPIRE_DAYS=7

    # Frontend
    FRONTEND_URL=http://REDACTED:3000

    # Environment
    ENVIRONMENT=development
    DEBUG=true
    ```

3. **Запустите бэкенд:**
    ```bash
    npm run dev
    # или
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    ```

### Фронтенд (Next.js)

1. **Установите зависимости:**

    ```bash
    cd front
    npm install
    ```

2. **Создайте файл `.env.local` в папке `front/`:**

    ```env
    # Backend API URL
    NEXT_PUBLIC_API_URL=https://ai-komekshi.site/api

    # NextAuth Configuration
    NEXTAUTH_SECRET=your-nextauth-secret-key-here-make-it-long-and-random
    NEXTAUTH_URL=http://REDACTED:3000

    # Backend URL for server-side requests
    API_URL=https://ai-komekshi.site/api/
    BACKEND_URL=https://ai-komekshi.site/api
    ```

3. **Запустите фронтенд:**
    ```bash
    npm run dev
    ```

### Доступ к чат-боту

1. Откройте http://REDACTED:3000
2. Зарегистрируйтесь или войдите в систему
3. Перейдите в раздел "Чат с ИИ" или напрямую по адресу:
   http://REDACTED:3000/assistants/1/main/testing

## 🤖 Возможности чат-бота

-   ✅ **Полнофункциональный интерфейс чата** с поддержкой истории
-   ✅ **Автоматическое создание ассистента** при регистрации пользователя
-   ✅ **Сохранение истории чатов** в базе данных
-   ✅ **Типизированные ответы** с поддержкой markdown
-   ✅ **Анимация печатания** для ответов ассистента
-   ✅ **Мобильная адаптивность**
-   ✅ **Темная/светлая тема**

## 🔧 Настройка реального ИИ

В текущей версии ассистент использует мок-ответы. Для интеграции с реальным ИИ:

1. Установите библиотеку для работы с OpenAI:

    ```bash
    cd backend
    pip install openai
    ```

2. Добавьте в `.env`:

    ```env
    OPENAI_API_KEY=your-openai-api-key
    ```

3. Замените функцию `generate_mock_ai_response` в `backend/app/api/assistants.py`

## 📁 Структура проекта

```
AI-Komekshi/
├── backend/          # FastAPI бэкенд
│   ├── app/
│   │   ├── api/      # API endpoints
│   │   │   ├── models/   # SQLAlchemy модели
│   │   │   ├── schemas/  # Pydantic схемы
│   │   │   └── auth/     # JWT аутентификация
│   │   └── requirements.txt
├── front/            # Next.js фронтенд
│   ├── src/
│   │   ├── app/(protected-pages)/assistants/[id]/main/testing/
│   │   │   └── # Компоненты чат-бота
│   │   ├── components/
│   │   └── services/
│   └── package.json
└── README.md
```

## 🐛 Troubleshooting

### Чат не работает?

1. Убедитесь, что бэкенд запущен на порту 8000
2. Проверьте переменные окружения в `.env.local`
3. Убедитесь, что вы авторизованы в системе

### Ошибки CORS?

-   Проверьте, что `FRONTEND_URL` в бэкенде соответствует адресу фронтенда

### База данных?

-   SQLite файл создается автоматически при первом запуске
-   Таблицы создаются автоматически
