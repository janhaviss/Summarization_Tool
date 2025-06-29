from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from database import get_db
from models import user
from schemas.auth import UserCreate, User, Token, UserLogin
from schemas.user import UserInDB,UserCreate
from models.user import User as UserModel 
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from service.config import settings  
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

from service.auth import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    get_current_user,
    get_current_active_user,
    authenticate_user,
    create_access_token,
    get_password_hash,
    get_user
)

router = APIRouter()


@router.post("/login", response_model=Token)
async def login(
    user_login: UserLogin,  # Uses our custom schema instead of OAuth2 form
    db: Session = Depends(get_db)
):
    """
    Login with email and password.
    Returns access token for authenticated users.
    """
    user = authenticate_user(db, user_login.email, user_login.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/register", response_model=UserInDB)
async def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    try:
        # Check if user exists
        existing_user = db.query(UserModel).filter(UserModel.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        db_user = UserModel(
            email=user_data.email,
            name=user_data.name,
            hashed_password=get_password_hash(user_data.password),
            credits=100,
            active=True
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        return db_user
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user