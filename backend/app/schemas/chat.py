from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import time

class SenderInfo(BaseModel):
    id: str
    name: str
    avatarImageUrl: Optional[str] = None

class MessageBase(BaseModel):
    content: str
    role: str
    sender_id: str
    sender_name: str
    avatar_image_url: Optional[str] = None

class MessageCreate(MessageBase):
    pass

class MessageResponse(BaseModel):
    id: str
    sender: SenderInfo
    content: str
    timestamp: Optional[datetime] = None
    type: str = "regular"
    isMyMessage: Optional[bool] = None
    fresh: Optional[bool] = None
    
    class Config:
        from_attributes = True

class ConversationMessage(BaseModel):
    id: str
    sender: SenderInfo
    content: str
    timestamp: Optional[datetime] = None
    type: str = "regular"
    isMyMessage: Optional[bool] = None
    fresh: Optional[bool] = None

class ChatHistoryBase(BaseModel):
    title: str
    last_conversation: Optional[str] = None
    enable: bool = True

class ChatHistoryCreate(ChatHistoryBase):
    assistant_id: int
    created_time: Optional[int] = Field(default_factory=lambda: int(time.time()))
    updated_time: Optional[int] = Field(default_factory=lambda: int(time.time()))

class ChatHistoryResponse(BaseModel):
    id: str
    title: str
    conversation: Optional[List[ConversationMessage]] = None
    lastConversation: str
    createdTime: int
    updatedTime: int
    enable: bool
    
    class Config:
        from_attributes = True

class SendMessageRequest(BaseModel):
    participant: str
    message: str

class SendMessageResponse(BaseModel):
    replies: List[str]

# Removed ChatMessageResponse - using SendMessageResponse instead 