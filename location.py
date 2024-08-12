from fastapi import FastAPI
from fastapi.responses import JSONResponse
import json
import logging
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

# Load the countries from the JSON file
def load_countries():
    with open("location.json", "r") as file:
        return json.load(file)

@app.get("/api/v1/countries")
async def get_countries():
    try:
        countries = load_countries()
        logger.info("countries"+str(countries["countries"]))
        return JSONResponse(content={"countries": countries["countries"]})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# Other routes and configuration...
