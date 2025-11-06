"use client"

import { Trash2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type TeacherDto = {
  id?: number | string
  firstName?: string
  lastName?: string
  name?: string
  // other optional fields are ignored in the table
}

type ServerSalaryDto = {
  id?: number | string
  amount?: number // BigDecimal -> number in frontend
  paymentDate?: string | null
  paymentMode?: string | null
  remarks?: string | null
  status?: string | null
  teacher?: TeacherDto | null
  // older frontend fields (optional)
  baseSalary?: number
  allowances?: number
  deductions?: number
  netSalary?: number
  month?: string
}

export default function SalaryTable({
  salaries,
  onDelete,
  onMarkPaid,
}: {
  salaries: ServerSalaryDto[]
  onDelete: (id: string | number) => void
  onMarkPaid: (id: string | number) => void
}) {
  const getStatusColor = (status?: string) => {
    switch ((status || "").toLowerCase()) {
      case "paid":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  const normalize = (s: ServerSalaryDto) => {
    // support both server DTO and old frontend shape
    const id = s.id ?? ""
    const teacherObj = s.teacher ?? ({} as TeacherDto)
    const teacherName =
      (teacherObj.name && String(teacherObj.name)) ||
      `${teacherObj.firstName ?? ""} ${teacherObj.lastName ?? ""}`.trim() ||
      `Teacher ${teacherObj.id ?? ""}` ||
      // fallback to any teacherName field from old shape
      (s as any).teacherName ||
      "Unknown"

    const teacherId = teacherObj.id ?? (s as any).teacherId ?? ""

    // amount: server uses 'amount', older version used baseSalary/netSalary
    const amount =
      typeof s.amount === "number"
        ? s.amount
        : typeof (s as any).netSalary === "number"
        ? (s as any).netSalary
        : typeof (s as any).baseSalary === "number"
        ? (s as any).baseSalary
        : 0

    const paidDate = s.paymentDate ?? (s as any).paidDate ?? null
    const paymentMode = s.paymentMode ?? (s as any).paymentMode ?? null
    const remarks = s.remarks ?? (s as any).remarks ?? null
    const status = s.status ?? (s as any).status ?? "Pending"

    // keep month if present (old UI)
    const month = s.month ?? (s as any).month ?? ""

    return { id, teacherName, teacherId, amount, paidDate, paymentMode, remarks, status, month }
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-700 hover:bg-slate-700/50">
            <TableHead className="text-slate-300">ID</TableHead>
            <TableHead className="text-slate-300">Teacher</TableHead>
            <TableHead className="text-slate-300">Amount</TableHead>
            <TableHead className="text-slate-300">Payment Date</TableHead>
            <TableHead className="text-slate-300">Payment Mode</TableHead>
            <TableHead className="text-slate-300">Remarks</TableHead>
            <TableHead className="text-slate-300">Status</TableHead>
            <TableHead className="text-slate-300">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {salaries.map((s) => {
            const row = normalize(s)
            return (
              <TableRow key={String(row.id)} className="border-slate-700 hover:bg-slate-700/50">
                <TableCell className="text-slate-300 font-medium">{String(row.id)}</TableCell>

                <TableCell className="text-slate-300">
                  <div>
                    <p className="font-medium">{row.teacherName}</p>
                    <p className="text-xs text-slate-500">#{String(row.teacherId)}</p>
                  </div>
                </TableCell>

                <TableCell className="text-slate-300">₹{Number(row.amount).toLocaleString()}</TableCell>

                <TableCell className="text-slate-300">{row.paidDate ?? "-"}</TableCell>

                <TableCell className="text-slate-300">{row.paymentMode ?? "-"}</TableCell>

                <TableCell className="text-slate-300 max-w-xs truncate">{row.remarks ?? "-"}</TableCell>

                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(row.status)}`}
                  >
                    {row.status}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    {String(row.status).toLowerCase() !== "paid" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMarkPaid(row.id)}
                        className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                        title="Mark as paid"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(row.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      title="Delete salary"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
