"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import TeacherTable from "@/components/teachers/teacher-table"
import TeacherForm from "@/components/teachers/teacher-form"
import TeacherAnalytics from "@/components/teachers/teacher-analytics"
import TeacherFilters from "@/components/teachers/teacher-filters"
import TeacherProfile from "@/components/teachers/teacher-profile"
import { Plus, Search, Download } from "lucide-react"

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState(null)
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [filters, setFilters] = useState({
    subject: "",
    class: "",
    gender: "",
    status: "All",
  })
  const [teachers, setTeachers] = useState([
    {
      id: "T001",
      firstName: "Rajesh",
      lastName: "Kumar",
      name: "Dr. Rajesh Kumar",
      email: "rajesh@school.com",
      subject: "Mathematics",
      qualification: "M.Sc, B.Ed",
      phone: "9876543220",
      joinDate: "2020-06-15",
      dob: "1985-03-20",
      gender: "Male",
      assignedClass: "10th A",
      address: "123 Main St, City",
      status: "Active",
      lastUpdated: "2024-02-15",
    },
    {
      id: "T002",
      firstName: "Priya",
      lastName: "Sharma",
      name: "Ms. Priya Sharma",
      email: "priya.s@school.com",
      subject: "English",
      qualification: "M.A, B.Ed",
      phone: "9876543221",
      joinDate: "2021-07-20",
      dob: "1988-05-10",
      gender: "Female",
      assignedClass: "9th B",
      address: "456 Oak Ave, City",
      status: "Active",
      lastUpdated: "2024-02-15",
    },
    {
      id: "T003",
      firstName: "Vikram",
      lastName: "Singh",
      name: "Mr. Vikram Singh",
      email: "vikram.s@school.com",
      subject: "Science",
      qualification: "M.Sc, B.Ed",
      phone: "9876543222",
      joinDate: "2019-08-10",
      dob: "1982-11-15",
      gender: "Male",
      assignedClass: "10th B",
      address: "789 Pine Rd, City",
      status: "Active",
      lastUpdated: "2024-02-15",
    },
    {
      id: "T004",
      firstName: "Anjali",
      lastName: "Patel",
      name: "Ms. Anjali Patel",
      email: "anjali@school.com",
      subject: "History",
      qualification: "M.A, B.Ed",
      phone: "9876543223",
      joinDate: "2022-01-05",
      dob: "1990-07-22",
      gender: "Female",
      assignedClass: "8th A",
      address: "321 Elm St, City",
      status: "Active",
      lastUpdated: "2024-02-15",
    },
    {
      id: "T005",
      firstName: "Arjun",
      lastName: "Desai",
      name: "Mr. Arjun Desai",
      email: "arjun@school.com",
      subject: "Physical Education",
      qualification: "B.P.Ed",
      phone: "9876543224",
      joinDate: "2021-03-12",
      dob: "1987-09-08",
      gender: "Male",
      assignedClass: "All Classes",
      address: "654 Birch Ln, City",
      status: "Active",
      lastUpdated: "2024-02-15",
    },
  ])

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSubject = !filters.subject || teacher.subject === filters.subject
    const matchesClass = !filters.class || teacher.assignedClass === filters.class
    const matchesGender = !filters.gender || teacher.gender === filters.gender
    const matchesStatus = filters.status === "All" || teacher.status === filters.status

    return matchesSearch && matchesSubject && matchesClass && matchesGender && matchesStatus
  })

  const handleAddTeacher = (newTeacher: any) => {
    if (editingTeacher) {
      setTeachers(
        teachers.map((t) =>
          t.id === editingTeacher.id
            ? {
                ...newTeacher,
                id: editingTeacher.id,
                lastUpdated: new Date().toISOString().split("T")[0],
              }
            : t,
        ),
      )
      setEditingTeacher(null)
    } else {
      const teacher = {
        ...newTeacher,
        id: `T${String(teachers.length + 1).padStart(3, "0")}`,
        lastUpdated: new Date().toISOString().split("T")[0],
      }
      setTeachers([...teachers, teacher])
    }
    setShowForm(false)
  }

  const handleDeleteTeacher = (id: string) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      setTeachers(teachers.filter((t) => t.id !== id))
    }
  }

  const handleEditTeacher = (teacher: any) => {
    setEditingTeacher(teacher)
    setShowForm(true)
  }

  const handleExport = () => {
    const csv = [
      ["ID", "Name", "Email", "Subject", "Class", "Gender", "Phone", "Status"],
      ...filteredTeachers.map((t) => [t.id, t.name, t.email, t.subject, t.assignedClass, t.gender, t.phone, t.status]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "teachers.csv"
    a.click()
  }

  return (
    <div className="p-3 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Teachers</h1>
          <p className="text-slate-400 mt-1 text-sm md:text-base">Manage teacher records and assignments</p>
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
            <CardTitle className="text-white">{editingTeacher ? "Edit Teacher" : "Add New Teacher"}</CardTitle>
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
            onViewProfile={setSelectedTeacher}
          />
        </CardContent>
      </Card>

      {selectedTeacher && <TeacherProfile teacher={selectedTeacher} onClose={() => setSelectedTeacher(null)} />}
    </div>
  )
}
