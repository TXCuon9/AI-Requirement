import json
from app.providers.local_provider import LocalProvider


class EntityExtractor:

    provider = LocalProvider()

    async def extract(self,text:str):

        short_text = text[:1000]

        prompt=f"""
                Return VALID JSON only.

                No explanation.
                No markdown.
                No extra text.

                Extract:

                skills
                experience
                education
                projects
                certificates
                languages
                hobbies

                CV:

                {short_text}

                """

        result = await self.provider.generate(prompt)

        try:

            return json.loads(result)

        except:

            return {
                "error":"Invalid JSON",
                "raw_response":result
            }