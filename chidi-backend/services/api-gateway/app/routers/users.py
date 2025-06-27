"""
Users router for user context management
"""
import logging
from typing import Dict, Any
import os
import json

import psycopg2
from psycopg2.extras import Json
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
import psycopg2.extras
import os
import sys

# Add the shared directory to the Python path
shared_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', 'shared'))
if shared_path not in sys.path:
    sys.path.insert(0, shared_path)

from auth.dependencies import get_current_user, require_user_id

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/users", tags=["Users"])


class UserContextResponse(BaseModel):
    """Response model for user context"""
    user_id: str
    business_data: Dict[str, Any]
    onboarding_status: str
    settings: Dict[str, Any]
    created_at: str
    updated_at: str


class UserContextCreateResponse(BaseModel):
    """Response model for user context creation"""
    message: str
    user_context: UserContextResponse
    created: bool


def get_db_connection():
    """Get database connection with enhanced logging"""
    logger.info(" Attempting database connection...")
    
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        logger.error(" DATABASE_URL environment variable not set")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database configuration missing"
        )
    
    # Log connection attempt (without exposing full URL)
    logger.info(f" Connecting to database: {database_url[:20]}...")
    
    try:
        conn = psycopg2.connect(database_url)
        # Set autocommit to True to avoid transaction issues
        conn.autocommit = False
        logger.info(" Database connection established successfully")
        return conn
    except Exception as e:
        logger.error(f" Database connection failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database connection failed"
        )


@router.post("/context", response_model=UserContextCreateResponse)
def create_user_context(
    user_id: str = Depends(require_user_id)
) -> UserContextCreateResponse:
    """
    Create or retrieve user context (idempotent operation).
    
    This endpoint creates a user_contexts record for the authenticated user
    if it doesn't already exist. If it exists, it returns the existing record.
    
    Args:
        user_id: User ID extracted from JWT token via FastAPI dependency
        
    Returns:
        UserContextCreateResponse with context data and creation status
    """
    logger.info(f" POST /users/context - Creating/retrieving user context for user: {user_id}")
    conn = None
    try:
        # Get database connection
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        logger.info(f" Checking if user context exists for user: {user_id}")
        
        # Check if user context already exists
        try:
            # Try with settings column
            cursor.execute(
                """
                SELECT id, user_id, business_data, onboarding_status, settings, 
                       created_at, updated_at
                FROM user_contexts 
                WHERE user_id = %s
                """,
                (user_id,)
            )
        except psycopg2.Error as e:
            if 'column "settings" does not exist' in str(e):
                logger.warning("⚠️ Settings column not found in user_contexts table. Using query without settings.")
                # Rollback any failed transaction before trying again
                conn.rollback()
                
                # Fallback query without settings column
                cursor.execute(
                    """
                    SELECT id, user_id, business_data, onboarding_status, 
                           created_at, updated_at
                    FROM user_contexts 
                    WHERE user_id = %s
                    """,
                    (user_id,)
                )
            else:
                # Rollback and re-raise if it's a different error
                conn.rollback()
                raise
                
        existing_context = cursor.fetchone()
        
        if existing_context:
            logger.info(f" User context already exists for user: {user_id}")
            logger.info(f"   Context ID: {existing_context['id']}")
            logger.info(f"   Onboarding Status: {existing_context['onboarding_status']}")
            logger.info(f"   Created At: {existing_context['created_at']}")
            
            # Convert record to response format
            user_context = UserContextResponse(
                user_id=str(existing_context['user_id']),
                business_data=existing_context['business_data'] or {},
                onboarding_status=existing_context['onboarding_status'],
                settings=existing_context.get('settings', {}) or {},  # Handle missing settings column
                created_at=existing_context['created_at'].isoformat(),
                updated_at=existing_context['updated_at'].isoformat()
            )
            
            logger.info(f" Returning existing user context for user: {user_id}")
            return UserContextCreateResponse(
                message="User context retrieved successfully",
                user_context=user_context,
                created=False
            )
        
        # Create new user context
        logger.info(f" Creating new user context for user: {user_id}")
        logger.info(f"   Default business_data: {{}}")
        logger.info(f"   Default onboarding_status: 'pending'")
        
        # Check if settings column exists
        try:
            logger.info(f"   Default settings: {{}}")
            cursor.execute(
                """
                INSERT INTO user_contexts (user_id, business_data, onboarding_status, settings)
                VALUES (%s, %s, %s, %s)
                RETURNING id, user_id, business_data, onboarding_status, settings, 
                          created_at, updated_at
                """,
                (user_id, Json({}), 'pending', Json({}))
            )
        except psycopg2.Error as e:
            # Always rollback on error
            conn.rollback()
            
            if 'column "settings" does not exist' in str(e):
                logger.warning("⚠️ Settings column not found in user_contexts table. Using insert without settings.")
                # Fallback query without settings column
                try:
                    cursor.execute(
                        """
                        INSERT INTO user_contexts (user_id, business_data, onboarding_status)
                        VALUES (%s, %s, %s)
                        RETURNING id, user_id, business_data, onboarding_status, 
                                  created_at, updated_at
                        """,
                        (user_id, Json({}), 'pending')
                    )
                except psycopg2.Error as inner_e:
                    # Rollback again if the fallback fails
                    conn.rollback()
                    logger.error(f" Second database error: {str(inner_e)}")
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail=f"Database operation failed: {str(inner_e)}"
                    )
            else:
                # Re-raise if it's a different error
                logger.error(f" Database error: {str(e)}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Database operation failed: {str(e)}"
                )
        new_context = cursor.fetchone()
        conn.commit()
        
        logger.info(f" Successfully created user context for user: {user_id}")
        logger.info(f"   New Context ID: {new_context['id']}")
        logger.info(f"   Created At: {new_context['created_at']}")
        
        # Convert record to response format
        user_context = UserContextResponse(
            user_id=str(new_context['user_id']),
            business_data=new_context['business_data'] or {},
            onboarding_status=new_context['onboarding_status'],
            settings=new_context.get('settings', {}) or {},  # Handle missing settings column
            created_at=new_context['created_at'].isoformat(),
            updated_at=new_context['updated_at'].isoformat()
        )
        
        logger.info(f" Returning newly created user context for user: {user_id}")
        return UserContextCreateResponse(
            message="User context created successfully",
            user_context=user_context,
            created=True
        )
        
    except psycopg2.Error as e:
        logger.error(f" Database error in create_user_context: {str(e)}")
        logger.error(f"   Error code: {e.pgcode if hasattr(e, 'pgcode') else 'Unknown'}")
        if conn:
            conn.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database operation failed: {str(e)}"
        )
    except Exception as e:
        logger.error(f" Unexpected error in create_user_context: {str(e)}")
        logger.error(f"   Error type: {type(e).__name__}")
        if conn:
            conn.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )
    finally:
        if conn:
            conn.close()
            logger.info(" Database connection closed")


