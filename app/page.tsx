// app/page.tsx
"use client"

import { useState, useEffect } from "react"
import { ImageUploader } from "@/components/image-uploader"
import { HistoryLog, HistoryItem } from "@/components/history-log"
import { ModelInfo } from "@/components/mode-info"

export default function Home() {
  const [history, setHistory] = useState<HistoryItem[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("tumorClassifierHistory")
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  const addToHistory = (item: Omit<HistoryItem, "id" | "timestamp">) => {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
    }
    const updated = [newItem, ...history].slice(0, 10)
    setHistory(updated)
    localStorage.setItem("tumorClassifierHistory", JSON.stringify(updated))
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem("tumorClassifierHistory")
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Breast Tumor Classifier
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Upload a histology slide image to classify benign vs. malignant tumors
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ImageUploader addToHistory={addToHistory} />
          <HistoryLog history={history} clearHistory={clearHistory} />
        </div>

        <div className="mt-8">
          <ModelInfo />
        </div>
      </div>
    </main>
  )
}
