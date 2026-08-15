import os
import io
import uuid
import logging
import requests
from PIL import Image

logger = logging.getLogger(__name__)

STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
APP_NAME = os.environ.get("APP_NAME", "nirman_udyog")

_storage_key = None
_object_cache = {}
_CACHE_MAX_ITEMS = 1000


def init_storage(force: bool = False):
    global _storage_key
    if _storage_key and not force:
        return _storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    resp.raise_for_status()
    _storage_key = resp.json()["storage_key"]
    return _storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data,
        timeout=120,
    )
    if resp.status_code == 404:
        key = init_storage(force=True)
        resp = requests.put(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": key, "Content-Type": content_type},
            data=data,
            timeout=120,
        )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    cached = _object_cache.get(path)
    if cached:
        return cached
    key = init_storage()
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    if resp.status_code == 404:
        key = init_storage(force=True)
        resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    resp.raise_for_status()
    result = (resp.content, resp.headers.get("Content-Type", "application/octet-stream"))
    if len(_object_cache) < _CACHE_MAX_ITEMS:
        _object_cache[path] = result
    return result


SIZES = {"thumb": 400, "medium": 800, "large": 1600}


def _resize_webp(img: Image.Image, max_width: int) -> bytes:
    w, h = img.size
    if w > max_width:
        new_h = int(h * (max_width / w))
        img = img.resize((max_width, new_h), Image.LANCZOS)
    buf = io.BytesIO()
    img.convert("RGB").save(buf, format="WEBP", quality=82)
    return buf.getvalue()


def process_and_upload_image(file_bytes: bytes, folder: str) -> dict:
    img = Image.open(io.BytesIO(file_bytes))
    image_id = str(uuid.uuid4())
    paths = {}
    for size_name, max_width in SIZES.items():
        webp_bytes = _resize_webp(img.copy(), max_width)
        path = f"{APP_NAME}/{folder}/{image_id}_{size_name}.webp"
        result = put_object(path, webp_bytes, "image/webp")
        paths[size_name] = result["path"]
    return {"id": image_id, "thumb": paths["thumb"], "medium": paths["medium"], "large": paths["large"]}
