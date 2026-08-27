import asyncio
import logging
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Response
from typing import List
from auth import get_current_user
from storage import process_and_upload_image, upload_pdf, get_object

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api")

MAX_SIZE = 10 * 1024 * 1024
MAX_PDF_SIZE = 30 * 1024 * 1024


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
            processed = await asyncio.to_thread(process_and_upload_image, data, folder)
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
        data, content_type = await asyncio.to_thread(get_object, path)
    except Exception as e:
        logger.error(f"Media fetch failed for {path}: {e}")
        raise HTTPException(status_code=404, detail="Image not found")
    return Response(content=data, media_type=content_type or "image/webp", headers={"Cache-Control": "public, max-age=31536000, immutable"})


@router.post("/admin/upload-pdf")
async def upload_catalogue_pdf(file: UploadFile = File(...), user=Depends(get_current_user)):
    content_type = file.content_type or ""
    if content_type != "application/pdf" and not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail=f"{file.filename} is not a PDF")
    data = await file.read()
    if len(data) > MAX_PDF_SIZE:
        raise HTTPException(status_code=400, detail=f"{file.filename} exceeds 30MB limit")
    try:
        result = await asyncio.to_thread(upload_pdf, data)
    except Exception as e:
        logger.error(f"PDF upload failed for {file.filename}: {e}")
        raise HTTPException(status_code=500, detail="PDF upload failed")
    return {
        "url": f"/api/media/{result['path']}",
        "file_size_mb": round(result["size_bytes"] / (1024 * 1024), 2),
    }
