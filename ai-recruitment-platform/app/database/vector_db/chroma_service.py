import chromadb


class ChromaService:

    client = chromadb.PersistentClient(path="./chroma_db")


    collection = client.get_or_create_collection(name="candidates")


    @classmethod
    def save(cls,candidate_id:str,vector:list,metadata:dict):
        cls.collection.add(ids=[candidate_id], embeddings=[vector], metadatas=[metadata])


    @classmethod
    def search(cls,vector:list,top_k:int=5):
        result=cls.collection.query(query_embeddings=[vector],n_results=top_k)
        return result