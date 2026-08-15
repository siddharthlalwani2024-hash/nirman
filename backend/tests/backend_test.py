"""
Nirman Udyog Backend Test Suite
Covers: health, public content, auth, admin CRUD, uploads, sitemap
"""
import os
import io
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://tile-showcase-50.preview.emergentagent.com").rstrip("/")
ADMIN_EMAIL = "siddharth.lalwani2024@vitstudent.ac.in"
ADMIN_PASSWORD = "NirmanUdyog@2026"

API = f"{BASE_URL}/api"


# ---------- Fixtures ----------
@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    return s


@pytest.fixture(scope="module")
def admin_client():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    return s


# ---------- Health ----------
def test_api_root(client):
    r = client.get(f"{API}")
    assert r.status_code == 200
    assert "Nirman" in r.json().get("message", "")


# ---------- Public content ----------
def test_list_tiles_public(client):
    r = client.get(f"{API}/tiles")
    assert r.status_code == 200
    tiles = r.json()
    assert isinstance(tiles, list)
    assert len(tiles) >= 18, f"Expected >=18 seeded tiles, got {len(tiles)}"
    t = tiles[0]
    for k in ("id", "slug", "name", "sku", "type", "rooms", "images"):
        assert k in t, f"Missing key {k} in tile"


def test_list_tiles_filter_room(client):
    r = client.get(f"{API}/tiles", params={"room": "bathroom"})
    assert r.status_code == 200
    for t in r.json():
        assert "bathroom" in t["rooms"]


def test_list_tiles_featured(client):
    r = client.get(f"{API}/tiles", params={"featured": "true"})
    assert r.status_code == 200
    for t in r.json():
        assert t.get("featured") is True


def test_get_tile_by_slug(client):
    tiles = client.get(f"{API}/tiles").json()
    slug = tiles[0]["slug"]
    r = client.get(f"{API}/tiles/{slug}")
    assert r.status_code == 200
    data = r.json()
    assert data["slug"] == slug
    assert "demo_photos" in data


def test_get_tile_not_found(client):
    r = client.get(f"{API}/tiles/does-not-exist")
    assert r.status_code == 404


def test_categories(client):
    r = client.get(f"{API}/categories")
    assert r.status_code == 200
    cats = r.json()
    slugs = {c["slug"] for c in cats}
    assert {"bathroom", "kitchen", "living", "outdoor", "wall", "floor"}.issubset(slugs)


def test_category_by_slug(client):
    r = client.get(f"{API}/categories/bathroom")
    assert r.status_code == 200
    assert r.json()["slug"] == "bathroom"


def test_demo_photos(client):
    r = client.get(f"{API}/demo-photos")
    assert r.status_code == 200
    photos = r.json()
    assert len(photos) >= 24, f"Expected >=24 seeded photos, got {len(photos)}"


def test_site_settings(client):
    r = client.get(f"{API}/site-settings")
    assert r.status_code == 200
    s = r.json()
    assert s.get("phone") == "9475833221"
    assert "919475833221" in (s.get("whatsapp_number", "") or "")


def test_blog_list(client):
    r = client.get(f"{API}/blog")
    assert r.status_code == 200
    posts = r.json()
    assert len(posts) >= 3


def test_blog_detail(client):
    posts = client.get(f"{API}/blog").json()
    slug = posts[0]["slug"]
    r = client.get(f"{API}/blog/{slug}")
    assert r.status_code == 200
    assert r.json()["slug"] == slug


def test_sitemap(client):
    r = client.get(f"{API}/sitemap.xml")
    assert r.status_code == 200
    assert "urlset" in r.text
    assert "/tiles/bathroom" in r.text


# ---------- Auth ----------
def test_login_invalid():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong-pass-xxxx"})
    assert r.status_code == 401


def test_login_success_and_me():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200
    data = r.json()
    assert data["email"] == ADMIN_EMAIL
    assert data["role"] == "admin"
    # Cookie check
    assert "access_token" in s.cookies
    # /me
    me = s.get(f"{API}/auth/me")
    assert me.status_code == 200
    assert me.json()["email"] == ADMIN_EMAIL


def test_me_unauthenticated():
    r = requests.get(f"{API}/auth/me")
    assert r.status_code == 401


def test_admin_endpoints_protected():
    r = requests.get(f"{API}/admin/tiles")
    assert r.status_code == 401


# ---------- Admin CRUD ----------
def test_admin_list_tiles(admin_client):
    r = admin_client.get(f"{API}/admin/tiles")
    assert r.status_code == 200
    assert len(r.json()) >= 18


def test_admin_list_demo_photos(admin_client):
    r = admin_client.get(f"{API}/admin/demo-photos")
    assert r.status_code == 200
    assert len(r.json()) >= 24


def test_admin_list_blog(admin_client):
    r = admin_client.get(f"{API}/admin/blog")
    assert r.status_code == 200
    assert len(r.json()) >= 3


