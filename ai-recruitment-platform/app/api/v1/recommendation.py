from fastapi import APIRouter
from app.database.vector_db.chroma_service import ChromaService

router=APIRouter()


@router.post("/similar")

async def similar(
    vector:list[float]
):

    result=ChromaService.search(
        vector
    )

    return result