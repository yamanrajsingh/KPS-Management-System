"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import TeacherTable from "@/components/teachers/teacher-table"
import TeacherForm from "@/components/teachers/teacher-form"
import TeacherAnalytics from "@/components/teachers/teacher-analytics"
import TeacherFilters from "@/components/teachers/teacher-filters"
import TeacherProfile from "@/components/teachers/teacher-profile"
import { Plus, Search, Download } from "lucide-react"

interface Teacher {
  id: string
  firstName?: string
  lastName?: string
  name: string
  email?: string
  subject?: string
  qualification?: string
  phone?: string
  joinDate?: string
  dob?: string
  gender?: string
  assignedClass?: string
  address?: string
  status?: string
  lastUpdated?: string
}

const API_BASE = "http://localhost:8080/api/teachers"

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [filters, setFilters] = useState({
    subject: "",
    class: "",
    gender: "",
    status: "All",
  })
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(false)

  // fetch all teachers
  const fetchTeachers = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/`)
      if (!res.ok) throw new Error(`Failed to fetch teachers: ${res.status}`)
      const data = await res.json()
      // assume backend returns array of teachers
      setTeachers(Array.isArray(data) ? data : [])
    } catch (err: any) {
      console.error(err)
      alert("Error loading teachers. See console for details.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [])

  // fetch single teacher for view (used when user clicks view profile)
  const fetchTeacherById = async (id: string) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`)
      if (!res.ok) throw new Error(`Failed to fetch teacher ${id}: ${res.status}`)
      const data = await res.json()
      setSelectedTeacher(data)
    } catch (err) {
      console.error(err)
      alert("Error loading teacher profile.")
    } finally {
      setLoading(false)
    }
  }

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSubject = !filters.subject || teacher.subject === filters.subject
    const matchesClass = !filters.class || teacher.assignedClass === filters.class
    const matchesGender = !filters.gender || teacher.gender === filters.gender
    const matchesStatus = filters.status === "All" || teacher.status === filters.status

    return matchesSearch && matchesSubject && matchesClass && matchesGender && matchesStatus
  })

  // Create or Update teacher via API
  const handleAddTeacher = async (newTeacher: any) => {
    try {
      // if editingTeacher exists -> update
      if (editingTeacher) {
        const id = editingTeacher.id
        const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newTeacher }), // send fields to backend
        })
        if (!res.ok) {
          const text = await res.text()
          throw new Error(`Update failed: ${res.status} ${text}`)
        }
        const updated = await res.json()
        // update local list
        setTeachers((prev) => prev.map((t) => (t.id === id ? updated : t)))
        setEditingTeacher(null)
      } else {
        // create new teacher
        const res = await fetch(`${API_BASE}/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTeacher),
        })
        if (!res.ok) {
          const text = await res.text()
          throw new Error(`Create failed: ${res.status} ${text}`)
        }
        const created = await res.json()
        // backend may return created teacher with id — prefer that, fallback to local id generation
        const teacherToAdd: Teacher = {
          ...(created || {}),
          id: created?.id || `T${String(teachers.length + 1).padStart(3, "0")}`,
        }
        setTeachers((prev) => [...prev, teacherToAdd])
      }
      setShowForm(false)
    } catch (err: any) {
      console.error(err)
      alert("Error saving teacher. See console for details.")
    }
  }

  // Delete teacher via API
  const handleDeleteTeacher = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return
    try {
      const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Delete failed: ${res.status} ${text}`)
      }
      // remove from local list
      setTeachers((prev) => prev.filter((t) => t.id !== id))
      // if deleted teacher was selected, close profile
      if (selectedTeacher?.id === id) setSelectedTeacher(null)
    } catch (err) {
      console.error(err)
      alert("Error deleting teacher.")
    }
  }

  // Edit (open form with teacher data)
  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher)
    setShowForm(true)
  }

  // View profile (fetch full teacher data)
  const handleViewProfile = (teacher: Teacher) => {
    // if teacher already has full data you can set it directly, otherwise fetch
    // We'll fetch to ensure we have freshest detail from backend
    if (!teacher.id) return
    fetchTeacherById(teacher.id)
  }

  // Export currently filtered teachers to CSV (uses client-side data)
  const handleExport = () => {
    const csv = [
      ["ID", "Name", "Email", "Subject", "Class", "Gender", "Phone", "Status"],
      ...filteredTeachers.map((t) => [
        t.id,
        t.name ?? "",
        t.email ?? "",
        t.subject ?? "",
        t.assignedClass ?? "",
        t.gender ?? "",
        t.phone ?? "",
        t.status ?? "",
      ]),
    ]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "teachers.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="p-3 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Teachers</h1>
          <p className="text-slate-400 mt-1 text-sm md:text-base">
            Manage teacher records and assignments
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            onClick={handleExport}
            variant="outline"
            className="border-slate-600 text-slate-300 bg-transparent hover:bg-slate-700/50 gap-2 flex-1 md:flex-none"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            onClick={() => {
              setEditingTeacher(null)
              setShowForm(!showForm)
            }}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white gap-2 flex-1 md:flex-none"
          >
            <Plus className="w-4 h-4" />
            Add Teacher
          </Button>
        </div>
      </div>

      <TeacherAnalytics teachers={teachers} />

      <TeacherFilters filters={filters} setFilters={setFilters} teachers={teachers} />

      {showForm && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {editingTeacher ? "Update teacher details below" : "Fill in the teacher details below"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TeacherForm
              initialData={editingTeacher}
              onSubmit={handleAddTeacher}
              onCancel={() => {
                setShowForm(false)
                setEditingTeacher(null)
              }}
            />
          </CardContent>
        </Card>
      )}

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Teacher List</CardTitle>
          <CardDescription className="text-slate-400">
            Showing {filteredTeachers.length} of {teachers.length} teachers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>
          <TeacherTable
            teachers={filteredTeachers}
            onDelete={handleDeleteTeacher}
            onEdit={handleEditTeacher}
            onViewProfile={handleViewProfile}
          />
          {loading && <div className="text-sm text-slate-400 mt-2">Loading...</div>}
        </CardContent>
      </Card>

      {selectedTeacher && <TeacherProfile teacher={selectedTeacher} onClose={() => setSelectedTeacher(null)} />}
    </div>
  )
}
