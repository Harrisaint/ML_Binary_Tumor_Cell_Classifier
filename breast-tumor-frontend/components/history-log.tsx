// components/history-log.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export interface HistoryItem {
  id: string
  filename: string
  timestamp: string
  prediction: string
  confidence: number
}

interface HistoryLogProps {
  history: HistoryItem[]
  clearHistory: () => void
}

export function HistoryLog({ history, clearHistory }: HistoryLogProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Session History</CardTitle>
        {history.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearHistory}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            Your session history will appear here
          </p>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
              >
                <div>
                  <p className="font-medium truncate max-w-[200px]">
                    {item.filename}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.timestamp}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={
                      item.prediction === "Malignant"
                        ? "text-red-600 font-medium"
                        : "text-green-600 font-medium"
                    }
                  >
                    {item.prediction}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.confidence.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
