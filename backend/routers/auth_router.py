import os
import logging
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from models import LoginRequest, new_id, now_iso
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    get_current_user,
    check_lockout,
    record_failed_attempt,
    clear_attempts,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/auth")

COOKIE_KW = dict(httponly=True, secure=True, samesite="none", path="/")


def _set_auth_cookies(response: Response, user_id: str, email: str):
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    response.set_cookie("access_token", access_token, max_age=3600, **COOKIE_KW)
    response.set_cookie("refresh_token", refresh_token, max_age=604800, **COOKIE_KW)


@router.post("/login")
async def login(payload: LoginRequest, request: Request, response: Response):
    from server import db

    email = payload.email.strip().lower()
    identifier = f"{request.client.host}:{email}"
    await check_lockout(db, identifier)

    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        await record_failed_attempt(db, identifier)
        raise HTTPException(status_code=401, detail="Invalid email or password")

    await clear_attempts(db, identifier)
    _set_auth_cookies(response, user["id"], user["email"])
    return {"id": user["id"], "email": user["email"], "name": user.get("name", "Admin"), "role": user["role"]}


@router.post("/logout")
async def logout(response: Response, user=Depends(get_current_user)):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "logged out"}


@router.get("/me")
async def me(user=Depends(get_current_user)):
    return user