@router.get("/context", response_model=UserContextResponse)
def get_user_context(
    user_id: str = Depends(require_user_id)
) -> UserContextResponse:
    """
    Get the current user's context.
    
    Args:
        user_id: User ID extracted from JWT token via FastAPI dependency
        
    Returns:
        UserContextResponse with context data
    """
    logger.info(f" GET /users/context - Retrieving user context for user: {user_id}")
    conn = None
    try:
        # Get database connection
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        logger.info(f" Querying user context for user: {user_id}")
        
        # Get user context
        try:
            # Try with settings column
            cursor.execute(
                """
                SELECT id, user_id, business_data, onboarding_status, settings, 
                       created_at, updated_at
                FROM user_contexts 
                WHERE user_id = %s
                """,
                (user_id,)
            )
        except psycopg2.Error as e:
            # Always rollback on error
            conn.rollback()
            
            if 'column "settings" does not exist' in str(e):
                logger.warning("⚠️ Settings column not found in user_contexts table. Using query without settings.")
                # Fallback query without settings column
                try:
                    cursor.execute(
                        """
                        SELECT id, user_id, business_data, onboarding_status, 
                               created_at, updated_at
                        FROM user_contexts 
                        WHERE user_id = %s
                        """,
                        (user_id,)
                    )
                except psycopg2.Error as inner_e:
                    # Rollback again if the fallback fails
                    conn.rollback()
                    logger.error(f" Second database error in GET: {str(inner_e)}")
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail=f"Database operation failed: {str(inner_e)}"
                    )
            else:
                # Re-raise if it's a different error
                logger.error(f" Database error in GET: {str(e)}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Database operation failed: {str(e)}"
                )
                
        context = cursor.fetchone()
        
        if not context:
            logger.warning(f" User context not found for user: {user_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User context not found"
            )
        
        logger.info(f" User context found for user: {user_id}")
        logger.info(f"   Context ID: {context['id']}")
        logger.info(f"   Onboarding Status: {context['onboarding_status']}")
        
        # Convert record to response format
        user_context = UserContextResponse(
            user_id=str(context['user_id']),
            business_data=context['business_data'] or {},
            onboarding_status=context['onboarding_status'],
            settings=context.get('settings', {}) or {},  # Handle missing settings column
            created_at=context['created_at'].isoformat(),
            updated_at=context['updated_at'].isoformat()
        )
        
        logger.info(f" Returning user context for user: {user_id}")
        return user_context
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f" Error getting user context: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )
    finally:
        if conn:
            conn.close()
            logger.info(" Database connection closed")
