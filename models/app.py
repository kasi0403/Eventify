from flask import Flask, request, jsonify
import google.generativeai as genai
import faiss
import numpy as np
from flask_cors import CORS
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app) 

load_dotenv()

GENAI_API_KEY = os.getenv("GENAI_API_KEY")
genai.configure(api_key=GENAI_API_KEY)

events = [
    {
        "id": 1,
        "title": "TechCon 2023",
        "description": "The ultimate tech conference featuring the latest innovations and industry leaders.",
        "date": "2023-11-15",
        "location": "San Francisco, CA",
        "category": "Conference",
        "image": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop",
        "rating": 4.8
    },
    {
        "id": 2,
        "title": "Summer Music Festival",
        "description": "The biggest music event of the summer, featuring top artists across multiple genres.",
        "date": "2023-07-22",
        "location": "Los Angeles, CA",
        "category": "Concert",
        "image": "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1000&auto=format&fit=crop",
        "rating": 4.7
    },
    {
        "id": 3,
        "title": "Business Leadership Summit",
        "description": "Connect with business leaders and entrepreneurs from around the world.",
        "date": "2023-09-05",
        "location": "New York, NY",
        "category": "Business",
        "image": "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop",
        "rating": 4.5
    }
]

def embed_text(text):
    """Generate a numerical embedding using Gemini."""
    embedding = genai.embed_content(model="models/embedding-001", content=text)["embedding"]
    return np.array(embedding, dtype=np.float32)

event_embeddings = np.array([embed_text(event["description"]) for event in events])

dimension = event_embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(event_embeddings)

@app.route('/search', methods=['POST'])
def search():
    """Finds the most relevant events for a given query using POST."""
    data = request.get_json()

    if not data or "query" not in data:
        return jsonify({"error": "Query parameter is required"}), 400

    query = data["query"]
    k = data.get("k", 2)  

    query_embedding = embed_text(query).reshape(1, -1)
    _, indices = index.search(query_embedding, k)

    matched_events = [events[i] for i in indices[0]]

    return jsonify(matched_events)

if __name__ == "__main__":
    app.run(debug=True,port=4000)
