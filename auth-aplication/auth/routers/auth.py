# auth/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from auth import crud, schemas
from auth.database import get_db
from auth.utils import create_access_token, verify_password, get_current_user
from datetime import datetime, timedelta
import os

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

router = APIRouter(prefix="/login", tags=["auth"])

@router.post("/token")
def login_for_access_token(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, user.username)
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Senha incorreta")
    
    # Cria o token JWT
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.username}, expires_delta=access_token_expires
    )

    # Atualiza o token e o tempo de expiração no banco de dados
    crud.update_user_token(db, db_user.id, access_token, datetime.utcnow() + access_token_expires)

    return {"access_token": "bearer " + access_token, "token_expires": access_token_expires, "username": db_user.username, "userId": db_user.id}

