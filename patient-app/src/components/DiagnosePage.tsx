import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Home, Mic, Send, Square } from "lucide-react";
import { ChatMessage, PatientSummary } from "../App";

interface DiagnosePageProps {
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onGoHome: () => void;
  onComplete: (summary: PatientSummary) => void;
}

export function DiagnosePage({
  chatHistory,
  setChatHistory,
  onGoHome,
  onComplete,
}: DiagnosePageProps) {
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isHoldingMic, setIsHoldingMic] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // ✅ Auto-greeting
  useEffect(() => {
    if (chatHistory.length === 0) {
      setChatHistory([
        {
          role: "ai",
          content:
            "Hello! Please describe your symptoms.",
        },
      ]);
    }
  }, []);

  // ✅ Send message
  const handleSendMessage = (msg: string) => {
    if (!msg.trim()) return;

    setChatHistory((prev) => [...prev, { role: "patient", content: msg }]);
    setInputText("");

    setTimeout(() => {
      const reply = AIreply();
      setChatHistory((prev) => [...prev, { role: "ai", content: reply }]);
    }, 600);
  };

  // ✅ Dummy AI logic for now
  const AIreply = () => {
    const patientMsgs = chatHistory.filter((m) => m.role === "patient");
    const count = patientMsgs.length;

    if (count === 0) return "Can you describe the pain?";
    if (count === 1) return "Is it sharp, dull, or burning?";
    if (count === 2) return "Is the pain constant or does it come and go?";
    if (count === 3) return "Does the pain radiate anywhere?";

    setTimeout(() => {
      onComplete({
        symptoms: ["Chest pain"],
        duration: "Unknown",
        severity: "High",
        riskFactors: [],
        ticketNumber: "A1001",
        waitTime: "5–15 minutes",
      });
    }, 800);

    return "Thank you. A clinician will review you shortly.";
  };

  // ✅ Mic logic
  const handleMicPress = () => {
    setIsHoldingMic(true);
    setIsRecording(true);
  };

  const handleMicRelease = () => {
    setIsHoldingMic(false);
    setIsRecording(false);

    setTimeout(() => {
      handleSendMessage("I have chest pain and dizziness");
    }, 400);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setTimeout(() => {
        handleSendMessage("The pain started 2 hours ago");
      }, 400);
    } else {
      setIsRecording(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center gap-4 shadow-sm">
        <Button onClick={onGoHome} variant="outline" className="gap-2">
          <Home className="w-4 h-4" />
          Home
        </Button>
        <h2 className="text-slate-800">AI Triage Assessment</h2>
      </div>

      {/* ✅ Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        
        {/* ✅ Chat window */}
        <Card className="lg:col-span-2 p-6 flex flex-col h-[calc(100vh-200px)]">
          <div className="flex-1 overflow-y-auto space-y-4 mb-3">
            {chatHistory.map((m, i) => (
              <div key={i} className={`flex ${m.role === "patient" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-4 rounded-lg ${
                  m.role === "patient"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-800"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* ✅ Text input always shown */}
          <div className="border-t border-slate-200 pt-4 flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
              placeholder="Describe your symptoms..."
              className="flex-1"
            />
            <Button className="bg-blue-600" onClick={() => handleSendMessage(inputText)}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* ✅ Controls */}
        <Card className="p-6 flex flex-col gap-4 h-fit">
          <h3 className="text-slate-800 mb-2">Input Controls</h3>

          {/* Hold to talk */}
          <div>
            <p className="text-sm text-slate-600">Hold to talk</p>
            <Button
              onMouseDown={handleMicPress}
              onMouseUp={handleMicRelease}
              onTouchStart={handleMicPress}
              onTouchEnd={handleMicRelease}
              className={`w-full h-20 ${isHoldingMic ? "bg-red-600" : "bg-blue-600"}`}
            >
              <Mic className="w-8 h-8" />
            </Button>
          </div>

          {/* Continuous recording */}
          <div>
            <p className="text-sm text-slate-600">Continuous Recording</p>
            <Button
              onClick={toggleRecording}
              className={`w-full h-16 ${isRecording ? "bg-red-600" : "bg-slate-600"}`}
            >
              {isRecording ? <Square className="w-5 h-5 mr-2" /> : <Mic className="w-5 h-5 mr-2" />}
              {isRecording ? "Stop" : "Start"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
