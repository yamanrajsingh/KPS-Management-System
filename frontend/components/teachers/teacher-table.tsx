"use client"

import { Trash2, Eye, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Teacher {
  id: string
  name: string
  email: string
  subject: string
  qualification: string
  phone: string
  joinDate: string
  gender: string
  assignedClass: string
  status: string
}

export default function TeacherTable({
  teachers,
  onDelete,
  onEdit,
  onViewProfile,
}: {
  teachers: Teacher[]
  onDelete: (id: string) => void
  onEdit: (teacher: Teacher) => void
  onViewProfile: (teacher: Teacher) => void
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-700 hover:bg-slate-700/50">
            <TableHead className="text-slate-300">ID</TableHead>
            <TableHead className="text-slate-300">Name</TableHead>
            <TableHead className="text-slate-300">Subject</TableHead>
            <TableHead className="text-slate-300">Class</TableHead>
            <TableHead className="text-slate-300">Gender</TableHead>
            <TableHead className="text-slate-300">Phone</TableHead>
            <TableHead className="text-slate-300">Status</TableHead>
            <TableHead className="text-slate-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((teacher) => (
            <TableRow key={teacher.id} className="border-slate-700 hover:bg-slate-700/50">
              <TableCell className="text-slate-300 font-medium">{teacher.id}</TableCell>
              <TableCell className="text-slate-300">{teacher.name}</TableCell>
              <TableCell className="text-slate-300">{teacher.subject}</TableCell>
              <TableCell className="text-slate-300">{teacher.assignedClass}</TableCell>
              <TableCell className="text-slate-300">{teacher.gender}</TableCell>
              <TableCell className="text-slate-300">{teacher.phone}</TableCell>
              <TableCell>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                  {teacher.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewProfile(teacher)}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(teacher)}
                    className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(teacher.id)}
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
