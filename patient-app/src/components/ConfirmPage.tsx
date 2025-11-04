import React from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Home, Edit, CheckCircle, AlertTriangle } from "lucide-react";
import { PatientSummary } from "../App";

interface ConfirmPageProps {
  summary: PatientSummary;
  onGoHome: () => void;
  onEdit: () => void;
  onConfirm: () => void;
}

export function ConfirmPage({ summary, onGoHome, onEdit, onConfirm }: ConfirmPageProps) {
  const getSeverityColor = (severity: PatientSummary["severity"]) => {
    switch (severity) {
      case "Critical":
        return "bg-red-600 text-white";
      case "High":
        return "bg-orange-600 text-white";
      case "Medium":
        return "bg-yellow-600 text-white";
      default:
        return "bg-green-600 text-white";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center gap-4 shadow-sm">
        <Button onClick={onGoHome} variant="outline" className="gap-2">
          <Home className="w-4 h-4" />
          Home
        </Button>
        <h2 className="text-slate-800 font-medium">Confirm Your Information</h2>
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="max-w-3xl w-full p-8 space-y-6 shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-blue-700 font-semibold text-xl mb-2">Triage Summary</h1>
            <p className="text-slate-600">
              Please review the information below and confirm if it's accurate.
            </p>
          </div>

          {/* Severity */}
          <div className="flex justify-center mb-6">
            <Badge className={`text-lg px-6 py-3 ${getSeverityColor(summary.severity)}`}>
              {summary.severity === "Critical" && (
                <AlertTriangle className="w-5 h-5 mr-2" />
              )}
              Severity: {summary.severity}
            </Badge>
          </div>

          {/* Summary Sections */}
          <div className="space-y-6">
            {/* Symptoms */}
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-slate-700 mb-2 font-medium">Reported Symptoms</h3>
              <div className="flex flex-wrap gap-2">
                {summary.symptoms.map((symptom, i) => (
                  <Badge key={i} variant="outline" className="px-3 py-1">
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-slate-700 mb-2 font-medium">Symptom Duration</h3>
              <p className="text-slate-600">{summary.duration}</p>
            </div>

            {/* Risk Factors */}
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-slate-700 mb-2 font-medium">Risk Factors</h3>
              <div className="flex flex-wrap gap-2">
                {summary.riskFactors.map((factor, i) => (
                  <Badge key={i} variant="secondary" className="px-3 py-1">
                    {factor}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
            <Button onClick={onEdit} variant="outline" className="h-16 gap-2">
              <Edit className="w-5 h-5" />
              Edit Information
            </Button>
            <Button
              onClick={onConfirm}
              className="h-16 gap-2 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-5 h-5" />
              Confirm & Get Ticket
            </Button>
          </div>

          {/* Critical Notice */}
          {summary.severity === "Critical" && (
            <div className="mt-6 p-4 bg-red-100 border-2 border-red-300 rounded-lg">
              <p className="text-red-800 text-center font-medium">
                <AlertTriangle className="w-5 h-5 inline mr-2" />
                Your condition is critical. You will be seen immediately.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
