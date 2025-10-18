"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import FeeTable from "@/components/fees/fee-table"
import FeeForm from "@/components/fees/fee-form"
import FeeAnalytics from "@/components/fees/fee-analytics"
import FeeFilters from "@/components/fees/fee-filters"
import FeeReceipt from "@/components/fees/fee-receipt"
import { Plus, Search, Download } from "lucide-react"

export default function FeesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingFee, setEditingFee] = useState(null)
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const [filters, setFilters] = useState({
    class: "",
    paymentStatus: "",
    paymentMode: "",
    dateFrom: "",
    dateTo: "",
  })

  const [fees, setFees] = useState([
    {
      id: "F001",
      studentId: "S001",
      studentName: "Aarav Kumar",
      class: "Class 5",
      academicYear: "2024-2025",
      totalAmount: 50000,
      amountPaid: 50000,
      dueAmount: 0,
      paymentMode: "UPI",
      paymentDate: "2024-01-25",
      receiptNumber: "RCP001",
      remarks: "Full payment received",
      status: "Paid",
      lastUpdated: "2024-01-25",
    },
    {
      id: "F002",
      studentId: "S002",
      studentName: "Priya Singh",
      class: "Class 4",
      academicYear: "2024-2025",
      totalAmount: 50000,
      amountPaid: 0,
      dueAmount: 50000,
      paymentMode: "",
      paymentDate: null,
      receiptNumber: "",
      remarks: "Pending payment",
      status: "Pending",
      lastUpdated: "2024-02-01",
    },
    {
      id: "F003",
      studentId: "S003",
      studentName: "Rohan Patel",
      class: "Class 3",
      academicYear: "2024-2025",
      totalAmount: 50000,
      amountPaid: 50000,
      dueAmount: 0,
      paymentMode: "Bank Transfer",
      paymentDate: "2024-02-05",
      receiptNumber: "RCP002",
      remarks: "Late payment",
      status: "Overdue",
      lastUpdated: "2024-02-05",
    },
    {
      id: "F004",
      studentId: "S004",
      studentName: "Ananya Sharma",
      class: "Class 5",
      academicYear: "2024-2025",
      totalAmount: 50000,
      amountPaid: 50000,
      dueAmount: 0,
      paymentMode: "Cash",
      paymentDate: "2024-02-20",
      receiptNumber: "RCP003",
      remarks: "On time payment",
      status: "Paid",
      lastUpdated: "2024-02-20",
    },
    {
      id: "F005",
      studentId: "S005",
      studentName: "Vikram Desai",
      class: "Class 2",
      academicYear: "2024-2025",
      totalAmount: 50000,
      amountPaid: 25000,
      dueAmount: 25000,
      paymentMode: "UPI",
      paymentDate: "2024-02-10",
      receiptNumber: "RCP004",
      remarks: "Partial payment received",
      status: "Partially Paid",
      lastUpdated: "2024-02-10",
    },
  ])

  const filteredFees = fees.filter((fee) => {
    const matchesSearch =
      fee.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.studentId.includes(searchTerm) ||
      fee.receiptNumber.includes(searchTerm)

    const matchesClass = !filters.class || fee.class === filters.class
    const matchesStatus = !filters.paymentStatus || fee.status === filters.paymentStatus
    const matchesMode = !filters.paymentMode || fee.paymentMode === filters.paymentMode
    const matchesDateFrom =
      !filters.dateFrom || new Date(fee.paymentDate || fee.lastUpdated) >= new Date(filters.dateFrom)
    const matchesDateTo = !filters.dateTo || new Date(fee.paymentDate || fee.lastUpdated) <= new Date(filters.dateTo)

    return matchesSearch && matchesClass && matchesStatus && matchesMode && matchesDateFrom && matchesDateTo
  })

  const handleAddFee = (newFee: any) => {
    if (editingFee) {
      setFees(fees.map((f) => (f.id === editingFee.id ? { ...newFee, id: editingFee.id } : f)))
      setEditingFee(null)
    } else {
      const fee = {
        ...newFee,
        id: `F${String(fees.length + 1).padStart(3, "0")}`,
        lastUpdated: new Date().toISOString().split("T")[0],
      }
      setFees([...fees, fee])
    }
    setShowForm(false)
  }

  const handleDeleteFee = (id: string) => {
    if (confirm("Are you sure you want to delete this fee record?")) {
      setFees(fees.filter((f) => f.id !== id))
    }
  }

  const handleEditFee = (fee: any) => {
    setEditingFee(fee)
    setShowForm(true)
  }

  const handleMarkPaid = (id: string) => {
    setFees(
      fees.map((f) =>
        f.id === id
          ? {
              ...f,
              status: "Paid",
              amountPaid: f.totalAmount,
              dueAmount: 0,
              paymentDate: new Date().toISOString().split("T")[0],
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : f,
      ),
    )
  }

  const handleExport = () => {
    const csv = [
      ["Student Name", "Class", "Total Amount", "Amount Paid", "Due Amount", "Status", "Payment Mode", "Payment Date"],
      ...filteredFees.map((f) => [
        f.studentName,
        f.class,
        f.totalAmount,
        f.amountPaid,
        f.dueAmount,
        f.status,
        f.paymentMode,
        f.paymentDate,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "fees_report.csv"
    a.click()
  }

  return (
    <div className="p-3 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Fees Management</h1>
          <p className="text-slate-400 mt-1 text-sm md:text-base">Track and manage student fee payments</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            onClick={() => {
              setEditingFee(null)
              setShowForm(!showForm)
            }}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white gap-2 flex-1 md:flex-none"
          >
            <Plus className="w-4 h-4" />
            Add Fee
          </Button>
          <Button
            onClick={handleExport}
            variant="outline"
            className="border-slate-600 text-slate-300 bg-transparent gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <FeeAnalytics fees={filteredFees} />

      {showForm && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{editingFee ? "Edit Fee Record" : "Add Fee Record"}</CardTitle>
            <CardDescription className="text-slate-400">
              {editingFee ? "Update fee payment details" : "Record a new fee payment or entry"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FeeForm
              onSubmit={handleAddFee}
              onCancel={() => {
                setShowForm(false)
                setEditingFee(null)
              }}
              initialData={editingFee}
            />
          </CardContent>
        </Card>
      )}

      <FeeFilters onFilterChange={setFilters} />

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Fee Records</CardTitle>
          <CardDescription className="text-slate-400">Total: {filteredFees.length} records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search by student name, ID, or receipt number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>
          <FeeTable
            fees={filteredFees}
            onDelete={handleDeleteFee}
            onMarkPaid={handleMarkPaid}
            onEdit={handleEditFee}
            onViewReceipt={setSelectedReceipt}
          />
        </CardContent>
      </Card>

      {selectedReceipt && <FeeReceipt fee={selectedReceipt} onClose={() => setSelectedReceipt(null)} />}
    </div>
  )
}
