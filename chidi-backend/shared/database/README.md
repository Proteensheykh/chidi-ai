# Database Schema with Row-Level Security

This directory contains the database schema implementation for the Chidi project, with Row-Level Security (RLS) policies to enforce strict data isolation between users.

## Core Tables

1. **user_contexts**: Stores business context and preferences for each user
2. **conversations**: Represents conversation threads between users and the AI assistant
3. **messages**: Stores individual messages within conversations

## Row-Level Security Policies

RLS policies are implemented to ensure complete data isolation:

- Users can only access their own user context
- Users can only access conversations linked to their user context
- Users can only access messages within their conversations

## Setup Instructions

1. Install required dependencies:
   ```bash
   poetry add alembic sqlalchemy psycopg2-binary
   ```

2. Set up the database connection:
   - Create a `.env` file in the `chidi-backend` directory if it doesn't exist
   - Add your Supabase database URL:
     ```
     DATABASE_URL=postgres://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres
     ```

3. Apply the migration to create tables and RLS policies:
   ```bash
   cd chidi-backend
   poetry run alembic upgrade head
   ```

4. Verify in the Supabase table editor that:
   - The tables have been created successfully
   - RLS policies are enabled on all tables
   - The RLS policies enforce proper data isolation

## Usage

To use the database in FastAPI endpoints:

```python
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from chidi_backend.shared.database.connection import get_db
from chidi_backend.shared.database.models import UserContext, Conversation, Message

@app.get("/conversations/")
async def get_conversations(db: AsyncSession = Depends(get_db)):
    # The RLS policies will automatically filter results to the current user
    result = await db.execute(select(Conversation))
    conversations = result.scalars().all()
    return conversations
```
