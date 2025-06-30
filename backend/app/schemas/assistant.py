from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class AssistantBase(BaseModel):
    name: str
    description: Optional[str] = None
    model: str = "prod-swedencentral-openai"
    system_prompt: Optional[str] = None
    temperature: str = "0.7"
    max_tokens: int = 8000

class AssistantCreate(AssistantBase):
    pass

class AssistantUpdate(AssistantBase):
    name: Optional[str] = None
    model: Optional[str] = None
    temperature: Optional[str] = None
    max_tokens: Optional[int] = None

class AssistantResponse(AssistantBase):
    id: int
    user_id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class AssistantWithChatHistory(AssistantResponse):
    chat_history: List["ChatHistoryResponse"] = []

# Для совместимости с фронтендом
class AssistantListItem(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    model: str
    lastEdited: int  # Unix timestamp

class AssistantsListResponse(BaseModel):
    data: List[AssistantListItem]
    total: int 