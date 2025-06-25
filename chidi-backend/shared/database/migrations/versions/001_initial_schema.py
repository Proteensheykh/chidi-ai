"""Initial schema with RLS

Revision ID: 001
Revises: 
Create Date: 2025-06-25

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID


# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create extension for UUID generation if it doesn't exist
    op.execute('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')
    
    # Create user_contexts table
    op.create_table(
        'user_contexts',
        sa.Column('id', UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('business_data', sa.JSON(), nullable=False, server_default='{}'),
        sa.Column('onboarding_status', sa.String(), nullable=False, server_default='pending'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.UniqueConstraint('user_id')
    )
    
    # Create conversations table
    op.create_table(
        'conversations',
        sa.Column('id', UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('user_context_id', UUID(as_uuid=True), sa.ForeignKey('user_contexts.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(), nullable=False, server_default='New Conversation'),
        sa.Column('source', sa.String(), nullable=False, server_default='chat'),
        sa.Column('source_metadata', sa.JSON(), nullable=True),
        sa.Column('is_archived', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP'))
    )
    
    # Create messages table
    op.create_table(
        'messages',
        sa.Column('id', UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('conversation_id', UUID(as_uuid=True), sa.ForeignKey('conversations.id', ondelete='CASCADE'), nullable=False),
        sa.Column('role', sa.String(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('message_metadata', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP'))
    )
    
    # Create indexes for better query performance
    op.create_index('idx_user_contexts_user_id', 'user_contexts', ['user_id'])
    op.create_index('idx_conversations_user_context_id', 'conversations', ['user_context_id'])
    op.create_index('idx_messages_conversation_id', 'messages', ['conversation_id'])
    
    # Add Row-Level Security (RLS) policies
    
    # Enable RLS on tables
    op.execute('ALTER TABLE user_contexts ENABLE ROW LEVEL SECURITY')
    op.execute('ALTER TABLE conversations ENABLE ROW LEVEL SECURITY')
    op.execute('ALTER TABLE messages ENABLE ROW LEVEL SECURITY')
    
    # Create policies for user_contexts table
    op.execute("""
    CREATE POLICY user_contexts_isolation_policy ON user_contexts
    USING (user_id = current_user)
    WITH CHECK (user_id = current_user)
    """)
    
    # Create policies for conversations table
    op.execute("""
    CREATE POLICY conversations_isolation_policy ON conversations
    USING (user_context_id IN (SELECT id FROM user_contexts WHERE user_id = current_user))
    WITH CHECK (user_context_id IN (SELECT id FROM user_contexts WHERE user_id = current_user))
    """)
    
    # Create policies for messages table
    op.execute("""
    CREATE POLICY messages_isolation_policy ON messages
    USING (conversation_id IN (
        SELECT c.id FROM conversations c
        JOIN user_contexts uc ON c.user_context_id = uc.id
        WHERE uc.user_id = current_user
    ))
    WITH CHECK (conversation_id IN (
        SELECT c.id FROM conversations c
        JOIN user_contexts uc ON c.user_context_id = uc.id
        WHERE uc.user_id = current_user
    ))
    """)


def downgrade() -> None:
    # Drop tables (cascade will handle foreign keys)
    op.drop_table('messages')
    op.drop_table('conversations')
    op.drop_table('user_contexts')
