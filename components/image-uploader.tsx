// components/image-uploader.tsx
"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { predictImage } from "@/app/actions"
import { HistoryItem } from "./history-log"
import { ResultsDisplay } from "./results-display"

interface ImageUploaderProps {
  addToHistory: (item: Omit<HistoryItem, "id" | "timestamp">) => void
}

export function ImageUploader({ addToHistory }: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<{
    prediction: string
    confidence: number
    heatmapUrl?: string
  } | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.match("image.*")) {
      alert("Please upload an image file (JPEG, PNG)")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB")
      return
    }
    setFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
    setResults(null)
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    setResults(null)
  }

  const handlePredict = async () => {
    if (!file) return
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("image", file)
      const result = await predictImage(formData)
      setResults(result)
      addToHistory({
        filename: file.name,
        prediction: result.prediction,
        confidence: result.confidence,
      })
    } catch (error) {
      console.error("Prediction error:", error)
      alert("Error processing the image. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center justify-center">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900">
              Drag and drop your histology slide image
            </p>
            <p className="mt-1 text-sm text-gray-500">
              or click to browse (JPEG, PNG up to 5MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="p-4 flex-1">
              <div className="relative">
                <div className="aspect-square relative overflow-hidden rounded-md">
                  <Image src={preview!} alt="Preview" fill className="object-cover" />
                </div>
                <button
                  onClick={clearFile}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500 truncate">{file.name}</p>
            </Card>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Image Details</h3>
                <dl className="mt-2 text-sm text-gray-500">
                  <div className="mt-1">
                    <dt className="inline font-medium">File name: </dt>
                    <dd className="inline">{file.name}</dd>
                  </div>
                  <div className="mt-1">
                    <dt className="inline font-medium">File size: </dt>
                    <dd className="inline">{(file.size / 1024).toFixed(2)} KB</dd>
                  </div>
                  <div className="mt-1">
                    <dt className="inline font-medium">File type: </dt>
                    <dd className="inline">{file.type}</dd>
                  </div>
                </dl>
              </div>

              <Button onClick={handlePredict} disabled={isLoading} className="mt-4 w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Predict"
                )}
              </Button>
            </div>
          </div>

          {results && <ResultsDisplay results={results} />}
        </div>
      )}
    </div>
  )
}
