from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from auth import crud, schemas
from auth.database import get_db
from auth.utils import create_access_token, verify_password, get_current_user, decode_jwt
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
    expires_at = datetime.utcnow() + access_token_expires
    crud.update_user_token(db, db_user.id, access_token, expires_at)

    return {"access_token": access_token, "token_expires": access_token_expires, "username": db_user.username, "userId": db_user.id, "name": db_user.name}

@router.post("/token/verify")
def verify_token(token: str, db: Session = Depends(get_db)):
    # Decodifica e valida o token JWT
    payload = decode_jwt(token)
    username = payload.get("sub")
    if username is None:
        raise HTTPException(status_code=401, detail="Token inválido")

    # Obtém o usuário diretamente pelo token armazenado
    db_user = crud.get_user_by_token(db, token)
    if not db_user:
        raise HTTPException(status_code=404, detail="Token não encontrado")

    # Atualiza o tempo de expiração do token no banco de dados
    expires_at = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    crud.update_user_token(db, db_user.id, token, expires_at)

    return {"status": True, "expires_at": expires_at, "userId": db_user.id, "acesss_token": token, 'username': db_user.username}


@router.delete("/logout")
def logout(token: str, db: Session = Depends(get_db)):
    if not token:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    crud.remove_user_token(db, token)

    return {"message": "Logout realizado com sucesso"}
