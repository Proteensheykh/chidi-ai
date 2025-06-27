FROM python:3.11-slim

WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV POETRY_VERSION=1.6.1
ENV POETRY_HOME=/opt/poetry
ENV POETRY_VIRTUALENVS_IN_PROJECT=false
ENV POETRY_NO_INTERACTION=1
ENV PATH="$POETRY_HOME/bin:$PATH"

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 -

# Copy pyproject.toml and poetry.lock from backend root
COPY pyproject.toml poetry.lock* ./

# Install dependencies with required groups
RUN poetry config virtualenvs.create false \
    && poetry install --without dev --with api-gateway,auth,database

# Install psycopg2-binary for PostgreSQL support
RUN pip install psycopg2-binary

# Copy shared modules (critical for imports)
COPY shared/ ./shared/

# Copy service-specific application code
COPY services/api-gateway/app ./app

# Set Python path to include current directory for shared imports
ENV PYTHONPATH=/app

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
