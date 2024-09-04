from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from auth import crud, schemas
from auth.database import get_db
from auth.utils import get_current_user

router = APIRouter(prefix="/permissions", tags=["permissions"])

@router.post("/", response_model=schemas.PermissionResponse)
def create_permission(
    permission: schemas.PermissionCreate,
    db: Session = Depends(get_db),
    current_user: schemas.BaseUser = Depends(get_current_user)  # Usando BaseUser
):
    # Cria a permissão e obtém o objeto criado
    new_permission = crud.create_permission(db, permission.name)
    # Retorna o objeto PermissionResponse
    return schemas.PermissionResponse(id=new_permission.id, name=new_permission.name)

@router.get("/{permission_id}", response_model=schemas.PermissionResponse)
def read_permission(
    permission_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.BaseUser = Depends(get_current_user)  # Usando BaseUser
):
    permission = crud.get_permission(db, permission_id)
    if permission is None:
        raise HTTPException(status_code=404, detail="Permission not found")
    # Retorna o objeto PermissionResponse
    return schemas.PermissionResponse(id=permission.id, name=permission.name)

@router.put("/{permission_id}", response_model=schemas.PermissionResponse)
def update_permission(
    permission_id: int,
    permission: schemas.PermissionCreate,
    db: Session = Depends(get_db),
    current_user: schemas.BaseUser = Depends(get_current_user)  # Usando BaseUser
):
    db_permission = crud.get_permission(db, permission_id)
    if db_permission is None:
        raise HTTPException(status_code=404, detail="Permission not found")
    
    # Atualiza a permissão
    db_permission.name = permission.name
    db.commit()
    db.refresh(db_permission)
    # Retorna o objeto PermissionResponse atualizado
    return schemas.PermissionResponse(id=db_permission.id, name=db_permission.name)

@router.delete("/{permission_id}", response_model=dict)
def delete_permission(
    permission_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.BaseUser = Depends(get_current_user)  # Usando BaseUser
):
    db_permission = crud.get_permission(db, permission_id)
    if db_permission is None:
        raise HTTPException(status_code=404, detail="Permission not found")
    
    crud.delete_permission(db, db_permission)
    return {"message": "Permission deleted successfully"}
