"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TeacherTable from "@/components/teachers/teacher-table";
import TeacherForm from "@/components/teachers/teacher-form";
import TeacherAnalytics from "@/components/teachers/teacher-analytics";
import TeacherFilters from "@/components/teachers/teacher-filters";
import TeacherProfile from "@/components/teachers/teacher-profile";
import { Plus, Search, Download } from "lucide-react";

interface Teacher {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  subject?: string;
  qualification?: string;
  phone?: string;
  joinDate?: string;
  dob?: string;
  gender?: string;
  assignedClass?: string;
  address?: string;
  status?: string;
  lastUpdated?: string;
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const API_BASE = `${apiBaseUrl}/api/teachers`;
 

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [filters, setFilters] = useState({
    subject: "",
    class: "",
    gender: "",
    status: "All",
  });
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // centralized headers builder (always reads latest token)
  const getAuthHeaders = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    return token
      ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      : { "Content-Type": "application/json" };
  };

  // helper for 401 handling
  const handleUnauthorized = () => {
    localStorage.removeItem("authToken");
    router.push("/");
  };

  // fetch all teachers
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const res = await axios.get<Teacher[]>(`${API_BASE}/`, { headers });
      setTeachers(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      console.error("Error fetching teachers:", err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        handleUnauthorized();
      } else {
        // optional: show toast or alert
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) {
      console.error("No auth token found. Please log in.");
      router.push("/");
      return;
    }
    fetchTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch single teacher for view (used when user clicks view profile)
  const fetchTeacherById = async (id: string) => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const res = await axios.get<Teacher>(`${API_BASE}/${encodeURIComponent(id)}`, { headers });
      setSelectedTeacher(res.data);
    } catch (err: any) {
      console.error(`Error fetching teacher ${id}:`, err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        handleUnauthorized();
      } else {
        alert("Error loading teacher profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (teacher.name ?? `${teacher.firstName ?? ""} ${teacher.lastName ?? ""}`)
        .toLowerCase()
        .includes(q) ||
      (teacher.email ?? "").toLowerCase().includes(q) ||
      (teacher.subject ?? "").toLowerCase().includes(q);

    const matchesSubject = !filters.subject || teacher.subject === filters.subject;
    const matchesClass = !filters.class || teacher.assignedClass === filters.class;
    const matchesGender = !filters.gender || teacher.gender === filters.gender;
    const matchesStatus = filters.status === "All" || teacher.status === filters.status;

    return matchesSearch && matchesSubject && matchesClass && matchesGender && matchesStatus;
  });

  // Create or Update teacher via API
  const handleAddTeacher = async (newTeacher: any) => {
    try {
      const headers = getAuthHeaders();
      if (editingTeacher) {
        const id = editingTeacher.id;
        const res = await axios.put<Teacher>(
          `${API_BASE}/${encodeURIComponent(id)}`,
          { ...newTeacher },
          { headers }
        );
        // update local list
        setTeachers((prev) => prev.map((t) => (t.id === id ? res.data : t)));
        setEditingTeacher(null);
      } else {
        const res = await axios.post<Teacher>(`${API_BASE}/create`, newTeacher, { headers });
        const created = res.data;
        const teacherToAdd: Teacher = {
          ...(created || {}),
          id: created?.id || `T${String(teachers.length + 1).padStart(3, "0")}`,
        };
        setTeachers((prev) => [...prev, teacherToAdd]);
      }
      setShowForm(false);
    } catch (err: any) {
      console.error("Error saving teacher:", err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        handleUnauthorized();
      } else {
        alert("Error saving teacher. See console for details.");
      }
    }
  };

  // Delete teacher via API
  const handleDeleteTeacher = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    try {
      const headers = getAuthHeaders();
      await axios.delete(`${API_BASE}/${encodeURIComponent(id)}`, { headers });
      // remove from local list
      setTeachers((prev) => prev.filter((t) => t.id !== id));
      if (selectedTeacher?.id === id) setSelectedTeacher(null);
    } catch (err: any) {
      console.error("Error deleting teacher:", err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        handleUnauthorized();
      } else {
        alert("Error deleting teacher.");
      }
    }
  };

  // Edit (open form with teacher data)
  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setShowForm(true);
  };

  // View profile (fetch full teacher data)
  const handleViewProfile = (teacher: Teacher) => {
    if (!teacher.id) return;
    fetchTeacherById(teacher.id);
  };

  // Export currently filtered teachers to CSV (uses client-side data)
  const handleExport = () => {
    const csv = [
      ["ID", "Name", "Email", "Subject", "Class", "Gender", "Phone", "Status"],
      ...filteredTeachers.map((t) => [
        t.id,
        t.name ?? `${t.firstName ?? ""} ${t.lastName ?? ""}`.trim(),
        t.email ?? "",
        t.subject ?? "",
        t.assignedClass ?? "",
        t.gender ?? "",
        t.phone ?? "",
        t.status ?? "",
      ]),
    ]
      .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "teachers.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
