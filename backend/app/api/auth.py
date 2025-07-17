from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from pydantic import BaseModel

from ..database import get_db
from ..schemas.user import UserCreate, UserResponse, TokenResponse
from ..auth.jwt import create_access_token, create_refresh_token, verify_token
from ..auth.security import authenticate_user, get_password_hash, get_user_by_email, get_user_by_username
from ..models.user import User

router = APIRouter(prefix="/api/auth", tags=["auth"])

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    if await get_user_by_email(user_data.email, db):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    if await get_user_by_username(user_data.username, db):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=get_password_hash(user_data.password)
    )
    print(user)

    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@router.post("/login", response_model=TokenResponse)
async def login(
    credentials: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    user = await authenticate_user(credentials.username, credentials.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = await create_access_token(data={"sub": user.username})
    refresh_token = await create_refresh_token(data={"sub": user.username})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "is_first_login": user.is_first_login
    }

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(refresh_token: str = Body(..., embed=True), db: AsyncSession = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = await verify_token(refresh_token, credentials_exception, token_type="refresh")
        username = payload.username
        if username is None:
            raise credentials_exception
    except:
        raise credentials_exception
        
    user = await get_user_by_username(username, db)
    if user is None:
        raise credentials_exception
        
    access_token = await create_access_token(data={"sub": username})
    new_refresh_token = await create_refresh_token(data={"sub": username})
    
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "is_first_login": user.is_first_login
    } 