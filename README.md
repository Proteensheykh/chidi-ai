# Chidi Project

A modern full-stack application built with Next.js frontend and FastAPI backend, powered by Supabase for database, authentication, and storage.

## Project Structure

```
chidi/
├── chidi-frontend/          # Next.js 14 frontend with App Router
├── chidi-backend/           # FastAPI backend
├── project-files/           # Project documentation
└── README.md               # This file
```

## Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.11+
- Poetry (for Python dependency management)
- A Supabase account and project

## Setup Instructions

### 1. Supabase Project Setup

1. Create a new project on [Supabase](https://supabase.com)
2. Navigate to your project's **Settings > API** to get:
   - Project URL
   - Anon key
   - Service role key
3. Navigate to your project's **Settings > Database** to get:
   - Connection string (Database URL)

### 2. Frontend Setup (Next.js)

```bash
cd chidi-frontend

# Install dependencies
npm install

# Create environment file from example
cp .env.local.example .env.local

# Edit .env.local and add your Supabase credentials:
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Backend Setup (FastAPI)

```bash
cd chidi-backend

# Install Poetry if you haven't already
# Visit: https://python-poetry.org/docs/#installation

# Install dependencies
poetry install

# Create environment file from example
cp .env.example .env

# Edit .env and add your credentials:
# DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
# SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
# JWT_SECRET=your_secure_jwt_secret
```

### 4. Generate JWT Secret

Generate a secure JWT secret for your backend:

```bash
# Using Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Or using OpenSSL
openssl rand -base64 32
```

## Running the Application

### Start the Backend

```bash
cd chidi-backend
poetry run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
API documentation will be available at `http://localhost:8000/docs`

### Start the Frontend

```bash
cd chidi-frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Development Workflow

1. **Backend Development**: Use Poetry to manage Python dependencies and virtual environment
2. **Frontend Development**: Use npm/yarn for Node.js dependencies
3. **Database Changes**: Use Supabase dashboard or SQL migrations
4. **Environment Variables**: Never commit `.env` or `.env.local` files

## Key Technologies

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.11, SQLAlchemy, Alembic
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Deployment**: TBD

## Security Notes

- Keep your Supabase service role key secure and never expose it in frontend code
- Use environment variables for all sensitive configuration
- The anon key is safe to use in frontend code as it has limited permissions
- Generate a strong, unique JWT secret for your backend

## Next Steps

After completing the setup:

1. Verify both frontend and backend start successfully
2. Test the connection to Supabase
3. Set up your database schema in Supabase
4. Implement authentication flow
5. Build your application features

## Troubleshooting

- **Port conflicts**: Change ports in the run commands if 3000 or 8000 are in use
- **Poetry issues**: Ensure Poetry is properly installed and in your PATH
- **Supabase connection**: Verify your credentials and network connectivity
- **Environment variables**: Double-check all required variables are set correctly

For more detailed information, refer to the project documentation in the `project-files/` directory.
