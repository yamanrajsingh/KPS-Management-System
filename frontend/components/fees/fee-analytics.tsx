"use client"

import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, AlertCircle, Calendar } from "lucide-react"

interface FeeAnalyticsProps {
  fees: any[]
}

export default function FeeAnalytics({ fees }: FeeAnalyticsProps) {
  const monthlyData = [
    { month: "Jan", collected: 250000, pending: 50000, overdue: 20000 },
    { month: "Feb", collected: 280000, pending: 40000, overdue: 15000 },
    { month: "Mar", collected: 300000, pending: 30000, overdue: 10000 },
    { month: "Apr", collected: 320000, pending: 25000, overdue: 8000 },
    { month: "May", collected: 350000, pending: 20000, overdue: 5000 },
    { month: "Jun", collected: 380000, pending: 15000, overdue: 3000 },
  ]

  const classWiseData = [
    { class: "Class 1", collected: 150000 },
    { class: "Class 2", collected: 140000 },
    { class: "Class 3", collected: 160000 },
    { class: "Class 4", collected: 155000 },
    { class: "Class 5", collected: 165000 },
  ]

  const paymentModeData = [
    { name: "Cash", value: 35, color: "#10b981" },
    { name: "UPI", value: 45, color: "#3b82f6" },
    { name: "Bank Transfer", value: 15, color: "#f59e0b" },
    { name: "Cheque", value: 5, color: "#8b5cf6" },
  ]

  const totalCollected = fees.filter((f) => f.status === "Paid").reduce((sum, f) => sum + f.amount, 0)
  const totalPending = fees.filter((f) => f.status === "Pending").reduce((sum, f) => sum + f.amount, 0)
  const totalOverdue = fees.filter((f) => f.status === "Overdue").reduce((sum, f) => sum + f.amount, 0)
  const totalTransactions = fees.length
  const collectionPercentage = Math.round((totalCollected / (totalCollected + totalPending + totalOverdue)) * 100)

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Collected</p>
                <p className="text-2xl font-bold text-white mt-2">₹{(totalCollected / 100000).toFixed(1)}L</p>
                <p className="text-xs text-green-400 mt-1">↑ 12% from last month</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Pending</p>
                <p className="text-2xl font-bold text-white mt-2">₹{(totalPending / 100000).toFixed(1)}L</p>
                <p className="text-xs text-yellow-400 mt-1">
                  {fees.filter((f) => f.status === "Pending").length} students
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Overdue</p>
                <p className="text-2xl font-bold text-white mt-2">₹{(totalOverdue / 100000).toFixed(2)}L</p>
                <p className="text-xs text-red-400 mt-1">
                  {fees.filter((f) => f.status === "Overdue").length} students
                </p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Collection Rate</p>
                <p className="text-2xl font-bold text-white mt-2">{collectionPercentage}%</p>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full"
                    style={{ width: `${collectionPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Fee Collection Trend */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Monthly Fee Collection Trend</CardTitle>
            <CardDescription className="text-slate-400">Last 6 months performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                <Legend />
                <Line type="monotone" dataKey="collected" stroke="#10b981" strokeWidth={2} name="Collected" />
                <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} name="Pending" />
                <Line type="monotone" dataKey="overdue" stroke="#ef4444" strokeWidth={2} name="Overdue" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Class-wise Collection Report */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Class-wise Collection Report</CardTitle>
            <CardDescription className="text-slate-400">Fees collected by class</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classWiseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                <Bar dataKey="collected" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Payment Mode Distribution */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Payment Mode Distribution</CardTitle>
          <CardDescription className="text-slate-400">Breakdown of payment methods used</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentModeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentModeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col justify-center gap-4">
              {paymentModeData.map((mode, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: mode.color }}></div>
                  <span className="text-slate-300">{mode.name}</span>
                  <span className="text-white font-semibold ml-auto">{mode.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
