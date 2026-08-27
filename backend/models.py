import uuid
import re
from datetime import datetime, timezone
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict

ROOMS = [
    {"slug": "bathroom", "name": "Bathroom"},
    {"slug": "kitchen", "name": "Kitchen"},
    {"slug": "living", "name": "Living"},
    {"slug": "bedroom", "name": "Bedroom"},
    {"slug": "outdoor", "name": "Outdoor"},
    {"slug": "wall", "name": "Wall"},
    {"slug": "floor", "name": "Floor"},
]
ROOM_SLUGS = [r["slug"] for r in ROOMS]
TILE_TYPES = ["PVT", "GVT", "Ceramic"]
CATALOGUE_CATEGORIES = ["Ceramic", "GVT", "PVT", "Gres"]


def new_id() -> str:
    return str(uuid.uuid4())


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return re.sub(r"-+", "-", text).strip("-")


class ImageAsset(BaseModel):
    id: str
    url: str
    thumb_url: str
    medium_url: str
    alt_text: Optional[str] = ""


class FeaturedTilesUpdate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    tile_ids: List[str] = []


class TileCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str
    sku: str
    type: str
    size: str
    finish: Optional[str] = ""
    rooms: List[str] = []
    description: Optional[str] = ""
    images: List[ImageAsset] = []
    featured: bool = False
    published: bool = True
    is_kajaria: bool = True


class TileUpdate(TileCreate):
    name: Optional[str] = None
    sku: Optional[str] = None
    type: Optional[str] = None
    size: Optional[str] = None


class DemoPhotoCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    image: ImageAsset
    room: str
    caption: Optional[str] = ""
    tile_ids: List[str] = []
    published: bool = True


class CategoryUpdate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    hero_image: Optional[str] = None
    description: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None


class SiteSettingsUpdate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    business_name: Optional[str] = None
    tagline: Optional[str] = None
    years_in_business: Optional[int] = None
    phone: Optional[str] = None
    whatsapp_number: Optional[str] = None
    address: Optional[str] = None
    hours: Optional[str] = None
    map_embed_url: Optional[str] = None
    showroom_photo: Optional[str] = None
    about_story: Optional[str] = None
    about_why_us: Optional[str] = None
    kajaria_dealer_badge: Optional[bool] = None
    social_links: Optional[dict] = None
    hero_images: Optional[List[str]] = None
    logo_url: Optional[str] = None
    showroom_building_photo: Optional[str] = None
    premium_collections: Optional[List[dict]] = None
    skus_stocked: Optional[int] = None
    projects_completed: Optional[int] = None
    warranty_years: Optional[int] = None


class BlogCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    title: str
    excerpt: Optional[str] = ""
    content: str
    cover_image: Optional[str] = ""
    published: bool = True
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None


class BlogUpdate(BlogCreate):
    title: Optional[str] = None
    content: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str


class CatalogueCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    title: str
    category: str
    year: Optional[int] = None
    cover_image: Optional[str] = ""
    pdf_url: Optional[str] = ""
    description: Optional[str] = ""
    page_count: Optional[int] = None
    file_size_mb: Optional[float] = None
    featured: bool = False
    published: bool = True


class CatalogueUpdate(CatalogueCreate):
    title: Optional[str] = None
    category: Optional[str] = None
