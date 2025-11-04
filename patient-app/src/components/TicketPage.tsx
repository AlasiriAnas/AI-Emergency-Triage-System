import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Home, Printer, QrCode } from "lucide-react";
import { Ticket } from "../App";

interface TicketPageProps {
  ticket: Ticket;
  onGoHome: () => void;
}

export function TicketPage({ ticket, onGoHome }: TicketPageProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [autoReturnCountdown, setAutoReturnCountdown] = useState(30);

  // ✅ Auto trigger “need more time” dialog after 30 sec
  useEffect(() => {
    const timer = setTimeout(() => setShowDialog(true), 30000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Dialog countdown
  useEffect(() => {
    if (showDialog && countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showDialog && countdown === 0) {
      onGoHome();
    }
  }, [showDialog, countdown, onGoHome]);

  // ✅ Page auto-return countdown
  useEffect(() => {
    if (!showDialog && autoReturnCountdown > 0) {
      const timer = setTimeout(
        () => setAutoReturnCountdown((c) => c - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [showDialog, autoReturnCountdown]);

  const handlePrint = () => window.print();

  const handleStayLonger = () => {
    setShowDialog(false);
    setCountdown(10);
    setAutoReturnCountdown(30);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-50">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center gap-4 shadow-sm">
        <Button onClick={onGoHome} variant="outline" className="gap-2">
          <Home className="w-4 h-4" />
          Home
        </Button>
        <h2 className="text-slate-800 font-semibold text-lg">Your ER Ticket</h2>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="max-w-2xl w-full p-12 text-center space-y-8 shadow-lg">
          
          <div>
            <h1 className="text-green-600 font-bold text-xl mb-2">
              ✅ Ticket Issued
            </h1>
            <p className="text-slate-600">
              Please wait nearby. Medical staff will call your ticket by priority.
            </p>
          </div>

          {/* Ticket Box */}
          <div className="py-10 px-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl text-white shadow-xl">
            <p className="text-lg mb-2 opacity-80">Your Ticket Number</p>
            <div className="text-8xl tracking-wider font-extrabold mb-4">
              {ticket.number}
            </div>

            <div className="h-px bg-blue-400 my-4" />

            <p className="text-lg opacity-80">Estimated Wait Time</p>
            <p className="text-3xl mt-2 font-semibold">{ticket.estimatedWait}</p>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center py-6">
            <div className="w-40 h-40 bg-white border-4 border-slate-300 rounded-lg flex items-center justify-center">
              <QrCode className="w-28 h-28 text-slate-400" />
            </div>
            <p className="text-sm text-slate-500 mt-2">
              Scan to track your queue position
            </p>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <Button onClick={handlePrint} variant="outline" className="h-14 gap-2">
              <Printer className="w-5 h-5" />
              Print Ticket
            </Button>
            <Button
              onClick={onGoHome}
              className="h-14 gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Home className="w-5 h-5" />
              Home
            </Button>
          </div>

          {/* Countdown */}
          <p className="text-sm text-slate-400 pt-4">
            Returning home in {autoReturnCountdown} seconds…
          </p>
        </Card>
      </div>

      {/* More Time Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Need More Time?</DialogTitle>
            <DialogDescription>
              Returning to home in {countdown} seconds. Would you like to stay here?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button onClick={onGoHome} variant="outline">
              Go Home Now
            </Button>
            <Button
              onClick={handleStayLonger}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Stay Longer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
