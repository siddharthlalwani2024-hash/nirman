from models import new_id, now_iso, ROOMS

IMG = {
    "b1": "photo-1661107259637-4e1c55462428",
    "b2": "photo-1643949700215-e61cdca053f7",
    "b3": "photo-1521783593447-5702b9bfd267",
    "b4": "photo-1628602813485-4e8b09442e98",
    "k1": "photo-1769079453343-17a687eb190a",
    "k2": "photo-1755624222023-621f7718950b",
    "k3": "photo-1708058459213-afee744f6f5c",
    "k4": "photo-1765556556784-7656ee0a1bd8",
    "l1": "photo-1556438758-872c68902f60",
    "l2": "photo-1708540084677-dc5838b37627",
    "l3": "photo-1684928364941-2158e071cdd6",
    "l4": "photo-1713192704825-74a0017f585d",
    "o1": "photo-1719324924230-63781a3f18b9",
    "o2": "photo-1719324923413-ba0a066465c9",
    "o3": "photo-1777370382141-287958d420dc",
    "o4": "photo-1719324923613-ff0884b031ed",
    "w1": "photo-1458682625221-3a45f8a844c7",
    "w2": "photo-1548967199-79324abbe7dc",
    "w3": "photo-1551893478-d726eaf0442c",
    "w4": "photo-1541471943749-e5976783f6c3",
    "c1": "photo-1749207325185-2d4a456273eb",
    "c2": "photo-1693854774681-e24977fc66f5",
    "c3": "photo-1693854775672-f20f46e678ef",
    "s1": "photo-1583195730792-8ffeae7d65a9",
    "s3": "photo-1656147173067-2022b4ab3cc6",
    "s4": "photo-1774971295872-cededec9320b",
    "m1": "photo-1694376329556-cf1ba3610960",
    "m2": "photo-1604939129748-480a0a7828fa",
    "m3": "photo-1584354273341-3eb96574e5be",
    "m4": "photo-1652305461546-bf0a76934433",
}


def image_asset(key: str, alt: str = "") -> dict:
    base = f"https://images.unsplash.com/{IMG[key]}"
    return {
        "id": new_id(),
        "url": f"{base}?w=1600&q=80&auto=format&fit=crop",
        "medium_url": f"{base}?w=800&q=75&auto=format&fit=crop",
        "thumb_url": f"{base}?w=400&q=70&auto=format&fit=crop",
        "alt_text": alt,
    }


TEXTURE_CYCLE = ["m1", "m2", "m3", "m4", "w1", "w2", "w3", "w4", "c1", "c2", "c3", "s3", "s4"]

TILES_SPEC = [
    ("Alpine White Marble", "NU-GVT-101", "GVT", "600x1200mm", "Glossy", ["bathroom", "wall"], True),
    ("Carrara Ash", "NU-CER-102", "Ceramic", "300x600mm", "Matte", ["bathroom", "floor"], False),
    ("Kitchen Charcoal Subway", "NU-CER-103", "Ceramic", "100x300mm", "Glossy", ["kitchen", "wall"], False),
    ("Sandstone Beige", "NU-GVT-104", "GVT", "600x600mm", "Matte", ["living", "floor"], True),
    ("Terracotta Rustic", "NU-PVT-105", "PVT", "600x600mm", "Rustic", ["outdoor", "floor"], False),
    ("Slate Grey Outdoor", "NU-GVT-106", "GVT", "600x600mm", "Anti-skid", ["outdoor", "floor"], False),
    ("Emerald Mosaic", "NU-CER-107", "Ceramic", "200x300mm", "Glossy", ["wall", "kitchen"], False),
    ("Ivory Statuario", "NU-GVT-108", "GVT", "800x1600mm", "Polished", ["living", "wall"], True),
    ("Coastal Blue", "NU-CER-109", "Ceramic", "300x450mm", "Glossy", ["bathroom"], False),
    ("Walnut Wood-look", "NU-GVT-110", "GVT", "200x1200mm", "Matte", ["living", "floor"], True),
    ("Graphite Stone", "NU-PVT-111", "PVT", "600x1200mm", "Matte", ["outdoor", "floor"], False),
    ("Rose Quartz Wall", "NU-CER-112", "Ceramic", "300x600mm", "Glossy", ["wall", "bathroom"], False),
    ("Onyx Black", "NU-GVT-113", "GVT", "600x600mm", "Polished", ["living", "floor"], True),
    ("Moroccan Pattern", "NU-CER-114", "Ceramic", "200x200mm", "Matte", ["kitchen", "wall"], False),
    ("Desert Sand", "NU-GVT-115", "GVT", "600x1200mm", "Matte", ["floor", "living"], True),
    ("Aqua Marine", "NU-CER-116", "Ceramic", "300x300mm", "Glossy", ["bathroom"], False),
    ("Industrial Cement-look", "NU-GVT-117", "GVT", "600x600mm", "Matte", ["floor", "outdoor"], False),
    ("Golden Beige Wall", "NU-CER-118", "Ceramic", "300x600mm", "Glossy", ["wall", "kitchen"], False),
]

