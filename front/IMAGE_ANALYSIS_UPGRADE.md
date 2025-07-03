# 🔍 AI Image Analysis - Vision Support

## Обзор изменений

Добавлена поддержка анализа изображений! AI теперь может анализировать прикрепленные фотографии и изображения с помощью GPT-4o Vision API.

## ✅ Что изменилось

### Backend (Python)

- **Схема**: Добавлено поле `images: Optional[List[str]]` в `SendMessageRequest`
- **API**: Обновлен эндпоинт `/assistants/{id}/chat` для обработки изображений в base64
- **Azure OpenAI**: Добавлена поддержка Vision API для передачи изображений в формате:
    ```json
    {
        "role": "user",
        "content": [
            { "type": "text", "text": "Анализируй это изображение" },
            {
                "type": "image_url",
                "image_url": { "url": "data:image/jpeg;base64,..." }
            }
        ]
    }
    ```

### Frontend (React/TypeScript)

- **Утилиты**: Добавлены функции `convertToBase64()` и `convertFilesToBase64()`
- **Компоненты**: Обновлены `ChatView.tsx` и `useChatSend.tsx` для отправки изображений
- **Типы**: Расширен `SendMessageRequest` для поддержки `images?: string[]`

## 🎯 Возможности AI с изображениями

AI может анализировать:

📋 **Резюме** - сканы и фотографии резюме
📄 **Документы** - любые документы связанные с трудоустройством  
💼 **Вакансии** - скриншоты вакансий для анализа
🎯 **Материалы компаний** - для подготовки к собеседованию
📊 **Графики и таблицы** - визуальные данные

## 🔧 Как работает

1. **Загрузка**: Пользователь прикрепляет изображение в чат
2. **Конвертация**: Frontend конвертирует изображения в base64
3. **Отправка**: Сообщение + изображения отправляются на backend
4. **Анализ**: GPT-4o Vision анализирует изображения с контекстом
5. **Ответ**: AI предоставляет детальный анализ и советы

## ⚡ Технические детали

### Base64 конвертация

```typescript
const imageBase64s = await convertFilesToBase64(attachments)
```

### Отправка в API

```typescript
await sendMessage({
    participant: conversationId,
    message: processedMessage,
    images: imageBase64s.length > 0 ? imageBase64s : undefined,
})
```

### OpenAI Vision формат

```python
content = [
    {"type": "text", "text": user_message}
]
for image_base64 in images:
    content.append({
        "type": "image_url",
        "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"}
    })
```

## 🚀 Результат

Теперь AI может **РЕАЛЬНО** анализировать изображения! Пользователи могут:

- Прикрепить фото резюме → получить советы по улучшению
- Отправить скриншот вакансии → получить план подготовки
- Загрузить документы → получить анализ и рекомендации

**До**: "К сожалению, я пока не могу анализировать изображения"
**После**: "Отлично! Я вижу ваше резюме. Вот мои рекомендации..."

## 🛠️ Файлы изменены

**Backend:**

- `backend/app/schemas/chat.py` - добавлено поле images
- `backend/app/api/assistants.py` - поддержка Vision API

**Frontend:**

- `front/src/app/(protected-pages)/main/ai-chat/utils/fileUtils.ts` - утилиты конвертации
- `front/src/app/(protected-pages)/main/ai-chat/_components/ChatView.tsx` - обработка изображений
- `front/src/app/(protected-pages)/main/ai-chat/_hooks/useChatSend.tsx` - отправка изображений
- `front/src/services/AssistantsService.ts` - типы API
