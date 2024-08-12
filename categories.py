from fastapi import FastAPI
from fastapi.responses import JSONResponse
import json
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",  # The URL of your front-end application
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load the categories from the JSON file
def load_categories():
    with open("categories.json", "r") as file:
        return json.load(file)

@app.get("/api/v1/categories")
async def get_categories():
    try:
        categories = load_categories()
        return JSONResponse(content={"categories": categories})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# Other routes and configuration...
