from fastapi import FastAPI, Query, Depends, HTTPException
from pydantic import BaseModel
import httpx
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware
import logging
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Optional, List

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
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

# Retrieve the Pexels API key from the environment variable
VITE_AMAZON_API_KEY = os.getenv("VITE_AMAZON_API_KEY")
PEXELS_API_URL = 'https://api.pexels.com/v1/search'

# SQLAlchemy setup
DATABASE_URL = "sqlite:///./test.db"

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Create a session maker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a base class for declarative models
Base = declarative_base()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Define a model for storing search queries
class SearchQuery(Base):
    __tablename__ = "search_queries"

    id = Column(Integer, primary_key=True, index=True)
    query = Column(String, index=True)
    result_count = Column(Integer)

# Define a model for storing form submissions
class FormSubmissionDB(Base):
    __tablename__ = "form_submissions"

    id = Column(Integer, primary_key=True, index=True)
    supplier_name = Column(String, index=True)
    product_info = Column(String)
    product_url = Column(String, nullable=True)
    category = Column(String)
    quantity = Column(Integer)
    timeline = Column(String)
    location = Column(String)
    required_for = Column(String)

# Create the database tables
Base.metadata.create_all(bind=engine)

# Pydantic model for Pexels response
class Photo(BaseModel):
    id: int
    src: dict
    alt: str

# Pydantic model for form submission request
class FormSubmission(BaseModel):
    supplierName: str
    productInfo: str
    productUrl: str
    category: str
    quantity: int
    timeline: str
    location: str
    requiredFor: str

# Pydantic model for form submission response
class FormSubmissionDBResponse(BaseModel):
    id: int
    supplier_name: str
    product_info: str
    product_url: Optional[str] = None
    category: str
    quantity: int
    timeline: str
    location: str
    required_for: str

    class Config:
        orm_mode = True

# Define the model for the product data
class Product(BaseModel):
    asin: Optional[str] = None
    product_title: Optional[str] = None
    product_price: Optional[str] = None
    product_original_price: Optional[str] = None
    currency: Optional[str] = None
    product_star_rating: Optional[str] = None
    product_num_ratings: Optional[int] = None
    product_url: Optional[str] = None
    product_photo: Optional[str] = None
    product_num_offers: Optional[int] = None
    product_minimum_offer_price: Optional[str] = None
    is_best_seller: Optional[bool] = None
    is_amazon_choice: Optional[bool] = None
    is_prime: Optional[bool] = None
    climate_pledge_friendly: Optional[bool] = None
    sales_volume: Optional[str] = None
    delivery: Optional[str] = None
    has_variations: Optional[bool] = None

@app.get("/api/v1/search")
async def search_products(
    query: str = Query(..., min_length=2),
    page: int = Query(1, gt=0),
    sort_by: str = Query("RELEVANCE"),
    product_condition: str = Query("ALL"),
    is_prime: bool = Query(False)
):
    url = "https://real-time-amazon-data.p.rapidapi.com/search"
    querystring = {
        "query": query,
        "page": "1",
    }

    headers = {
        "x-rapidapi-key": VITE_AMAZON_API_KEY,  # Replace with your actual RapidAPI key
        "x-rapidapi-host": "real-time-amazon-data.p.rapidapi.com"
    }

    try:
        logger.info(f"Fetching products for query: '{query}' with page: {page}, sort_by: {sort_by}")
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=querystring, headers=headers)
            response.raise_for_status()  # Raise an error for HTTP request failures
            
            data = response.json()
            
            # Check if 'data' and 'products' are in the response data
            if 'data' not in data or 'products' not in data['data']:
                raise ValueError("Unexpected response format: 'data' or 'products' key not found")
            
            # Extract and transform the product data
            products = [
                Product(
                    asin=product['asin'],
                    product_title=product['product_title'],
                    product_price=product['product_price'],
                    product_original_price=product.get('product_original_price', ''),
                    currency=product['currency'],
                    product_star_rating=product['product_star_rating'],
                    product_num_ratings=product['product_num_ratings'],
                    product_url=product['product_url'],
                    product_photo=product['product_photo'],
                    product_num_offers=product['product_num_offers'],
                    product_minimum_offer_price=product['product_minimum_offer_price'],
                    is_best_seller=product['is_best_seller'],
                    is_amazon_choice=product['is_amazon_choice'],
                    is_prime=product['is_prime'],
                    climate_pledge_friendly=product['climate_pledge_friendly'],
                    sales_volume=product['sales_volume'],
                    delivery=product['delivery'],
                    has_variations=product['has_variations']
                )
                for product in data['data']['products']
            ]
            
            return {"products": products}
    
    except httpx.RequestError as exc:
        logger.error(f"Request error: {exc}")
        return {"error": f"An error occurred while requesting data: {exc}"}
    
    except httpx.HTTPStatusError as exc:
        logger.error(f"HTTP error: {exc}")
        return {"error": f"Error response {exc.response.status_code} while requesting data: {exc}"}
    
    except ValueError as exc:
        logger.error(f"Value error: {exc}")
        return {"error": f"Value error: {exc}"}

@app.post("/api/v1/submit")
async def submit_form(
    submission: FormSubmission,
    db: Session = Depends(get_db)
):
    try:
        # Create a new FormSubmissionDB instance
        db_submission = FormSubmissionDB(
            supplier_name=submission.supplierName,
            product_info=submission.productInfo,
            product_url=submission.productUrl,
            category=submission.category,
            quantity=submission.quantity,
            timeline=submission.timeline,
            location=submission.location,
            required_for=submission.requiredFor
        )
        
        # Add to the database
        db.add(db_submission)
        db.commit()
        db.refresh(db_submission)

        return {"message": "Form submission successful", "id": db_submission.id}
    except Exception as e:
        logger.error(f"Error saving form submission: {e}")
        db.rollback()
        return {"error": "An error occurred while saving the submission"}

# New endpoint to retrieve form submissions
@app.get("/api/v1/forms", response_model=List[FormSubmissionDBResponse])
async def get_form_submissions(db: Session = Depends(get_db)):
    try:
        form_submissions = db.query(FormSubmissionDB).all()
        return form_submissions
    except Exception as e:
        logger.error(f"Error retrieving form submissions: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while retrieving the submissions")
