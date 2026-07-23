from app.modules.resume_parser.pdf_extractor import PDFExtractor
from app.providers.gemini_provider import GeminiProvider
import json
import re

from app.modules.skill_extraction.skill_detector import SkillDetector

from app.modules.embeddings.vector_builder import VectorBuilder
from app.modules.embeddings.embedding_service import EmbeddingService

from app.database.vector_db.chroma_service import ChromaService

import uuid


class ParserService:

    @staticmethod
    def _find_target_position(personal_info: dict, profile_data: dict, text: str) -> str:
        candidates = [
            personal_info.get("targetPosition"),
            personal_info.get("target_position"),
            personal_info.get("desiredPosition"),
            personal_info.get("jobTitle"),
            profile_data.get("targetPosition"),
            profile_data.get("target_position"),
        ]
        for candidate in candidates:
            if isinstance(candidate, str) and candidate.strip():
                return candidate.strip()

        label_pattern = re.compile(
            r"^(?:vị\s*trí\s*(?:ứng\s*tuyển|mong\s*muốn)|"
            r"chức\s*danh\s*(?:ứng\s*tuyển|mong\s*muốn)|"
            r"desired\s*position|target\s*position|position\s*applied)\s*[:\-]\s*(.+)$",
            re.IGNORECASE,
        )
        for line in text.splitlines():
            match = label_pattern.match(line.strip())
            if match and match.group(1).strip():
                return match.group(1).strip()

        return ""

    @staticmethod
    async def parse(file_path: str):

        text = PDFExtractor.extract(file_path)

        prompt = f"""Bạn là một chuyên gia phân tích CV. Trích xuất thông tin từ văn bản CV sau và TRẢ VỀ ĐÚNG MỘT KHỐI JSON HỢP LỆ (không thêm giải thích).
        Chú ý: "targetPosition" là vị trí ứng tuyển hoặc chức danh thường nằm ngay dưới tên ứng viên.
        {{
            "personal_info": {{
                "name": "",
                "email": "",
                "phone": "",
                "address": "",
                "targetPosition": "",
                "summary": ""
            }},
            "skills": ["kỹ năng 1", "kỹ năng 2"],
            "education": [
                {{
                    "schoolName": "",
                    "major": "",
                    "startDate": "",
                    "endDate": "",
                    "description": ""
                }}
            ],
            "experience": [
                {{
                    "companyName": "",
                    "position": "",
                    "startDate": "",
                    "endDate": "",
                    "description": ""
                }}
            ],
            "projects": [
                {{
                    "projectName": "",
                    "role": "",
                    "startDate": "",
                    "endDate": "",
                    "description": ""
                }}
            ]
        }}

        VĂN BẢN CV:
        {text}
        """
        provider = GeminiProvider()
        llm_response = await provider.generate(prompt)
        
        match = re.search(r'\{.*\}', llm_response, re.DOTALL)
        json_str = match.group(0) if match else llm_response
            
        try:
            profile_data = json.loads(json_str)
        except json.JSONDecodeError:
            profile_data = {"personal_info": {}, "skills": [], "education": [], "projects": [], "experience": []}

        personal_info = profile_data.get("personal_info", {})
        if not isinstance(personal_info, dict):
            personal_info = {}
        personal_info["targetPosition"] = ParserService._find_target_position(
            personal_info, profile_data, text
        )

        normalized_skills = SkillDetector.detect(
            profile_data.get("skills", [])
        )

        profile = {
            "personal_info": personal_info,
            "skills": normalized_skills,
            "education": profile_data.get("education", []),
            "projects": profile_data.get("projects", []),
            "experience": profile_data.get("experience", []),
            "parsedText": text,
            "summary": personal_info.get("summary", ""),
        }

        try:
            embedding_text = VectorBuilder.build(profile)
            if embedding_text.strip():
                vector = EmbeddingService.generate(embedding_text)
                candidate_id = str(uuid.uuid4())

                ChromaService.save(
                    candidate_id=candidate_id,
                    vector=vector,
                    metadata={
                        "skills": ",".join(
                            x["normalized"] for x in normalized_skills
                        )
                    },
                )

                profile["candidate_id"] = candidate_id
                profile["embedding"] = vector
        except Exception as exc:
            print(f"Resume parsed, but recommendation indexing failed: {exc}")

        return profile
