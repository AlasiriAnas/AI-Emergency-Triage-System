import { 
  Calendar, 
  FileText, 
  Activity, 
  AlertCircle,
  Pill,
  ClipboardList,
  User,
  Phone,
  MapPin,
  Clock
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

type Patient = {
  id: string;
  name: string;
  symptoms: string;
  severity: "Critical" | "Moderate" | "Stable";
  status: string;
  time: string;
  waitTime?: number;
};

type PatientHistory = {
  personalInfo: {
    age: number;
    gender: string;
    bloodType: string;
    phone: string;
    address: string;
  };
  allergies: string[];
  currentMedications: string[];
  chronicConditions: string[];
  previousVisits: Array<{
    date: string;
    reason: string;
    diagnosis: string;
    doctor: string;
  }>;
  vitalSigns: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    oxygenLevel: number;
  };
  notes: string;
};

// Mock data generator
const generatePatientHistory = (patient: Patient): PatientHistory => {
  return {
    personalInfo: {
      age: Math.floor(Math.random() * 50) + 20,
      gender: Math.random() > 0.5 ? "Male" : "Female",
      bloodType: ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"][Math.floor(Math.random() * 8)],
      phone: "+966 5" + Math.floor(Math.random() * 100000000),
      address: "Riyadh, Saudi Arabia",
    },
    allergies: 
      patient.severity === "Critical" 
        ? ["Penicillin", "Peanuts"] 
        : patient.severity === "Moderate"
        ? ["Aspirin"]
        : ["None"],
    currentMedications: 
      patient.severity === "Critical"
        ? ["Aspirin 100mg", "Lisinopril 10mg", "Metformin 500mg"]
        : patient.severity === "Moderate"
        ? ["Ibuprofen 200mg"]
        : ["None"],
    chronicConditions:
      patient.severity === "Critical"
        ? ["Hypertension", "Type 2 Diabetes"]
        : patient.severity === "Moderate"
        ? ["Asthma"]
        : ["None"],
    previousVisits: [
      {
        date: "Oct 15, 2024",
        reason: "Routine Checkup",
        diagnosis: "Healthy",
        doctor: "Dr. Sarah Ahmed",
      },
      {
        date: "Aug 22, 2024",
        reason: "Chest Pain",
        diagnosis: "Gastritis",
        doctor: "Dr. Omar Al Harbi",
      },
      {
        date: "May 10, 2024",
        reason: "Annual Physical",
        diagnosis: "Healthy",
        doctor: "Dr. Mohammed Ali",
      },
    ],
    vitalSigns: {
      bloodPressure: patient.severity === "Critical" ? "160/95" : "120/80",
      heartRate: patient.severity === "Critical" ? 110 : 75,
      temperature: patient.severity === "Critical" ? 38.5 : 37.0,
      oxygenLevel: patient.severity === "Critical" ? 92 : 98,
    },
    notes: "Patient is cooperative and following treatment plan. Last visit showed improvement in overall health.",
  };
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "Critical":
      return "bg-red-100 text-red-700 border-red-200";
    case "Moderate":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "Stable":
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

// Convert any Arabic numerals to English
const toEnglishNumber = (str: string | number): string => {
  if (typeof str === 'number') str = str.toString();
  return str.replace(/[\u0660-\u0669]/g, (c) =>
    (c.charCodeAt(0) - 0x0660).toString()
  );
};

interface PatientHistorySheetProps {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PatientHistorySheet({ patient, open, onOpenChange }: PatientHistorySheetProps) {
  if (!patient) return null;

  const history = generatePatientHistory(patient);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-2xl">{patient.name}</SheetTitle>
              <SheetDescription>Patient ID: {patient.id}</SheetDescription>
            </div>
            <Badge className={getSeverityColor(patient.severity)}>
              {patient.severity}
            </Badge>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Current Status */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm mb-1 text-blue-900">Current Visit</h4>
                <p className="text-sm text-blue-700">{patient.symptoms}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-blue-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {patient.time}
                  </span>
                  <span>Status: {patient.status}</span>
                  {patient.waitTime !== undefined && patient.waitTime > 0 && (
                    <span>Wait: {toEnglishNumber(patient.waitTime)}m</span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Personal Information */}
          <div>
            <h3 className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4" />
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600">Age</div>
                <div className="text-sm mt-1">{toEnglishNumber(history.personalInfo.age)} years</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600">Gender</div>
                <div className="text-sm mt-1">{history.personalInfo.gender}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600">Blood Type</div>
                <div className="text-sm mt-1">{history.personalInfo.bloodType}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600">Phone</div>
                <div className="text-sm mt-1">{toEnglishNumber(history.personalInfo.phone)}</div>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg mt-3">
              <div className="text-xs text-gray-600 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Address
              </div>
              <div className="text-sm mt-1">{history.personalInfo.address}</div>
            </div>
          </div>

          <Separator />

          {/* Vital Signs */}
          <div>
            <h3 className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4" />
              Vital Signs
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600">Blood Pressure</div>
                <div className="text-lg mt-1">{toEnglishNumber(history.vitalSigns.bloodPressure)}</div>
                <div className="text-xs text-gray-500">mmHg</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600">Heart Rate</div>
                <div className="text-lg mt-1">{toEnglishNumber(history.vitalSigns.heartRate)}</div>
                <div className="text-xs text-gray-500">bpm</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600">Temperature</div>
                <div className="text-lg mt-1">{toEnglishNumber(history.vitalSigns.temperature)}°C</div>
                <div className="text-xs text-gray-500">celsius</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600">Oxygen Level</div>
                <div className="text-lg mt-1">{toEnglishNumber(history.vitalSigns.oxygenLevel)}%</div>
                <div className="text-xs text-gray-500">SpO2</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tabs for Medical History */}
          <Tabs defaultValue="allergies" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="allergies">Allergies</TabsTrigger>
              <TabsTrigger value="medications">Medications</TabsTrigger>
              <TabsTrigger value="conditions">Conditions</TabsTrigger>
            </TabsList>

            <TabsContent value="allergies" className="mt-4">
              <div className="space-y-2">
                <h4 className="text-sm flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  Known Allergies
                </h4>
                {history.allergies.length > 0 && history.allergies[0] !== "None" ? (
                  <div className="flex flex-wrap gap-2">
                    {history.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No known allergies</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="medications" className="mt-4">
              <div className="space-y-2">
                <h4 className="text-sm flex items-center gap-2">
                  <Pill className="w-4 h-4" />
                  Current Medications
                </h4>
                {history.currentMedications.length > 0 && history.currentMedications[0] !== "None" ? (
                  <ul className="space-y-2">
                    {history.currentMedications.map((med, index) => (
                      <li key={index} className="text-sm p-2 bg-blue-50 rounded">
                        {med}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No current medications</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="conditions" className="mt-4">
              <div className="space-y-2">
                <h4 className="text-sm flex items-center gap-2">
                  <ClipboardList className="w-4 h-4" />
                  Chronic Conditions
                </h4>
                {history.chronicConditions.length > 0 && history.chronicConditions[0] !== "None" ? (
                  <div className="flex flex-wrap gap-2">
                    {history.chronicConditions.map((condition, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No chronic conditions</p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <Separator />

          {/* Previous Visits */}
          <div>
            <h3 className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4" />
              Previous Visits
            </h3>
            <div className="space-y-3">
              {history.previousVisits.map((visit, index) => (
                <Card key={index} className="p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm">{visit.reason}</div>
                    <div className="text-xs text-gray-500">{visit.date}</div>
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    Diagnosis: {visit.diagnosis}
                  </div>
                  <div className="text-xs text-gray-500">
                    Doctor: {visit.doctor}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4" />
              Medical Notes
            </h3>
            <Card className="p-4 bg-gray-50">
              <p className="text-sm text-gray-700">{history.notes}</p>
            </Card>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
