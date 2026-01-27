import requests
import json

# Configuration
API_URL = "https://atlas-backend-npbs.vercel.app/api"
API_KEY = "atla_a829872a0f8c66733f7e3f0e20e341f7439a0997b4ca7bd2d07e035e4e3cc8b5"

def create_blog_post(title, body, category, tags=None, sources=None):
    """
    Creates a new blog post in the Atlas Knowledge Engine.
    """
    endpoint = f"{API_URL}/content"
    
    headers = {
        "x-api-key": API_KEY,
        "Content-Type": "application/json"
    }
    
    payload = {
        "title": title,
        "body": body,
        "category": category,
        "status": "published", # or "draft"
        "tags": tags or [],
        "sources": sources or []
    }
    
    try:
        response = requests.post(endpoint, headers=headers, json=payload)
        
        if response.status_code == 201:
            print("Successfully created blog post!")
            print(json.dumps(response.json(), indent=2))
            return response.json()
        else:
            print(f"Failed to create blog post. Status code: {response.status_code}")
            print(response.text)
            return None
            
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

if __name__ == "__main__":
    # Example usage
    title = "The Future of Sovereign Intelligence"
    body = "In an era of centralized algorithms, local knowledge engines become the ultimate leverage..."
    category = "business"
    tags = ["intelligence", "sovereignty", "technology"]
    sources = [
        {
            "title": "Sovereign Individual",
            "url": "https://example.com/book",
            "type": "book"
        }
    ]
    
    create_blog_post(title, body, category, tags, sources)
