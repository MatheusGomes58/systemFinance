from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from auth import crud, schemas
from auth.database import get_db
from auth.utils import get_current_user, generate_temp_password

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=schemas.UserResponseCreated)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_user(db, user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{user_id}")
def read_user(user_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    user = crud.get_user(db, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return schemas.UserResponseCreated(username=user.username, id=user.id)

@router.put("/{user_id}")
def update_user(user_id: int, user: schemas.UserUpdate, db: Session = Depends(get_db), current_user: schemas.UserCreate = Depends(get_current_user)):        
    db_user = crud.get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.username = user.username
    db_user.hashed_password = crud.hash_password(user.password)
    db.commit()
    db.refresh(db_user)
    return schemas.UserResponseCreated(username=db_user.username, id=db_user.id)

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: schemas.UserCreate = Depends(get_current_user)):
    db_user = crud.get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return {"message": "User deleted successfully"}

@router.post("/reset-password/")
def reset_password(user: schemas.UserResetPassword, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, user.username)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    temp_password = generate_temp_password()
    hashed_temp_password = crud.hash_password(temp_password)
    db_user.hashed_password = hashed_temp_password
    db.commit()
    db.refresh(db_user)
    
    return {"message": "Your password has been temporarily reset to: " + temp_password }
