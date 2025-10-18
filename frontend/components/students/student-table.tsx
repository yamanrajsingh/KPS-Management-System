"use client"

import { Trash2, Eye, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Student {
  id: number
  firstName: string
  lastName: string
  className: string
  age: number
  dob: string
  gender: string
  phone: string
  guardianName: string
  guardianPhone: string
  aadhaarNumber: string
  address: string
  admissionDate: string
  // feeStatus: string
}

export default function StudentTable({
  students,
  onDelete,
  onEdit,
  onView,
}: {
  students: Student[]
  onDelete: (id: number) => void
  onEdit: (student: Student) => void
  onView: (student: Student) => void
}) {
// const getFeeStatusColor = (status: string) => {
//    switch (status) { 
//     case "Paid": return "bg-green-500/10 text-green-400 border-green-500/20" 
//     case "Pending": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
//      case "Overdue": return "bg-red-500/10 text-red-400 border-red-500/20" 
//      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20"
//      } }

  if (students.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">No students found</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700 hover:bg-slate-700/50">
              <TableHead className="text-slate-300 text-xs md:text-sm">ID</TableHead>
              <TableHead className="text-slate-300 text-xs md:text-sm">Name</TableHead>
              <TableHead className="text-slate-300 text-xs md:text-sm">Class</TableHead>
              <TableHead className="text-slate-300 text-xs md:text-sm">Age</TableHead>
              <TableHead className="text-slate-300 text-xs md:text-sm">DOB</TableHead>
              <TableHead className="text-slate-300 text-xs md:text-sm">Gender</TableHead>
              <TableHead className="text-slate-300 text-xs md:text-sm">Phone</TableHead>
              <TableHead className="text-slate-300 text-xs md:text-sm">Guardian</TableHead>
              <TableHead className="text-slate-300 text-xs md:text-sm">Guardian Phone</TableHead>
              <TableHead className="text-slate-300 text-xs md:text-sm">Aadhaar</TableHead>
              <TableHead className="text-slate-300 text-xs md:text-sm">Address</TableHead>
              <TableHead className="text-slate-300 text-xs md:text-sm">Admission Date</TableHead>
              {/* <TableHead className="text-slate-300 text-xs md:text-sm">Fee Status</TableHead> */}
              <TableHead className="text-slate-300 text-xs md:text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id} className="border-slate-700 hover:bg-slate-700/50">
                <TableCell className="text-slate-300 font-medium text-xs md:text-sm">{student.id}</TableCell>
                <TableCell className="text-slate-300 text-xs md:text-sm">{student.firstName} {student.lastName}</TableCell>
                <TableCell className="text-slate-300 text-xs md:text-sm">{student.className}</TableCell>
                <TableCell className="text-slate-300 text-xs md:text-sm">{student.age}</TableCell>
                <TableCell className="text-slate-300 text-xs md:text-sm">{student.dob}</TableCell>
                <TableCell className="text-slate-300 text-xs md:text-sm">{student.gender}</TableCell>
                <TableCell className="text-slate-300 text-xs md:text-sm">{student.phone}</TableCell>
                <TableCell className="text-slate-300 text-xs md:text-sm">{student.guardianName}</TableCell>
                <TableCell className="text-slate-300 text-xs md:text-sm">{student.guardianPhone}</TableCell>
                <TableCell className="text-slate-300 text-xs md:text-sm">{student.aadhaarNumber}</TableCell>
                <TableCell className="text-slate-300 text-xs md:text-sm">{student.address}</TableCell>
                <TableCell className="text-slate-300 text-xs md:text-sm">{student.admissionDate}</TableCell>
                {/* <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getFeeStatusColor(student.feeStatus)}`}
                  >
                    {student.feeStatus}
                  </span>
                </TableCell> */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onView(student)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(student)} className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(student.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          
        </Table>
      </div>
    </>
  )
}
