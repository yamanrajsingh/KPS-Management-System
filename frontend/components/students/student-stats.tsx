"use client"

import { useEffect, useState } from "react"
import { Users, User2, BarChart3 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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
  CartesianGrid
} from "recharts"

export default function StudentStats() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    maleStudents: 0,
    femaleStudents: 0,
  })

  const [classDistribution, setClassDistribution] = useState<{ className: string; count: number }[]>([])

  useEffect(() => {
    // Fetch overall student stats
    fetch("http://localhost:8080/api/students/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Error fetching student stats:", err))

    // Fetch class-wise distribution
    fetch("http://localhost:8080/api/students/class-distribution")
      .then((res) => res.json())
      .then((data) => {
        // Transform object to array for Recharts
        const distributionArray = Object.entries(data).map(([className, count]) => ({
          className,
          count: count as number,
        }))
        setClassDistribution(distributionArray)
      })
      .catch((err) => console.error("Error fetching class distribution:", err))
  }, [])

  const { totalStudents, maleStudents, femaleStudents } = stats

  const genderData = [
    { name: "Male", value: maleStudents },
    { name: "Female", value: femaleStudents },
  ]

  const COLORS = ["#3b82f6", "#ec4899"]

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
