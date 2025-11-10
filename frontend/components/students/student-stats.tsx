"use client"

import { useEffect, useState } from "react";
import { Users, User2, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

type Stats = {
  totalStudents: number;
  maleStudents: number;
  femaleStudents: number;
};

export default function StudentStats() {
  const router = useRouter();

  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    maleStudents: 0,
    femaleStudents: 0,
  });
  const [classDistribution, setClassDistribution] = useState<
    { className: string; count: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    return token
      ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      : { "Content-Type": "application/json" };
  };

   const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

  useEffect(() => {
    // redirect to login if no token
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) {
      router.push("/");
      return;
    }

    const headers = getAuthHeaders();

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        // fetch stats
        const statsRes = await axios.get<Stats>(`${apiBaseUrl}/api/students/stats`, {
          headers,
        });
        setStats(statsRes.data ?? { totalStudents: 0, maleStudents: 0, femaleStudents: 0 });

        // fetch class distribution
        const distRes = await axios.get(`${apiBaseUrl}/api/students/class-distribution`, {
          headers,
        });

        const raw = distRes.data;

        // normalize different possible shapes:
        // - { "Class 1": 10, "Class 2": 12 }
        // - [ { className: "Class 1", count: 10 }, ... ]
        let distributionArray: { className: string; count: number }[] = [];

        if (Array.isArray(raw)) {
          // assume array of objects already
          distributionArray = raw.map((r: any) => ({
            className: r.className ?? r.name ?? String(r.class ?? r.name ?? "Unknown"),
            count: Number(r.count ?? r.value ?? 0),
          }));
        } else if (raw && typeof raw === "object") {
          distributionArray = Object.entries(raw).map(([className, count]) => ({
            className,
            count: Number(count ?? 0),
          }));
        } else {
          // unexpected shape — leave empty
          distributionArray = [];
        }

        setClassDistribution(distributionArray);
      } catch (err: any) {
        console.error("Error fetching student stats or distribution:", err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          // invalid/expired token -> clear & redirect
          localStorage.removeItem("authToken");
          router.push("/");
          setError("Unauthorized. Redirecting to login.");
        } else {
          setError("Failed to load student statistics.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { totalStudents, maleStudents, femaleStudents } = stats;

  const genderData = [
    { name: "Male", value: maleStudents },
    { name: "Female", value: femaleStudents },
  ];

  const COLORS = ["#3b82f6", "#ec4899"]; // blue, pink

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Statistic Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <Card className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 border-blue-500/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-slate-400">Total Students</p>
                <p className="text-2xl md:text-3xl font-bold text-white mt-1">{totalStudents}</p>
              </div>
              <Users className="w-8 h-8 md:w-10 md:h-10 text-blue-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-600/20 to-cyan-600/5 border-cyan-500/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-slate-400">Male Students</p>
                <p className="text-2xl md:text-3xl font-bold text-white mt-1">{maleStudents}</p>
              </div>
              <User2 className="w-8 h-8 md:w-10 md:h-10 text-cyan-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-600/20 to-pink-600/5 border-pink-500/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-slate-400">Female Students</p>
                <p className="text-2xl md:text-3xl font-bold text-white mt-1">{femaleStudents}</p>
              </div>
              <User2 className="w-8 h-8 md:w-10 md:h-10 text-pink-400 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Class-wise Distribution */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 md:p-6">
            <h3 className="text-sm md:text-base font-semibold text-white mb-4">Class-wise Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={classDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="className" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gender Distribution */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 md:p-6">
            <h3 className="text-sm md:text-base font-semibold text-white mb-4">Gender Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
