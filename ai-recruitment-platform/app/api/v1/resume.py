from fastapi import APIRouter, UploadFile
from app.modules.resume_parser.parser_service import ParserService

import os
import tempfile

router=APIRouter()


@router.post("/parse")

async def parse_resume(file:UploadFile):

    content=await file.read()

    fd, path = tempfile.mkstemp(suffix=".pdf")
    try:
        with os.fdopen(fd, "wb") as f:
            f.write(content)
            
        result = await ParserService.parse(path)
        return result
    finally:
        if os.path.exists(path):
            os.remove(path)