from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
from ..config import KEYCLOAK_SERVER, KEYCLOAK_REALM, KEYCLOAK_CLIENT_ID, KEYCLOAK_CLIENT_SECRET

router = APIRouter()

class AuthRequest(BaseModel):
    username: str
    password: str

@router.post("/token/")
def get_token(auth_request: AuthRequest):
    url = f"{KEYCLOAK_SERVER}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/token"
    data = {
        "grant_type": "password",
        "client_id": KEYCLOAK_CLIENT_ID,
        "client_secret": KEYCLOAK_CLIENT_SECRET,
        "username": auth_request.username,
        "password": auth_request.password
    }
    response = requests.post(url, data=data)
    if response.status_code == 200:
        return response.json()
    else:
        raise HTTPException(status_code=response.status_code, detail="Authentication failed")
