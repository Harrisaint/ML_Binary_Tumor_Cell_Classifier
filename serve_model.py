# serve_model.py
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from PIL import Image
import io

# 1) Load your saved model once at startup
MODEL_PATH = "breakhis_mobilenet_finetuned_model.keras"
model = tf.keras.models.load_model(MODEL_PATH)
model.make_predict_function()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in production, lock this down to your frontend origin
    allow_methods=["POST"],
    allow_headers=["*"],
)

def preprocess_image(data: bytes, target_size=(224, 224)) -> np.ndarray:
    img = Image.open(io.BytesIO(data)).convert("RGB")
    img = img.resize(target_size)
    arr = np.array(img)
    arr = preprocess_input(arr)
    return np.expand_dims(arr, 0)

@app.post("/predict")
async def predict(image_file: UploadFile = File(...)):
    # 2) Read & preprocess
    data = await image_file.read()
    try:
        input_arr = preprocess_image(data)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image")
    
    # 3) Run inference
    prob = float(model.predict(input_arr)[0][0])
    label = "Malignant" if prob > 0.5 else "Benign"
    confidence = round(prob * 100, 2)
    
    # 4) Return JSON
    return {"prediction": label, "confidence": confidence}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
