"""
JWT Handler for Supabase JWT verification
"""
import os
import jwt
import httpx
import logging
from typing import Optional, Dict, Any
from datetime import datetime, timezone
from functools import lru_cache
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.serialization import load_pem_private_key
from cryptography.hazmat.backends import default_backend

logger = logging.getLogger(__name__)


class JWTHandler:
    """Handle Supabase JWT verification"""
    
    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_anon_key = os.getenv("SUPABASE_ANON_KEY")
        self.jwt_secret = os.getenv("SUPABASE_JWT_SECRET")
        
        if not self.supabase_url:
            raise ValueError("SUPABASE_URL environment variable is required")
        if not self.supabase_anon_key:
            raise ValueError("SUPABASE_ANON_KEY environment variable is required")
        if not self.jwt_secret:
            raise ValueError("SUPABASE_JWT_SECRET environment variable is required")
            
        self.jwks_url = f"{self.supabase_url}/auth/v1/jwks"
        logger.info(f"JWT Handler initialized with URL: {self.supabase_url}")

    async def get_jwks(self) -> Dict[str, Any]:
        """
        Fetch JWKS from Supabase auth endpoint.
        This method is kept for RS256 compatibility but not used for HS256.
        """
        try:
            logger.info(f"Fetching JWKS from: {self.jwks_url}")
            
            headers = {}
            if self.supabase_anon_key:
                headers["apikey"] = self.supabase_anon_key
                logger.debug("Using API key for JWKS request")
            
            async with httpx.AsyncClient() as client:
                response = await client.get(self.jwks_url, headers=headers)
                
                if response.status_code == 401 and self.supabase_anon_key:
                    logger.warning("JWKS request with API key failed with 401, retrying without API key")
                    response = await client.get(self.jwks_url)
                
                response.raise_for_status()
                jwks_data = response.json()
                logger.info("Successfully fetched JWKS")
                return jwks_data
                
        except Exception as e:
            logger.error(f"Failed to fetch JWKS: {str(e)}")
            raise Exception(f"Failed to fetch JWKS: {str(e)}")

    def get_signing_key(self, jwks: Dict[str, Any], kid: str) -> str:
        """
        Extract signing key from JWKS for the given key ID.
        This method is kept for RS256 compatibility but not used for HS256.
        """
        try:
            keys = jwks.get("keys", [])
            for key in keys:
                if key.get("kid") == kid:
                    # Convert JWK to PEM format for RS256
                    jwk = JsonWebKey.import_key(key)
                    return jwk.get_public_key()
            
            raise Exception(f"Unable to find signing key with kid: {kid}")
            
        except Exception as e:
            logger.error(f"Failed to get signing key: {str(e)}")
            raise Exception(f"Failed to get signing key: {str(e)}")

    async def verify_token(self, token: str) -> Dict[str, Any]:
        """
        Verify JWT token using HS256 algorithm with JWT secret.
        Falls back to RS256 with JWKS if HS256 fails.
        """
        try:
            logger.info("Attempting to verify JWT token")
            logger.debug(f"Token length: {len(token)}")
            
            # First, try HS256 verification with JWT secret
            try:
                logger.debug("Attempting HS256 verification with JWT secret")
                payload = jwt.decode(
                    token,
                    self.jwt_secret,
                    algorithms=["HS256"],
                    audience="authenticated",
                    options={"verify_exp": True}
                )
                logger.info(f"Successfully verified HS256 token for user: {payload.get('sub')}")
                return payload
                
            except Exception as hs256_error:
                logger.warning(f"HS256 verification failed: {str(hs256_error)}")
                logger.info("Falling back to RS256 verification with JWKS")
                
                # Fallback to RS256 verification with JWKS
                unverified_header = jwt.get_unverified_header(token)
                logger.debug(f"Token header: {unverified_header}")
                
                kid = unverified_header.get("kid")
                if not kid:
                    raise Exception("Token header missing 'kid' field")
                
                logger.debug(f"Token kid: {kid}")
                
                # Get JWKS and find the signing key
                jwks = await self.get_jwks()
                signing_key = self.get_signing_key(jwks, kid)
                
                # Verify and decode the token with RS256
                payload = jwt.decode(
                    token,
                    signing_key,
                    algorithms=["RS256"],
                    audience="authenticated",
                    options={"verify_exp": True}
                )
                
                logger.info(f"Successfully verified RS256 token for user: {payload.get('sub')}")
                return payload
            
        except jwt.ExpiredSignatureError:
            logger.warning("Token has expired")
            raise Exception("Token has expired")
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid token: {str(e)}")
            raise Exception(f"Invalid token: {str(e)}")
        except Exception as e:
            logger.error(f"Token verification failed: {str(e)}")
            raise Exception(f"Token verification failed: {str(e)}")

    def extract_user_info(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Extract user information from JWT payload"""
        return {
            "user_id": payload.get("sub"),
            "email": payload.get("email"),
            "role": payload.get("role", "authenticated"),
            "aud": payload.get("aud"),
            "exp": payload.get("exp"),
            "iat": payload.get("iat"),
            "iss": payload.get("iss"),
        }


# Global JWT handler instance
jwt_handler = JWTHandler()
