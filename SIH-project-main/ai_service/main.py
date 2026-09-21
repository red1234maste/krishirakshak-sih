from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn
from pipeline import analyze_leaf_image

app = FastAPI(
    title="KrishiRakshak AI Crop Disease Detection Service",
    description="Microservice providing OpenCV image segmentation and CNN disease classification",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictPayload(BaseModel):
    crop_hint: Optional[str] = "Cotton"
    file_name: Optional[str] = "leaf.jpg"
    location: Optional[str] = "Pimpalgaon"

class RiskPayload(BaseModel):
    temperature: float = 28.0
    humidity: float = 85.0
    rainfall: float = 15.0
    leaf_wetness_hours: float = 8.0
    satellite_ndvi: float = 0.56
    crop: str = "Cotton"

@app.get("/")
def index():
    return {
        "service": "KrishiRakshak AI Service",
        "status": "ONLINE",
        "endpoints": ["/predict", "/predict-image", "/risk-score", "/health"]
    }

@app.get("/health")
def health():
    return {
        "status": "HEALTHY",
        "model": "KrishiRakshak-CNN-v2.1",
        "supported_crops": ["Cotton", "Soybean", "Tomato", "Wheat", "Rice"]
    }

@app.post("/predict")
def predict_json(payload: PredictPayload):
    result = analyze_leaf_image(
        crop_hint=payload.crop_hint,
        location=payload.location
    )
    return result

@app.post("/predict-image")
async def predict_image(
    file: UploadFile = File(...),
    crop_hint: str = Form("Cotton"),
    location: str = Form("Pimpalgaon")
):
    contents = await file.read()
    result = analyze_leaf_image(
        image_bytes=contents,
        crop_hint=crop_hint,
        location=location
    )
    return result

@app.post("/risk-score")
def calculate_risk(payload: RiskPayload):
    # Favorable weather formula
    humidity_factor = min(1.0, payload.humidity / 100.0) * 40
    wetness_factor = min(1.0, payload.leaf_wetness_hours / 10.0) * 30
    ndvi_stress = (1.0 - payload.satellite_ndvi) * 30
    total_score = round(humidity_factor + wetness_factor + ndvi_stress)
    total_score = max(5, min(99, total_score))

    risk_level = "HIGH" if total_score > 70 else ("MEDIUM" if total_score >= 40 else "LOW")

    return {
        "risk_score": total_score,
        "risk_level": risk_level,
        "factors": {
            "humidity_contribution": round(humidity_factor, 1),
            "leaf_wetness_contribution": round(wetness_factor, 1),
            "ndvi_stress_contribution": round(ndvi_stress, 1)
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
