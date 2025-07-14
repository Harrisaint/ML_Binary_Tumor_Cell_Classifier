# ML Binary Tumor Cell Classifier

## 1. Project Overview

This project is a machine learning application designed to classify breast tumor cell images as benign or malignant. It leverages deep learning models, data augmentation, and transfer learning to improve classification accuracy. The project includes a web-based frontend for image upload and result visualization, and a backend for model inference.

**Primary Features:**
- **Home Screen (Dashboard):**
  - Upload breast tumor cell images for classification
  - View summary statistics and recent results
- **Results Display:**
  - Visualize model predictions (benign/malignant)
  - Display confidence scores
- **History Log:**
  - View previous classification results
- **Model Info:**
  - Display information about the model and its performance

---

## 2. Tech Stack

- **Frontend:**
  - Next.js (React framework)
  - TypeScript
  - TailwindCSS
- **Backend:**
  - Python (Flask or FastAPI, served via `serve_model.py`)
- **Machine Learning:**
  - TensorFlow / Keras
  - MobileNet (transfer learning)
- **Dev Tools:**
  - ESLint, Prettier (frontend)
  - Docker (optional, for containerization)

---

## 3. Development Environment Setup

### 🔧 Prerequisites
- **Node.js:** v16.x or higher
- **Python:** 3.8 or higher
- **pip** (Python package manager)
- **(Optional) Docker**

### 📦 Backend Setup

```bash
cd backend
# Create and activate a virtual environment (recommended)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
# Run the FastAPI server
python serve_model.py
```

### 💻 Frontend Setup

```bash
cd breast-tumor-frontend
npm install
npm run dev
```

---

## 4. Running the Application

- **Frontend:** Runs on [http://localhost:3000](http://localhost:3000)
- **Backend:** Typically runs on [http://localhost:5000](http://localhost:5000) (check `serve_model.py`)
- The frontend communicates with the backend for model inference. Ensure both are running.

---

## 5. API Endpoints

The backend exposes endpoints for model inference:

- **POST /predict**
  - Description: Classify an uploaded image as benign or malignant
  - Input: Image file (multipart/form-data)
  - Output: JSON with prediction and confidence score

---

## 6. Data Models / ML Details

- **Model:** MobileNet (with transfer learning)
- **Training Scripts:**
  - `model_with_data_augmentation.py`: Model training with data augmentation
  - `model_with_finetuning_dataaugmentation.py`: Model training with fine-tuning and data augmentation
  - `train_breakhis_mobilenet.py`: Training on the BreakHis dataset
- **Input:** Breast tumor cell images (e.g., from BreakHis dataset)
- **Output:** Binary classification (benign/malignant)

---

## 7. Troubleshooting

- **Backend not running:** Ensure Python dependencies are installed and the correct port is used.
- **Frontend cannot connect to backend:** Check backend URL in frontend code and CORS settings.
- **Model not found:** Ensure the trained model file is present in the expected location.
- **Resetting environment:**
  - Reinstall dependencies
  - Restart both frontend and backend

---

## 8. Contributing

- **Branching Strategy:**
  - `main`: Production-ready code
  - `dev` or feature branches: For new features or experiments
- **Linting & Formatting:**
  - Run `npm run lint` and `npm run format` in the frontend before submitting PRs
- **Submitting a PR:**
  1. Fork the repo and create your feature branch
  2. Commit your changes with clear messages
  3. Push to your fork and open a Pull Request against `main`
  4. Request review from a maintainer
- **Contact:**
  - For questions or approvals, contact the project maintainers

---

Feel free to expand this README as the project evolves!
