import React from "react";
import { MessageSquare, Ticket, LogOut } from "lucide-react";

interface HomePageProps {
  onStartDiagnose: () => void;
  onJustTicket: () => void;
  onLogout: () => void;
}

export function HomePage({ onStartDiagnose, onJustTicket, onLogout }: HomePageProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[linear-gradient(to_bottom_right,#f4f8ff,#eef2f6)] p-8">

      {/* Header */}
      <div className="w-full flex justify-between items-center mb-10">
        <h1 className="text-lg font-semibold text-blue-700">
          AI Emergency Triage Assistant
        </h1>

        <button
          onClick={onLogout}
          className="px-4 py-2 border border-red-500 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold mb-12 text-center">
        Welcome! Select an option to begin.
      </h2>

      {/* Cards Row (INLINE STYLES FORCE THE SPACING & LAYOUT) */}
      <div
        className="w-full"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "28px",            // <-- hard space between cards
          flexWrap: "nowrap",
        }}
      >
        {/* Diagnose Card */}
        <div
          onClick={onStartDiagnose}
          className="cursor-pointer rounded-2xl shadow-lg flex flex-col items-center justify-center select-none
                     text-white transition-transform hover:scale-105"
          style={{
            width: "260px",
            height: "260px",
            minWidth: "260px",
            minHeight: "260px",
            backgroundColor: "#2563eb", // blue-600 (inline to beat theme)
          }}
        >
          <MessageSquare className="w-10 h-10 opacity-90" />
          <div className="text-2xl font-bold mt-3">Diagnose</div>
          <div className="text-sm opacity-90 mt-1">Start AI-assisted triage</div>
        </div>

        {/* Just Ticket Card */}
        <div
          onClick={onJustTicket}
          className="cursor-pointer rounded-2xl shadow-lg flex flex-col items-center justify-center select-none
                     text-white transition-transform hover:scale-105"
          style={{
            width: "260px",
            height: "260px",
            minWidth: "260px",
            minHeight: "260px",
            backgroundColor: "#475569", // slate-600 (solid gray)
          }}
        >
          <Ticket className="w-10 h-10 opacity-90" />
          <div className="text-2xl font-bold mt-3">Just Ticket</div>
          <div className="text-sm opacity-90 mt-1">Skip triage — get queue number</div>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-12 text-sm text-gray-500 text-center">
        If you are experiencing a life-threatening emergency, alert staff immediately.
      </p>
    </div>
  );
}
