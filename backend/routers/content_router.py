import logging
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional, List
from models import (
    TileCreate,
    TileUpdate,
    DemoPhotoCreate,
    CategoryUpdate,
    SiteSettingsUpdate,
    BlogCreate,
    BlogUpdate,
    ROOMS,
    ROOM_SLUGS,
    new_id,
    now_iso,
    slugify,
)
from auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api")


def _strip(doc):
    if doc:
        doc.pop("_id", None)
    return doc


# ---------- Tiles (public) ----------
@router.get("/tiles")
async def list_tiles(room: Optional[str] = None, featured: Optional[bool] = None, q: Optional[str] = None, limit: int = 200):
    from server import db

    query = {"published": True}
    if room:
        query["rooms"] = room
    if featured is not None:
        query["featured"] = featured
    if q:
        query["name"] = {"$regex": q, "$options": "i"}
    tiles = await db.tiles.find(query, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return tiles


@router.get("/tiles/{slug}")
async def get_tile(slug: str):
    from server import db

    tile = await db.tiles.find_one({"slug": slug, "published": True}, {"_id": 0})
    if not tile:
        raise HTTPException(status_code=404, detail="Tile not found")
    linked_photos = await db.demo_photos.find({"tile_ids": tile["id"], "published": True}, {"_id": 0}).to_list(50)
    tile["demo_photos"] = linked_photos
    return tile


# ---------- Tiles (admin) ----------
@router.get("/admin/tiles")
async def admin_list_tiles(user=Depends(get_current_user)):
    from server import db

    tiles = await db.tiles.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return tiles


@router.get("/admin/tiles/{tile_id}")
async def admin_get_tile(tile_id: str, user=Depends(get_current_user)):
    from server import db

    tile = await db.tiles.find_one({"id": tile_id}, {"_id": 0})
    if not tile:
        raise HTTPException(status_code=404, detail="Tile not found")
    return tile


@router.post("/admin/tiles")
async def create_tile(payload: TileCreate, user=Depends(get_current_user)):
    from server import db

    doc = payload.model_dump()
    doc["id"] = new_id()
    base_slug = slugify(f"{payload.name}-{payload.sku}")
    doc["slug"] = base_slug
    doc["created_at"] = now_iso()
    doc["updated_at"] = now_iso()
    await db.tiles.insert_one(doc)
    return _strip(doc)


@router.put("/admin/tiles/{tile_id}")
async def update_tile(tile_id: str, payload: TileUpdate, user=Depends(get_current_user)):
    from server import db

    existing = await db.tiles.find_one({"id": tile_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Tile not found")
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    if "name" in update_data or "sku" in update_data:
        name = update_data.get("name", existing["name"])
        sku = update_data.get("sku", existing["sku"])
        update_data["slug"] = slugify(f"{name}-{sku}")
    update_data["updated_at"] = now_iso()
    await db.tiles.update_one({"id": tile_id}, {"$set": update_data})
    return _strip(await db.tiles.find_one({"id": tile_id}, {"_id": 0}))


@router.delete("/admin/tiles/{tile_id}")
async def delete_tile(tile_id: str, user=Depends(get_current_user)):
    from server import db

    result = await db.tiles.delete_one({"id": tile_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Tile not found")
    await db.demo_photos.update_many({}, {"$pull": {"tile_ids": tile_id}})
    return {"message": "deleted"}


# ---------- Demo Photos (public) ----------
@router.get("/demo-photos")
async def list_demo_photos(room: Optional[str] = None, tile_id: Optional[str] = None, limit: int = 200):
    from server import db

    query = {"published": True}
    if room:
        query["room"] = room
    if tile_id:
        query["tile_ids"] = tile_id
    photos = await db.demo_photos.find(query, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return photos


@router.get("/demo-photos/{photo_id}")
async def get_demo_photo(photo_id: str):
    from server import db

    photo = await db.demo_photos.find_one({"id": photo_id, "published": True}, {"_id": 0})
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    tiles = await db.tiles.find({"id": {"$in": photo.get("tile_ids", [])}, "published": True}, {"_id": 0}).to_list(50)
    photo["tiles"] = tiles
    return photo


# ---------- Demo Photos (admin) ----------
@router.get("/admin/demo-photos")
async def admin_list_demo_photos(user=Depends(get_current_user)):
    from server import db

    photos = await db.demo_photos.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return photos


@router.post("/admin/demo-photos")
async def create_demo_photo(payload: DemoPhotoCreate, user=Depends(get_current_user)):
    from server import db

    doc = payload.model_dump()
    doc["id"] = new_id()
    doc["created_at"] = now_iso()
    await db.demo_photos.insert_one(doc)
    return _strip(doc)


@router.put("/admin/demo-photos/{photo_id}")
async def update_demo_photo(photo_id: str, payload: DemoPhotoCreate, user=Depends(get_current_user)):
    from server import db

    existing = await db.demo_photos.find_one({"id": photo_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Photo not found")
    update_data = payload.model_dump()
    await db.demo_photos.update_one({"id": photo_id}, {"$set": update_data})
    return _strip(await db.demo_photos.find_one({"id": photo_id}, {"_id": 0}))


@router.delete("/admin/demo-photos/{photo_id}")
async def delete_demo_photo(photo_id: str, user=Depends(get_current_user)):
    from server import db

    result = await db.demo_photos.delete_one({"id": photo_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Photo not found")
    return {"message": "deleted"}


# ---------- Categories ----------
@router.get("/categories")
async def list_categories():
    from server import db

    cats = await db.categories.find({}, {"_id": 0}).sort("order", 1).to_list(20)
    return cats


@router.get("/categories/{slug}")
async def get_category(slug: str):
    from server import db

    cat = await db.categories.find_one({"slug": slug}, {"_id": 0})
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return cat


@router.put("/admin/categories/{slug}")
async def update_category(slug: str, payload: CategoryUpdate, user=Depends(get_current_user)):
    from server import db

    if slug not in ROOM_SLUGS:
        raise HTTPException(status_code=404, detail="Category not found")
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    await db.categories.update_one({"slug": slug}, {"$set": update_data})
    return _strip(await db.categories.find_one({"slug": slug}, {"_id": 0}))


# ---------- Site Settings ----------
@router.get("/site-settings")
async def get_site_settings():
    from server import db

    settings = await db.site_settings.find_one({"id": "main"}, {"_id": 0})
    return settings or {}


@router.put("/admin/site-settings")
async def update_site_settings(payload: SiteSettingsUpdate, user=Depends(get_current_user)):
    from server import db

    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    await db.site_settings.update_one({"id": "main"}, {"$set": update_data}, upsert=True)
    return _strip(await db.site_settings.find_one({"id": "main"}, {"_id": 0}))


# ---------- Blog ----------
@router.get("/blog")
async def list_blog(limit: int = 50):
    from server import db

    posts = await db.blog_posts.find({"published": True}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return posts


@router.get("/blog/{slug}")
async def get_blog_post(slug: str):
    from server import db

    post = await db.blog_posts.find_one({"slug": slug, "published": True}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.get("/admin/blog")
async def admin_list_blog(user=Depends(get_current_user)):
    from server import db

    posts = await db.blog_posts.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return posts


@router.post("/admin/blog")
async def create_blog_post(payload: BlogCreate, user=Depends(get_current_user)):
    from server import db

    doc = payload.model_dump()
    doc["id"] = new_id()
    doc["slug"] = slugify(payload.title)
    doc["created_at"] = now_iso()
    doc["updated_at"] = now_iso()
    await db.blog_posts.insert_one(doc)
    return _strip(doc)


@router.put("/admin/blog/{post_id}")
async def update_blog_post(post_id: str, payload: BlogUpdate, user=Depends(get_current_user)):
    from server import db

    existing = await db.blog_posts.find_one({"id": post_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Post not found")
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    if "title" in update_data:
        update_data["slug"] = slugify(update_data["title"])
    update_data["updated_at"] = now_iso()
    await db.blog_posts.update_one({"id": post_id}, {"$set": update_data})
    return _strip(await db.blog_posts.find_one({"id": post_id}, {"_id": 0}))


@router.delete("/admin/blog/{post_id}")
async def delete_blog_post(post_id: str, user=Depends(get_current_user)):
    from server import db

    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "deleted"}


# ---------- SEO ----------
@router.get("/sitemap.xml")
async def sitemap():
    from fastapi.responses import Response as FastResponse
    from server import db

    frontend_url = __import__("os").environ.get("FRONTEND_URL", "")
    urls = ["", "/gallery", "/about", "/contact", "/blog"] + [f"/tiles/{r['slug']}" for r in ROOMS]
    tiles = await db.tiles.find({"published": True}, {"_id": 0, "slug": 1}).to_list(1000)
    urls += [f"/tile/{t['slug']}" for t in tiles]
    posts = await db.blog_posts.find({"published": True}, {"_id": 0, "slug": 1}).to_list(500)
    urls += [f"/blog/{p['slug']}" for p in posts]
    xml_items = "".join(f"<url><loc>{frontend_url}{u}</loc></url>" for u in urls)
    xml = f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{xml_items}</urlset>'
    return FastResponse(content=xml, media_type="application/xml")
