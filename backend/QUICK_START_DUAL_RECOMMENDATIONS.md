# Быстрый старт: Система двойных рекомендаций

## 🚀 Запуск за 5 минут

### 1. Установка зависимостей

```bash
# Backend
cd backend
pip install celery redis flower httpx

# Frontend (если нужно)
cd ../front
npm install
```

### 2. Запуск Redis

```bash
# Ubuntu/Debian
sudo apt install redis-server
sudo systemctl start redis

# macOS
brew install redis
brew services start redis

# Docker
docker run -d -p 6379:6379 redis:alpine
```

### 3. Настройка переменных окружения

```bash
# backend/.env
CELERY_BROKER_URL=redis://20.67.232.168:6379/0
CELERY_RESULT_BACKEND=redis://20.67.232.168:6379/0
```

### 4. Запуск сервисов

**Терминал 1 - API сервер:**

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

**Терминал 2 - Celery Worker:**

```bash
cd backend
celery -A celery_app worker --loglevel=info --queues=job_recommendations,maintenance
```

**Терминал 3 - Celery Beat (опционально):**

```bash
cd backend
celery -A celery_app beat --loglevel=info
```

**Терминал 4 - Frontend (опционально):**

```bash
cd front
npm run dev
```

## 🧪 Тестирование

### 1. Проверка API

```bash
# Здоровье сервиса
curl http://20.67.232.168:8000/health

# Получение рекомендаций (нужна авторизация)
curl -X GET "http://20.67.232.168:8000/api/enhanced-jobs/dual-recommendations" \
     -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Ручной запуск обновления

```bash
# Для текущего пользователя
curl -X POST "http://20.67.232.168:8000/api/enhanced-jobs/trigger-update" \
     -H "Authorization: Bearer YOUR_TOKEN"

# Статус задачи
curl -X GET "http://20.67.232.168:8000/api/enhanced-jobs/task-status/TASK_ID" \
     -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Мониторинг Celery

```bash
# Flower UI
celery -A celery_app flower

# Открыть: http://20.67.232.168:5555
```

## 📋 Структура ответа API

```json
{
    "personal_block": {
        "source": "onboarding",
        "title": "Персональные рекомендации",
        "description": "На основе вашей анкеты",
        "recommendations": [
            {
                "hh_vacancy_id": "12345",
                "title": "Python Developer",
                "company_name": "Tech Corp",
                "salary_from": 200000,
                "salary_to": 300000,
                "currency": "KZT",
                "area_name": "Алматы",
                "relevance_score": 0.85,
                "recommendation_source": "onboarding",
                "source_explanation": "Высокое совпадение навыков"
            }
        ],
        "total_found": 15
    },
    "assessment_block": {
        "source": "assessment",
        "title": "Рекомендации на основе тестирования",
        "description": "На основе ваших сильных сторон",
        "recommendations": [...],
        "total_found": 8
    },
    "user_has_assessment": true,
    "total_recommendations": 23
}
```

## 🔧 Основные endpoints

| Endpoint                                   | Метод | Описание                      |
| ------------------------------------------ | ----- | ----------------------------- |
| `/api/enhanced-jobs/dual-recommendations`  | GET   | Получить двойные рекомендации |
| `/api/enhanced-jobs/vacancy/{id}`          | GET   | Детали вакансии               |
| `/api/enhanced-jobs/trigger-update`        | POST  | Обновить рекомендации         |
| `/api/enhanced-jobs/task-status/{task_id}` | GET   | Статус задачи                 |

## ⚙️ Ключевые особенности

✅ **Инклюзивность**: Все вакансии с фильтром `accept_handicapped`  
✅ **Два источника**: Анкета + тестирование  
✅ **Автообновление**: Каждый час через Celery  
✅ **Детальная информация**: Полные данные с HH API  
✅ **Прозрачность**: Объяснение каждой рекомендации

## 🐛 Решение проблем

### Redis не запускается

```bash
# Проверка статуса
redis-cli ping

# Если не отвечает
sudo systemctl restart redis
```

### Celery задачи не выполняются

```bash
# Проверка очередей
celery -A celery_app inspect active

# Очистка зависших задач
celery -A celery_app purge
```

### HH API недоступен

```bash
# Проверка доступности
curl https://api.hh.kz/vacancies?per_page=1

# Проверка User-Agent
curl -H "User-Agent: AI-Komekshi Job Platform Parser" https://api.hh.kz/vacancies?per_page=1
```

## 📊 Мониторинг

### Логи

```bash
# Backend логи
tail -f backend/logs/app.log

# Celery логи
tail -f backend/logs/celery.log
```

### Метрики через Flower

-   Количество выполненных задач
-   Время выполнения
-   Ошибки и исключения
-   Использование памяти

## 🎯 Готово!

После запуска всех сервисов система будет:

1. ✅ Принимать запросы на рекомендации
2. ✅ Автоматически обновлять данные каждый час
3. ✅ Предоставлять два блока персонализированных вакансий
4. ✅ Применять инклюзивные фильтры ко всем результатам

**Следующие шаги:**

-   Интегрируйте компонент `DualJobRecommendations` в ваш фронтенд
-   Настройте мониторинг и алерты
-   Добавьте дополнительные фильтры по потребностям
