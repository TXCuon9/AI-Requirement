import os
import google.generativeai as genai

class EmbeddingService:
    @classmethod
    def generate(cls, text: str):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("Missing GEMINI_API_KEY")

        genai.configure(api_key=api_key)

        result = genai.embed_content(
            # Keep the 384 dimensions used by the existing Chroma collections.
            # `gemini-embedding-2` is not a valid Gemini model name.
            model=os.getenv("GEMINI_EMBEDDING_MODEL", "models/gemini-embedding-001"),
            content=text,
            task_type="retrieval_document",
            output_dimensionality=384,
        )
        return result['embedding']
