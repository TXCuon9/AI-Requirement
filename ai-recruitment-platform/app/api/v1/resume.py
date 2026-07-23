from fastapi import APIRouter, File, HTTPException, UploadFile
from app.modules.resume_parser.parser_service import ParserService
from app.providers.gemini_provider import GeminiQuotaError

import os
import tempfile
import traceback

router=APIRouter()


@router.post("/parse")

async def parse_resume(file: UploadFile = File(...)):

    if file.content_type != "application/pdf":
        raise HTTPException(status_code=415, detail="Chỉ hỗ trợ file PDF.")

    content=await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="File PDF rỗng.")

    fd, path = tempfile.mkstemp(suffix=".pdf")
    try:
        with os.fdopen(fd, "wb") as f:
            f.write(content)
        try:
            return await ParserService.parse(path)
        except GeminiQuotaError as exc:
            print(f"Resume parsing rate-limited: {exc}")
            raise HTTPException(
                status_code=429,
                detail=str(exc),
                headers={"Retry-After": "60"},
            ) from exc
        except Exception as exc:
            print(f"Resume parsing failed: {exc}")
            traceback.print_exc()
            raise HTTPException(
                status_code=500,
                detail="Không thể đọc nội dung CV hoặc kết nối Gemini. Vui lòng thử lại.",
            ) from exc
    finally:
        if os.path.exists(path):
            os.remove(path)
