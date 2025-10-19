"use client"

import { Trash2, CheckCircle, Edit2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Fee {
  id: string
  studentId: string
  studentName: string
  class: string
  academicYear: string
  totalAmount: number
  amountPaid: number
  dueAmount: number
  paymentMode: string
  paymentDate: string | null
  receiptNumber: string
  remarks: string
  status: string
  lastUpdated: string
}

export default function FeeTable({
  fees,
  onDelete,
  onMarkPaid,
  onEdit,
  onViewReceipt,
}: {
  fees: Fee[]
  onDelete: (id: string) => void
  onMarkPaid: (id: string) => void
  onEdit: (fee: Fee) => void
  onViewReceipt: (fee: Fee) => void
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "Pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "Partially Paid":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "Overdue":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  if (fees.length === 0) {
    return <div className="text-center text-slate-400 py-8">No fee records found</div>
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700 hover:bg-slate-700/50">
              <TableHead className="text-slate-300">Student</TableHead>
              <TableHead className="text-slate-300">Class</TableHead>
              <TableHead className="text-slate-300">Total</TableHead>
              <TableHead className="text-slate-300">Paid</TableHead>
              <TableHead className="text-slate-300">Due</TableHead>
              <TableHead className="text-slate-300">Mode</TableHead>
               <TableHead className="text-slate-300">Payment Date</TableHead>
              <TableHead className="text-slate-300">Status</TableHead>
              <TableHead className="text-slate-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fees.map((fee) => (
              <TableRow key={fee.id} className="border-slate-700 hover:bg-slate-700/50">
                <TableCell className="text-slate-300">
                  <div>
                    <p className="font-medium">{fee.studentName}</p>
                    <p className="text-xs text-slate-500">{fee.studentId}</p>
                  </div>
                </TableCell>
                <TableCell className="text-slate-300">{fee.class}</TableCell>
                <TableCell className="text-slate-300 font-medium">₹{fee.totalAmount.toLocaleString()}</TableCell>
                <TableCell className="text-slate-300 font-medium">₹{fee.amountPaid.toLocaleString()}</TableCell>
                <TableCell className="text-slate-300 font-medium">₹{fee.dueAmount.toLocaleString()}</TableCell>
                <TableCell className="text-slate-300 text-sm">{fee.paymentMode || "-"}</TableCell>
                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(fee.status)}`}>
                    {fee.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewReceipt(fee)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                      title="View Receipt"
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(fee)}
                      className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    {fee.status !== "Paid" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMarkPaid(fee.id)}
                        className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                        title="Mark Paid"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(fee.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      title="Delete"
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {fees.map((fee) => (
          <div key={fee.id} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-white">{fee.studentName}</p>
                <p className="text-xs text-slate-400">{fee.studentId}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(fee.status)}`}>
                {fee.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-slate-400">Class</p>
                <p className="text-white font-medium">{fee.class}</p>
              </div>
              <div>
                <p className="text-slate-400">Mode</p>
                <p className="text-white font-medium">{fee.paymentMode || "-"}</p>
              </div>
              <div>
                <p className="text-slate-400">Total</p>
                <p className="text-white font-medium">₹{fee.totalAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-400">Paid</p>
                <p className="text-white font-medium">₹{fee.amountPaid.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewReceipt(fee)}
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 flex-1"
              >
                <FileText className="w-4 h-4 mr-1" />
                Receipt
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(fee)}
                className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 flex-1"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(fee.id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 flex-1"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
