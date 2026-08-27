import logging
from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from models import CatalogueCreate, CatalogueUpdate, CATALOGUE_CATEGORIES, new_id, now_iso, slugify
from auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api")


def _strip(doc):
    if doc:
        doc.pop("_id", None)
    return doc


# ---------- Catalogues (public) ----------
@router.get("/catalogues")
async def list_catalogues(category: Optional[str] = None, featured: Optional[bool] = None):
    from server import db

    query = {"published": True}
    if category:
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    catalogues = await db.catalogues.find(query, {"_id": 0}).sort("created_at", -1).to_list(200)
    return catalogues


@router.get("/catalogues/{slug}")
async def get_catalogue(slug: str):
    from server import db

    catalogue = await db.catalogues.find_one({"slug": slug, "published": True}, {"_id": 0})
    if not catalogue:
        raise HTTPException(status_code=404, detail="Catalogue not found")
    return catalogue


@router.post("/catalogues/{slug}/track-download")
async def track_download(slug: str):
    from server import db

    await db.catalogues.update_one({"slug": slug}, {"$inc": {"download_count": 1}})
    return {"message": "tracked"}


# ---------- Catalogues (admin) ----------
@router.get("/admin/catalogues")
async def admin_list_catalogues(user=Depends(get_current_user)):
    from server import db

    catalogues = await db.catalogues.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return catalogues


@router.get("/admin/catalogues/{catalogue_id}")
async def admin_get_catalogue(catalogue_id: str, user=Depends(get_current_user)):
    from server import db

    catalogue = await db.catalogues.find_one({"id": catalogue_id}, {"_id": 0})
    if not catalogue:
        raise HTTPException(status_code=404, detail="Catalogue not found")
    return catalogue


@router.post("/admin/catalogues")
async def create_catalogue(payload: CatalogueCreate, user=Depends(get_current_user)):
    from server import db

    if payload.category not in CATALOGUE_CATEGORIES:
        raise HTTPException(status_code=400, detail=f"Category must be one of {CATALOGUE_CATEGORIES}")
    doc = payload.model_dump()
    doc["id"] = new_id()
    doc["slug"] = slugify(f"{payload.title}-{payload.category}")
    doc["download_count"] = 0
    doc["created_at"] = now_iso()
    doc["updated_at"] = now_iso()
    await db.catalogues.insert_one(doc)
    return _strip(doc)


@router.put("/admin/catalogues/{catalogue_id}")
async def update_catalogue(catalogue_id: str, payload: CatalogueUpdate, user=Depends(get_current_user)):
    from server import db

    existing = await db.catalogues.find_one({"id": catalogue_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Catalogue not found")
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    if update_data.get("category") and update_data["category"] not in CATALOGUE_CATEGORIES:
        raise HTTPException(status_code=400, detail=f"Category must be one of {CATALOGUE_CATEGORIES}")
    if "title" in update_data or "category" in update_data:
        title = update_data.get("title", existing["title"])
        category = update_data.get("category", existing["category"])
        update_data["slug"] = slugify(f"{title}-{category}")
    update_data["updated_at"] = now_iso()
    await db.catalogues.update_one({"id": catalogue_id}, {"$set": update_data})
    return _strip(await db.catalogues.find_one({"id": catalogue_id}, {"_id": 0}))


@router.delete("/admin/catalogues/{catalogue_id}")
async def delete_catalogue(catalogue_id: str, user=Depends(get_current_user)):
    from server import db

    result = await db.catalogues.delete_one({"id": catalogue_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Catalogue not found")
    return {"message": "deleted"}


@router.get("/catalogue-categories")
async def get_catalogue_categories():
    return CATALOGUE_CATEGORIES
