from fastapi import APIRouter
from app.modules.scoring.scoring_service import (
    ScoringService
)

router=APIRouter()


@router.post("/candidate")

async def score(candidate_profile:dict, job_data:dict):
    result=ScoringService.score(candidate_profile,job_data)
    return result