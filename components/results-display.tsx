"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ResultsDisplayProps {
  results: {
    prediction: string
    confidence: number
    heatmapUrl?: string
  }
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState("results")

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "bg-green-500"
    if (confidence >= 70) return "bg-blue-500"
    if (confidence >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  const downloadReport = () => {
    const reportText = `
Breast Tumor Classification Report
---------------------------------
Date: ${new Date().toLocaleString()}
Prediction: ${results.prediction}
Confidence: ${results.confidence.toFixed(2)}%
    `

    const blob = new Blob([reportText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "tumor-classification-report.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Classification Results</span>
          <Button variant="outline" size="sm" onClick={downloadReport}>
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="heatmap" disabled={!results.heatmapUrl}>
              Heatmap
            </TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-4 pt-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">
                  {results.prediction === "Malignant" ? (
                    <span className="text-red-600">Malignant</span>
                  ) : (
                    <span className="text-green-600">Benign</span>
                  )}
                </h3>
                <p className="text-gray-600 mb-4">
                  The model has classified this histology slide as
                  <strong> {results.prediction.toLowerCase()} </strong>
                  with the following confidence:
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Confidence</span>
                    <span>{results.confidence.toFixed(2)}%</span>
                  </div>
                  <Progress value={results.confidence} className={getConfidenceColor(results.confidence)} />
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-md">
                  <h4 className="font-medium mb-2">What does this mean?</h4>
                  <p className="text-sm text-gray-600">
                    {results.prediction === "Malignant"
                      ? "A malignant classification suggests cancerous cells that can invade nearby tissues and spread to other parts of the body."
                      : "A benign classification suggests non-cancerous cells that do not invade nearby tissues or spread to other parts of the body."}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Note:</strong> This is an AI-assisted classification and should be confirmed by a medical
                    professional.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="heatmap" className="pt-4">
            {results.heatmapUrl ? (
              <div className="space-y-4">
                <p className="text-gray-600">
                  This heatmap highlights the regions of the image that most influenced the model's decision:
                </p>
                <div className="relative aspect-square max-w-md mx-auto">
                  <Image
                    src={results.heatmapUrl || "/placeholder.svg"}
                    alt="Classification heatmap"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Red areas indicate regions that strongly contributed to the classification.
                </p>
              </div>
            ) : (
              <p className="text-gray-600">Heatmap visualization is not available for this prediction.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
