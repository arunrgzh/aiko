from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON, ForeignKey, func
from sqlalchemy.orm import relationship

from ..database import Base

class Assistant(Base):
    __tablename__ = "assistants"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Основная информация
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    model = Column(String, default="gpt-3.5-turbo")
    
    # Конфигурация
    system_prompt = Column(Text, nullable=True)
    temperature = Column(String, default="0.7")
    max_tokens = Column(Integer, default=1000)
    
    # Статус
    is_active = Column(Boolean, default=True)
    
    # Метаданные
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Связи
    user = relationship("User", back_populates="assistants")
    chat_histories = relationship("ChatHistory", back_populates="assistant", cascade="all, delete-orphan") 