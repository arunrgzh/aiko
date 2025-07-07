"""
Simple HeadHunter OAuth2 callback implementation
"""

from fastapi import APIRouter, Query, HTTPException
import httpx
import logging
from typing import Optional

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/auth/hh", tags=["headhunter-auth"])

@router.get("/callback")
async def hh_oauth_callback(
    code: Optional[str] = Query(None, description="Authorization code from HeadHunter"),
    state: Optional[str] = Query(None, description="State parameter"),
    error: Optional[str] = Query(None, description="Error from HeadHunter"),
    error_description: Optional[str] = Query(None, description="Error description")
):
    """
    HeadHunter OAuth callback endpoint
    Exchanges authorization code for access token
    """
    try:
        # Check for OAuth errors
        if error:
            logger.error(f"HeadHunter OAuth error: {error} - {error_description}")
            raise HTTPException(
                status_code=400, 
                detail=f"HeadHunter authorization failed: {error_description or error}"
            )
        
        # Check if we have a code
        if not code:
            raise HTTPException(
                status_code=400,
                detail="Authorization code is required"
            )
        
        # Here you would normally:
        # 1. Exchange code for access_token with HeadHunter
        # 2. Store the token securely
        # 3. Associate with the user
        
        # For now, let's return success with the code received
        logger.info(f"Received authorization code: {code[:10]}...")
        
        return {
            "message": "HH auth success!",
            "code_received": True,
            "state": state
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in HH OAuth callback: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process HeadHunter authorization")

@router.get("/authorize")
async def get_auth_url():
    """
    Get HeadHunter authorization URL
    """
    # This would normally build the proper authorization URL
    # For now, return a placeholder
    return {
        "message": "Configure HeadHunter OAuth app first",
        "redirect_uri": "http://localhost:8000/api/auth/hh/callback",
        "steps": [
            "1. Register at https://dev.hh.ru/",
            "2. Create OAuth app",
            "3. Set redirect URI to the URL above",
            "4. Configure client_id and client_secret"
        ]
    }

@router.get("/status")
async def auth_status():
    """
    Check HeadHunter authorization status
    """
    return {
        "authorized": False,
        "message": "HeadHunter integration not configured yet"
    }

# Открытый API без авторизации
@router.get("/search")
async def search_vacancies_open(
    text: Optional[str] = Query(None, description="Поисковый запрос"),
    area: Optional[str] = Query("40", description="Регион поиска (40 = Казахстан)"),
    page: Optional[int] = Query(0, description="Номер страницы"),
    per_page: Optional[int] = Query(20, description="Количество вакансий")
):
    """
    Поиск вакансий через открытый API HeadHunter (без авторизации)
    GET /api/auth/hh/search?text=python&area=40
    """
    try:
        params = {
            "page": page or 0,
            "per_page": min(per_page or 20, 100),
            "area": area or "40"
        }
        
        if text:
            params["text"] = text
            
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.hh.kz/vacancies",
                params=params,
                headers={"User-Agent": "AI-Komek Job Platform Parser"},
                timeout=30.0
            )
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "success": True,
                    "total_found": data.get("found", 0),
                    "total_pages": data.get("pages", 0),
                    "current_page": data.get("page", 0),
                    "per_page": data.get("per_page", 0),
                    "vacancies": data.get("items", [])
                }
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"HeadHunter API error: {response.status_code}"
                )
                
    except httpx.RequestError as e:
        logger.error(f"Network error: {str(e)}")
        raise HTTPException(status_code=500, detail="Ошибка соединения с HeadHunter API")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Внутренняя ошибка сервера")

@router.get("/areas")
async def get_areas():
    """
    Get HeadHunter areas (regions/cities) for Kazakhstan
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.hh.kz/areas/40",  # Kazakhstan
                headers={"User-Agent": "AI-Komek Job Platform Parser"},
                timeout=30.0
            )
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "success": True,
                    "areas": data.get("areas", [])
                }
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"HeadHunter API error: {response.status_code}"
                )
                
    except httpx.RequestError as e:
        logger.error(f"Network error: {str(e)}")
        raise HTTPException(status_code=500, detail="Ошибка соединения с HeadHunter API")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Внутренняя ошибка сервера")

@router.get("/specializations")
async def get_specializations():
    """
    Get HeadHunter specializations for job filtering
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.hh.kz/specializations",
                headers={"User-Agent": "AI-Komek Job Platform Parser"},
                timeout=30.0
            )
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "success": True,
                    "specializations": data
                }
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"HeadHunter API error: {response.status_code}"
                )
                
    except httpx.RequestError as e:
        logger.error(f"Network error: {str(e)}")
        raise HTTPException(status_code=500, detail="Ошибка соединения с HeadHunter API")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Внутренняя ошибка сервера") 