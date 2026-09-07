from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response, Query, File, UploadFile
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import boto3
import mimetypes
import os
import logging
import hashlib
import aiohttp
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
import re
from datetime import datetime, timezone, timedelta
from urllib.parse import quote
import jwt
from passlib.hash import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Secret
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-super-secret-jwt-key-change-in-production')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_DAYS = 7

# Cloudflare R2 (S3-compatible object storage)
R2_ENDPOINT_URL = os.environ.get('R2_ENDPOINT_URL', '').rstrip('/')
R2_BUCKET_NAME = os.environ.get('R2_BUCKET_NAME', 'mistechko')
R2_ACCESS_KEY_ID = os.environ.get('R2_ACCESS_KEY_ID')
R2_SECRET_ACCESS_KEY = os.environ.get('R2_SECRET_ACCESS_KEY')
R2_REGION = os.environ.get('R2_REGION', 'auto')
MAX_UPLOAD_SIZE = 25 * 1024 * 1024

# Facebook Page news import (optional; disabled until both values are configured).
FACEBOOK_PAGE_ID = os.environ.get('FACEBOOK_PAGE_ID', '').strip()
FACEBOOK_PAGE_ACCESS_TOKEN = os.environ.get('FACEBOOK_PAGE_ACCESS_TOKEN', '').strip()
FACEBOOK_GRAPH_API_VERSION = os.environ.get('FACEBOOK_GRAPH_API_VERSION', 'v25.0').strip()
FACEBOOK_SYNC_INTERVAL_SECONDS = int(os.environ.get('FACEBOOK_SYNC_INTERVAL_SECONDS', '900'))
facebook_sync_task = None

if all([R2_ENDPOINT_URL, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY]):
    r2_client = boto3.client(
        's3',
        endpoint_url=R2_ENDPOINT_URL,
        aws_access_key_id=R2_ACCESS_KEY_ID,
        aws_secret_access_key=R2_SECRET_ACCESS_KEY,
        region_name=R2_REGION,
    )
else:
    r2_client = None
    logger = logging.getLogger(__name__)
    logger.warning('Cloudflare R2 is not configured; file uploads are disabled.')

# Create the main app
app = FastAPI(title="Моє Містечко API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def require_r2():
    if r2_client is None:
        raise HTTPException(status_code=503, detail='Сховище файлів не налаштоване.')

def storage_url(object_key: str) -> str:
    return f'/api/storage/{quote(object_key, safe="/")}'

def validate_storage_reference(value: Optional[str]) -> Optional[str]:
    if value and (value.startswith('http://') or value.startswith('https://')):
        raise HTTPException(status_code=400, detail='Завантажте файл через форму, а не вставляйте зовнішнє посилання.')
    return value

# ==================== Models ====================

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    role: str = "user"  # superadmin, admin, moderator, user
    rada: Optional[str] = None  # rada1, rada2
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: str
    password: str
    name: str
    rada: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class NewsItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    excerpt: str
    image: Optional[str] = None
    category: str
    rada: str = "all"  # all, rada1, rada2
    author: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    views: int = 0
    source: Optional[str] = None
    source_url: Optional[str] = None
    facebook_id: Optional[str] = None

class NewsCreate(BaseModel):
    title: str
    content: str
    excerpt: str
    image: Optional[str] = None
    category: str
    rada: str = "all"

ANNOUNCEMENT_CATEGORIES = {
    "community",
    "events",
    "work",
    "help",
    "lostfound",
    "other",
}


def normalize_ukrainian_phone(value: str) -> str:
    digits = re.sub(r"\D", "", value or "")
    if digits.startswith("38"):
        digits = digits[2:]
    if not re.fullmatch(r"0\d{9}", digits):
        raise HTTPException(
            status_code=400,
            detail="Введіть український номер у форматі +38 0XX XXX XX XX",
        )
    return f"+38{digits}"


class Announcement(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: str  # community, events, work, help, lostfound, other
    rada: str
    is_urgent: bool = False
    contact_info: str
    image: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    expires_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc) + timedelta(days=30))
    user_id: str

class AnnouncementCreate(BaseModel):
    title: str
    description: str
    category: str
    rada: str
    is_urgent: bool = False
    contact_info: str
    image: Optional[str] = None
    expires_days: int = Field(30, ge=1, le=365)


class AnnouncementUpdate(BaseModel):
    title: str
    description: str
    category: str
    rada: str
    is_urgent: bool = False
    contact_info: str
    image: Optional[str] = None
    expires_days: int = Field(30, ge=1, le=365)

