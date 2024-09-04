from sqlalchemy.orm import Session
from auth.models import User, Permission, UserToken, UserPermission
from auth.schemas import UserCreate, UserResponseCreated
from passlib.context import CryptContext
from datetime import datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_token(db: Session, token: str):
    user_db = db.query(UserToken).filter(UserToken.access_token == token).first()
    user_db = db.query(User).filter(User.id == user_db.user_id).first()
    return user_db

def get_all_users(db: Session):
    return db.query(User).all()

def get_user_by_username(db: Session, username: str):
    return  db.query(User).filter(User.username == username).first()

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def create_user(db: Session, user: UserCreate) -> UserResponseCreated:
    db_user = get_user_by_username(db, user.username)
    if db_user:
        raise ValueError(f"User with username {user.username} already exists")
    hashed_password = hash_password(user.password)
    new_user = User(username=user.username, hashed_password=hashed_password, name="", email="")
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return UserResponseCreated(username=new_user.username, id=new_user.id)

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

# Função para obter uma permissão
def get_permission(db: Session, permission_id: int):
    return db.query(Permission).filter(Permission.id == permission_id).first()

# Função para atribuir permissão a um usuário
def create_user_permission(db: Session, user_id: int, permission_id: int):
    user_permission = UserPermission(user_id=user_id, permission_id=permission_id)
    db.add(user_permission)
    db.commit()
    db.refresh(user_permission)
    return user_permission

# Função para remover permissão de um usuário
def delete_user_permission(db: Session, user_permission: UserPermission):
    db.delete(user_permission)
    db.commit()

# Função para obter permissões de um usuário
def get_permissions_by_user(db: Session, user_id: int):
    return db.query(UserPermission).filter(UserPermission.user_id == user_id).all()

# Função para criar um token de usuário
def create_user_token(db: Session, user_id: int, token: str, expires_at: datetime):
    db_user_token = UserToken(user_id=user_id, access_token=token, expires_at=expires_at)
    db.add(db_user_token)
    db.commit()
    db.refresh(db_user_token)
    return db_user_token

# Função para atualizar um token de usuário
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

# Função para obter um token válido para um usuário
def get_valid_user_token(db: Session, user_id: int):
    return db.query(UserToken).filter(UserToken.user_id == user_id, UserToken.expires_at > datetime.utcnow()).first()

# Função para obter a permissão do usuário
def get_user_permission(db: Session, user_id: int, permission_id: int):
    return db.query(UserPermission).filter(UserPermission.user_id == user_id, UserPermission.permission_id == permission_id).first()
