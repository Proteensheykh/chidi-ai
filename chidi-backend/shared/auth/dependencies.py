"""
FastAPI dependencies for authentication
"""
import logging
from typing import Optional, Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from .jwt_handler import JWTHandler

# Configure logging
logger = logging.getLogger(__name__)

# Initialize security scheme and JWT handler
security = HTTPBearer()
jwt_handler = JWTHandler()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> Dict[str, Any]:
    """
    FastAPI dependency to get the current authenticated user.
    
    Args:
        credentials: HTTP Bearer token from Authorization header
        
    Returns:
        User information dictionary
        
    Raises:
        HTTPException: If authentication fails
    """
    logger.info(" Authentication attempt started")
    logger.info(f"   Token length: {len(credentials.credentials) if credentials else 0}")
    
    try:
        # Extract token from credentials
        token = credentials.credentials
        logger.debug(f"   Token preview: {token[:20]}...{token[-10:] if len(token) > 30 else token}")
        
        # Verify the JWT token
        logger.info(" Verifying JWT token...")
        payload = await jwt_handler.verify_token(token)
        logger.info(" JWT token verified successfully")
        
        # Extract user information
        logger.info(" Extracting user information from token payload...")
        user_info = jwt_handler.extract_user_info(payload)
        
        # Ensure we have a valid user ID
        if not user_info.get("user_id"):
            logger.error(" Token payload missing user_id (sub)")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user identifier",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        logger.info(f" Authentication successful for user: {user_info['user_id']}")
        logger.info(f"   Email: {user_info.get('email', 'N/A')}")
        logger.info(f"   Role: {user_info.get('role', 'N/A')}")
        return user_info
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        logger.warning(" Authentication failed - HTTP exception")
        raise
    except Exception as e:
        logger.error(f" Authentication failed: {str(e)}")
        logger.error(f"   Error type: {type(e).__name__}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))
) -> Optional[Dict[str, Any]]:
    """
    FastAPI dependency to optionally get the current authenticated user.
    Returns None if no token is provided or if token is invalid.
    
    Args:
        credentials: Optional HTTP Bearer token from Authorization header
        
    Returns:
        User information dictionary or None
    """
    logger.info(" Optional authentication attempt")
    
    if not credentials:
        logger.info("   No credentials provided - returning None")
        return None
    
    try:
        # Extract token from credentials
        token = credentials.credentials
        logger.info(f"   Token provided, length: {len(token)}")
        
        # Verify the JWT token
        payload = await jwt_handler.verify_token(token)
        
        # Extract user information
        user_info = jwt_handler.extract_user_info(payload)
        
        # Ensure we have a valid user ID
        if not user_info.get("user_id"):
            logger.warning(" Optional auth: Token missing user_id")
            return None
        
        logger.info(f" Optional authentication successful for user: {user_info['user_id']}")
        return user_info
        
    except Exception as e:
        logger.warning(f" Optional authentication failed: {str(e)}")
        return None


def require_user_id(user: Dict[str, Any] = Depends(get_current_user)) -> str:
    """
    FastAPI dependency that returns just the user ID string.
    
    Args:
        user: User information from get_current_user
        
    Returns:
        User ID string
    """
    user_id = user["user_id"]
    logger.info(f" User ID extracted for request: {user_id}")
    return user_id