class Deputy(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    position: str
    photo: Optional[str] = None
    phone: str
    email: str
    biography: str
    rada: str

class RadaInfo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    short_name: str
    description: str
    address: str
    phone: str
    email: str
    working_hours: str
    reception_hours: str
    head_name: str
    head_position: str
    head_photo: Optional[str] = None
    hero_image: Optional[str] = None
    population: int
    area: str
    founded_year: int

class Document(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    type: str  # decision, protocol, order
    rada: str
    file_url: str
    date: datetime
    description: str
    number: str

class MapObject(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str
    community: str
    latitude: float
    longitude: float
    address: str = ""
    phone: Optional[str] = None
    description: str = ""
    author: str
    user_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MapObjectCreate(BaseModel):
    name: str
    type: str
    community: str
    latitude: float
    longitude: float
    address: str = ""
    phone: Optional[str] = None
    description: str = ""

class ForumTopic(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    category: str
    author: str
    user_id: str
    content: str
    replies: int = 0
    views: int = 0
    last_reply: Optional[datetime] = None
    is_pinned: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ForumTopicCreate(BaseModel):
    title: str
    category: str
    content: str

class ForumReply(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    topic_id: str
    content: str
    author: str
    user_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ForumReplyCreate(BaseModel):
    content: str

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: float
    image: Optional[str] = None
    seller: str
    rating: float = 0.0
    reviews: int = 0
    category: str
    rada: str
    location: str = "Громада"
    condition: str = "Вживане"
    status: str = "active"
    contact_phone: Optional[str] = None
    user_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    image: Optional[str] = None
    category: str
    rada: str
    location: str = "Громада"
    condition: str = "Вживане"
    contact_phone: str

class ProductMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: str
    sender_id: str
    sender_name: str
    receiver_id: str
    content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductMessageCreate(BaseModel):
    content: str
    receiver_id: Optional[str] = None

# ==================== Auth Helpers ====================

def create_jwt_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(days=JWT_EXPIRATION_DAYS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_jwt_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(request: Request) -> User:
    # Check cookie first
    session_token = request.cookies.get("session_token")
    if session_token:
        session = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
        if session:
            expires_at = session.get("expires_at")
            if isinstance(expires_at, str):
                expires_at = datetime.fromisoformat(expires_at)
            if expires_at.tzinfo is None:
                expires_at = expires_at.replace(tzinfo=timezone.utc)
            if expires_at > datetime.now(timezone.utc):
                user = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
                if user:
                    return User(**user)
    
    # Check Authorization header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        try:
            payload = verify_jwt_token(token)
            user = await db.users.find_one({"user_id": payload["user_id"]}, {"_id": 0})
            if user:
                return User(**user)
        except HTTPException:
            pass
    
    raise HTTPException(status_code=401, detail="Not authenticated")

async def get_optional_user(request: Request) -> Optional[User]:
    try:
        return await get_current_user(request)
    except HTTPException:
        return None

# ==================== Auth Endpoints ====================

@api_router.post("/auth/register")
async def register(data: UserCreate):
    existing = await db.users.find_one({"email": data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    hashed_password = bcrypt.hash(data.password)
    
    user_doc = {
        "user_id": user_id,
        "email": data.email,
        "name": data.name,
        "password": hashed_password,
        "role": "user",
        "rada": data.rada,
        "picture": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    
    token = create_jwt_token(user_id, data.email, "user")
    return {"token": token, "user": {"user_id": user_id, "email": data.email, "name": data.name, "role": "user"}}

@api_router.post("/auth/login")
async def login(data: UserLogin, response: Response):
    user = await db.users.find_one({"email": data.email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not bcrypt.verify(data.password, user.get("password", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_jwt_token(user["user_id"], user["email"], user["role"])
    
    # Set session cookie
    session_token = f"session_{uuid.uuid4().hex}"
    expires_at = datetime.now(timezone.utc) + timedelta(days=JWT_EXPIRATION_DAYS)
    await db.user_sessions.insert_one({
        "user_id": user["user_id"],
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=JWT_EXPIRATION_DAYS * 24 * 60 * 60
    )
    
    return {
        "token": token,
        "user": {
            "user_id": user["user_id"],
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
            "rada": user.get("rada"),
            "picture": user.get("picture")
        }
    }

@api_router.get("/auth/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "user_id": current_user.user_id,
        "email": current_user.email,
        "name": current_user.name,
        "picture": current_user.picture,
        "role": current_user.role,
        "rada": current_user.rada
    }

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    response.delete_cookie(key="session_token", path="/")
    return {"message": "Logged out successfully"}

# ==================== File Storage Endpoints ====================

@api_router.post("/uploads")
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    require_r2()
    if not file.filename:
        raise HTTPException(status_code=400, detail="Оберіть файл для завантаження")

    content_type = file.content_type or mimetypes.guess_type(file.filename)[0] or "application/octet-stream"
    blocked_types = {"application/x-msdownload", "application/x-sh", "text/x-shellscript"}
    if content_type in blocked_types:
        raise HTTPException(status_code=400, detail="Цей тип файлу не підтримується")

    content = await file.read(MAX_UPLOAD_SIZE + 1)
    if len(content) > MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=413, detail="Файл не може бути більшим за 25 МБ")

    suffix = Path(file.filename).suffix.lower()
    if not re.fullmatch(r"\.[a-z0-9]{1,8}", suffix):
        suffix = mimetypes.guess_extension(content_type) or ""
    object_key = f"uploads/{current_user.user_id}/{uuid.uuid4().hex}{suffix}"

    await asyncio.to_thread(
        r2_client.put_object,
        Bucket=R2_BUCKET_NAME,
        Key=object_key,
        Body=content,
        ContentType=content_type,
        CacheControl="public, max-age=31536000, immutable",
    )
    return {
        "key": object_key,
        "url": storage_url(object_key),
        "filename": file.filename,
        "content_type": content_type,
        "size": len(content),
    }

@api_router.get("/storage/{object_key:path}")
async def download_file(object_key: str):
    require_r2()
    if not object_key or ".." in object_key or object_key.startswith("/"):
        raise HTTPException(status_code=400, detail="Некоректний шлях до файлу")
    try:
        stored = await asyncio.to_thread(
            r2_client.get_object,
            Bucket=R2_BUCKET_NAME,
            Key=object_key,
        )
        content = await asyncio.to_thread(stored["Body"].read)
        stored["Body"].close()
    except Exception as error:
        logger.warning("Storage object is unavailable: %s", error)
        raise HTTPException(status_code=404, detail="Файл не знайдено")

    headers = {"Cache-Control": "public, max-age=31536000, immutable"}
    if stored.get("ETag"):
        headers["ETag"] = stored["ETag"]
    return Response(
        content=content,
        media_type=stored.get("ContentType", "application/octet-stream"),
        headers=headers,
    )

# ==================== News Endpoints ====================

def facebook_import_enabled():
    return bool(FACEBOOK_PAGE_ID and FACEBOOK_PAGE_ACCESS_TOKEN)


def facebook_post_image_url(post):
    full_picture = post.get("full_picture")
    if full_picture:
        return full_picture

    attachments = post.get("attachments", {}).get("data", [])
    if attachments:
        media = attachments[0].get("media", {})
        image = media.get("image", {})
        return image.get("src")
    return None


async def store_facebook_image(session, image_url, facebook_id):
    if not image_url or r2_client is None:
        return None

    try:
        async with session.get(image_url, allow_redirects=True) as response:
            if response.status != 200:
                return None
            content_type = response.headers.get("Content-Type", "image/jpeg").split(";")[0]
            if not content_type.startswith("image/"):
                return None
            content = await response.read()

        suffix = mimetypes.guess_extension(content_type) or ".jpg"
        object_key = f"news/facebook/{hashlib.sha256(facebook_id.encode()).hexdigest()}{suffix}"
        await asyncio.to_thread(
            r2_client.put_object,
            Bucket=R2_BUCKET_NAME,
            Key=object_key,
            Body=content,
            ContentType=content_type,
            CacheControl="public, max-age=31536000, immutable",
        )
        return storage_url(object_key)
    except Exception as error:
        logger.warning("Could not save Facebook image to R2: %s", error)
        return None


async def sync_facebook_news_from_page():
    if not facebook_import_enabled():
        return {
            "enabled": False,
            "imported": 0,
            "message": "Facebook sync is not configured.",
        }

    endpoint = f"https://graph.facebook.com/{FACEBOOK_GRAPH_API_VERSION}/{FACEBOOK_PAGE_ID}/posts"
    params = {
        "access_token": FACEBOOK_PAGE_ACCESS_TOKEN,
        "fields": "id,message,story,created_time,permalink_url,full_picture,attachments{media{image{src}}}",
        "limit": "25",
    }

    try:
        timeout = aiohttp.ClientTimeout(total=30)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(endpoint, params=params) as response:
                payload = await response.json(content_type=None)
                if response.status >= 400:
                    error = payload.get("error", {}) if isinstance(payload, dict) else {}
                    message = error.get("message", "Facebook API request failed")
                    logger.error("Facebook news sync failed: %s", message)
                    return {"enabled": True, "imported": 0, "error": message}

            imported = 0
            for post in payload.get("data", []):
                facebook_id = post.get("id")
                message = (post.get("message") or post.get("story") or "").strip()
                if not facebook_id or not message:
                    continue

                created_at_value = post.get("created_time")
                try:
                    created_at = datetime.fromisoformat(created_at_value.replace("Z", "+00:00"))
                except (AttributeError, ValueError):
                    created_at = datetime.now(timezone.utc)

                first_line = next((line.strip() for line in message.splitlines() if line.strip()), message)
                title = first_line[:120].strip()
                excerpt = " ".join(message.split())[:240].strip()
                image = await store_facebook_image(session, facebook_post_image_url(post), facebook_id)
                existing = await db.news.find_one({"facebook_id": facebook_id}, {"id": 1})
                news_id = existing.get("id") if existing else str(uuid.uuid4())

                update = {
                    "title": title,
                    "content": message,
                    "excerpt": excerpt,
                    "category": "Офіційно",
                    "rada": "all",
                    "author": "Томаківська громада",
                    "created_at": created_at,
                    "source": "facebook",
                    "source_url": post.get("permalink_url") or f"https://www.facebook.com/{facebook_id}",
                    "facebook_id": facebook_id,
                }
                if image:
                    update["image"] = image

                await db.news.update_one(
                    {"facebook_id": facebook_id},
                    {
                        "$set": update,
                        "$setOnInsert": {"id": news_id, "views": 0},
                    },
                    upsert=True,
                )
                imported += 1

        logger.info("Facebook news sync completed: %s posts imported", imported)
        return {"enabled": True, "imported": imported}
    except Exception as error:
        logger.error("Facebook news sync request failed: %s", error)
        return {"enabled": True, "imported": 0, "error": "Не вдалося отримати новини з Facebook"}

@api_router.get("/news", response_model=List[NewsItem])
async def get_news(
    rada: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    limit: int = Query(20, le=100),
    skip: int = Query(0)
):
    query = {}
    if rada and rada != "all":
        query["$or"] = [{"rada": rada}, {"rada": "all"}]
    if category:
        query["category"] = category
    
    news = await db.news.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    
    for item in news:
        if isinstance(item.get("created_at"), str):
            item["created_at"] = datetime.fromisoformat(item["created_at"])
    
    return news


@api_router.post("/news/sync-facebook")
async def sync_facebook_news(current_user: User = Depends(get_current_user)):
    if current_user.role not in ["superadmin", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    return await sync_facebook_news_from_page()

@api_router.get("/news/{news_id}")
async def get_news_item(news_id: str):
    news = await db.news.find_one({"id": news_id}, {"_id": 0})
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    
    # Increment views
    await db.news.update_one({"id": news_id}, {"$inc": {"views": 1}})
    
    if isinstance(news.get("created_at"), str):
        news["created_at"] = datetime.fromisoformat(news["created_at"])
    
    return news

@api_router.post("/news", response_model=NewsItem)
async def create_news(data: NewsCreate, current_user: User = Depends(get_current_user)):
    if current_user.role not in ["superadmin", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if current_user.role == "admin" and current_user.rada and data.rada != current_user.rada and data.rada != "all":
        raise HTTPException(status_code=403, detail="Cannot create news for other rada")
    
    news = NewsItem(
        title=data.title,
        content=data.content,
        excerpt=data.excerpt,
        image=validate_storage_reference(data.image),
        category=data.category,
        rada=data.rada,
        author=current_user.name
    )
    
    doc = news.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.news.insert_one(doc)
    
    return news

# ==================== Announcements Endpoints ====================

@api_router.get("/announcements", response_model=List[Announcement])
async def get_announcements(
    rada: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    limit: int = Query(20, le=100),
    skip: int = Query(0)
):
    query = {
        "expires_at": {"$gte": datetime.now(timezone.utc).isoformat()},
        "category": {"$in": list(ANNOUNCEMENT_CATEGORIES)},
    }
    if rada:
        query["rada"] = rada
    if category:
        if category not in ANNOUNCEMENT_CATEGORIES:
            return []
        query["category"] = category
    
    announcements = await db.announcements.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    
    for item in announcements:
        for field in ["created_at", "expires_at"]:
            if isinstance(item.get(field), str):
                item[field] = datetime.fromisoformat(item[field])
    
    return announcements

@api_router.post("/announcements", response_model=Announcement)
async def create_announcement(data: AnnouncementCreate, current_user: User = Depends(get_current_user)):
    if data.category not in ANNOUNCEMENT_CATEGORIES:
        raise HTTPException(status_code=400, detail="Оберіть категорію інформаційного оголошення")

    announcement = Announcement(
        title=data.title,
        description=data.description,
        category=data.category,
        rada=data.rada,
        is_urgent=data.is_urgent,
        contact_info=normalize_ukrainian_phone(data.contact_info),
        image=validate_storage_reference(data.image),
        expires_at=datetime.now(timezone.utc) + timedelta(days=data.expires_days),
        user_id=current_user.user_id
    )
    
    doc = announcement.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    doc["expires_at"] = doc["expires_at"].isoformat()
    await db.announcements.insert_one(doc)
    
    return announcement


@api_router.get("/announcements/{announcement_id}", response_model=Announcement)
async def get_announcement(announcement_id: str):
    announcement = await db.announcements.find_one({"id": announcement_id}, {"_id": 0})
    if not announcement:
        raise HTTPException(status_code=404, detail="Оголошення не знайдено")
    return announcement


@api_router.put("/announcements/{announcement_id}", response_model=Announcement)
async def update_announcement(
    announcement_id: str,
    data: AnnouncementUpdate,
    current_user: User = Depends(get_current_user),
):
    announcement = await db.announcements.find_one({"id": announcement_id}, {"_id": 0})
    if not announcement:
        raise HTTPException(status_code=404, detail="Оголошення не знайдено")

    can_edit = announcement.get("user_id") == current_user.user_id or current_user.role in ["superadmin", "admin", "moderator"]
    if not can_edit:
        raise HTTPException(status_code=403, detail="Ви можете редагувати лише власні оголошення")
    if data.category not in ANNOUNCEMENT_CATEGORIES:
        raise HTTPException(status_code=400, detail="Оберіть категорію інформаційного оголошення")

    updates = {
        "title": data.title.strip(),
        "description": data.description.strip(),
        "category": data.category,
        "rada": data.rada,
        "is_urgent": data.is_urgent,
        "contact_info": normalize_ukrainian_phone(data.contact_info),
        "image": validate_storage_reference(data.image),
        "expires_at": datetime.now(timezone.utc) + timedelta(days=data.expires_days),
    }
    await db.announcements.update_one({"id": announcement_id}, {"$set": updates})
    updated = await db.announcements.find_one({"id": announcement_id}, {"_id": 0})
    return updated

@api_router.delete("/announcements/{announcement_id}")
async def delete_announcement(announcement_id: str, current_user: User = Depends(get_current_user)):
    announcement = await db.announcements.find_one({"id": announcement_id}, {"_id": 0})
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    
    if announcement["user_id"] != current_user.user_id and current_user.role not in ["superadmin", "admin", "moderator"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.announcements.delete_one({"id": announcement_id})
    return {"message": "Deleted successfully"}

# ==================== Map Object Endpoints ====================

@api_router.get("/map/objects")
async def get_map_objects(community: Optional[str] = Query(None), object_type: Optional[str] = Query(None)):
    query = {}
    if community and community != "all":
        query["community"] = community
    if object_type and object_type != "all":
        query["type"] = object_type
    objects = await db.map_objects.find(query, {"_id": 0}).sort("created_at", -1).to_list(500)
    for item in objects:
        if isinstance(item.get("created_at"), str):
            item["created_at"] = datetime.fromisoformat(item["created_at"])
    return objects

@api_router.post("/map/objects", response_model=MapObject)
async def create_map_object(data: MapObjectCreate, current_user: User = Depends(get_current_user)):
    allowed_communities = {"tomakivska", "myrivska"}
    allowed_types = {"shop", "organization", "medicine", "education", "trade", "transport", "admin", "service", "other"}
    if data.community not in allowed_communities:
        raise HTTPException(status_code=400, detail="Оберіть Томаківську або Мирівську громаду")
    if data.type not in allowed_types:
        raise HTTPException(status_code=400, detail="Оберіть коректний тип об'єкта")
    if not data.name.strip():
        raise HTTPException(status_code=400, detail="Вкажіть назву об'єкта")
    if not (-90 <= data.latitude <= 90 and -180 <= data.longitude <= 180):
        raise HTTPException(status_code=400, detail="Некоректні координати об'єкта")

    map_object = MapObject(
        name=data.name.strip(),
        type=data.type,
        community=data.community,
        latitude=data.latitude,
        longitude=data.longitude,
        address=data.address.strip(),
        phone=data.phone.strip() if data.phone else None,
        description=data.description.strip(),
        author=current_user.name,
        user_id=current_user.user_id,
    )
    document = map_object.model_dump()
    document["created_at"] = document["created_at"].isoformat()
    await db.map_objects.insert_one(document)
    return map_object

@api_router.delete("/map/objects/{object_id}")
async def delete_map_object(object_id: str, current_user: User = Depends(get_current_user)):
    map_object = await db.map_objects.find_one({"id": object_id}, {"_id": 0, "user_id": 1})
    if not map_object:
        raise HTTPException(status_code=404, detail="Об'єкт не знайдено")
    if map_object.get("user_id") != current_user.user_id and current_user.role not in {"admin", "superadmin"}:
        raise HTTPException(status_code=403, detail="Ви можете видаляти лише власні об'єкти")
    await db.map_objects.delete_one({"id": object_id})
    return {"message": "Об'єкт видалено"}

# ==================== Rada Info Endpoints ====================

@api_router.get("/radas")
async def get_radas():
    radas = await db.radas.find({}, {"_id": 0}).to_list(10)
    return radas

@api_router.get("/radas/{rada_id}")
async def get_rada(rada_id: str):
    rada = await db.radas.find_one({"id": rada_id}, {"_id": 0})
    if not rada:
        raise HTTPException(status_code=404, detail="Rada not found")
    return rada

# ==================== Deputies Endpoints ====================

@api_router.get("/deputies")
async def get_deputies(rada: Optional[str] = Query(None)):
    query = {}
    if rada:
        query["rada"] = rada
    deputies = await db.deputies.find(query, {"_id": 0}).to_list(100)
    return deputies

# ==================== Documents Endpoints ====================

@api_router.get("/documents")
async def get_documents(
    rada: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    limit: int = Query(20, le=100),
    skip: int = Query(0)
):
    query = {}
    if rada:
        query["rada"] = rada
    if type:
        query["type"] = type
    
    documents = await db.documents.find(query, {"_id": 0}).sort("date", -1).skip(skip).limit(limit).to_list(limit)
    
    for doc in documents:
        if isinstance(doc.get("date"), str):
            doc["date"] = datetime.fromisoformat(doc["date"])
    
    return documents

# ==================== Forum Endpoints ====================

@api_router.get("/forum/topics")
async def get_forum_topics(
    category: Optional[str] = Query(None),
    limit: int = Query(20, le=100),
    skip: int = Query(0)
):
    query = {}
    if category:
        query["category"] = category
    
    topics = await db.forum_topics.find(query, {"_id": 0}).sort([("is_pinned", -1), ("last_reply", -1)]).skip(skip).limit(limit).to_list(limit)
    
    for topic in topics:
        for field in ["created_at", "last_reply"]:
            if isinstance(topic.get(field), str):
                topic[field] = datetime.fromisoformat(topic[field])
    
    return topics

@api_router.get("/forum/topics/{topic_id}")
async def get_forum_topic(topic_id: str):
    topic = await db.forum_topics.find_one_and_update(
        {"id": topic_id},
        {"$inc": {"views": 1}},
        {"_id": 0},
        return_document=True
    )
    if not topic:
        raise HTTPException(status_code=404, detail="Тему не знайдено")

    for field in ["created_at", "last_reply"]:
        if isinstance(topic.get(field), str):
            topic[field] = datetime.fromisoformat(topic[field])

    return topic

@api_router.get("/forum/topics/{topic_id}/replies")
async def get_forum_replies(topic_id: str):
    topic_exists = await db.forum_topics.find_one({"id": topic_id}, {"_id": 1})
    if not topic_exists:
        raise HTTPException(status_code=404, detail="Тему не знайдено")

    replies = await db.forum_replies.find(
        {"topic_id": topic_id}, {"_id": 0}
    ).sort("created_at", 1).to_list(100)
    for reply in replies:
        if isinstance(reply.get("created_at"), str):
            reply["created_at"] = datetime.fromisoformat(reply["created_at"])
    return replies

@api_router.post("/forum/topics/{topic_id}/replies")
async def create_forum_reply(
    topic_id: str,
    data: ForumReplyCreate,
    current_user: User = Depends(get_current_user)
):
    content = data.content.strip()
    if not content:
        raise HTTPException(status_code=400, detail="Текст відповіді не може бути порожнім")
    if len(content) > 4000:
        raise HTTPException(status_code=400, detail="Відповідь не може містити понад 4000 символів")

    topic = await db.forum_topics.find_one({"id": topic_id}, {"_id": 0})
    if not topic:
        raise HTTPException(status_code=404, detail="Тему не знайдено")

    reply = ForumReply(
        topic_id=topic_id,
        content=content,
        author=current_user.name,
        user_id=current_user.user_id
    )
    doc = reply.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.forum_replies.insert_one(doc)
    await db.forum_topics.update_one(
        {"id": topic_id},
        {"$inc": {"replies": 1}, "$set": {"last_reply": doc["created_at"]}}
    )
    return reply

@api_router.post("/forum/topics")
async def create_forum_topic(data: ForumTopicCreate, current_user: User = Depends(get_current_user)):
    topic = ForumTopic(
        title=data.title,
        category=data.category,
        content=data.content,
        author=current_user.name,
        user_id=current_user.user_id
    )
    
    doc = topic.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    if doc.get("last_reply"):
        doc["last_reply"] = doc["last_reply"].isoformat()
    await db.forum_topics.insert_one(doc)
    
    return topic

# ==================== Marketplace Endpoints ====================

@api_router.get("/products")
async def get_products(
    rada: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    sort: str = Query("newest"),
    limit: int = Query(20, le=100),
    skip: int = Query(0)
):
    query = {"status": {"$ne": "deleted"}}
    if rada:
        query["rada"] = rada
    if category:
        query["category"] = category
    if search:
        query["$or"] = [
            {"name": {"$regex": search.strip(), "$options": "i"}},
            {"description": {"$regex": search.strip(), "$options": "i"}},
            {"location": {"$regex": search.strip(), "$options": "i"}},
        ]
    if min_price is not None or max_price is not None:
        query["price"] = {}
        if min_price is not None:
            query["price"]["$gte"] = min_price
        if max_price is not None:
            query["price"]["$lte"] = max_price

    sort_field = "created_at"
    sort_direction = -1
    if sort == "price_asc":
        sort_field, sort_direction = "price", 1
    elif sort == "price_desc":
        sort_field, sort_direction = "price", -1
    
    products = await db.products.find(query, {"_id": 0}).sort(sort_field, sort_direction).skip(skip).limit(limit).to_list(limit)
    
    for product in products:
        if isinstance(product.get("created_at"), str):
            product["created_at"] = datetime.fromisoformat(product["created_at"])
    
    return products

@api_router.get("/products/locations")
async def get_product_locations():
    locations = await db.products.distinct("location", {"status": {"$ne": "deleted"}})
    defaults = ["с. Зелене", "мкр. Сонячний", "Громада"]
    return sorted({location.strip() for location in [*defaults, *locations] if isinstance(location, str) and location.strip()})

@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Оголошення не знайдено")

    if isinstance(product.get("created_at"), str):
        product["created_at"] = datetime.fromisoformat(product["created_at"])

    seller = await db.users.find_one({"user_id": product.get("user_id")}, {"_id": 0, "email": 1})
    if seller:
        product["seller_email"] = seller.get("email")
    return product

@api_router.post("/products")
async def create_product(data: ProductCreate, current_user: User = Depends(get_current_user)):
    if not data.name.strip() or not data.description.strip():
        raise HTTPException(status_code=400, detail="Заповніть назву та опис оголошення")
    if data.price < 0:
        raise HTTPException(status_code=400, detail="Ціна не може бути від’ємною")
    phone = data.contact_phone.strip()
    if len(phone) < 7:
        raise HTTPException(status_code=400, detail="Вкажіть коректний номер телефону")

    product = Product(
        name=data.name.strip(),
        description=data.description.strip(),
        price=data.price,
        image=validate_storage_reference(data.image),
        seller=current_user.name,
        category=data.category,
        rada=data.rada,
        location=data.location.strip() or "Громада",
        condition=data.condition,
        contact_phone=phone,
        user_id=current_user.user_id
    )
    
    doc = product.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.products.insert_one(doc)
    
    return product

@api_router.put("/products/{product_id}")
async def update_product(product_id: str, data: ProductCreate, current_user: User = Depends(get_current_user)):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Оголошення не знайдено")
    if product.get("user_id") != current_user.user_id:
        raise HTTPException(status_code=403, detail="Ви можете редагувати лише власні оголошення")
    if not data.name.strip() or not data.description.strip():
        raise HTTPException(status_code=400, detail="Заповніть назву та опис оголошення")
    if data.price < 0:
        raise HTTPException(status_code=400, detail="Ціна не може бути від’ємною")
    phone = data.contact_phone.strip()
    if len(phone) < 7:
        raise HTTPException(status_code=400, detail="Вкажіть коректний номер телефону")

    updates = {
        "name": data.name.strip(), "description": data.description.strip(), "price": data.price,
        "image": validate_storage_reference(data.image), "category": data.category, "rada": data.rada,
        "location": data.location.strip() or "Громада", "condition": data.condition,
        "contact_phone": phone,
    }
    await db.products.update_one({"id": product_id}, {"$set": updates})
    updated = await db.products.find_one({"id": product_id}, {"_id": 0})
    if isinstance(updated.get("created_at"), str):
        updated["created_at"] = datetime.fromisoformat(updated["created_at"])
    return updated

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, current_user: User = Depends(get_current_user)):
    product = await db.products.find_one({"id": product_id}, {"_id": 0, "user_id": 1})
    if not product:
        raise HTTPException(status_code=404, detail="Оголошення не знайдено")
    if product.get("user_id") != current_user.user_id:
        raise HTTPException(status_code=403, detail="Ви можете видаляти лише власні оголошення")
    await db.products.update_one({"id": product_id}, {"$set": {"status": "deleted"}})
    return {"message": "Оголошення видалено"}

@api_router.get("/products/{product_id}/messages")
async def get_product_messages(product_id: str, current_user: User = Depends(get_current_user)):
    product = await db.products.find_one({"id": product_id}, {"_id": 0, "user_id": 1})
    if not product:
        raise HTTPException(status_code=404, detail="Оголошення не знайдено")

    messages = await db.product_messages.find({
        "product_id": product_id,
        "$or": [
            {"sender_id": current_user.user_id},
            {"receiver_id": current_user.user_id},
        ]
    }, {"_id": 0}).sort("created_at", 1).to_list(200)
    for message in messages:
        if isinstance(message.get("created_at"), str):
            message["created_at"] = datetime.fromisoformat(message["created_at"])
    return messages

@api_router.post("/products/{product_id}/messages")
async def create_product_message(
    product_id: str,
    data: ProductMessageCreate,
    current_user: User = Depends(get_current_user)
):
    content = data.content.strip()
    if not content:
        raise HTTPException(status_code=400, detail="Повідомлення не може бути порожнім")
    if len(content) > 2000:
        raise HTTPException(status_code=400, detail="Повідомлення не може містити понад 2000 символів")

    product = await db.products.find_one({"id": product_id}, {"_id": 0, "user_id": 1})
    if not product:
        raise HTTPException(status_code=404, detail="Оголошення не знайдено")
    if product.get("user_id") == "system":
        raise HTTPException(status_code=400, detail="Для цього оголошення внутрішня переписка недоступна")
    if product.get("user_id") == current_user.user_id and not data.receiver_id:
        raise HTTPException(status_code=400, detail="Оберіть отримувача повідомлення")

    receiver_id = data.receiver_id or product.get("user_id")
    receiver = await db.users.find_one({"user_id": receiver_id}, {"_id": 0, "user_id": 1})
    if not receiver:
        raise HTTPException(status_code=404, detail="Отримувача не знайдено")
    if receiver_id == current_user.user_id:
        raise HTTPException(status_code=400, detail="Не можна надіслати повідомлення самому собі")

    message = ProductMessage(
        product_id=product_id,
        sender_id=current_user.user_id,
        sender_name=current_user.name,
        receiver_id=receiver_id,
        content=content,
    )
    doc = message.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.product_messages.insert_one(doc)
    return message

# ==================== Health Check ====================

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# Include the router
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event - seed data
@app.on_event("startup")
async def startup_event():
    global facebook_sync_task
    await migrate_announcements()
    # Check if data exists
    news_count = await db.news.count_documents({})
    if news_count == 0:
        await seed_data()
    if facebook_import_enabled():
        await sync_facebook_news_from_page()
        facebook_sync_task = asyncio.create_task(facebook_news_sync_loop())
    else:
        logger.info("Facebook news sync is disabled: configure FACEBOOK_PAGE_ID and FACEBOOK_PAGE_ACCESS_TOKEN")


async def facebook_news_sync_loop():
    while True:
        await asyncio.sleep(max(FACEBOOK_SYNC_INTERVAL_SECONDS, 300))
        await sync_facebook_news_from_page()


async def migrate_announcements():
    """Keep the announcements board informational, separate from the marketplace."""
    await db.announcements.update_many({}, {"$unset": {"price": ""}})

    announcements_cursor = db.announcements.find({}, {"id": 1, "contact_info": 1})
    async for item in announcements_cursor:
        try:
            normalized_phone = normalize_ukrainian_phone(item.get("contact_info", ""))
        except HTTPException:
            continue
        if normalized_phone != item.get("contact_info"):
            await db.announcements.update_one(
                {"id": item["id"]},
                {"$set": {"contact_info": normalized_phone}},
            )

    # Replace the original demo sale listing with a community notice for existing databases.
    await db.announcements.update_one(
        {"user_id": "system", "title": "Продам будинок у с. Зелене"},
        {
            "$set": {
                "title": "Громадські слухання у с. Зелене",
                "description": "Запрошуємо мешканців громади долучитися до громадських слухань щодо розвитку села.",
                "category": "community",
                "is_urgent": False,
                "contact_info": "+38 (0312) 45-67-89",
                "image": None,
                "expires_at": (datetime.now(timezone.utc) + timedelta(days=30)).isoformat(),
            },
            "$unset": {"price": ""},
        },
    )

async def seed_data():
    """Seed initial data for the application"""
    logger.info("Seeding initial data...")
    
    # Seed Radas
    radas = [
        {
            "id": "rada1",
            "name": "Сільська рада села Зелене",
            "short_name": "Рада №1",
            "description": "Село Зелене — мальовничий куточок нашої громади з багатою історією та привітними жителями.",
            "address": "вул. Центральна, 45, с. Зелене",
            "phone": "+38 (0312) 45-67-89",
            "email": "rada1@moemistecheko.ua",
            "working_hours": "Пн-Пт: 8:00 - 17:00",
            "reception_hours": "Вт: 10:00 - 14:00, Чт: 14:00 - 18:00",
            "head_name": "Іван Петрович Коваленко",
            "head_position": "Сільський голова",
            "head_photo": "/api/storage/site/photo-1507003211169-0a1dd7228f2d.jpg",
            "hero_image": "/api/storage/site/photo-1500382017468-9049fed747ef.jpg",
            "population": 3240,
            "area": "18.5 км²",
            "founded_year": 1587
        },
        {
            "id": "rada2",
            "name": "Міська рада мікрорайону Сонячний",
            "short_name": "Рада №2",
            "description": "Мікрорайон Сонячний — сучасний житловий масив з розвиненою інфраструктурою.",
            "address": "просп. Сонячний, 12, мікрорайон Сонячний",
            "phone": "+38 (0312) 56-78-90",
            "email": "rada2@moemistecheko.ua",
            "working_hours": "Пн-Пт: 8:00 - 17:00",
            "reception_hours": "Пн: 10:00 - 14:00, Ср: 14:00 - 18:00",
            "head_name": "Марія Олександрівна Шевченко",
            "head_position": "Голова ради",
            "head_photo": "/api/storage/site/photo-1573496359142-b8d87734a5a2.jpg",
            "hero_image": "/api/storage/site/photo-1449844908441-8829872d2607.jpg",
            "population": 5680,
            "area": "12.3 км²",
            "founded_year": 1985
        }
    ]
    await db.radas.insert_many(radas)
    
    # Seed News
    news = [
        {
            "id": str(uuid.uuid4()),
            "title": "Відкриття нового дитячого майданчика у селі Зелене",
            "content": "Сьогодні у селі Зелене відбулося урочисте відкриття сучасного дитячого майданчика.",
            "excerpt": "Сучасний дитячий майданчик відкрився у селі Зелене. На спорудження виділено 450 тис. грн.",
            "image": "/api/storage/site/photo-1566140967404-b8b3932483f5.jpg",
            "category": "Інфраструктура",
            "rada": "rada1",
            "author": "Прес-служба Ради №1",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "views": 245
        },
        {
            "id": str(uuid.uuid4()),
            "title": "У мікрорайоні Сонячний запрацював новий медичний пункт",
            "content": "З початку грудня у мікрорайоні Сонячний розпочав роботу оновлений медичний пункт.",
            "excerpt": "Оновлений медичний пункт тепер приймає жителів мікрорайону Сонячний.",
            "image": "/api/storage/site/photo-1519494026892-80bbd2d6fd0d.jpg",
            "category": "Медицина",
            "rada": "rada2",
            "author": "Прес-служба Ради №2",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "views": 189
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Сесія ОТГ: затверджено бюджет на 2025 рік",
            "content": "На черговій сесії об'єднаної територіальної громади було затверджено бюджет на 2025 рік.",
            "excerpt": "Затверджено бюджет ОТГ на 2025 рік. Пріоритетні галузі: освіта, медицина, інфраструктура.",
            "image": "/api/storage/site/photo-1554224155-8d04cb21cd6c.jpg",
            "category": "Офіційно",
            "rada": "all",
            "author": "Секретар ради",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "views": 412
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Фестиваль 'Зимові свята' у нашій громаді",
            "content": "Запрошуємо всіх мешканців на традиційний фестиваль 'Зимові свята'.",
            "excerpt": "Фестиваль 'Зимові свята'. Ялинка, конкурси, подарунки, атракціони!",
            "image": "/api/storage/site/photo-1543589077-47d81606c1bf.jpg",
            "category": "Культура",
            "rada": "all",
            "author": "Відділ культури",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "views": 523
        }
    ]
    await db.news.insert_many(news)
    
    # Seed Deputies
    deputies = [
        {
            "id": str(uuid.uuid4()),
            "name": "Іван Петрович Коваленко",
            "position": "Сільський голова",
            "photo": "/api/storage/site/photo-1507003211169-0a1dd7228f2d.jpg",
            "phone": "+38 (0312) 45-67-89",
            "email": "kovalenko@rada1.ua",
            "biography": "Народився у 1965 році в селі Зелене. Освіта вища економічна.",
            "rada": "rada1"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Марія Олександрівна Шевченко",
            "position": "Голова ради",
            "photo": "/api/storage/site/photo-1573496359142-b8d87734a5a2.jpg",
            "phone": "+38 (0312) 56-78-90",
            "email": "shevchenko@rada2.ua",
            "biography": "Народилася у 1972 році. Освіта вища управлінська.",
            "rada": "rada2"
        }
    ]
    await db.deputies.insert_many(deputies)
    
    # Seed Announcements
    announcements = [
        {
            "id": str(uuid.uuid4()),
            "title": "Громадські слухання у с. Зелене",
            "description": "Запрошуємо мешканців громади долучитися до громадських слухань щодо розвитку села.",
            "category": "community",
            "rada": "rada1",
            "is_urgent": False,
            "contact_info": "+38 (0312) 45-67-89",
            "image": None,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "expires_at": (datetime.now(timezone.utc) + timedelta(days=30)).isoformat(),
            "user_id": "system"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Терміново потрібен водій",
            "description": "Підприємство шукає водія вантажівки. Категорія С, досвід від 3 років.",
            "category": "work",
            "rada": "rada2",
            "is_urgent": True,
            "contact_info": "+38 (050) 987-65-43",
            "image": None,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "expires_at": (datetime.now(timezone.utc) + timedelta(days=14)).isoformat(),
            "user_id": "system"
        }
    ]
    await db.announcements.insert_many(announcements)
    
    # Seed Products
    products = [
        {
            "id": str(uuid.uuid4()),
            "name": "Мед від місцевого пасічника",
            "description": "Натуральний квітковий мед, зібраний у екологічно чистому районі.",
            "price": 250,
            "image": "/api/storage/site/photo-1587049352846-4a222e784d38.jpg",
            "seller": "Пасіка 'Зелений мед'",
            "rating": 4.9,
            "reviews": 45,
            "category": "Продукти",
            "rada": "rada1",
            "user_id": "system",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Домашнє варення з малини",
            "description": "Смачне домашнє варення без консервантів. Банка 0.5 л.",
            "price": 80,
            "image": "/api/storage/site/photo-1568051243851-f9b136146e97.jpg",
            "seller": "Господиня Олена",
            "rating": 5.0,
            "reviews": 23,
            "category": "Продукти",
            "rada": "rada2",
            "user_id": "system",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.products.insert_many(products)
    
    # Seed Forum Topics
    forum_topics = [
        {
            "id": str(uuid.uuid4()),
            "title": "Проблеми з вивезенням сміття у селі Зелене",
            "category": "ЖКГ",
            "author": "Марія К.",
            "user_id": "system",
            "content": "Вже третій тиждень не вивозять сміття на вулиці Лісовій.",
            "replies": 23,
            "views": 456,
            "last_reply": datetime.now(timezone.utc).isoformat(),
            "is_pinned": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Шукаю репетитора з математики для 9 класу",
            "category": "Освіта",
            "author": "Олена П.",
            "user_id": "system",
            "content": "Шукаю досвідченого репетитора для підготовки до ДПА.",
            "replies": 8,
            "views": 189,
            "last_reply": datetime.now(timezone.utc).isoformat(),
            "is_pinned": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.forum_topics.insert_many(forum_topics)
    
    # Create admin user
    admin_user = {
        "user_id": "admin_001",
        "email": "admin@moemistechko.ua",
        "name": "Супер Адмін",
        "password": bcrypt.hash("admin123"),
        "role": "superadmin",
        "rada": None,
        "picture": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(admin_user)
    
    logger.info("Data seeding completed!")

@app.on_event("shutdown")
async def shutdown_db_client():
    global facebook_sync_task
    if facebook_sync_task:
        facebook_sync_task.cancel()
        try:
            await facebook_sync_task
        except asyncio.CancelledError:
            pass
    client.close()
