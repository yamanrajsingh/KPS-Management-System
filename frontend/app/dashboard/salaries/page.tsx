"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SalaryTable from "@/components/salaries/salary-table"
import SalaryForm from "@/components/salaries/salary-form"
import { Plus, Search, Wallet, TrendingUp, Calendar } from "lucide-react"

export default function SalariesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [salaries, setSalaries] = useState([
    {
      id: "SAL001",
      teacherId: "T001",
      teacherName: "Dr. Rajesh Kumar",
      baseSalary: 45000,
      allowances: 5000,
      deductions: 2000,
      netSalary: 48000,
      month: "February 2024",
      paidDate: "2024-02-01",
      status: "Paid",
    },
    {
      id: "SAL002",
      teacherId: "T002",
      teacherName: "Ms. Priya Sharma",
      baseSalary: 40000,
      allowances: 4000,
      deductions: 1500,
      netSalary: 42500,
      month: "February 2024",
      paidDate: "2024-02-01",
      status: "Paid",
    },
    {
      id: "SAL003",
      teacherId: "T003",
      teacherName: "Mr. Vikram Singh",
      baseSalary: 45000,
      allowances: 5000,
      deductions: 2000,
      netSalary: 48000,
      month: "February 2024",
      paidDate: null,
      status: "Pending",
    },
    {
      id: "SAL004",
      teacherId: "T004",
      teacherName: "Ms. Anjali Patel",
      baseSalary: 38000,
      allowances: 3500,
      deductions: 1200,
      netSalary: 40300,
      month: "February 2024",
      paidDate: "2024-02-01",
      status: "Paid",
    },
    {
      id: "SAL005",
      teacherId: "T005",
      teacherName: "Mr. Arjun Desai",
      baseSalary: 35000,
      allowances: 3000,
      deductions: 1000,
      netSalary: 37000,
      month: "February 2024",
      paidDate: "2024-02-01",
      status: "Paid",
    },
  ])

  const filteredSalaries = salaries.filter(
    (salary) =>
      salary.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salary.teacherId.includes(searchTerm) ||
      salary.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    totalPaid: salaries.filter((s) => s.status === "Paid").reduce((sum, s) => sum + s.netSalary, 0),
    pending: salaries.filter((s) => s.status === "Pending").length,
    averageSalary: Math.round(salaries.reduce((sum, s) => sum + s.netSalary, 0) / salaries.length),
  }

  const handleAddSalary = (newSalary: any) => {
    const salary = {
      ...newSalary,
      id: `SAL${String(salaries.length + 1).padStart(3, "0")}`,
      netSalary: newSalary.baseSalary + newSalary.allowances - newSalary.deductions,
    }
    setSalaries([...salaries, salary])
    setShowForm(false)
  }

  const handleDeleteSalary = (id: string) => {
    setSalaries(salaries.filter((s) => s.id !== id))
  }

  const handleMarkPaid = (id: string) => {
    setSalaries(
      salaries.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "Paid",
              paidDate: new Date().toISOString().split("T")[0],
            }
          : s,
      ),
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Salary Management</h1>
          <p className="text-slate-400 mt-1">Manage teacher salaries and payments</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Salary Record
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Paid This Month</p>
                <p className="text-2xl font-bold text-white mt-2">₹{(stats.totalPaid / 100000).toFixed(2)}L</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Pending Payments</p>
                <p className="text-2xl font-bold text-white mt-2">{stats.pending}</p>
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
                <p className="text-sm text-slate-400">Average Salary</p>
                <p className="text-2xl font-bold text-white mt-2">₹{(stats.averageSalary / 1000).toFixed(1)}K</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Add Salary Record</CardTitle>
            <CardDescription className="text-slate-400">Record a new salary payment</CardDescription>
          </CardHeader>
          <CardContent>
            <SalaryForm onSubmit={handleAddSalary} onCancel={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Salary Records</CardTitle>
          <CardDescription className="text-slate-400">Total: {salaries.length} records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search by teacher name, ID, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>
          <SalaryTable salaries={filteredSalaries} onDelete={handleDeleteSalary} onMarkPaid={handleMarkPaid} />
        </CardContent>
      </Card>
    </div>
  )
}
