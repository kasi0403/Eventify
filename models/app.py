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
    "description": "The ultimate tech conference featuring the latest innovations and industry leaders. Join us for three days of keynotes, workshops, and networking opportunities.",
    "date": "2023-11-15",
    "time": "09:00 AM",
    "location": "San Francisco, CA",
    "venue": "Moscone Center",
    "category": "Conference",
    "image": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop",
    "price": 299,
    "currency": "USD",
    "tickets": [
      { "type": "Regular", "price": 299, "available": 1500 },
      { "type": "VIP", "price": 599, "available": 200 }
    ],
    "organizer": "TechCorp Inc.",
    "tags": ["tech", "innovation", "networking"],
    "attendance": 1800,
    "rating": 4.8
  },
  {
    "id": 2,
    "title": "Summer Music Festival",
    "description": "The biggest music event of the summer, featuring top artists across multiple genres. Enjoy live performances, food vendors, and art installations.",
    "date": "2023-07-22",
    "time": "12:00 PM",
    "location": "Los Angeles, CA",
    "venue": "Grand Park",
    "category": "Concert",
    "image": "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1000&auto=format&fit=crop",
    "price": 149,
    "currency": "USD",
    "tickets": [
      { "type": "General Admission", "price": 149, "available": 10000 },
      { "type": "VIP Access", "price": 349, "available": 500 },
      { "type": "Backstage Pass", "price": 799, "available": 50 }
    ],
    "organizer": "Melody Productions",
    "tags": ["music", "festival", "summer", "outdoor"],
    "attendance": 25000,
    "rating": 4.7
  },
  {
    "id": 3,
    "title": "Business Leadership Summit",
    "description": "Connect with business leaders and entrepreneurs from around the world. Learn strategies for growth, innovation, and leadership.",
    "date": "2023-09-05",
    "time": "10:00 AM",
    "location": "New York, NY",
    "venue": "Javits Center",
    "category": "Business",
    "image": "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop",
    "price": 499,
    "currency": "USD",
    "tickets": [
      { "type": "Standard", "price": 499, "available": 800 },
      { "type": "Premium", "price": 899, "available": 200 }
    ],
    "organizer": "Global Business Network",
    "tags": ["business", "leadership", "networking", "entrepreneurs"],
    "attendance": 1200,
    "rating": 4.5
  },
  {
    "id": 4,
    "title": "Wellness Retreat",
    "description": "A weekend of mindfulness, yoga, and wellness workshops. Rejuvenate your mind and body in a peaceful natural setting.",
    "date": "2023-08-12",
    "time": "08:00 AM",
    "location": "Boulder, CO",
    "venue": "Mountain Serenity Resort",
    "category": "Wellness",
    "image": "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1000&auto=format&fit=crop",
    "price": 349,
    "currency": "USD",
    "tickets": [
      { "type": "Full Weekend", "price": 349, "available": 300 },
      { "type": "Single Day", "price": 149, "available": 200 }
    ],
    "organizer": "Mindful Living Co.",
    "tags": ["wellness", "yoga", "meditation", "retreat"],
    "attendance": 450,
    "rating": 4.9
  },
  {
    "id": 5,
    "title": "International Food Festival",
    "description": "Experience culinary delights from around the world. Sample dishes from over 30 countries, watch cooking demonstrations, and enjoy live entertainment.",
    "date": "2023-10-08",
    "time": "11:00 AM",
    "location": "Chicago, IL",
    "venue": "Millennium Park",
    "category": "Food",
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop",
    "price": 75,
    "currency": "USD",
    "tickets": [
      { "type": "General Entry", "price": 75, "available": 5000 },
      { "type": "VIP Tasting Tour", "price": 199, "available": 300 }
    ],
    "organizer": "Global Tastes Association",
    "tags": ["food", "festival", "international", "culinary"],
    "attendance": 12000,
    "rating": 4.6
  },
  {
    "id": 6,
    "title": "AI & Machine Learning Conference",
    "description": "Explore the future of artificial intelligence and machine learning. Hear from top researchers and industry practitioners.",
    "date": "2023-12-03",
    "time": "09:30 AM",
    "location": "Seattle, WA",
    "venue": "Washington State Convention Center",
    "category": "Conference",
    "image": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop",
    "price": 399,
    "currency": "USD",
    "tickets": [
      { "type": "Regular", "price": 399, "available": 1200 },
      { "type": "Premium", "price": 699, "available": 300 }
    ],
    "organizer": "Future Tech Institute",
    "tags": ["ai", "machine learning", "tech", "conference"],
    "attendance": 2000,
    "rating": 4.7
  }
]


def embed_text(description, tags):
    """Generate a numerical embedding using Gemini for both description and tags."""
    combined_text = description + " " + " ".join(tags)  # Merge description and tags
    embedding = genai.embed_content(model="models/embedding-001", content=combined_text)["embedding"]
    return np.array(embedding, dtype=np.float32)

event_embeddings = np.array([embed_text(event["description"],event["tags"]) for event in events])

dimension = event_embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(event_embeddings)

@app.route('/search', methods=['POST'])
@app.route('/search', methods=['POST'])
def search():
    """Finds the most relevant events for a given query using POST."""
    data = request.get_json()

    if not data or "query" not in data:
        return jsonify({"error": "Query parameter is required"}), 400

    query = data["query"]
    k = data.get("k", 2)  

    # Fix: Pass an empty list for tags to satisfy the function's parameter requirements
    query_embedding = embed_text(query, []).reshape(1, -1)
    _, indices = index.search(query_embedding, k)

    matched_events = [events[i] for i in indices[0]]

    return jsonify(matched_events)


if __name__ == "__main__":
    app.run(debug=True,port=4000)
