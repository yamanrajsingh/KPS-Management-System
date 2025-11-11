"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  BookOpen,
  DollarSign,
  Wallet,
  TrendingUp,
  AlertCircle,
  User,
  CheckCircle,
  Calendar,
  Award,
  BarChart3,
} from "lucide-react";

// --- static sample data (fallbacks) ---
const sampleStudentData = [
  { month: "Jan", students: 120 },
  { month: "Feb", students: 135 },
  { month: "Mar", students: 150 },
  { month: "Apr", students: 165 },
  { month: "May", students: 180 },
  { month: "Jun", students: 195 },
];

const feeStatusData = [   ///  sample data
  { name: "Collected", value: 75, color: "#10b981" },
  { name: "Pending", value: 20, color: "#f59e0b" },
  { name: "Overdue", value: 5, color: "#ef4444" },
];

const feeCollectionData = [  ///  sample data
  { month: "Jan", collected: 12.5, pending: 2.5, overdue: 0.5 },
  { month: "Feb", collected: 13.2, pending: 2.8, overdue: 0.8 },
  { month: "Mar", collected: 14.0, pending: 2.2, overdue: 1.2 },
  { month: "Apr", collected: 14.5, pending: 2.0, overdue: 0.9 },
  { month: "May", collected: 15.2, pending: 1.8, overdue: 0.7 },
  { month: "Jun", collected: 15.8, pending: 1.5, overdue: 0.6 },
];

const salaryData = [ ///  sample data
  { month: "Jan", amount: 45000 },
  { month: "Feb", amount: 45000 },
  { month: "Mar", amount: 48000 },
  { month: "Apr", amount: 45000 },
  { month: "May", amount: 50000 },
  { month: "Jun", amount: 45000 },
];

const attendanceData = [  ///  sample data
  { class: "9A", present: 42, absent: 3, percentage: 93 },
  { class: "9B", present: 38, absent: 5, percentage: 88 },
  { class: "10A", present: 45, absent: 2, percentage: 96 },
  { class: "10B", present: 40, absent: 4, percentage: 91 },
];

const topStudents = [  ///  sample data
  { name: "Aarav Sharma", class: "10A", score: 95, rank: 1 },
  { name: "Priya Patel", class: "9A", score: 93, rank: 2 },
  { name: "Rohan Singh", class: "10B", score: 91, rank: 3 },
  { name: "Ananya Gupta", class: "9B", score: 89, rank: 4 },
  { name: "Vikram Kumar", class: "10A", score: 87, rank: 5 },
];

const upcomingEvents = [  ///  sample data
  {
    title: "Parent-Teacher Meeting",
    date: "2024-01-15",
    type: "meeting",
    color: "bg-blue-500/10 border-blue-500/20",
  },
  {
    title: "Annual Exam Starts",
    date: "2024-01-20",
    type: "exam",
    color: "bg-red-500/10 border-red-500/20",
  },
  {
    title: "School Foundation Day",
    date: "2024-01-25",
    type: "event",
    color: "bg-green-500/10 border-green-500/20",
  },
  {
    title: "Republic Day Celebration",
    date: "2024-01-26",
    type: "holiday",
    color: "bg-purple-500/10 border-purple-500/20",
  },
];

const teacherInsights = [   ///  sample data
  {
    name: "Rajesh Kumar",
    subject: "Mathematics",
    rating: 4.8,
    students: 120,
    performance: "Excellent",
  },
  {
    name: "Priya Sharma",
    subject: "English",
    rating: 4.6,
    students: 110,
    performance: "Excellent",
  },
  {
    name: "Amit Patel",
    subject: "Science",
    rating: 4.5,
    students: 115,
    performance: "Very Good",
  },
];

type Stats = {
  maleStudents: number;
  femaleStudents: number;
};

interface MonthlyFee {
  month: string
  collected: number
  pending: number
  overdue: number
}

const formatCurrencyINR = (n: number) => {
  if (n >= 100000) {
    return `₹${(n / 100000).toFixed(1)}L`;
  }
  return `₹${n.toLocaleString("en-IN")}`;
};

type EnrollmentPoint = { month: string; students: number };

