from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.resume import router as resume_router
from app.api.v1.recommendation import (
    router as recommendation_router
)
from app.api.v1.scoring import (
    router as scoring_router
)
from app.api.v1.analysis import (
    router as analysis_router
)

app=FastAPI(
    title="AI Recruitment Platform",
    version="1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    resume_router,
    prefix="/api/v1/resume",
    tags=["Resume"]
)

app.include_router(

    recommendation_router,

    prefix="/api/v1/recommendation",

    tags=["Recommendation"]
)

app.include_router(

    scoring_router,

    prefix="/api/v1/scoring",

    tags=["Scoring"]
)

app.include_router(
    analysis_router,
    prefix="/api/v1/analysis",
    tags=["Analysis"]
)

@app.get("/")
def home():

    return {
        "message":"AI Recruitment Running"
    }