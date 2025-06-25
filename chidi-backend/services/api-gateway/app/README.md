# CHIDI API Gateway

This is the API Gateway service for the CHIDI application, providing a unified entry point for all microservices.

## Development Setup

### Prerequisites

- Docker and Docker Compose installed on your machine

### Running the Service

The API Gateway is designed to be run as part of the complete CHIDI stack using Docker Compose:

```bash
# From the project root directory
docker-compose up --build
```

This will start the API Gateway along with its dependencies (PostgreSQL and Redis).

### Accessing the API

Once running, the API Gateway will be available at:

- API Endpoint: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Environment Variables

The following environment variables can be configured:

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string

These are automatically set by Docker Compose in development.
