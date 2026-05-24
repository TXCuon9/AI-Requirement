from app.modules.resume_parser.pdf_extractor import PDFExtractor
from app.modules.resume_parser.section_detector import SectionDetector

from app.modules.skill_extraction.skill_detector import SkillDetector

from app.modules.embeddings.vector_builder import VectorBuilder
from app.modules.embeddings.embedding_service import EmbeddingService

from app.database.vector_db.chroma_service import ChromaService

import uuid


class ParserService:

    @staticmethod
    async def parse(
        file_path: str
    ):

        text = PDFExtractor.extract(
            file_path
        )

        sections = SectionDetector.extract_sections(
            text
        )

        normalized_skills = SkillDetector.detect(
            sections["skills"]
        )

        profile = {

            "skills": normalized_skills,

            "education":
            sections["education"],

            "projects":
            sections["projects"],

            "certificates":
            sections["certificates"]

        }

        embedding_text = VectorBuilder.build(
            profile
        )

        vector = EmbeddingService.generate(
            embedding_text
        )

        candidate_id = str(
            uuid.uuid4()
        )

        ChromaService.save(

            candidate_id=candidate_id,

            vector=vector,

            metadata={

                "skills": ",".join(

                    x["normalized"]

                    for x in normalized_skills

                )

            }

        )

        profile["candidate_id"] = candidate_id

        profile["embedding"] = vector


        return profile