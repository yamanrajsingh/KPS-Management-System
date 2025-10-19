"use client"

import { useEffect, useState } from "react"
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

interface FeeSummary {
  totalCollected: number
  totalPending: number
  totalOverdue: number
  totalTransactions: number
  collectionRate: number
}

interface MonthlyFee {
  month: string
  collected: number
  pending: number
  overdue: number
}

interface ClassWiseFee {
  className: string
  collected: number
}

interface PaymentMode {
  name: string
  value: number
  color?: string
}

export default function FeeAnalytics() {
  const [summary, setSummary] = useState<FeeSummary | null>(null)
  const [monthlyData, setMonthlyData] = useState<MonthlyFee[]>([])
  const [classWiseData, setClassWiseData] = useState<ClassWiseFee[]>([])
  const [paymentModeData, setPaymentModeData] = useState<PaymentMode[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Fee Summary
        const summaryRes = await fetch("http://localhost:8080/api/students/fee/summary")
        const summaryData: FeeSummary = await summaryRes.json()
        setSummary(summaryData)

        // 2️⃣ Monthly Fee Trend
        const monthlyRes = await fetch("http://localhost:8080/api/students/fee/monthly")
        const monthlyJson: MonthlyFee[] = await monthlyRes.json()
        setMonthlyData(monthlyJson)

        // 3️⃣ Class-wise Collection
        const classRes = await fetch("http://localhost:8080/api/students/fee/classwise")
        const classJson: ClassWiseFee[] = await classRes.json()
        setClassWiseData(classJson)

        // 4️⃣ Payment Mode Distribution
        const paymentRes = await fetch("http://localhost:8080/api/students/fee/payment-modes")
        const paymentJson: PaymentMode[] = await paymentRes.json()

        // Add default colors if not provided
        const colors = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"]
        setPaymentModeData(paymentJson.map((p, i) => ({ ...p, color: colors[i % colors.length] })))
      } catch (error) {
        console.error("Error fetching fee analytics:", error)
      }
    }

    fetchData()
  }, [])

  console.log("Fee Summary:", summary)

  if (!summary) return <p className="text-white">Loading...</p>

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Collected</p>
                <p className="text-2xl font-bold text-white mt-2">₹{(summary.totalCollected / 100000).toFixed(1)}L</p>
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
                <p className="text-2xl font-bold text-white mt-2">₹{(summary.totalPending / 100000).toFixed(1)}L</p>
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
                <p className="text-2xl font-bold text-white mt-2">₹{(summary.totalOverdue / 100000).toFixed(2)}L</p>
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
                <p className="text-2xl font-bold text-white mt-2">{summary.collectionRate}%</p>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full"
                    style={{ width: `${summary.collectionRate}%` }}
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
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Monthly Fee Collection Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="month" stroke="#94a3b8" />
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

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Class-wise Collection Report</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classWiseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="className" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                <Legend />
                <Bar dataKey="collected" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Payment Mode Distribution</CardTitle>
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