export default function DashboardPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  const router = useRouter();

  // Summary states
  const [totalStudents, setTotalStudents] = useState<number>(195);
  const [maleStudents, setMaleStudents] = useState<number>(110);
  const [femaleStudents, setFemaleStudents] = useState<number>(85);
  const [totalTeachers, setTotalTeachers] = useState<number>(28);
  const [feesCollected, setFeesCollected] = useState<number>(1580000);
  const [pendingFees, setPendingFees] = useState<number>(150000);
  const [overdueFees, setOverdueFees] = useState<number>(60000);
  const [monthlyData, setMonthlyData] = useState<MonthlyFee[]>([])
  const [totalSalaryPaid, setTotalSalaryPaid] = useState<number>(45000);

  // centralized stats object (keeps source of truth)
  const [stats, setStats] = useState<Stats>({
    maleStudents: 0,
    femaleStudents: 0,
  });

  // enrollment chart state
  const [studentData, setStudentData] =
    useState<EnrollmentPoint[]>(sampleStudentData);
  const [studentLoading, setStudentLoading] = useState<boolean>(false);
  const [studentError, setStudentError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleUnauthorized = () => {
    if (typeof window !== "undefined") localStorage.removeItem("authToken");
    router.push("/");
  };

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) {
      router.push("/");
      return;
    }

    const headers = { "Content-Type": "application/json", ...getAuthHeaders() };

    // helper for fetch-responses (keeps existing behavior for enrollment fetch)
    const check401AndParse = async (res: Response) => {
      if (res.status === 401) {
        handleUnauthorized();
        throw new Error("Unauthorized");
      }
      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(`API error ${res.status}: ${text}`);
      }
      return res.json();
    };

    // AbortController for enrollment fetch
    const enrollmentController = new AbortController();

    (async () => {
      // 1) fetch stats via axios (single source of truth for male/female)
      try {
        const statsRes = await axios.get<Stats>(
          `${apiBaseUrl}/api/students/stats`,
          {
            headers,
          }
        );
        const statsData = statsRes.data ?? {
          maleStudents: 0,
          femaleStudents: 0,
        };
        setStats(statsData);
        // keep separate states in sync for places referencing them directly
        setMaleStudents(statsData.maleStudents ?? 0);
        setFemaleStudents(statsData.femaleStudents ?? 0);

        // if API returns totalStudents inside stats, update it too (defensive)
        if (
          (statsData as any).totalStudents &&
          typeof (statsData as any).totalStudents === "number"
        ) {
          setTotalStudents((statsData as any).totalStudents);
        }
      } catch (err: any) {
        if (err?.response?.status === 401) {
          handleUnauthorized();
        } else {
          // don't crash; keep defaults
          console.warn("axios /api/students/stats failed:", err);
        }
      }

      // 2) fetch enrollments (keeps your existing fetch approach)
      setStudentLoading(true);
      setStudentError(null);
      try {
        const res = await fetch(`${apiBaseUrl}/api/students/enrollments`, {
          headers,
          signal: enrollmentController.signal,
        });
        const data = await check401AndParse(res);

        if (Array.isArray(data)) {
          const normalized: EnrollmentPoint[] = data.map((item: any) => {
            let monthLabel = "";
            let students = 0;

            if (typeof item.month === "string") {
              monthLabel = item.month;
            } else if (
              typeof item.month === "number" ||
              typeof item.monthNumber === "number"
            ) {
              const m = Number(item.month ?? item.monthNumber);
              if (!Number.isNaN(m) && m >= 1 && m <= 12) {
                monthLabel = new Date(2020, m - 1, 1).toLocaleString("en-US", {
                  month: "short",
                });
              }
            }

            if (typeof item.students === "number")
              students = Number(item.students);
            else if (typeof item.cnt === "number") students = Number(item.cnt);
            else if (typeof item.count === "number")
              students = Number(item.count);
            else students = Number(item.value ?? 0);

            return {
              month: monthLabel || "",
              students: Number.isFinite(students) ? students : 0,
            };
          });

          if (normalized.length > 0) setStudentData(normalized);
          else setStudentData(sampleStudentData);
        } else {
          console.warn("Unexpected enrollments response shape:", data);
          setStudentData(sampleStudentData);
        }
      } catch (err: any) {
        if (err?.name === "AbortError") {
          // aborted - ignore
        } else if (err?.response?.status === 401) {
          handleUnauthorized();
        } else {
          console.warn("/api/students/enrollments fetch failed:", err);
          setStudentError(err?.message ?? String(err));
          setStudentData(sampleStudentData);
        }
      } finally {
        setStudentLoading(false);
      }

      // 3) teachers (count) - unchanged (fetch)
      try {
        const res = await fetch(`${apiBaseUrl}/api/teachers/`, { headers });
        if (res.status === 401) {
          handleUnauthorized();
        } else {
          const data = await res.json().catch(() => null);
          if (Array.isArray(data)) setTotalTeachers(data.length);
          else if (data && typeof (data as any).length === "number")
            setTotalTeachers((data as any).length);
          else if (data && typeof (data as any).count === "number")
            setTotalTeachers((data as any).count);
        }
      } catch (err) {
        console.warn("teachers fetch failed:", err);
      }

      // 4) fee summary
      try {
        const res = await fetch(`${apiBaseUrl}/api/students/fee/summary`, {
          headers,
        });
        if (res.status === 401) handleUnauthorized();
        else {
          const data = await res.json().catch(() => null);
          if (data) {
            if (typeof data.totalCollected === "number")
              setFeesCollected(data.totalCollected);
            if (typeof data.totalPending === "number")
              setPendingFees(data.totalPending);
            if (typeof data.totalOverdue === "number")
              setOverdueFees(data.totalOverdue);
          }
        }
      } catch (err) {
        console.warn("fee summary fetch failed:", err);
      }



     try{
       // 2️⃣ Monthly Fee Trend
        const monthlyRes = await fetch(`${apiBaseUrl}/api/students/fee/monthly`,{headers})
        const monthlyJson: MonthlyFee[] = await monthlyRes.json()
        setMonthlyData(monthlyJson)
     }
      catch(err){
        
          // don't crash; keep defaults
          console.warn("axios /api/students/fee/monthly failed:", err);
        
      }



      // 5) teacher salaries
      try {
        const res = await fetch(`${apiBaseUrl}/api/teacher/salary/`, {
          headers,
        });
        if (res.status === 401) handleUnauthorized();
        else {
          const data = await res.json().catch(() => null);
          if (Array.isArray(data)) {
            const sum = data.reduce(
              (acc: number, item: any) => acc + (Number(item.amount) || 0),
              0
            );
            if (!isNaN(sum)) setTotalSalaryPaid(sum);
          } else if (data && Array.isArray((data as any).salaries)) {
            const sum = (data as any).salaries.reduce(
              (acc: number, item: any) => acc + (Number(item.amount) || 0),
              0
            );
            if (!isNaN(sum)) setTotalSalaryPaid(sum);
          } else if (data && typeof (data as any).total === "number") {
            setTotalSalaryPaid((data as any).total);
          }
        }
      } catch (err) {
        console.warn("teacher salary fetch failed:", err);
      }
    })();

    return () => {
      enrollmentController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // computed values
  const genderRatio =
    femaleStudents === 0
      ? "—"
      : (maleStudents / femaleStudents).toFixed(2) + ":1";

  // derive gender pie data from stats (single source)
  const deriveGenderData = (s: Stats) => {
    const male = Number(s.maleStudents ?? 0);
    const female = Number(s.femaleStudents ?? 0);
    return [
      { name: "Male", value: male, color: "#3b82f6" },
      { name: "Female", value: female, color: "#ec4899" },
    ];
  };

  // small custom tooltip for pie (renders count + percent)
  function GenderTooltip({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: any;
  }) {
    if (!active || !payload || !payload.length) return null;
    const item = payload[0].payload;
    const total = deriveGenderData(stats).reduce(
      (acc, cur) => acc + cur.value,
      0
    );
    const percent = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0.0";
    return (
      <div
        style={{
          backgroundColor: "#0f172a",
          color: "#e2e8f0",
          padding: 8,
          borderRadius: 8,
          border: "1px solid #475569",
          minWidth: 120,
        }}
      >
        <div style={{ fontSize: 12, opacity: 0.9 }}>{item.name}</div>
        <div style={{ fontWeight: 700, marginTop: 4 }}>
          {item.value} students
        </div>
        <div style={{ fontSize: 12, marginTop: 2 }}>{percent}%</div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, label, value, change }: any) => (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="pt-4 md:pt-6">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs md:text-sm text-slate-400">{label}</p>
            <p className="text-xl md:text-2xl font-bold text-white mt-1 md:mt-2 truncate">
              {value}
            </p>
            {change && (
              <p className="text-xs text-green-400 mt-1 md:mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{change}</span>
              </p>
            )}
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // gender data derived for rendering
  const genderDataFromStats = deriveGenderData(stats);
  const genderTotal = genderDataFromStats.reduce(
    (acc, cur) => acc + cur.value,
    0
  );

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-sm md:text-base text-slate-400 mt-1">
          Welcome to your school management system
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          icon={Users}
          label="Total Students"
          value={totalStudents}
          change="+12% this month"
        />
        <StatCard
          icon={BookOpen}
          label="Total Teachers"
          value={totalTeachers}
          change="+2 this month"
        />
        <StatCard
          icon={DollarSign}
          label="Fees Collected"
          value={formatCurrencyINR(feesCollected)}
          change={`Collection Rate: ${
            feesCollected > 0
              ? (
                  (feesCollected /
                    Math.max(1, feesCollected + pendingFees + overdueFees)) *
                  100
                ).toFixed(0)
              : 0
          }%`}
        />
        <StatCard
          icon={Wallet}
          label="Salaries Paid"
          value={formatCurrencyINR(totalSalaryPaid)}
          change="On schedule"
        />
      </div>

      {/* Gender Statistics Section (cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-4 md:pt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-slate-400">
                  Male Students
                </p>
                <p className="text-xl md:text-2xl font-bold text-white mt-1 md:mt-2">
                  {maleStudents}
                </p>
                <p className="text-xs text-blue-400 mt-1 md:mt-2">
                  {((maleStudents / Math.max(1, totalStudents)) * 100).toFixed(
                    1
                  )}
                  % of total
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500/20 to-blue-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-4 md:pt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-slate-400">
                  Female Students
                </p>
                <p className="text-xl md:text-2xl font-bold text-white mt-1 md:mt-2">
                  {femaleStudents}
                </p>
                <p className="text-xs text-pink-400 mt-1 md:mt-2">
                  {(
                    (femaleStudents / Math.max(1, totalStudents)) *
                    100
                  ).toFixed(1)}
                  % of total
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-500/20 to-pink-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 md:w-6 md:h-6 text-pink-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 sm:col-span-2 lg:col-span-2">
          <CardContent className="pt-4 md:pt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-slate-400">
                  Gender Ratio
                </p>
                <p className="text-xl md:text-2xl font-bold text-white mt-1 md:mt-2">
                  {genderRatio}
                </p>
                <p className="text-xs text-cyan-400 mt-1 md:mt-2">
                  Male to Female
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrollment trend + Gender Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg text-white">
              Student Enrollment Trend
            </CardTitle>
            <CardDescription className="text-xs md:text-sm text-slate-400">
              Last fetched enrollment by month
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
            {studentLoading && <div>Loading enrollment data...</div>}
            {studentError && (
              <div className="text-red-400">Error: {studentError}</div>
            )}
            {!studentLoading && !studentError && (
              <div style={{ width: "100%", height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={studentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="month"
                      stroke="#94a3b8"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #475569",
                        borderRadius: 8,
                      }}
                      labelStyle={{ color: "#e2e8f0" }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="students"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      dot={{ fill: "#06b6d4" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg text-white">
              Gender Distribution
            </CardTitle>
            <CardDescription className="text-xs md:text-sm text-slate-400">
              Student breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={genderDataFromStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={false}
                  label={({ percent, name }) =>
                    `${name} ${Math.round((percent ?? 0) * 100)}%`
                  }
                >
                  {genderDataFromStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip
                  content={<GenderTooltip active payload={undefined} />}
                  wrapperStyle={{ outline: "none" }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-3 md:mt-4 space-y-2">
              {genderDataFromStats.map((item) => {
                const percent =
                  genderTotal > 0
                    ? ((item.value / genderTotal) * 100).toFixed(1)
                    : "0.0";
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-xs md:text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 md:w-3 md:h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-slate-300">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">{item.value}</div>
                      <div className="text-slate-400 text-[11px] md:text-xs">
                        {percent}% of total
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fee Collection Trend */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg text-white">
            Fee Collection Trend
          </CardTitle>
          <CardDescription className="text-xs md:text-sm text-slate-400">
            Collected, Pending & Overdue (in Lakhs)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: 8,
                }}
                labelStyle={{ color: "#e2e8f0" }}
              />
              <Legend />
              <Bar
                dataKey="collected"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
                name="Collected"
              />
              <Bar
                dataKey="pending"
                fill="#f59e0b"
                radius={[8, 8, 0, 0]}
                name="Pending"
              />
              <Bar
                dataKey="overdue"
                fill="#ef4444"
                radius={[8, 8, 0, 0]}
                name="Overdue"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg text-white">
            Fee Status Distribution
          </CardTitle>
          <CardDescription className="text-xs md:text-sm text-slate-400">
            Overall fee collection status
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={feeStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {feeStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col justify-center space-y-3 md:space-y-4">
              {feeStatusData.map((item) => (
                <div
                  key={item.name}
                  className="p-3 md:p-4 bg-slate-700/50 rounded-lg border border-slate-600"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 md:w-4 md:h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm md:text-base text-slate-300 font-medium">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-sm md:text-base text-white font-bold">
                      {item.value}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${item.value}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg text-white">
            Monthly Salary Expenses
          </CardTitle>
          <CardDescription className="text-xs md:text-sm text-slate-400">
            Last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salaryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#e2e8f0" }}
              />
              <Legend />
              <Bar dataKey="amount" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Upcoming Events & Notifications, Top Performing Students, Teacher Insights, Attendance Tracker, Alerts (unchanged) */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg text-white">
              Upcoming Events
            </CardTitle>
            <CardDescription className="text-xs md:text-sm text-slate-400">
              This month's schedule
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
            <div className="space-y-2 md:space-y-3">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className={`p-3 md:p-4 rounded-lg border ${event.color}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm md:text-base font-medium text-white">
                        {event.title}
                      </p>
                      <p className="text-xs md:text-sm text-slate-400 mt-1">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-700 text-slate-200 flex-shrink-0 capitalize">
                      {event.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3 md:space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-4 md:pt-6">
              <div className="text-center">
                <p className="text-xs md:text-sm text-slate-400">
                  Classes Today
                </p>
                <p className="text-2xl md:text-3xl font-bold text-white mt-2">
                  8
                </p>
                <p className="text-xs text-slate-400 mt-2">All on schedule</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-4 md:pt-6">
              <div className="text-center">
                <p className="text-xs md:text-sm text-slate-400">
                  Pending Tasks
                </p>
                <p className="text-2xl md:text-3xl font-bold text-white mt-2">
                  3
                </p>
                <p className="text-xs text-yellow-400 mt-2">
                  Requires attention
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg text-white">
            Top Performing Students
          </CardTitle>
          <CardDescription className="text-xs md:text-sm text-slate-400">
            This month's achievers
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 text-slate-400 font-medium">
                    Rank
                  </th>
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 text-slate-400 font-medium">
                    Name
                  </th>
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 text-slate-400 font-medium">
                    Class
                  </th>
                  <th className="text-right py-2 md:py-3 px-2 md:px-4 text-slate-400 font-medium">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {topStudents.map((student) => (
                  <tr
                    key={student.rank}
                    className="border-b border-slate-700/50 hover:bg-slate-700/30 transition"
                  >
                    <td className="py-2 md:py-3 px-2 md:px-4">
                      <span className="inline-flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-yellow-500 to-amber-500 text-white text-xs md:text-sm font-bold">
                        {student.rank}
                      </span>
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4 text-white font-medium">
                      {student.name}
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4 text-slate-300">
                      {student.class}
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2 md:px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs md:text-sm font-semibold">
                        {student.score}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg text-white">
            Teacher Performance Insights
          </CardTitle>
          <CardDescription className="text-xs md:text-sm text-slate-400">
            Top performing teachers
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
          <div className="space-y-3 md:space-y-4">
            {teacherInsights.map((teacher, index) => (
              <div
                key={index}
                className="p-3 md:p-4 bg-slate-700/50 rounded-lg border border-slate-600"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-sm md:text-base font-medium text-white">
                      {teacher.name}
                    </p>
                    <p className="text-xs text-slate-400">{teacher.subject}</p>
                  </div>
                  <div className="flex items-center gap-1 px-2 md:px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs md:text-sm font-semibold flex-shrink-0">
                    <span>★</span>
                    <span>{teacher.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <span className="text-slate-400">
                    Students: {teacher.students}
                  </span>
                  <span className="text-green-400 font-medium">
                    {teacher.performance}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg text-white">
            Class-wise Attendance
          </CardTitle>
          <CardDescription className="text-xs md:text-sm text-slate-400">
            Today's attendance status
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
          <div className="space-y-3 md:space-y-4">
            {attendanceData.map((classData, index) => (
              <div
                key={index}
                className="p-3 md:p-4 bg-slate-700/50 rounded-lg border border-slate-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm md:text-base font-medium text-white">
                      {classData.class}
                    </p>
                    <p className="text-xs text-slate-400">
                      {classData.present} present, {classData.absent} absent
                    </p>
                  </div>
                  <span
                    className={`text-sm md:text-base font-bold px-3 py-1 rounded-full ${
                      classData.percentage >= 90
                        ? "bg-green-500/20 text-green-300"
                        : classData.percentage >= 75
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {classData.percentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      classData.percentage >= 90
                        ? "bg-green-500"
                        : classData.percentage >= 75
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${classData.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg text-white">
            Recent Alerts
          </CardTitle>
          <CardDescription className="text-xs md:text-sm text-slate-400">
            Important notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
          <div className="space-y-2 md:space-y-3">
            <div className="flex items-start gap-3 p-2 md:p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-yellow-200">
                  Pending Fee Payments
                </p>
                <p className="text-xs text-yellow-300/70">
                  15 students have pending fee payments
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 md:p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-blue-200">
                  New Enrollment
                </p>
                <p className="text-xs text-blue-300/70">
                  5 new students enrolled this week
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
