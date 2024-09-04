from fastapi import HTTPException, status
from keycloak import KeycloakOpenID
from .config import KEYCLOAK_SERVER, KEYCLOAK_REALM, KEYCLOAK_CLIENT_ID, KEYCLOAK_CLIENT_SECRET

keycloak_openid = KeycloakOpenID(server_url=KEYCLOAK_SERVER,
                                client_id=KEYCLOAK_CLIENT_ID,
                                realm_name=KEYCLOAK_REALM,
                                client_secret_key=KEYCLOAK_CLIENT_SECRET)

def verify_token(token: str):
    try:
        keycloak_openid.decode_token(token)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
