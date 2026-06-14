import os
import asyncio
import google.generativeai as genai
from dotenv import load_dotenv
from app.providers.base_provider import BaseProvider

load_dotenv()

class GeminiProvider(BaseProvider):
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    def _sync_generate(self, prompt: str) -> str:
        if not self.api_key:
            raise ValueError("Missing GEMINI_API_KEY")
            
        print("ĐANG GỌI GEMINI API...")
        try:
            response = self.model.generate_content(prompt)
            print("GEMINI ĐÃ TRẢ KẾT QUẢ")
            return response.text
        except Exception as e:
            print(f"Gemini API Error: {e}")
            raise e

    async def generate(self, prompt: str) -> str:
        return await asyncio.to_thread(self._sync_generate, prompt)
