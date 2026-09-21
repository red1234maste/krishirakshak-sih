# KrishiRakshak — AI-Powered, Smartphone-Independent Crop Disease & Pest Early Warning System

**SIH 2026 Problem Statement SIH26131:** *"Early detection and management of crop diseases and pest infestations"* (Theme: Agriculture, FoodTech & Rural Development).

---

## 🌾 Core Philosophy: "Smartphone is Optional, Not a Requirement"

The intelligence layer (Deep Learning CNN, OpenCV lesion segmentation, GIS Leaflet mapping, weather telemetry, satellite NDVI analytics) is decoupled from the access layer (Interactive Voice Response IVR, Missed-Call callback, localized SMS broadcast, Agri Mitra CSC centers, and Progressive Web App).

---

## 📞 Toll-Free Kisan Suraksha Helpline (24x7)
```
Kisan Suraksha Helpline: 1800-180-1551 (Toll-Free, 24x7)
```
- Available in **Hindi (हिन्दी)**, **Marathi (मराठी)**, and **English**.
- Prominently embedded on all landing pages, SMS alert templates, IVR prompts, Agri Mitra portals, and advisory cards.
- Configurable globally from the Admin Settings Dashboard.

---

## 🚀 Architecture & Tech Stack

```
Farmer (IVR / Missed Call / SMS / Agri Mitra CSC / Web)
       │
       ▼
Node.js Express REST API (Port 5000)
 ├── 13 Collections (Users, Farmers, Farms, Villages, Crops, Disease Reports, Alerts, SMS Logs, IVR Calls, etc.)
 ├── Early-Warning Multi-Factor Risk Engine (0-100%)
 ├── Pluggable Multilingual SMS & Voice Adapter
 └── IVR State Machine
       │
       ▼
Python FastAPI AI Microservice (Port 8000)
 ├── OpenCV Image Segmentation (Contour count, Lesion area %, Chlorosis index)
 └── CNN Crop Disease Classifier (Cotton, Soybean, Tomato, Wheat, Rice)
       │
       ▼
Officer Verification & Human-in-the-Loop Protocol
 └── Certified Agriculture Officer reviews AI finding -> Confirms/Overrides -> Dispatches Prescription
```

- **Frontend:** React 18, Tailwind CSS, Leaflet + React-Leaflet (GIS map), Recharts (outbreak analytics), `react-i18next` (tri-lingual UI).
- **Backend:** Node.js, Express, JWT auth, Multer, Resilient 13-collection data store with seed datasets.
- **AI Microservice:** Python 3.11, FastAPI, Uvicorn, Pillow, NumPy, OpenCV telemetry.

---

## 🛠️ Quick Start & Running the Prototype

### 1. Install Dependencies
```bash
# Backend dependencies
cd server
npm install

# Frontend dependencies
cd ../client
npm install

# AI Service dependencies
cd ../ai_service
pip install -r requirements.txt
```

### 2. Start Services
Open 3 terminal windows (or run concurrently):

**Terminal 1 (Backend API - Port 5000):**
```bash
cd server
node server.js
```

**Terminal 2 (AI Microservice - Port 8000):**
```bash
cd ai_service
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

**Terminal 3 (React Client - Port 3000):**
```bash
cd client
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

---

## 🧑‍🌾 1-Click Demo Evaluation Roles

The top navbar includes a **1-Click Role Switcher** for instant testing:
1. **🌾 Farmer (Ramesh Patil):** View crop health, live risk score, voice advisory, recent SMS alerts, symptom reporter.
2. **🤝 Agri Mitra / CSC (Kavita Shinde):** Register offline farmers without smartphones, submit field observations.
3. **👔 Agriculture Officer (Dr. Rajeshwar Verma):** Review pending AI diagnoses, approve prescriptions, trigger emergency village broadcasts.
4. **⚙️ Admin:** Configure global helpline number, inspect SMS logs, reset database.

---

## 🛡️ Safety Principle
> AI predictions are explicitly watermarked as **"AI PREDICTION — PENDING AGRICULTURE OFFICER VERIFICATION"**. No chemical recommendations are sent to farmers without expert review or consultation via Toll-Free Helpline **1800-180-1551**.
