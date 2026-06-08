import requests
import sys

url = "http://localhost:11434/api/generate"

user_input = sys.argv[1]

prompt = f"""
You are a friendly 10th class physics teacher.

Explain in very simple words.
Keep answer STRICTLY under 3 lines.
Use very short sentences.

Question: {user_input}
"""

response = requests.post(url, json={
    "model": "tinyllama",
    "prompt": prompt,
    "stream": False
})

print(response.json()["response"])