from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Any
from fastapi.middleware.cors import CORSMiddleware
from recommender import engine
from chatbot import aura

app = FastAPI(title="AuraGifts AI Service")

# Enable CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    suggestions: Optional[List[str]] = None
    recommendations: Optional[List[Any]] = None
    finished: bool = False

@app.get("/")
async def root():
    return {"status": "AuraGifts AI Service is Online"}

@app.post("/chat", response_model=ChatResponse)
async def chat(msg: ChatMessage):
    try:
        response_text, suggestions = aura.get_response(msg.message)
        
        # Check for the trigger word in the LLM response
        is_finished = "SEARCH_QUERY:" in response_text
        recommendations = None
        
        display_text = response_text
        
        if is_finished:
            # Extract the query after the trigger
            query = response_text.split("SEARCH_QUERY:")[-1].strip()
            # Clean up the display text to remove the technical trigger
            display_text = response_text.split("SEARCH_QUERY:")[0].strip()
            if not display_text:
                display_text = "I've found some great matches for you!"
            
            recommendations = engine.recommend(query)
            
        return {
            "response": display_text,
            "suggestions": suggestions if not is_finished else None,
            "recommendations": recommendations,
            "finished": is_finished
        }
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/recommend")
async def recommend(query: str):
    try:
        recommendations = engine.recommend(query)
        return {"query": query, "recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/product/{product_id}")
async def get_product(product_id: str):
    try:
        product = engine.get_product(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/product/{product_id}/similar")
async def get_similar_products(product_id: str):
    try:
        similar_products = engine.get_similar_products(product_id)
        return {"similar": similar_products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
