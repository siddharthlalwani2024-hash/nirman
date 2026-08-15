import uuid
import re
from datetime import datetime, timezone
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict

ROOMS = [
    {"slug": "bathroom", "name": "Bathroom"},
    {"slug": "kitchen", "name": "Kitchen"},
    {"slug": "living", "name": "Living"},
    {"slug": "outdoor", "name": "Outdoor"},
    {"slug": "wall", "name": "Wall"},
    {"slug": "floor", "name": "Floor"},
]
ROOM_SLUGS = [r["slug"] for r in ROOMS]
TILE_TYPES = ["PVT", "GVT", "Ceramic"]


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
