from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from auth import crud, schemas
from auth.database import get_db
from auth.utils import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=schemas.UserCreate)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db), current_user: schemas.UserCreate = Depends(get_current_user)):
    try:
        return crud.create_user(db, user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{user_id}")
def read_user(user_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    user = crud.get_user(db, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user

@router.put("/{user_id}")
def update_user(user_id: int, user: schemas.UserUpdate, db: Session = Depends(get_db), current_user: schemas.UserCreate = Depends(get_current_user)):
    db_user = crud.get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    db_user.username = user.username
    db_user.hashed_password = crud.hash_password(user.password)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: schemas.UserCreate = Depends(get_current_user)):
    db_user = crud.get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    db.delete(db_user)
    db.commit()
    return {"message": "Usuário deletado com sucesso"}