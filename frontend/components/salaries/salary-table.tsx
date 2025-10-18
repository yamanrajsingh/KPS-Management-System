"use client"

import { Trash2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Salary {
  id: string
  teacherId: string
  teacherName: string
  baseSalary: number
  allowances: number
  deductions: number
  netSalary: number
  month: string
  paidDate: string | null
  status: string
}

export default function SalaryTable({
  salaries,
  onDelete,
  onMarkPaid,
}: {
  salaries: Salary[]
  onDelete: (id: string) => void
  onMarkPaid: (id: string) => void
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "Pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-700 hover:bg-slate-700/50">
            <TableHead className="text-slate-300">ID</TableHead>
            <TableHead className="text-slate-300">Teacher</TableHead>
            <TableHead className="text-slate-300">Month</TableHead>
            <TableHead className="text-slate-300">Base Salary</TableHead>
            <TableHead className="text-slate-300">Allowances</TableHead>
            <TableHead className="text-slate-300">Deductions</TableHead>
            <TableHead className="text-slate-300">Net Salary</TableHead>
            <TableHead className="text-slate-300">Paid Date</TableHead>
            <TableHead className="text-slate-300">Status</TableHead>
            <TableHead className="text-slate-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salaries.map((salary) => (
            <TableRow key={salary.id} className="border-slate-700 hover:bg-slate-700/50">
              <TableCell className="text-slate-300 font-medium">{salary.id}</TableCell>
              <TableCell className="text-slate-300">
                <div>
                  <p className="font-medium">{salary.teacherName}</p>
                  <p className="text-xs text-slate-500">{salary.teacherId}</p>
                </div>
              </TableCell>
              <TableCell className="text-slate-300">{salary.month}</TableCell>
              <TableCell className="text-slate-300">₹{salary.baseSalary.toLocaleString()}</TableCell>
              <TableCell className="text-slate-300">₹{salary.allowances.toLocaleString()}</TableCell>
              <TableCell className="text-slate-300">₹{salary.deductions.toLocaleString()}</TableCell>
              <TableCell className="text-slate-300 font-bold text-cyan-400">
                ₹{salary.netSalary.toLocaleString()}
              </TableCell>
              <TableCell className="text-slate-300">{salary.paidDate || "-"}</TableCell>
              <TableCell>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(salary.status)}`}>
                  {salary.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {salary.status !== "Paid" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMarkPaid(salary.id)}
                      className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(salary.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
