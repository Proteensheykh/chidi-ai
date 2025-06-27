from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
from uuid import UUID

from sqlalchemy import Column, DateTime, ForeignKey, String, Text, Boolean, JSON, text
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class UserContext(Base):
    """
    Stores business context and preferences for each user.
    Protected by RLS to ensure users can only access their own context.
    """
    __tablename__ = "user_contexts"

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    user_id = Column(String, nullable=False, unique=True, index=True)
    business_data = Column(JSON, nullable=False, default=dict)
    onboarding_status = Column(String, nullable=False, default="pending")
    settings = Column(JSON, nullable=False, default=dict)
    created_at = Column(DateTime, nullable=False, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, nullable=False, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    # Relationships
    conversations = relationship("Conversation", back_populates="user_context", cascade="all, delete-orphan")


class Conversation(Base):
    """
    Represents a conversation thread between a user and the AI assistant.
    Protected by RLS to ensure users can only access their own conversations.
    """
    __tablename__ = "conversations"

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    user_context_id = Column(PostgresUUID(as_uuid=True), ForeignKey("user_contexts.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String, nullable=False, default="New Conversation")
    source = Column(String, nullable=False, default="chat")  # chat, instagram, whatsapp, etc.
    source_metadata = Column(JSON, nullable=True)
    is_archived = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, nullable=False, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    # Relationships
    user_context = relationship("UserContext", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")


class Message(Base):
    """
    Represents a single message within a conversation.
    Protected by RLS to ensure users can only access their own messages.
    """
    __tablename__ = "messages"

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    conversation_id = Column(PostgresUUID(as_uuid=True), ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(String, nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    message_metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.now(timezone.utc))

    # Relationships
    conversation = relationship("Conversation", back_populates="messages")
