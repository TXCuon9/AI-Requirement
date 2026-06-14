from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.modules.embeddings.embedding_service import EmbeddingService
from app.database.vector_db.chroma_service import ChromaService

router = APIRouter()

class JobSyncRequest(BaseModel):
    job_id: str
    title: str
    description: str
    requirements: str
    responsibilities: str

@router.post("/sync")
async def sync_job(request: JobSyncRequest):
    try:
        # Build text for embedding
        text_to_embed = f"Title: {request.title}\nDescription: {request.description}\nRequirements: {request.requirements}\nResponsibilities: {request.responsibilities}"
        
        # Generate embedding
        vector = EmbeddingService.generate(text_to_embed)
        
        # Save to Chroma
        ChromaService.save_job(
            job_id=str(request.job_id),
            vector=vector,
            metadata={
                "title": request.title
            }
        )
        return {"status": "success", "message": f"Job {request.job_id} synced successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
