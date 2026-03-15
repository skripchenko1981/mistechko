from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import httpx
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

# Create the main app
app = FastAPI(title="Моє Містечко API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

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

class NewsCreate(BaseModel):
    title: str
    content: str
    excerpt: str
    image: Optional[str] = None
    category: str
    rada: str = "all"

class Announcement(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: str  # work, realty, auto, services, lostfound, other
    rada: str
    is_urgent: bool = False
    price: Optional[float] = None
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
    price: Optional[float] = None
    contact_info: str
    image: Optional[str] = None
    expires_days: int = 30

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
    user_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    image: Optional[str] = None
    category: str
    rada: str

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

# REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
@api_router.post("/auth/google/session")
async def google_auth_session(request: Request, response: Response):
    body = await request.json()
    session_id = body.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    
    # Exchange session_id with Emergent Auth
    async with httpx.AsyncClient() as client_http:
        resp = await client_http.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid session")
        
        auth_data = resp.json()
    
    email = auth_data.get("email")
    name = auth_data.get("name")
    picture = auth_data.get("picture")
    session_token = auth_data.get("session_token")
    
    # Find or create user
    user = await db.users.find_one({"email": email}, {"_id": 0})
    if not user:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        user_doc = {
            "user_id": user_id,
            "email": email,
            "name": name,
            "picture": picture,
            "role": "user",
            "rada": None,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(user_doc)
        user = user_doc
    else:
        # Update user info
        await db.users.update_one(
            {"email": email},
            {"$set": {"name": name, "picture": picture}}
        )
        user["name"] = name
        user["picture"] = picture
    
    # Store session
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
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
        max_age=7 * 24 * 60 * 60
    )
    
    return {
        "user_id": user["user_id"],
        "email": user["email"],
        "name": user["name"],
        "picture": user.get("picture"),
        "role": user.get("role", "user")
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

# ==================== News Endpoints ====================

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
        image=data.image,
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
    query = {"expires_at": {"$gte": datetime.now(timezone.utc).isoformat()}}
    if rada:
        query["rada"] = rada
    if category:
        query["category"] = category
    
    announcements = await db.announcements.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    
    for item in announcements:
        for field in ["created_at", "expires_at"]:
            if isinstance(item.get(field), str):
                item[field] = datetime.fromisoformat(item[field])
    
    return announcements

@api_router.post("/announcements", response_model=Announcement)
async def create_announcement(data: AnnouncementCreate, current_user: User = Depends(get_current_user)):
    announcement = Announcement(
        title=data.title,
        description=data.description,
        category=data.category,
        rada=data.rada,
        is_urgent=data.is_urgent,
        price=data.price,
        contact_info=data.contact_info,
        image=data.image,
        expires_at=datetime.now(timezone.utc) + timedelta(days=data.expires_days),
        user_id=current_user.user_id
    )
    
    doc = announcement.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    doc["expires_at"] = doc["expires_at"].isoformat()
    await db.announcements.insert_one(doc)
    
    return announcement

@api_router.delete("/announcements/{announcement_id}")
async def delete_announcement(announcement_id: str, current_user: User = Depends(get_current_user)):
    announcement = await db.announcements.find_one({"id": announcement_id}, {"_id": 0})
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    
    if announcement["user_id"] != current_user.user_id and current_user.role not in ["superadmin", "admin", "moderator"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.announcements.delete_one({"id": announcement_id})
    return {"message": "Deleted successfully"}

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
    limit: int = Query(20, le=100),
    skip: int = Query(0)
):
    query = {}
    if rada:
        query["rada"] = rada
    if category:
        query["category"] = category
    
    products = await db.products.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    
    for product in products:
        if isinstance(product.get("created_at"), str):
            product["created_at"] = datetime.fromisoformat(product["created_at"])
    
    return products

@api_router.post("/products")
async def create_product(data: ProductCreate, current_user: User = Depends(get_current_user)):
    product = Product(
        name=data.name,
        description=data.description,
        price=data.price,
        image=data.image,
        seller=current_user.name,
        category=data.category,
        rada=data.rada,
        user_id=current_user.user_id
    )
    
    doc = product.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.products.insert_one(doc)
    
    return product

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
    # Check if data exists
    news_count = await db.news.count_documents({})
    if news_count == 0:
        await seed_data()

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
            "head_photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
            "hero_image": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=600&fit=crop",
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
            "head_photo": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
            "hero_image": "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&h=600&fit=crop",
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
            "image": "https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=800&h=500&fit=crop",
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
            "image": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=500&fit=crop",
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
            "image": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=500&fit=crop",
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
            "image": "https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=800&h=500&fit=crop",
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
            "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
            "phone": "+38 (0312) 45-67-89",
            "email": "kovalenko@rada1.ua",
            "biography": "Народився у 1965 році в селі Зелене. Освіта вища економічна.",
            "rada": "rada1"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Марія Олександрівна Шевченко",
            "position": "Голова ради",
            "photo": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
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
            "title": "Продам будинок у с. Зелене",
            "description": "Продається затишний будинок 120 м² на ділянці 15 соток.",
            "category": "realty",
            "rada": "rada1",
            "is_urgent": False,
            "price": 85000,
            "contact_info": "+38 (067) 123-45-67",
            "image": "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop",
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
            "price": None,
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
            "image": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop",
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
            "image": "https://images.unsplash.com/photo-1568051243851-f9b136146e97?w=400&h=300&fit=crop",
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
    client.close()
