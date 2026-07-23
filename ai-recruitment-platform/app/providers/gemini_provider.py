import os
import asyncio
import google.generativeai as genai
from dotenv import load_dotenv
from app.providers.base_provider import BaseProvider

load_dotenv()

class GeminiQuotaError(RuntimeError):
    pass


class GeminiProvider(BaseProvider):
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
        configured_models = os.getenv(
            "GEMINI_GENERATION_MODELS",
            "gemini-3.5-flash-lite,gemini-3.1-flash-lite,gemini-2.5-flash",
        )
        self.model_names = [
            model.strip() for model in configured_models.split(",") if model.strip()
        ]

    def _sync_generate(self, prompt: str) -> str:
        if not self.api_key:
            raise ValueError("Missing GEMINI_API_KEY")

        last_quota_error = None
        last_unavailable_error = None
        for model_name in self.model_names:
            print(f"Calling GEMINI API with {model_name}...")
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(prompt)
                print(f"GEMINI returned results from {model_name}")
                return response.text
            except Exception as exc:
                error_text = str(exc).lower()
                is_quota_error = (
                    "429" in error_text
                    or "resourceexhausted" in type(exc).__name__.lower()
                    or "quota" in error_text
                )
                if is_quota_error:
                    last_quota_error = exc
                    print(f"Gemini quota exhausted for {model_name}; trying fallback.")
                    continue

                is_unavailable = "404" in error_text or "notfound" in type(exc).__name__.lower()
                if is_unavailable:
                    last_unavailable_error = exc
                    print(f"Gemini model {model_name} is unavailable; trying fallback.")
                    continue

                print(f"Gemini API Error ({model_name}): {exc}")
                raise

        if last_quota_error:
            raise GeminiQuotaError(
                "Các model Gemini hiện đã hết hạn mức. Vui lòng thử lại sau hoặc kiểm tra quota API."
            ) from last_quota_error

        if last_unavailable_error:
            raise RuntimeError("Không có model Gemini khả dụng cho API key hiện tại.") from last_unavailable_error

        raise RuntimeError("Không có model Gemini nào được cấu hình.")

    async def generate(self, prompt: str) -> str:
        return await asyncio.to_thread(self._sync_generate, prompt)
