import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function ModelInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Architecture</h3>
            <p className="text-sm text-gray-600">MobileNetV2 (fine-tuned)</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium">Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm font-medium">Accuracy</p>
                <p className="text-2xl font-bold">92.7%</p>
              </div>
              <div>
                <p className="text-sm font-medium">AUC</p>
                <p className="text-2xl font-bold">0.95</p>
              </div>
              <div>
                <p className="text-sm font-medium">Sensitivity</p>
                <p className="text-2xl font-bold">91.3%</p>
              </div>
              <div>
                <p className="text-sm font-medium">Specificity</p>
                <p className="text-2xl font-bold">94.1%</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium">Dataset</h3>
            <p className="text-sm text-gray-600">
              Trained on BreakHis dataset containing 7,909 histopathological images of breast tumor tissue
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium">Last Updated</h3>
            <p className="text-sm text-gray-600">April 28, 2025</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-md mt-4">
            <p className="text-sm text-blue-800">
              <strong>Disclaimer:</strong> This tool is for research and educational purposes only. It is not intended
              to be a substitute for professional medical advice, diagnosis, or treatment.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
