# Atlas Blog CMS: Python Integration Guide

This guide explains how to programmatically create and manage content on your Atlas Knowledge Engine using Python and API keys.

## 1. Get your API Key
1. Go to your Atlas Dashboard.
2. Navigate to **User Management** or **Settings** (where API Key management is implemented).
3. Create a new API Key and copy it.

> [!IMPORTANT]
> The user associated with the API key must have either the `admin` or `contributor` role to create content.

## 2. Python Setup
You will need the `requests` library.
```bash
pip install requests
```

## 3. Integration Script
I've created a sample script for you at [post_blog.py](file:///c:/Users/abc/Desktop/Projects/atla/scripts/post_blog.py).

### Core Logic:
```python
import requests

API_URL = "https://atlas-backend-npbs.vercel.app/api"
API_KEY = "your_key"

headers = {
    "x-api-key": API_KEY,
    "Content-Type": "application/json"
}

payload = {
    "title": "My Article",
    "body": "Detailed research...",
    "category": "money",
    "tags": ["crypto", "finance"],
    "sources": [{"title": "Source 1", "url": "..."}]
}

response = requests.post(f"{API_URL}/content", headers=headers, json=payload)
print(response.json())
```

## 4. Troubleshooting 500 Errors
If you receive a `500 Internal Server Error`, check the following:
- **Database Schema**: Ensure yours `profiles` table has been updated with the `DEFAULT uuid_generate_v4()` as described in the previous migration step.
- **Constraints**: If you have `REFERENCES auth.users` on `author_id` in the `content` table, it might fail if the user was created manually.
- **Role Permissions**: Ensure your API key belongs to a user with the correct role (`admin` or `contributor`).

## 5. Deployment Note
Remember to set `CORS_ORIGIN` in your Vercel/Render dashboard if you plan to call this from another website, though Python scripts (server-to-server) are not restricted by CORS.
