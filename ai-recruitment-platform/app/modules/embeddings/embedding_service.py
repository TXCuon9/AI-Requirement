from sentence_transformers import SentenceTransformer


class EmbeddingService:

    model=SentenceTransformer(
        "all-MiniLM-L6-v2"
    )


    @classmethod
    def generate(
        cls,
        text:str
    ):

        vector=cls.model.encode(
            text
        )

        return vector.tolist()