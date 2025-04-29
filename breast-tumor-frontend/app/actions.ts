// app/actions.ts
"use server"

interface PredictResult {
  prediction: string
  confidence: number
  heatmapUrl?: string
}

/**
 * Sends the uploaded image to the Python FastAPI backend for inference.
 * Expects a FormData containing a file under the key "image".
 * Returns an object with { prediction, confidence, heatmapUrl? }.
 */
export async function predictImage(formData: FormData): Promise<PredictResult> {
  const res = await fetch("http://localhost:8000/predict", {
    method: "POST",
    // No need for headers—browser will set multipart/form-data for FormData
    body: formData,
  })

  if (!res.ok) {
    // Try to parse error detail from FastAPI
    let detail = ""
    try {
      const errJson = await res.json()
      detail = errJson.detail || JSON.stringify(errJson)
    } catch {
      detail = res.statusText
    }
    throw new Error(`Prediction failed: ${detail}`)
  }

  // Should be { prediction: string; confidence: number; heatmapUrl?: string }
  const result = (await res.json()) as PredictResult
  return result
}
