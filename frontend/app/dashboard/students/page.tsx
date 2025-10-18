"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Download, Filter } from "lucide-react";
import StudentTable from "@/components/students/student-table";
import StudentForm from "@/components/students/student-form";
import StudentProfile from "@/components/students/student-profile";
import StudentStats from "@/components/students/student-stats";
import { api } from "@/lib/api";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [filterClass, setFilterClass] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/");
      setStudents(res.data); // backend should return array of students
      console.log(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch students");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = async (studentData: any) => {
    try {
      if (editingStudent) {
        await api.put(`/${editingStudent.id}`, studentData);
      } else {
        await api.post("/create", studentData);
      }
      fetchStudents();
      setShowForm(false);
      setEditingStudent(null);
    } catch (err: any) {
      console.error(err);
      alert("Failed to save student");
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;
    try {
      await api.delete(`/${id}`);
      fetchStudents();
    } catch (err: any) {
      console.error(err);
      alert("Failed to delete student");
    }
  };

  const handleViewStudent = async (id: string) => {
    try {
      const res = await api.get(`/${id}`);
      setSelectedStudent(res.data);
    } catch (err: any) {
      console.error(err);
      alert("Failed to fetch student details");
    }
  };

  // Filters
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo?.includes(searchTerm) ||
      student.guardianName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.guardianPhone?.includes(searchTerm);

    const matchesClass = !filterClass || student.className === filterClass;
    const matchesGender = !filterGender || student.gender === filterGender;
    const matchesLocation =
      !filterLocation || student.address === filterLocation;

    return matchesSearch && matchesClass && matchesGender && matchesLocation;
  });

  const uniqueClasses = [...new Set(students.map((s) => s.className))].sort();

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Class",
      "Gender",
      "Age",
      "DOB",
      "Guardian",
      "Phone",
      "Aadhaar",
      "Address",
      "Admission Date",
    ];
    const rows = filteredStudents.map((s) => [
      s.id,
      s.firstName + " " + s.lastName,
      s.className,
      s.gender,
      s.age,
      s.dob,
      s.guardianName,
      s.phone,
      s.aadhaarNumber,
      s.address,
      s.admissionDate,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Students
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Manage student records and information
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700/50 gap-2 text-sm bg-transparent"
          >
            <Download className="w-4 h-4" />{" "}
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button
            onClick={() => {
              setEditingStudent(null);
              setShowForm(!showForm);
            }}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white gap-2 w-full sm:w-auto text-sm"
          >
            <Plus className="w-4 h-4" />{" "}
            <span className="hidden sm:inline">Add Student</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <StudentStats students={students} />

      {/* Form */}
      {showForm && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg text-white">
              {editingStudent ? "Edit Student" : "Add New Student"}
            </CardTitle>
            <CardDescription className="text-xs md:text-sm text-slate-400">
              {editingStudent
                ? "Update student details"
                : "Fill in the student details"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
            <StudentForm
              onSubmit={handleAddStudent}
              onCancel={() => {
                setShowForm(false);
                setEditingStudent(null);
              }}
              initialData={editingStudent}
            />
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg text-white flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search by name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 text-sm"
              />
            </div>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Classes</option>
              {uniqueClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Location</option>
              <option value="Mahmoodpur">Mahmoodpur</option>
              <option value="Jamalpur">Jamalpur</option>
              <option value="Nagla Dleep">Nagla Dleep</option>
              <option value="Khanalampur">Khanalampur</option>
              <option value="Nagla Banzra">Nagla Banzra</option>
              <option value="Nagla Khautiya">Nagla Khautiya</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Student Table */}
      <StudentTable
        students={filteredStudents}
        onDelete={handleDeleteStudent}
        onEdit={(s) => {
          setEditingStudent(s);
          setShowForm(true);
        }}
        onView={(s) => handleViewStudent(s.id)}
      />

      {/* Student Profile */}
      {selectedStudent && (
        <StudentProfile
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}
