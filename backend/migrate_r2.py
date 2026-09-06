"""One-time migration of existing demo images to Cloudflare R2."""

import os
import hashlib
from urllib.parse import urlparse
from urllib.request import Request, urlopen

import boto3
from pymongo import MongoClient


STATIC_URLS = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1568051243851-f9b136146e97?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&h=400&fit=crop",
]


def object_key(source_url: str) -> str:
    if not source_url.startswith("https://images.unsplash.com/"):
        extension = os.path.splitext(urlparse(source_url).path)[1].lower()
        if not extension or len(extension) > 8:
            extension = ".bin"
        digest = hashlib.sha256(source_url.encode()).hexdigest()[:24]
        return f"migrated/{digest}{extension}"
    filename = os.path.basename(urlparse(source_url).path)
    return f"site/{filename}.jpg"


def upload_url(s3, source_url: str, key: str) -> None:
    request = Request(source_url, headers={"User-Agent": "Mistechko-R2-Migration/1.0"})
    with urlopen(request, timeout=45) as response:
        content = response.read()
        content_type = response.headers.get_content_type() or "image/jpeg"
    s3.put_object(
        Bucket=os.environ["R2_BUCKET_NAME"],
        Key=key,
        Body=content,
        ContentType=content_type,
        CacheControl="public, max-age=31536000, immutable",
    )


def main():
    s3 = boto3.client(
        "s3",
        endpoint_url=os.environ["R2_ENDPOINT_URL"],
        aws_access_key_id=os.environ["R2_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["R2_SECRET_ACCESS_KEY"],
        region_name=os.environ.get("R2_REGION", "auto"),
    )
    bucket = os.environ["R2_BUCKET_NAME"]
    source_to_key = {}

    for source_url in STATIC_URLS:
        key = object_key(source_url)
        source_to_key[source_url] = key
        try:
            s3.head_object(Bucket=bucket, Key=key)
        except Exception:
            print(f"Uploading {key}")
            upload_url(s3, source_url, key)

    mongo = MongoClient(os.environ["MONGO_URL"])
    database = mongo[os.environ["DB_NAME"]]
    fields = ("image", "photo", "head_photo", "hero_image", "file_url")
    for collection_name in ("news", "announcements", "products", "deputies", "radas", "documents"):
        collection = database[collection_name]
        for document in collection.find({}):
            updates = {}
            for field in fields:
                value = document.get(field)
                if not isinstance(value, str) or not value.startswith(("http://", "https://")):
                    continue
                key = source_to_key.get(value)
                if not key:
                    key = object_key(value)
                    source_to_key[value] = key
                    try:
                        s3.head_object(Bucket=bucket, Key=key)
                    except Exception:
                        print(f"Uploading {key}")
                        upload_url(s3, value, key)
                updates[field] = f"/api/storage/{key}"
            if updates:
                collection.update_one({"_id": document["_id"]}, {"$set": updates})

    for source_url, key in sorted(source_to_key.items()):
        print(f"{source_url} -> /api/storage/{key}")


if __name__ == "__main__":
    main()
