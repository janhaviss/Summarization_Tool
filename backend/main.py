from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from router import  summarization ,translator,tt

# 🧩 Import your user router and DB setup
# from users.router import router as user_router
# from users import models
from database import engine

# Auto-create tables
# models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Allow frontend dev server (adjust port if needed)
origins = [
    "http://localhost:5173",  # Vite default
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Default test route
@app.get("/api/hello")
def read_root():
    return {"message": "Hello from FastAPI! Mrunali is the best"}

# 🧩 Include users router
# app.include_router(user_router)

app.include_router(summarization.router)
app.include_router(translator.router)
app.include_router(tt.router)

@app.get("/")
def home():
    return {"message": "Summarization Tool API"}
