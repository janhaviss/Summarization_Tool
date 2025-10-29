from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from sqlalchemy.orm import Session
from database import get_db

from service.email import send_reset_email
from schemas.auth import UserCreate, User, Token, UserLogin, PasswordResetRequest, PasswordResetConfirm
from schemas.user import UserInDB,UserCreate
from models.user import User as UserModel 

from typing import Annotated
from service.config import settings  

ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

from service.auth import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    get_current_user,
    get_current_active_user,
    verify_reset_token,
    create_reset_token,
    authenticate_user,
    create_access_token,
    get_password_hash,
    get_user,
)

router = APIRouter(tags=['Authentication'])


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


@router.post("/forgot-password")
async def forgot_password(
    request: PasswordResetRequest,
    db: Session = Depends(get_db)
):
    user = db.query(UserModel).filter(UserModel.email == request.email).first()
    if not user:
        return {"detail": "If this email exists, you'll receive a reset link"}
    
    reset_token = create_reset_token(user.email)
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
    
    await send_reset_email(user.email, reset_link)
    return {"detail": "Password reset email sent"}

@router.post("/reset-password")
async def reset_password(
    form_data: PasswordResetConfirm, # pehle schemas se aata hai 
    db: Session = Depends(get_db)
):
    email = verify_reset_token(form_data.token)
    user = db.query(UserModel).filter(UserModel.email == email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.hashed_password = get_password_hash(form_data.new_password.get_secret_value()) # phir set hota hai, and since get_password_hash expects normal string and we are giving secret
    # get_password_hash fucntion takes the form data password (string thru ^) and returns hashed pw,
    #  which is then stored in hashshed pwaasord column in model (db)
    db.commit()
    
    return {"detail": "Password updated successfully"}


# @router.post('/forgot-password')
# async def forgot_password(request: PasswordResetRequest, db: Session = Depends(get_db)):
#         # 1. Check if email exists
#     user = db.query(User).filter(User.email == request.email).first()
#     if not user:
#         return {'detail':'If the email exist, you will receive a reset link'}
    
#     # 2. Generate reset token
#     reset_token = create_password_reset_token(user.email)

#     # 3. Send email with reset link
#     reset_link = f"https://yourapp.com/reset-password?token={reset_token}"
#     await send_password_reset_email(user.email, reset_link) # sending this fucntion its argument

#     return {"detail": "Password reset link sent"}

# @router.post("/reset-password")
# async def reset_password( reset_data: PasswordResetConfirm, db: Session = Depends(get_db)):
#     # 1. Verify token
#     email = verify_password_reset_token(reset_data.token)
#     if not email:
#         raise HTTPException(status_code=400, detail="Invalid or expired token")
    
#     # 2. Update password
#     user = db.query(User).filter(User.email == email).first()
#     user.hashed_password = get_password_hash(reset_data.new_password)
#     db.commit()
    
#     return {"detail": "Password updated successfully"}