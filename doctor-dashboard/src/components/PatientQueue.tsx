import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import {
  Search,
  List,
  Grid,
  MoreVertical,
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Download,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner@2.0.3";
import { NotificationCenter } from "./NotificationCenter";
import { PatientHistorySheet } from "./PatientHistorySheet";
import { PatientEditDialog } from "./PatientEditDialog";
import { AssignDoctorDialog } from "./AssignDoctorDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

type Patient = {
  id: string;
  name: string;
  symptoms: string;
  severity: "Critical" | "Moderate" | "Stable";
  status: string;
  time: string;
  waitTime?: number;
};

const initialPatientsData: Patient[] = [
  {
    id: "FIG-123",
    name: "Ahmed",
    symptoms: "Chest Pain, Dizziness",
    severity: "Critical",
    status: "In Treatment",
    time: "10:30 AM",
    waitTime: 5,
  },
  {
    id: "FIG-124",
    name: "Fatima",
    symptoms: "Chest Pain, Dizziness",
    severity: "Moderate",
    status: "Waiting Doctor",
    time: "11:10 AM",
    waitTime: 15,
  },
  {
    id: "FIG-125",
    name: "Mohammed",
    symptoms: "Chest Pain, Dizziness",
    severity: "Stable",
    status: "Discharged",
    time: "12:45 PM",
    waitTime: 0,
  },
  {
    id: "FIG-126",
    name: "Sarah",
    symptoms: "Fever, Headache",
    severity: "Moderate",
    status: "Waiting Doctor",
    time: "01:15 PM",
    waitTime: 8,
  },
  {
    id: "FIG-127",
    name: "Ali",
    symptoms: "Broken Arm",
    severity: "Critical",
    status: "In Treatment",
    time: "02:00 PM",
    waitTime: 2,
  },
];

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Patients", active: false },
  { icon: FileText, label: "Reports", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const getSeverityStyle = (severity: string) => {
  switch (severity) {
    case "Critical":
      return { bg: "#FFEBEE", text: "#D32F2F" };
    case "Moderate":
      return { bg: "#FFF4E5", text: "#F57C00" };
    case "Stable":
      return { bg: "#E8F5E9", text: "#388E3C" };
    default:
      return { bg: "#F5F5F5", text: "#666666" };
  }
};

// Convert any Arabic numerals to English
const toEnglishNumber = (str: string | number): string => {
  if (typeof str === 'number') str = str.toString();
  return str.replace(/[\u0660-\u0669]/g, (c) =>
    (c.charCodeAt(0) - 0x0660).toString()
  );
};

export function PatientQueue() {
  const [patientsData, setPatientsData] = useState<Patient[]>(
    initialPatientsData,
  );
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [notifications, setNotifications] = useState<string[]>(
    [],
  );
  const [selectedPatient, setSelectedPatient] =
    useState<Patient | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isDischargeOpen, setIsDischargeOpen] = useState(false);

  // Real-time Updates Simulation
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setPatientsData((prev) => {
        const newPatients = [...prev];

        // Random chance to add new critical patient
        if (Math.random() > 0.85) {
          const names = [
            "Omar",
            "Layla",
            "Hassan",
            "Nora",
            "Khalid",
          ];
          const symptoms = [
            "Severe Headache",
            "Breathing Difficulty",
            "High Fever",
            "Cardiac Arrest",
            "Trauma",
          ];

          const newPatient: Patient = {
            id: `FIG-${Math.floor(Math.random() * 9000) + 1000}`,
            name: names[
              Math.floor(Math.random() * names.length)
            ],
            symptoms:
              symptoms[
                Math.floor(Math.random() * symptoms.length)
              ],
            severity:
              Math.random() > 0.7 ? "Critical" : "Moderate",
            status: "Waiting Doctor",
            time: toEnglishNumber(
              new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })
            ),
            waitTime: 0,
          };

          if (newPatient.severity === "Critical") {
            toast.error("🚨 Critical Emergency!", {
              description: `New patient: ${newPatient.name} - ${newPatient.symptoms}`,
              duration: 8000,
              action: {
                label: "View",
                onClick: () => console.log("View patient"),
              },
            });

            setNotifications((prev) => [
              ...prev,
              `Critical: ${newPatient.name}`,
            ]);
          }

          newPatients.unshift(newPatient);
        }

        // Update wait times and statuses
        return newPatients.map((patient) => {
          if (
            patient.status === "Waiting Doctor" &&
            patient.waitTime !== undefined
          ) {
            const newWaitTime = patient.waitTime + 1;

            // Alert if wait time exceeds threshold
            if (
              newWaitTime === 20 &&
              patient.severity === "Critical"
            ) {
              toast.warning("⚠️ Warning: Long Wait Time", {
                description: `${patient.name} has been waiting for ${newWaitTime} minutes`,
                duration: 6000,
              });
            }

            return { ...patient, waitTime: newWaitTime };
          }

          // Random chance to update status
          if (
            Math.random() > 0.95 &&
            patient.status === "Waiting Doctor"
          ) {
            toast.info("✅ Status Updated", {
              description: `${patient.name} is now in treatment`,
              duration: 3000,
            });
            return { ...patient, status: "In Treatment" };
          }

          if (
            Math.random() > 0.98 &&
            patient.status === "In Treatment"
          ) {
            toast.success("🎉 Discharged", {
              description: `${patient.name} has been discharged from hospital`,
              duration: 3000,
            });
            return {
              ...patient,
              status: "Discharged",
              waitTime: 0,
            };
          }

          return patient;
        });
      });

      setLastUpdate(new Date());
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  // Export to PDF
  const handleExportPDF = () => {
    toast.info("📄 Exporting Patient Queue...", {
      description: "PDF will be downloaded shortly",
    });

    setTimeout(() => {
      window.print();
      toast.success("✅ Export Successful", {
        description: "Print window opened",
      });
    }, 1000);
  };

  // Filter patients
  const filteredPatients = patientsData.filter((patient) => {
    const matchesSeverity =
      filterSeverity === "all" ||
      patient.severity.toLowerCase() === filterSeverity;
    const matchesSearch =
      patient.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      patient.id
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      patient.symptoms
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const criticalCount = patientsData.filter(
    (p) =>
      p.severity === "Critical" && p.status !== "Discharged",
  ).length;
  const waitingCount = patientsData.filter(
    (p) => p.status === "Waiting Doctor",
  ).length;

  // Handle patient actions
  const handleEditPatient = (updatedPatient: Patient) => {
    setPatientsData((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
    toast.success("✅ Patient Updated", {
      description: `${updatedPatient.name}'s information has been updated`,
    });
  };

  const handleAssignDoctor = (patientId: string, doctorId: string) => {
    setPatientsData((prev) =>
      prev.map((p) =>
        p.id === patientId ? { ...p, status: "In Treatment" } : p
      )
    );
    const patient = patientsData.find((p) => p.id === patientId);
    toast.success("✅ Doctor Assigned", {
      description: `Doctor has been assigned to ${patient?.name}`,
    });
  };

  const handleDischargePatient = () => {
    if (selectedPatient) {
      setPatientsData((prev) =>
        prev.map((p) =>
          p.id === selectedPatient.id
            ? { ...p, status: "Discharged", waitTime: 0 }
            : p
        )
      );
      toast.success("✅ Patient Discharged", {
        description: `${selectedPatient.name} has been marked as discharged`,
      });
      setIsDischargeOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h1>Patient Queue</h1>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-200">
                <div
                  className={`w-2 h-2 rounded-full ${isLive ? "bg-blue-500 animate-pulse" : "bg-gray-400"}`}
                />
                <span className="text-xs text-blue-700">
                  {isLive ? "Live Updates" : "Paused"}
                </span>
              </div>
              <button
                onClick={() => setIsLive(!isLive)}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                {isLive ? "Pause" : "Resume"}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">
                Last updated:{" "}
                {toEnglishNumber(lastUpdate.toLocaleTimeString("en-US"))}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
              <NotificationCenter />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search tickets..."
                  className="pl-10 h-10 bg-gray-50 border-gray-200"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                />
              </div>
              <Select
                value={filterSeverity}
                onValueChange={setFilterSeverity}
              >
                <SelectTrigger className="w-48 h-10 bg-gray-50">
                  <SelectValue placeholder="Filter by Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All Severities
                  </SelectItem>
                  <SelectItem value="critical">
                    Critical
                  </SelectItem>
                  <SelectItem value="moderate">
                    Moderate
                  </SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Alert for Critical Cases */}
        {criticalCount > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div className="flex-1">
              <div className="text-sm text-red-900">
                Alert: There are {criticalCount} critical case
                {criticalCount > 1 ? "s" : ""} requiring
                immediate attention
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <Card
          className="shadow-sm border-gray-100"
          style={{ borderRadius: "16px" }}
        >
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8F8F8]">
                  <th className="text-left py-3 px-4 text-xs text-gray-700">
                    ID
                  </th>
                  <th className="text-left py-3 px-4 text-xs text-gray-700">
                    Patient Name
                  </th>
                  <th className="text-left py-3 px-4 text-xs text-gray-700">
                    Symptoms
                  </th>
                  <th className="text-left py-3 px-4 text-xs text-gray-700">
                    Severity
                  </th>
                  <th className="text-left py-3 px-4 text-xs text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs text-gray-700">
                    Time
                  </th>
                  <th className="text-left py-3 px-4 text-xs text-gray-700">
                    Wait
                  </th>
                  <th className="text-left py-3 px-4 text-xs text-gray-700"></th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient, index) => {
                  const severityStyle = getSeverityStyle(
                    patient.severity,
                  );
                  return (
                    <tr
                      key={patient.id}
                      className="border-t border-[#E5E5E5] hover:bg-[#F5F5F5] transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {patient.id}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {patient.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {patient.symptoms}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className="inline-block px-2.5 py-1 text-xs"
                          style={{
                            backgroundColor: severityStyle.bg,
                            color: severityStyle.text,
                            borderRadius: "6px",
                          }}
                        >
                          {patient.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {patient.status}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {patient.time}
                      </td>
                      <td className="py-3 px-4">
                        {patient.waitTime !== undefined &&
                        patient.waitTime > 0 ? (
                          <div className="flex items-center gap-1 text-xs">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span
                              className={
                                patient.waitTime > 15
                                  ? "text-red-600"
                                  : "text-gray-600"
                              }
                            >
                              {toEnglishNumber(patient.waitTime)}m
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">
                            -
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedPatient(patient);
                                setIsHistoryOpen(true);
                              }}
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              View Patient History
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedPatient(patient);
                                setIsEditOpen(true);
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedPatient(patient);
                                setIsAssignOpen(true);
                              }}
                            >
                              Assign Doctor
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setSelectedPatient(patient);
                                setIsDischargeOpen(true);
                              }}
                            >
                              Mark as Discharged
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredPatients.length === 0 && (
              <div className="py-12 text-center text-gray-500 text-sm">
                No matching results found
              </div>
            )}
          </div>
        </Card>

        {/* Summary Footer */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div>
            Showing {filteredPatients.length} of{" "}
            {patientsData.length} patients
          </div>
          <div className="flex items-center gap-4">
            <span>⚠️ {criticalCount} critical</span>
            <span>🕐 {waitingCount} waiting</span>
          </div>
        </div>
      </main>

      {/* Patient History Sheet */}
      <PatientHistorySheet
        patient={selectedPatient}
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
      />

      {/* Patient Edit Dialog */}
      <PatientEditDialog
        patient={selectedPatient}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSave={handleEditPatient}
      />

      {/* Assign Doctor Dialog */}
      <AssignDoctorDialog
        patient={selectedPatient}
        open={isAssignOpen}
        onOpenChange={setIsAssignOpen}
        onAssign={handleAssignDoctor}
      />

      {/* Discharge Confirmation Dialog */}
      <AlertDialog open={isDischargeOpen} onOpenChange={setIsDischargeOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discharge Patient</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark{" "}
              <span className="font-semibold">{selectedPatient?.name}</span> as
              discharged? This action will update their status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDischargePatient}>
              Confirm Discharge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}