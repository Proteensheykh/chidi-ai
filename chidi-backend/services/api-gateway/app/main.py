"""
FastAPI main application
"""
import os
import logging
import time
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from backend root .env file
backend_root = Path(__file__).parent.parent.parent.parent
env_path = backend_root / ".env"
load_dotenv(env_path)

# Create logs directory if it doesn't exist
logs_dir = backend_root / "logs"
logs_dir.mkdir(exist_ok=True)

# Configure logging to file and console
log_filename = f"chidi_api_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
log_filepath = logs_dir / log_filename

# Configure handlers
file_handler = logging.FileHandler(log_filepath)
console_handler = logging.StreamHandler()

# Configure formatter
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)
console_handler.setFormatter(formatter)

# Configure root logger
root_logger = logging.getLogger()
root_logger.setLevel(logging.INFO)
root_logger.addHandler(file_handler)
root_logger.addHandler(console_handler)

# Get application logger
logger = logging.getLogger(__name__)

from .routers import users

# Create FastAPI app
app = FastAPI(
    title="Chidi API",
    description="Backend API for Chidi project",
    version="0.1.0",
)

# Log environment variables status (without exposing secrets)
logger.info("=== CHIDI API GATEWAY STARTUP ===")
logger.info(f"Logs will be saved to: {log_filepath}")
logger.info(f"Environment variables status:")
logger.info(f"  SUPABASE_URL: {'✓ Set' if os.getenv('SUPABASE_URL') else '✗ Missing'}")
logger.info(f"  SUPABASE_ANON_KEY: {'✓ Set' if os.getenv('SUPABASE_ANON_KEY') else '✗ Missing'}")
logger.info(f"  SUPABASE_JWT_SECRET: {'✓ Set' if os.getenv('SUPABASE_JWT_SECRET') else '✗ Missing'}")
logger.info(f"  DATABASE_URL: {'✓ Set' if os.getenv('DATABASE_URL') else '✗ Missing'}")


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    # Log incoming request
    logger.info(f"🔄 Incoming request: {request.method} {request.url}")
    logger.info(f"   Headers: {dict(request.headers)}")
    logger.info(f"   Body: {await request.body()}")
    
    # Process request
    response = await call_next(request)
    
    # Log response
    process_time = time.time() - start_time
    logger.info(f"✅ Response: {response.status_code} | Time: {process_time:.3f}s")
    
    return response

# Mount routers
app.include_router(users.router)

# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint to verify API is running"""
    logger.info("🏥 Health check endpoint accessed")
    return {"status": "healthy", "message": "API is running"}

# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """API root endpoint"""
    logger.info("📍 Root endpoint accessed")
    return {
        "message": "Welcome to Chidi API",
        "docs": "/docs",
        "version": "0.1.0",
    }

logger.info("🚀 Chidi API started successfully")

# Run the application
if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", 8000))
    
    uvicorn.run("main:app", host=host, port=port, reload=True)
