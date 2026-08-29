import asyncio, os, json, re
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent / ".env")
client = AsyncIOMotorClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]

PATH_RE = re.compile(r"nirman_udyog/[A-Za-z0-9_\-/\.]+")


def extract_paths(obj, acc):
    if isinstance(obj, str):
        for m in PATH_RE.findall(obj):
            acc.add(m)
    elif isinstance(obj, dict):
        for v in obj.values():
            extract_paths(v, acc)
    elif isinstance(obj, list):
        for v in obj:
            extract_paths(v, acc)


async def main():
    acc = set()
    counts = {}
    for coll in ["tiles", "demo_photos", "categories", "catalogues", "site_settings", "settings", "blog_posts"]:
        docs = await db[coll].find({}, {"_id": 0}).to_list(1000)
        counts[coll] = len(docs)
        for d in docs:
            extract_paths(d, acc)
    print("COLLECTION COUNTS:", json.dumps(counts))
    print("TOTAL UNIQUE MEDIA PATHS:", len(acc))
    for p in sorted(acc)[:20]:
        print("  ", p)


asyncio.run(main())
