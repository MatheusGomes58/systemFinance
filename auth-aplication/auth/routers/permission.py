from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from auth import crud, schemas
from auth.database import get_db
from auth.utils import get_current_user

router = APIRouter(prefix="/permissions", tags=["permissions"])

@router.post("/", response_model=schemas.PermissionCreate)
def create_permission(permission: schemas.PermissionCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    return crud.create_permission(db, permission.name)

@router.get("/{permission_id}")
def read_permission(permission_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    permission = db.query(Permission).filter(Permission.id == permission_id).first()
    if permission is None:
        raise HTTPException(status_code=404, detail="Permissão não encontrada")
    return permission

@router.put("/{permission_id}")
def update_permission(permission_id: int, permission: schemas.PermissionCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    db_permission = db.query(Permission).filter(Permission.id == permission_id).first()
    if db_permission is None:
        raise HTTPException(status_code=404, detail="Permissão não encontrada")
    db_permission.name = permission.name
    db.commit()
    db.refresh(db_permission)
    return db_permission

@router.delete("/{permission_id}")
def delete_permission(permission_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    db_permission = db.query(Permission).filter(Permission.id == permission_id).first()
    if db_permission is None:
        raise HTTPException(status_code=404, detail="Permissão não encontrada")
    db.delete(db_permission)
    db.commit()
    return {"message": "Permissão deletada com sucesso"}
