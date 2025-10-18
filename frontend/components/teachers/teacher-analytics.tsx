"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Users, UserCheck, BookOpen, Calendar } from "lucide-react"

export default function TeacherAnalytics({ teachers }: { teachers: any[] }) {
  const totalTeachers = teachers.length
  const activeTeachers = teachers.filter((t) => t.status === "Active").length
  const inactiveTeachers = totalTeachers - activeTeachers

  const subjectDistribution = Object.entries(
    teachers.reduce(
      (acc, t) => {
        acc[t.subject] = (acc[t.subject] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ),
  ).map(([subject, count]) => ({ subject, count }))

  const genderDistribution = [
    { name: "Male", value: teachers.filter((t) => t.gender === "Male").length },
    { name: "Female", value: teachers.filter((t) => t.gender === "Female").length },
  ]

  const calculateExperience = (joinDate: string) => {
    const years = new Date().getFullYear() - new Date(joinDate).getFullYear()
    return years
  }

  const avgExperience = Math.round(
    teachers.reduce((sum, t) => sum + calculateExperience(t.joinDate), 0) / totalTeachers,
  )

  const COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#ec4899"]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Teachers</p>
              <p className="text-2xl font-bold text-white mt-2">{totalTeachers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Active Teachers</p>
              <p className="text-2xl font-bold text-white mt-2">{activeTeachers}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Avg Experience</p>
              <p className="text-2xl font-bold text-white mt-2">{avgExperience} yrs</p>
            </div>
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Subjects</p>
              <p className="text-2xl font-bold text-white mt-2">{subjectDistribution.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700 md:col-span-2">
        <CardContent className="pt-6">
          <h3 className="text-white font-semibold mb-4">Subject-wise Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={subjectDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="subject" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
              <Bar dataKey="count" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700 md:col-span-2">
        <CardContent className="pt-6">
          <h3 className="text-white font-semibold mb-4">Gender Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={genderDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={{ fill: "#e2e8f0" }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {genderDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
