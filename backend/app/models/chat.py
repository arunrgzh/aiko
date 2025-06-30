from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON, ForeignKey, func, Enum
from sqlalchemy.orm import relationship
import enum

from ..database import Base

class MessageRole(str, enum.Enum):
    USER = "user"
    AI = "ai"
    SYSTEM = "system"

class ChatHistory(Base):
    __tablename__ = "chat_histories"

    id = Column(Integer, primary_key=True, index=True)
    assistant_id = Column(Integer, ForeignKey("assistants.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Информация о чате
    title = Column(String, nullable=False)
    last_conversation = Column(Text, nullable=True)
    
    # Статус
    enable = Column(Boolean, default=True)
    
    # Метаданные
    created_time = Column(Integer, nullable=False)  # Unix timestamp
    updated_time = Column(Integer, nullable=False)  # Unix timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Связи
    assistant = relationship("Assistant", back_populates="chat_histories")
    user = relationship("User", back_populates="chat_histories")
    messages = relationship("Message", back_populates="chat_history", cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    chat_history_id = Column(Integer, ForeignKey("chat_histories.id"), nullable=False)
    
    # Содержимое сообщения
    content = Column(Text, nullable=False)
    role = Column(Enum(MessageRole), nullable=False)
    
    # Дополнительные поля
    sender_id = Column(String, nullable=False)  # "user" или "ai"
    sender_name = Column(String, nullable=False)
    avatar_image_url = Column(String, nullable=True)
    
    # Статус
    is_my_message = Column(Boolean, default=False)
    fresh = Column(Boolean, default=False)
    
    # Метаданные
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Связи
    chat_history = relationship("ChatHistory", back_populates="messages") 