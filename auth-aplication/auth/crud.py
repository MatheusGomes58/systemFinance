from sqlalchemy.orm import Session
from auth.models import User, Permission, UserToken
from auth.schemas import UserCreate
from passlib.context import CryptContext
from datetime import datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Função para criar um novo usuário
def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, user: UserCreate):
    db_user = get_user_by_username(db, user.username)
    if db_user:
        raise ValueError(f"User with username {user.username} already exists")
    hashed_password = hash_password(user.password)
    new_user = User(username=user.username, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# Função para ler um usuário
def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

# Função para verificar senha
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# Função para criar permissão
def create_permission(db: Session, name: str):
    db_permission = Permission(name=name)
    db.add(db_permission)
    db.commit()
    db.refresh(db_permission)
    return db_permission

def create_user_token(db: Session, user_id: int, token: str, expires_at: datetime):
    # Cria um novo registro de token para o usuário
    db_user_token = UserToken(
        user_id=user_id,
        token=token,
        expires_at=expires_at
    )
    db.add(db_user_token)
    db.commit()
    db.refresh(db_user_token)
    return db_user_token

def update_user_token(db: Session, user_id: int, access_token: str, expires_at: datetime):
    db_user_token = db.query(UserToken).filter(UserToken.user_id == user_id).first()
    if db_user_token:
        db_user_token.access_token = access_token
        db_user_token.expires_at = expires_at
    else:
        db_user_token = UserToken(user_id=user_id, access_token=access_token, expires_at=expires_at)
        db.add(db_user_token)
    db.commit()
    return db_user_token

def get_valid_user_token(db: Session, user_id: int):
    # Obtém um token válido para o usuário
    return db.query(UserToken).filter(UserToken.user_id == user_id, UserToken.expires_at > datetime.utcnow()).first()
