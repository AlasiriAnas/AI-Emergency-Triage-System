import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Search, Share2, Moon, TrendingUp, TrendingDown, Download, Activity } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner@2.0.3";
import { NotificationCenter } from "./NotificationCenter";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const initialStatsData = [
  {
    title: "Total Patients",
    value: 45,
    change: "+20%",
    trend: "up",
    subtitle: "month over month",
  },
  {
    title: "Critical Cases",
    value: 5,
    change: "+33%",
    trend: "up",
    subtitle: "month over month",
  },
  {
    title: "Moderate Patients",
    value: 10353,
    change: "-8%",
    trend: "down",
    subtitle: "month over month",
  },
  {
    title: "Stable / Discharged",
    value: 100,
    change: "-8%",
    trend: "down",
    subtitle: "month over month",
  },
  {
    title: "Avg. Wait Time",
    value: 14,
    change: "-8%",
    trend: "down",
    subtitle: "month over month",
  },
];

const hourlyData = [
  { hour: "0", patients: 12 },
  { hour: "3", patients: 8 },
  { hour: "6", patients: 15 },
  { hour: "9", patients: 28 },
  { hour: "12", patients: 35 },
  { hour: "15", patients: 42 },
  { hour: "18", patients: 38 },
  { hour: "21", patients: 52 },
  { hour: "23", patients: 58 },
];

const monthlyData = [
  { month: "Jan", cases: 2800 },
  { month: "Feb", cases: 2100 },
  { month: "Mar", cases: 2400 },
  { month: "Apr", cases: 2900 },
  { month: "May", cases: 3200 },
  { month: "Jun", cases: 3500 },
  { month: "Jul", cases: 3400 },
  { month: "Aug", cases: 2900 },
  { month: "Sep", cases: 2600 },
  { month: "Oct", cases: 2800 },
  { month: "Nov", cases: 2400 },
  { month: "Dec", cases: 2200 },
];

const initialDoctorsData = [
  { name: "Dr. Omar Al Harbi", specialty: "Emergency Lead", cases: 6 },
  { name: "Dr. Sarah Ahmed", specialty: "Cardiology", cases: 4 },
  { name: "Dr. Mohammed Ali", specialty: "Pediatrics", cases: 8 },
  { name: "Dr. Fatima Khan", specialty: "Surgery", cases: 3 },
];