DEMO_SPEC = [
    ("bathroom", "b1", "A calm, spa-like bathroom finished with warm marble tones."),
    ("bathroom", "b2", "Compact bathroom made spacious with light, glossy tiling."),
    ("bathroom", "b3", "Freestanding tub framed by soft stone-textured walls."),
    ("bathroom", "b4", "Charcoal accent wall paired with a bright vanity floor."),
    ("kitchen", "k1", "Warm-toned kitchen with a textured accent backsplash."),
    ("kitchen", "k2", "Green subway backsplash brings character to a minimal kitchen."),
    ("kitchen", "k3", "Sleek countertop and sink area with a matte floor finish."),
    ("kitchen", "k4", "Textured white tile grid across a full kitchen wall."),
    ("living", "l1", "Sunlit hallway floored edge-to-edge in polished stone-look tiles."),
    ("living", "l2", "Open-plan living room grounded by large-format marble-look flooring."),
    ("living", "l3", "Dining corner finished with warm, veined floor tiles."),
    ("living", "l4", "Traditional living space with classic marble flooring underfoot."),
    ("outdoor", "o1", "Garden patio finished with light, weather-resistant tiles."),
    ("outdoor", "o2", "Seating patio paved in anti-skid outdoor tiling."),
    ("outdoor", "o3", "Textured stone patio flooring built for all seasons."),
    ("outdoor", "o4", "Backyard patio with durable, slip-resistant tile paving."),
    ("wall", "k2", "Backsplash wall styled with a bold colour-blocked tile."),
    ("wall", "w1", "Scalloped pattern tiling used as a decorative feature wall."),
    ("wall", "w3", "Ornate patterned tile wall used as a striking focal point."),
    ("wall", "s4", "Colourful decorative tiles displayed as a gallery feature wall."),
    ("floor", "l1", "Large-format flooring laid across an open hallway."),
    ("floor", "m1", "Veined marble-look flooring in a bright living space."),
    ("floor", "m3", "Warm-toned stone flooring suited for high-traffic rooms."),
    ("floor", "s3", "Mixed-tone flooring paired with a matching feature wall."),
]

BLOG_SPEC = [
    (
        "5 Tile Trends for Indian Homes in 2026",
        "From large-format GVT to warm terracotta finishes, here is what homeowners are choosing this year.",
        "s1",
    ),
    (
        "GVT vs PVT vs Ceramic: Which Tile Is Right for Your Kitchen?",
        "A plain-English guide to the three tile types we stock, and where each one works best.",
        "s3",
    ),
    (
        "How to Choose Bathroom Tiles That Actually Last",
        "Slip resistance, water absorption and finish — the questions to ask before you buy.",
        "m2",
    ),
]

CATEGORY_COPY = {
    "bathroom": "Water-ready finishes with a spa-like feel — from anti-skid floors to glossy statement walls.",
    "kitchen": "Backsplashes and floors built for daily spills, grease and years of cooking.",
    "living": "Large-format looks that make every room feel bigger and calmer underfoot.",
    "bedroom": "Warm, quiet-toned wall and floor tiles that turn a bedroom into a retreat.",
    "outdoor": "Weatherproof, slip-resistant tiling for patios, balconies and courtyards.",
    "wall": "Feature walls and accent tiling that turn a plain wall into the room's focal point.",
    "floor": "Durable, easy-to-clean flooring across every finish — matte, glossy and stone-look.",
}


