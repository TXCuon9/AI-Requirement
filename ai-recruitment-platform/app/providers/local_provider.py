import ollama
from app.providers.base_provider import BaseProvider


class LocalProvider(BaseProvider):

    async def generate(self,prompt: str):

        print("ĐANG GỌI OLLAMA")

        response = ollama.chat(
            model="qwen3:latest",
            messages=[
                {
                    "role":"user",
                    "content":prompt
                }
            ]
        )
        print("OLLAMA ĐÃ TRẢ KẾT QUẢ")
        return response["message"]["content"]