export function DoctorDashboard() {
  const [statsData, setStatsData] = useState(initialStatsData);
  const [doctorsData, setDoctorsData] = useState(initialDoctorsData);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Real-time Updates Simulation
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Update stats randomly
      setStatsData(prev => {
        const newStats = [...prev];
        const randomIndex = Math.floor(Math.random() * 2); // Update first 2 stats only
        
        if (randomIndex === 0) {
          // Total Patients
          const change = Math.random() > 0.5 ? 1 : -1;
          newStats[0] = { ...newStats[0], value: Math.max(1, newStats[0].value + change) };
        } else if (randomIndex === 1) {
          // Critical Cases
          const prevValue = newStats[1].value;
          const change = Math.random() > 0.7 ? 1 : (Math.random() > 0.5 ? -1 : 0);
          const newValue = Math.max(0, prevValue + change);
          
          newStats[1] = { ...newStats[1], value: newValue };
          
          // Show notification for critical case changes
          if (change > 0) {
            toast.error("⚠️ New Critical Case!", {
              description: `A new critical case has been added. Total: ${newValue}`,
              duration: 5000,
            });
          } else if (change < 0 && prevValue > 0) {
            toast.success("✅ Critical Case Improved", {
              description: `A critical case has been transferred. Remaining: ${newValue}`,
              duration: 4000,
            });
          }
        }
        
        return newStats;
      });

      // Update doctor cases randomly
      setDoctorsData(prev => {
        const newDoctors = [...prev];
        const randomDoctor = Math.floor(Math.random() * newDoctors.length);
        const change = Math.random() > 0.5 ? 1 : -1;
        newDoctors[randomDoctor] = {
          ...newDoctors[randomDoctor],
          cases: Math.max(0, newDoctors[randomDoctor].cases + change),
        };
        return newDoctors;
      });

      setLastUpdate(new Date());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  // Export to PDF
  const handleExportPDF = () => {
    toast.info("📄 Exporting Report...", {
      description: "PDF will be downloaded shortly",
    });

    setTimeout(() => {
      // Simulate PDF generation
      window.print();
      toast.success("✅ Export Successful", {
        description: "Print window opened",
      });
    }, 1000);
  };

  // Convert any Arabic numerals to English
  const toEnglishNumber = (str: string | number): string => {
    if (typeof str === 'number') str = str.toString();
    return str.replace(/[\u0660-\u0669]/g, (c) =>
      (c.charCodeAt(0) - 0x0660).toString()
    );
  };

  const formatValue = (value: number, index: number) => {
    if (index === 2) return toEnglishNumber(value.toLocaleString('en-US')); // Moderate Patients
    if (index === 4) return toEnglishNumber(`${value} min`); // Wait Time
    return toEnglishNumber(value.toString());
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#E5E5E5]">
        <div className="px-8 pt-8 pb-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <h1 className="text-xl">Doctor Dashboard</h1>
            {/* Live Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-xs text-green-700">
                {isLive ? 'Live' : 'Paused'}
              </span>
            </div>
            <button
              onClick={() => setIsLive(!isLive)}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              {isLive ? 'Pause' : 'Resume'}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-10 h-9 bg-gray-50 border-gray-200"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Last updated: {toEnglishNumber(lastUpdate.toLocaleTimeString('en-US'))}</span>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 gap-2"
                onClick={handleExportPDF}
              >
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <NotificationCenter />
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Moon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <Card
              key={index}
              className="p-4 shadow-sm border-gray-100 transition-all hover:shadow-md"
              style={{ borderRadius: "16px" }}
            >
              <div className="text-xs text-gray-600 mb-2">{stat.title}</div>
              <div className="text-3xl mb-1">{formatValue(stat.value, index)}</div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                {stat.trend === "up" ? (
                  <TrendingUp className="w-3 h-3 text-green-600" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-600" />
                )}
                <span
                  className={stat.trend === "up" ? "text-green-600" : "text-red-600"}
                >
                  {stat.change}
                </span>
                <span>{stat.subtitle}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Line Chart */}
          <Card className="p-5 shadow-sm border-gray-100" style={{ borderRadius: "16px" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm">Patient Inflow — Hourly Trend</h3>
              <Activity className="w-4 h-4 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDEDED" />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 11, fill: "#666" }}
                  axisLine={{ stroke: "#E5E5E5" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#666" }}
                  axisLine={{ stroke: "#E5E5E5" }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="patients"
                  stroke="#000"
                  strokeWidth={2}
                  dot={{ fill: "#000", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Bar Chart */}
          <Card className="p-5 shadow-sm border-gray-100" style={{ borderRadius: "16px" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm">Monthly Emergency Cases (Year Overview)</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={handleExportPDF}
              >
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyData}>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#666" }}
                  axisLine={{ stroke: "#E5E5E5" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#666" }}
                  axisLine={{ stroke: "#E5E5E5" }}
                />
                <Tooltip />
                <Bar dataKey="cases" fill="#000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Doctors Table */}
        <Card className="p-5 shadow-sm border-gray-100" style={{ borderRadius: "16px" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm">On Duty Doctors Now</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {toEnglishNumber(doctorsData.reduce((acc, d) => acc + d.cases, 0))} active cases
              </span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs text-gray-700">Doctor</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-700">Specialty</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-700">Cases Now</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {doctorsData.map((doctor, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm">{doctor.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{doctor.specialty}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`inline-flex items-center gap-1 ${doctor.cases > 5 ? 'text-orange-600' : 'text-gray-900'}`}>
                        {toEnglishNumber(doctor.cases)}
                        {doctor.cases > 5 && <span className="text-xs">⚠️</span>}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        doctor.cases === 0 
                          ? 'bg-gray-100 text-gray-600' 
                          : doctor.cases > 5 
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {doctor.cases === 0 ? 'Available' : doctor.cases > 5 ? 'Busy' : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
