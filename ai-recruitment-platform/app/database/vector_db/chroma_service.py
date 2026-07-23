import os
import chromadb


class ChromaService:

    # Resolve from this file so local runs use the same DB regardless of cwd.
    default_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../chroma_db"))
    client = chromadb.PersistentClient(path=os.getenv("CHROMA_DB_PATH", default_path))


    collection = client.get_or_create_collection(name="candidates")
    jobs_collection = client.get_or_create_collection(name="jobs")


    @classmethod
    def save(cls,candidate_id:str,vector:list,metadata:dict):
        cls.collection.add(ids=[candidate_id], embeddings=[vector], metadatas=[metadata])

    @classmethod
    def search(cls,vector:list,top_k:int=5):
        result=cls.collection.query(query_embeddings=[vector],n_results=top_k)
        return result

    @classmethod
    def save_job(cls, job_id: str, vector: list, metadata: dict):
        cls.jobs_collection.upsert(ids=[job_id], embeddings=[vector], metadatas=[metadata])

    @classmethod
    def search_jobs(cls, vector: list, top_k: int = 5):
        result = cls.jobs_collection.query(query_embeddings=[vector], n_results=top_k)
        return result
