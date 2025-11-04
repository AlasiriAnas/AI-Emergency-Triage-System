import { Card } from "./ui/card";
import { TrendingUp, Users, Clock, Activity } from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const performanceData = [
  { name: "Sat", value: 45 },
  { name: "Sun", value: 52 },
  { name: "Mon", value: 48 },
  { name: "Tue", value: 61 },
  { name: "Wed", value: 55 },
  { name: "Thu", value: 58 },
  { name: "Fri", value: 42 },
];

const severityDistribution = [
  { name: "Critical", value: 15, color: "#D32F2F" },
  { name: "Moderate", value: 35, color: "#F57C00" },
  { name: "Stable", value: 50, color: "#388E3C" },
];

const quickStats = [
  {
    icon: Users,
    label: "Daily Patient Average",
    value: "52",
    change: "+12%",
    trend: "up",
  },
  {
    icon: Clock,
    label: "Average Wait Time",
    value: "18 min",
    change: "-5%",
    trend: "down",
  },
  {
    icon: Activity,
    label: "Occupancy Rate",
    value: "78%",
    change: "+8%",
    trend: "up",
  },
  {
    icon: TrendingUp,
    label: "Recovery Rate",
    value: "94%",
    change: "+3%",
    trend: "up",
  },
];

export function AnalyticsDashboard() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Performance Analytics</h2>
        <p className="text-sm text-gray-600">
          Comprehensive overview of hospital performance and vital statistics
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="p-5 shadow-sm border-gray-100"
              style={{ borderRadius: "16px" }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Icon className="w-5 h-5 text-gray-700" />
                </div>
                <span
                  className={`text-xs ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <div className="text-xs text-gray-600 mb-1">{stat.label}</div>
              <div className="text-2xl">{stat.value}</div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Performance Trend */}
        <Card
          className="p-5 shadow-sm border-gray-100"
          style={{ borderRadius: "16px" }}
        >
          <h3 className="mb-4 text-sm">Weekly Performance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#000" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#000" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#000"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Severity Distribution */}
        <Card
          className="p-5 shadow-sm border-gray-100"
          style={{ borderRadius: "16px" }}
        >
          <h3 className="mb-4 text-sm">Case Distribution by Severity</h3>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="50%" height={250}>
              <PieChart>
                <Pie
                  data={severityDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {severityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {severityDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card
        className="p-5 shadow-sm border-gray-100"
        style={{ borderRadius: "16px" }}
      >
        <h3 className="mb-4 text-sm">Key Performance Indicators</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl mb-1 text-green-700">94%</div>
            <div className="text-xs text-green-600">Patient Satisfaction Rate</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl mb-1 text-blue-700">87%</div>
            <div className="text-xs text-blue-600">Doctor Efficiency</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl mb-1 text-purple-700">12 min</div>
            <div className="text-xs text-purple-600">Average Response Time</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
