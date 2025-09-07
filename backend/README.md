# AI-Komekshi Backend

Backend API для платформы AI-Komekshi - системы поиска работы с ИИ-помощником.

## Установка и запуск

### 1. Установите Python зависимости:

```bash
pip install -r requirements.txt
```

### 2. Создайте .env файл:

Скопируйте содержимое ниже в файл `.env` в корне папки backend:

```env
# Database
DATABASE_URL=sqlite+aiosqlite:///./ai_komek.db

# Security
SECRET_KEY=your-secret-key-here-change-this-in-production-make-it-long-and-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Frontend
FRONTEND_URL=http://localhost:3000

# OpenAI API (получите ключ на https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4.0-turbo
OPENAI_MAX_TOKENS=1000
OPENAI_TEMPERATURE=0.7

# Environment
ENVIRONMENT=development
DEBUG=true
```

**ВАЖНО:** Если вы не укажете `OPENAI_API_KEY`, система будет использовать мок-ответы для демонстрации.

### 3. Получите OpenAI API ключ (опционально):

1. Зарегистрируйтесь на https://platform.openai.com/
2. Перейдите в раздел API Keys: https://platform.openai.com/api-keys
3. Создайте новый API ключ
4. Скопируйте ключ и добавьте его в `.env` файл как `OPENAI_API_KEY`

### 4. Запустите сервер:

```bash
# Используя python (простой способ)
python run.py

# Или напрямую через uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Или npm script (есть в backend/package.json)
npm run dev
```

Сервер будет доступен по адресу: http://localhost:8000

API документация (Swagger): http://localhost:8000/docs

## Структура API

### Аутентификация

-   `POST /api/auth/register` - Регистрация пользователя
-   `POST /api/auth/login` - Вход в систему
-   `POST /api/auth/refresh` - Обновление токена

### Ассистенты

-   `GET /main/assistants/` - Получить список ассистентов
-   `GET /main/assistants/{id}` - Получить ассистента с историей чатов
-   `POST /main/assistants/{id}/chat/` - Отправить сообщение ассистенту

### Онбординг

-   `GET /api/onboarding/profile` - Получить профиль онбординга
-   `POST /api/onboarding/profile` - Создать/обновить профиль онбординга
-   `POST /api/onboarding/complete` - Завершить онбординг

## Особенности

1. **Автоматическое создание ассистента**: При регистрации пользователя автоматически создается дефолтный ИИ-ассистент для поиска работы.

2. **Интеграция с OpenAI**: Система поддерживает реальную интеграцию с OpenAI API. Если API ключ не настроен, используются мок-ответы.

3. **Умный контекст**: ИИ-ассистент помнит последние 10 сообщений в разговоре для поддержания контекста.

4. **Fallback система**: При ошибках API автоматически переключается на мок-ответы.

5. **SQLite база данных**: По умолчанию используется SQLite для простоты развертывания. Для продакшена рекомендуется PostgreSQL.

## Настройка моделей

Вы можете настроить параметры ИИ в `.env` файле:

-   `OPENAI_MODEL` - модель OpenAI (gpt-3.5-turbo, gpt-4, gpt-4-turbo)
-   `OPENAI_MAX_TOKENS` - максимальное количество токенов в ответе
-   `OPENAI_TEMPERATURE` - креативность ответов (0.0-1.0)

## Альтернативные AI провайдеры

Для подключения других AI провайдеров (Claude, Llama, местные модели), замените функцию `generate_ai_response` в `backend/app/api/assistants.py` на соответствующую интеграцию.

## Безопасность

-   API ключи никогда не должны попадать в git
-   Измените `SECRET_KEY` в продакшене на случайную строку
-   Используйте HTTPS в продакшене
-   Ограничьте CORS только доверенными доменами
