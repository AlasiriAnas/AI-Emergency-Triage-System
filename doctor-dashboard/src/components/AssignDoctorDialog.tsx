import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";

type Patient = {
  id: string;
  name: string;
  symptoms: string;
  severity: "Critical" | "Moderate" | "Stable";
  status: string;
  time: string;
  waitTime?: number;
};

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  available: boolean;
  currentPatients: number;
};

interface AssignDoctorDialogProps {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (patientId: string, doctorId: string) => void;
}

// Convert any Arabic numerals to English
const toEnglishNumber = (str: string | number): string => {
  if (typeof str === 'number') str = str.toString();
  return str.replace(/[\u0660-\u0669]/g, (c) =>
    (c.charCodeAt(0) - 0x0660).toString()
  );
};

const availableDoctors: Doctor[] = [
  {
    id: "DOC-001",
    name: "Dr. Sarah Ahmed",
    specialty: "Emergency Medicine",
    available: true,
    currentPatients: 2,
  },
  {
    id: "DOC-002",
    name: "Dr. Omar Al Harbi",
    specialty: "Cardiology",
    available: true,
    currentPatients: 3,
  },
  {
    id: "DOC-003",
    name: "Dr. Layla Hassan",
    specialty: "Pediatrics",
    available: true,
    currentPatients: 1,
  },
  {
    id: "DOC-004",
    name: "Dr. Mohammed Ali",
    specialty: "Orthopedics",
    available: false,
    currentPatients: 5,
  },
  {
    id: "DOC-005",
    name: "Dr. Fatima Khalil",
    specialty: "Internal Medicine",
    available: true,
    currentPatients: 2,
  },
];

export function AssignDoctorDialog({
  patient,
  open,
  onOpenChange,
  onAssign,
}: AssignDoctorDialogProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");

  if (!patient) return null;

  const handleAssign = () => {
    if (selectedDoctor) {
      onAssign(patient.id, selectedDoctor);
      onOpenChange(false);
      setSelectedDoctor("");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Assign Doctor</DialogTitle>
          <DialogDescription>
            Assign a doctor to patient {patient.name} ({patient.id})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Patient Info */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm mb-1">Patient Information</div>
            <div className="text-xs text-gray-600">{patient.symptoms}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant={
                  patient.severity === "Critical"
                    ? "destructive"
                    : "secondary"
                }
              >
                {patient.severity}
              </Badge>
              <span className="text-xs text-gray-500">{patient.status}</span>
            </div>
          </div>

          {/* Doctor Selection */}
          <div className="space-y-3">
            <Label>Select Doctor</Label>
            <div className="space-y-2">
              {availableDoctors.map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() => setSelectedDoctor(doctor.id)}
                  disabled={!doctor.available}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedDoctor === doctor.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  } ${!doctor.available ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-600 text-white">
                        {getInitials(doctor.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{doctor.name}</span>
                        {doctor.available ? (
                          <Badge
                            variant="outline"
                            className="text-xs bg-green-50 text-green-700 border-green-200"
                          >
                            Available
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-xs bg-red-50 text-red-700 border-red-200"
                          >
                            Busy
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {doctor.specialty}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Current Patients: {toEnglishNumber(doctor.currentPatients)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!selectedDoctor}>
            Assign Doctor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
