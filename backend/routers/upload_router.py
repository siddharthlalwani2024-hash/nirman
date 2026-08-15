import logging
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Response
from typing import List
from auth import get_current_user
from storage import process_and_upload_image, get_object

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api")

MAX_SIZE = 10 * 1024 * 1024


@router.post("/admin/upload")
async def upload_images(files: List[UploadFile] = File(...), folder: str = Form("tiles"), user=Depends(get_current_user)):
    results = []
    for f in files:
        content_type = f.content_type or ""
        if not content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail=f"{f.filename} is not an image")
        data = await f.read()
        if len(data) > MAX_SIZE:
            raise HTTPException(status_code=400, detail=f"{f.filename} exceeds 10MB limit")
        try:
            processed = process_and_upload_image(data, folder)
        except Exception as e:
            logger.error(f"Image processing failed for {f.filename}: {e}")
            raise HTTPException(status_code=500, detail="Image processing failed")
        results.append(
            {
                "id": processed["id"],
                "url": f"/api/media/{processed['large']}",
                "medium_url": f"/api/media/{processed['medium']}",
                "thumb_url": f"/api/media/{processed['thumb']}",
            }
        )
    return {"images": results}


@router.get("/media/{path:path}")
async def serve_media(path: str):
    try:
        data, content_type = get_object(path)
    except Exception:
        raise HTTPException(status_code=404, detail="Image not found")
    return Response(content=data, media_type=content_type or "image/webp", headers={"Cache-Control": "public, max-age=31536000, immutable"})
