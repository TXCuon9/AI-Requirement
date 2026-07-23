from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.database.vector_db.chroma_service import ChromaService
from app.modules.embeddings.embedding_service import EmbeddingService

router = APIRouter()

class RecommendRequest(BaseModel):
    resume_id: Optional[str] = None
    candidate_id: Optional[str] = None
    onboarding_text: Optional[str] = None

@router.post("/jobs")
async def recommend_jobs(request: RecommendRequest):
    try:
        vector = None
        
        if request.candidate_id:
            result = ChromaService.collection.get(ids=[request.candidate_id], include=["embeddings"])
            if result and result.get("embeddings") and len(result["embeddings"]) > 0:
                vector = result["embeddings"][0]
        elif request.resume_id:
            result = ChromaService.collection.get(ids=[request.resume_id], include=["embeddings"])
            if result and result.get("embeddings") and len(result["embeddings"]) > 0:
                vector = result["embeddings"][0]
                
        elif request.onboarding_text:
            vector = EmbeddingService.generate(request.onboarding_text)
            
        if not vector:
            return {"recommended_job_ids": []}
            
        # Search jobs
        search_result = ChromaService.search_jobs(vector, top_k=5)
        job_ids = search_result["ids"][0] if search_result["ids"] and len(search_result["ids"]) > 0 else []
        
        return {"recommended_job_ids": job_ids}
    except Exception as e:
        print(f"Error in recommend_jobs: {str(e)}")
        return {"recommended_job_ids": []}
