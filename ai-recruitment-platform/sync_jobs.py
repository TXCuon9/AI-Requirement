import requests
import json
import time

def sync_jobs():
    print("Fetching jobs from Java Backend...")
    try:
        # Fetch all jobs
        response = requests.get("http://localhost:8080/api/jobs")
        if response.status_code != 200:
            print(f"Failed to fetch jobs. Status: {response.status_code}")
            return
            
        jobs = response.json()
        print(f"Found {len(jobs)} jobs. Starting sync to Vector DB...")
        
        success_count = 0
        for job in jobs:
            try:
                sync_payload = {
                    "job_id": str(job["id"]),
                    "title": job.get("title", ""),
                    "description": job.get("description", ""),
                    "requirements": job.get("requirements", ""),
                    "responsibilities": job.get("responsibilities", "")
                }
                
                sync_response = requests.post(
                    "http://localhost:8000/api/v1/jobs/sync", 
                    json=sync_payload
                )
                
                if sync_response.status_code == 200:
                    success_count += 1
                    print(f"Synced Job ID: {job['id']} - {job.get('title', '')}")
                else:
                    print(f"Failed to sync Job ID: {job['id']}")
            except Exception as e:
                print(f"Error syncing job {job.get('id')}: {str(e)}")
                
        print(f"Sync complete! Successfully synced {success_count}/{len(jobs)} jobs.")
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    sync_jobs()
