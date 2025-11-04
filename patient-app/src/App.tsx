// src/App.tsx
import React, { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import { HomePage } from "./components/HomePage";
import { DiagnosePage } from "./components/DiagnosePage";
import { ConfirmPage } from "./components/ConfirmPage";
import { TicketPage } from "./components/TicketPage";

export type Page = "home" | "diagnose" | "confirm" | "ticket";

export interface ChatMessage {
  role: "ai" | "patient";
  content: string;
}

export interface PatientSummary {
  symptoms: string[];
  duration: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  riskFactors: string[];
  ticketNumber?: string;
  waitTime?: string;
}

export interface Ticket {
  number: string;
  estimatedWait: string;
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [patientSummary, setPatientSummary] = useState<PatientSummary | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setPage("home");
  };

  const handleComplete = (summary: PatientSummary) => {
    setPatientSummary(summary);
    setPage("confirm");
  };

  // ✅ Generate ticket immediately (Skip AI)
  const handleJustTicket = () => {
    const number = "T-" + Math.floor(Math.random() * 900 + 100); // T-123 format
    setTicket({
      number,
      estimatedWait: "10–30 minutes"
    });
    setPage("ticket");
  };

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {page === "home" && (
        <HomePage
          onStartDiagnose={() => {
            setChatHistory([]);
            setPage("diagnose");
          }}
          onJustTicket={handleJustTicket}
          onLogout={handleLogout}
        />
      )}

      {page === "diagnose" && (
        <DiagnosePage
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          onGoHome={() => setPage("home")}
          onComplete={handleComplete}
        />
      )}

      {page === "confirm" && patientSummary && (
        <ConfirmPage
          summary={patientSummary}
          onGoHome={() => setPage("home")}
          onEdit={() => setPage("diagnose")}
          onConfirm={() => {
            setTicket({
              number: patientSummary.ticketNumber || "T-000",
              estimatedWait: patientSummary.waitTime || "Unknown"
            });
            setPage("ticket");
          }}
        />
      )}

      {page === "ticket" && ticket && (
        <TicketPage ticket={ticket} onGoHome={() => setPage("home")} />
      )}
    </div>
  );
}
