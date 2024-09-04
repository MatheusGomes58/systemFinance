from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List  # Certifique-se de que List esteja importado
from auth import crud, schemas
from auth.database import get_db
from auth.utils import get_current_user

router = APIRouter(prefix="/user-permissions", tags=["user-permissions"])

@router.post("/{user_id}/permissions/", response_model=schemas.UserPermission)
def assign_permission_to_user(user_id: int, permission_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    permission = crud.get_permission(db, permission_id)
    if not permission:
        raise HTTPException(status_code=404, detail="Permission not found")

    user_permission = crud.create_user_permission(db, user_id, permission_id)
    return user_permission

@router.delete("/{user_id}/permissions/{permission_id}")
def remove_permission_from_user(user_id: int, permission_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    user_permission = crud.get_user_permission(db, user_id, permission_id)
    if not user_permission:
        raise HTTPException(status_code=404, detail="User permission not found")

    crud.delete_user_permission(db, user_permission)
    return {"message": "User permission successfully removed"}

@router.get("/{user_id}/permissions/", response_model=List[schemas.UserPermissionResponse])
def get_user_permissions(user_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    permissions = crud.get_permissions_by_user(db, user_id)
    return permissions