async def seed_content(db):
    if await db.tiles.count_documents({}) == 0:
        tiles = []
        for i, (name, sku, ttype, size, finish, rooms, featured) in enumerate(TILES_SPEC):
            img_key = TEXTURE_CYCLE[i % len(TEXTURE_CYCLE)]
            alt = f"{name} {ttype} tile, {size}, {finish.lower()} finish"
            tiles.append(
                {
                    "id": new_id(),
                    "name": name,
                    "slug": f"{name.lower().replace(' ', '-')}-{sku.lower()}",
                    "sku": sku,
                    "type": ttype,
                    "size": size,
                    "finish": finish,
                    "rooms": rooms,
                    "description": f"{name} is a {finish.lower()}-finish {ttype} tile in {size}, suited for {', '.join(rooms)} spaces.",
                    "images": [image_asset(img_key, alt), image_asset(TEXTURE_CYCLE[(i + 1) % len(TEXTURE_CYCLE)], alt)],
                    "featured": featured,
                    "published": True,
                    "is_kajaria": True,
                    "created_at": now_iso(),
                    "updated_at": now_iso(),
                }
            )
        await db.tiles.insert_many(tiles)
    else:
        tiles = await db.tiles.find({}, {"_id": 0}).to_list(1000)

    tiles_by_room = {}
    for t in tiles:
        for r in t["rooms"]:
            tiles_by_room.setdefault(r, []).append(t["id"])

    if await db.demo_photos.count_documents({}) == 0:
        photos = []
        for room, img_key, caption in DEMO_SPEC:
            linked = tiles_by_room.get(room, [])[:3]
            photos.append(
                {
                    "id": new_id(),
                    "image": image_asset(img_key, caption),
                    "room": room,
                    "caption": caption,
                    "tile_ids": linked,
                    "published": True,
                    "created_at": now_iso(),
                }
            )
        await db.demo_photos.insert_many(photos)

    if await db.categories.count_documents({}) == 0:
        cats = []
        for i, r in enumerate(ROOMS):
            img_key = ["b1", "k2", "l2", "l4", "o1", "w1", "m3"][i]
            cats.append(
                {
                    "slug": r["slug"],
                    "name": r["name"],
                    "hero_image": image_asset(img_key)["url"],
                    "description": CATEGORY_COPY[r["slug"]],
                    "meta_title": f"{r['name']} Tiles | Nirman Udyog",
                    "meta_description": CATEGORY_COPY[r["slug"]],
                    "order": i,
                }
            )
        await db.categories.insert_many(cats)

    if await db.blog_posts.count_documents({}) == 0:
        posts = []
        for title, excerpt, img_key in BLOG_SPEC:
            posts.append(
                {
                    "id": new_id(),
                    "title": title,
                    "slug": title.lower().replace(" ", "-").replace(":", "").replace("?", ""),
                    "excerpt": excerpt,
                    "content": f"{excerpt}\n\nVisit our showroom or message us on WhatsApp to see full-size samples in person.",
                    "cover_image": image_asset(img_key)["url"],
                    "published": True,
                    "created_at": now_iso(),
                    "updated_at": now_iso(),
                    "meta_title": title,
                    "meta_description": excerpt,
                }
            )
        await db.blog_posts.insert_many(posts)

    if await db.site_settings.count_documents({}) == 0:
        await db.site_settings.insert_one(
            {
                "id": "main",
                "business_name": "Nirman Udyog",
                "tagline": "Tiles that finish the room, not just cover the floor.",
                "years_in_business": 15,
                "phone": "9475833221",
                "whatsapp_number": "919475833221",
                "address": "C/O Marble House, NH 31, Kolerpar, Jhinaidanga Nilkuthi, Cooch Behar, West Bengal 736156",
                "hours": "Monday to Sunday, 9:00 AM – 8:00 PM",
                "map_embed_url": "https://maps.google.com/maps?q=Marble%20House%20NH%2031%20Kolerpar%20Jhinaidanga%20Nilkuthi%20Cooch%20Behar%20West%20Bengal%20736156&t=&z=15&ie=UTF8&iwloc=&output=embed",
                "showroom_photo": image_asset("s1")["url"],
                "hero_images": [image_asset("b1")["url"], image_asset("k1")["url"], image_asset("l2")["url"]],
                "about_story": "Nirman Udyog has been supplying tiles to homeowners and contractors across Cooch Behar for over a decade, built on one idea: let the customer see the finished room, not just a sample chip.",
                "about_why_us": "Every tile in our showroom is chosen for how it looks installed, not just how it looks on a shelf. We are an authorized Kajaria dealer, and our team helps you match the right tile to the right room — bathroom, kitchen, living, outdoor, wall or floor.",
                "kajaria_dealer_badge": True,
                "social_links": {"facebook": "", "instagram": ""},
                "logo_url": "",
                "showroom_building_photo": "",
                "premium_collections": [
                    {"name": "Eternity", "tagline": "Marble-look GVT for statement floors"},
                    {"name": "Artstruct", "tagline": "Textured surfaces with architectural depth"},
                    {"name": "Grescolour", "tagline": "Bold solid-tone GVT for modern spaces"},
                ],
                "skus_stocked": 300,
                "projects_completed": 1200,
                "warranty_years": 10,
            }
        )