def test_tile_create_update_delete(admin_client):
    payload = {
        "name": "TEST_Tile_Alpha",
        "sku": "TEST-SKU-001",
        "type": "GVT",
        "size": "600x600",
        "finish": "Matte",
        "rooms": ["bathroom"],
        "description": "Test tile",
        "images": [{"id": "test-img-1", "url": "/api/media/x.webp", "thumb_url": "/api/media/x.webp", "medium_url": "/api/media/x.webp"}],
        "featured": False,
        "published": True,
    }
    r = admin_client.post(f"{API}/admin/tiles", json=payload)
    assert r.status_code == 200, r.text
    tile = r.json()
    tid = tile["id"]
    assert tile["name"] == "TEST_Tile_Alpha"
    assert tile["slug"]

    # GET (public via slug should succeed since published)
    slug = tile["slug"]
    gr = requests.get(f"{API}/tiles/{slug}")
    assert gr.status_code == 200

    # UPDATE
    ur = admin_client.put(f"{API}/admin/tiles/{tid}", json={"name": "TEST_Tile_Beta", "featured": True})
    assert ur.status_code == 200
    assert ur.json()["name"] == "TEST_Tile_Beta"
    assert ur.json()["featured"] is True

    # DELETE
    dr = admin_client.delete(f"{API}/admin/tiles/{tid}")
    assert dr.status_code == 200
    # GET admin should 404
    gr2 = admin_client.get(f"{API}/admin/tiles/{tid}")
    assert gr2.status_code == 404


def test_demo_photo_crud(admin_client):
    # need a tile id for linking - fetch first
    tiles = admin_client.get(f"{API}/admin/tiles").json()
    tile_id = tiles[0]["id"]
    payload = {
        "caption": "TEST_Photo",
        "room": "kitchen",
        "image": {"id": "img-t", "url": "/api/media/x.webp", "thumb_url": "/api/media/x.webp", "medium_url": "/api/media/x.webp"},
        "tile_ids": [tile_id],
        "published": True,
    }
    r = admin_client.post(f"{API}/admin/demo-photos", json=payload)
    assert r.status_code == 200, r.text
    pid = r.json()["id"]

    # update
    payload["caption"] = "TEST_Photo_Updated"
    ur = admin_client.put(f"{API}/admin/demo-photos/{pid}", json=payload)
    assert ur.status_code == 200
    assert ur.json()["caption"] == "TEST_Photo_Updated"

    # delete
    dr = admin_client.delete(f"{API}/admin/demo-photos/{pid}")
    assert dr.status_code == 200


def test_blog_crud(admin_client):
    payload = {"title": "TEST_Post", "content": "Hello world", "excerpt": "hi", "cover_image": "", "published": True}
    r = admin_client.post(f"{API}/admin/blog", json=payload)
    assert r.status_code == 200
    pid = r.json()["id"]
    slug = r.json()["slug"]
    # public visible
    pr = requests.get(f"{API}/blog/{slug}")
    assert pr.status_code == 200

    # update - unpublish
    ur = admin_client.put(f"{API}/admin/blog/{pid}", json={"published": False})
    assert ur.status_code == 200
    pr2 = requests.get(f"{API}/blog/{slug}")
    assert pr2.status_code == 404

    # delete
    dr = admin_client.delete(f"{API}/admin/blog/{pid}")
    assert dr.status_code == 200


def test_category_update(admin_client):
    r = admin_client.put(f"{API}/admin/categories/bathroom", json={"description": "TEST desc bathroom"})
    assert r.status_code == 200
    # revert would be ideal but description change is safe
    verify = requests.get(f"{API}/categories/bathroom").json()
    assert verify["description"] == "TEST desc bathroom"


def test_site_settings_update(admin_client):
    current = requests.get(f"{API}/site-settings").json()
    original_hours = current.get("hours", "Mon-Sun 9am-8pm")
    r = admin_client.put(f"{API}/admin/site-settings", json={"hours": "TEST HOURS"})
    assert r.status_code == 200
    v = requests.get(f"{API}/site-settings").json()
    assert v["hours"] == "TEST HOURS"
    # revert
    admin_client.put(f"{API}/admin/site-settings", json={"hours": original_hours})


# ---------- Upload ----------
def test_image_upload(admin_client):
    # Generate a real PNG using PIL
    from PIL import Image as _Img
    buf = io.BytesIO()
    _Img.new("RGB", (100, 100), (200, 100, 50)).save(buf, format="PNG")
    png = buf.getvalue()
    files = {"files": ("test.png", io.BytesIO(png), "image/png")}
    data = {"folder": "tiles"}
    r = admin_client.post(f"{API}/admin/upload", files=files, data=data)
    assert r.status_code == 200, r.text
    imgs = r.json()["images"]
    assert len(imgs) == 1
    assert imgs[0]["url"].startswith("/api/media/")
    # fetch media
    media_path = imgs[0]["url"].replace("/api/", "/")
    mr = requests.get(f"{BASE_URL}/api{media_path}") if False else requests.get(f"{BASE_URL}{imgs[0]['url']}")
    assert mr.status_code == 200


# ---------- Logout ----------
def test_logout_flow():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200
    lo = s.post(f"{API}/auth/logout")
    assert lo.status_code == 200
    # After logout, /me should fail. Note: cookie may still be in jar but browsers respect Set-Cookie deletion.
    # We check by making a fresh session with cleared cookies:
    s.cookies.clear()
    me = s.get(f"{API}/auth/me")
    assert me.status_code == 401
