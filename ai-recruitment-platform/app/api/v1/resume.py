from fastapi import APIRouter, UploadFile
from app.modules.resume_parser.parser_service import ParserService

router=APIRouter()


@router.post("/parse")

async def parse_resume(
    file:UploadFile
):

    content=await file.read()

    path=file.filename

    with open(path,"wb") as f:
        f.write(content)

    result=await ParserService.parse(path)

    return result