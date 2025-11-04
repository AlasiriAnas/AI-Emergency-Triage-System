import React from "react"; // ✅ Required for JSX runtime
import { useState } from "react";
import { DoctorDashboard } from "./components/DoctorDashboard";
import { PatientQueue } from "./components/PatientQueue";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import { Activity, Users, BarChart3 } from "lucide-react";

export default function App() {
  const [activeView, setActiveView] = useState<"dashboard" | "queue" | "analytics">("dashboard");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* View Toggle */}
      <div className="bg-white border-b border-gray-200 p-4 flex justify-center gap-4 shadow-sm">
        <Button
          variant={activeView === "dashboard" ? "default" : "outline"}
          onClick={() => setActiveView("dashboard")}
          className="min-w-40 gap-2"
        >
          <Activity className="w-4 h-4" />
          Doctor Dashboard
        </Button>
        <Button
          variant={activeView === "queue" ? "default" : "outline"}
          onClick={() => setActiveView("queue")}
          className="min-w-40 gap-2"
        >
          <Users className="w-4 h-4" />
          Patient Queue
        </Button>
        <Button
          variant={activeView === "analytics" ? "default" : "outline"}
          onClick={() => setActiveView("analytics")}
          className="min-w-40 gap-2"
        >
          <BarChart3 className="w-4 h-4" />
          Analytics
        </Button>
      </div>

      {/* Content */}
      <div className="bg-white min-h-[calc(100vh-73px)]">
        {activeView === "dashboard" && <DoctorDashboard />}
        {activeView === "queue" && <PatientQueue />}
        {activeView === "analytics" && <AnalyticsDashboard />}
      </div>
      
      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />
    </div>
  );
}
