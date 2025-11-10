"use client";

import React, { useEffect, useState } from "react";
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
import SalaryTable from "@/components/salaries/salary-table";
import SalaryForm from "@/components/salaries/salary-form";
import { Plus, Search, Wallet, TrendingUp, Calendar } from "lucide-react";

type TeacherDto = {
  id?: number;
  firstName?: string;
  lastName?: string;
  name?: string;
};

type SalaryDto = {
  id?: number;
  amount: number;
  paymentDate: string;
  paymentMode?: string;
  status?: string;
  remarks?: string | null;
  teacher?: TeacherDto | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export default function SalariesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [salaries, setSalaries] = useState<SalaryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleUnauthorized = () => {
    localStorage.removeItem("authToken");
    router.push("/");
  };

  // fetch list from GET /api/teacher/salary/
  const fetchSalaries = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeaders();
      const res = await axios.get(`${API_BASE}/api/teacher/salary/`, { headers });
      const data = res.data;
      if (Array.isArray(data)) {
        setSalaries(data);
      } else if (data?.data && Array.isArray(data.data)) {
        setSalaries(data.data);
      } else {
        // if server returns single object or unexpected shape, attempt to coerce
        setSalaries(Array.isArray(data) ? data : []);
      }
    } catch (err: any) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        handleUnauthorized();
      } else {
        setError(err?.message ?? "Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) {
      router.push("/");
      return;
    }
    fetchSalaries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // helper to get display name from teacher DTO
  const getTeacherName = (t?: TeacherDto | null) => {
    if (!t) return "Unknown";
    if (t.name && typeof t.name === "string") return t.name;
    if (t.firstName || t.lastName) return `${t.firstName ?? ""} ${t.lastName ?? ""}`.trim();
    if (t.id) return `Teacher #${t.id}`;
    return "Teacher";
  };

  const filteredSalaries = salaries.filter((s) => {
    const teacherName = getTeacherName(s.teacher).toLowerCase();
    const q = searchTerm.trim().toLowerCase();
    return (
      teacherName.includes(q) ||
      String(s.teacher?.id ?? "").includes(q) ||
      String(s.id ?? "").includes(q) ||
      (s.status ?? "").toLowerCase().includes(q)
    );
  });

  // stats (using amount as net paid)
  const stats = {
    totalPaid: salaries
      .filter((s) => (s.status ?? "").toLowerCase() === "paid")
      .reduce((sum, s) => sum + (Number(s.amount ?? 0) || 0), 0),
    pending: salaries.filter((s) => (s.status ?? "").toLowerCase() === "pending").length,
    averageSalary:
      salaries.length > 0
        ? Math.round(salaries.reduce((sum, s) => sum + (Number(s.amount ?? 0) || 0), 0) / salaries.length)
        : 0,
  };

  /**
   * handleAddSalary
   * SalaryForm must call onSubmit with payload:
   * { teacherId: number|string, amount: number|string, paymentDate: "YYYY-MM-DD", paymentMode: string, status: string, remarks?: string }
   *
   * Endpoint: POST /api/teacher/salary/create/{teacherId}
   */
  const handleAddSalary = async (newSalary: Partial<SalaryDto> & { teacherId: number | string }) => {
    setSaving(true);
    setError(null);
    try {
      const teacherId = newSalary.teacherId;
      if (!teacherId) throw new Error("teacherId is required to create salary");

      const payload = {
        amount: Number(newSalary.amount ?? 0),
        paymentDate: newSalary.paymentDate ?? new Date().toISOString().split("T")[0],
        paymentMode: newSalary.paymentMode ?? "Bank Transfer",
        status: newSalary.status ?? "Paid",
        remarks: newSalary.remarks ?? null,
      };

      const headers = getAuthHeaders();
      const res = await axios.post(
        `${API_BASE}/api/teacher/salary/create/${encodeURIComponent(String(teacherId))}`,
        payload,
        { headers },
      );

      const created: SalaryDto = res.data;
      setSalaries((prev) => [...prev, created]);
      setShowForm(false);
    } catch (err: any) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        handleUnauthorized();
      } else {
        setError(err?.message ?? "Failed to add salary");
        alert(err?.message ?? "Failed to add salary");
      }
    } finally {
      setSaving(false);
    }
  };

  /**
   * Delete salary
   * DELETE /api/teacher/salary/{salaryId}
   */
  const handleDeleteSalary = async (id?: number | string) => {
    if (!id) return;
    if (!confirm("Delete this salary record?")) return;

    const prev = salaries;
    setSalaries((s) => s.filter((x) => String(x.id) !== String(id)));

    try {
      const headers = getAuthHeaders();
      const res = await axios.delete(`${API_BASE}/api/teacher/salary/${encodeURIComponent(String(id))}`, { headers });
      if (res.status >= 400) throw new Error(`Delete failed (${res.status})`);
    } catch (err: any) {
      console.error(err);
      setSalaries(prev); // rollback
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        handleUnauthorized();
      } else {
        alert(err?.message ?? "Failed to delete salary on server");
      }
    }
  };

  /**
   * Mark paid
   * Try PATCH /api/teacher/salary/{salaryId}
   * Fallback to PUT if PATCH not supported.
   */
  const handleMarkPaid = async (id?: number | string) => {
    if (!id) return;
    const paidDate = new Date().toISOString().split("T")[0];

    // optimistic update
    const prev = salaries;
    setSalaries((s) =>
      s.map((x) =>
        String(x.id) === String(id)
          ? {
              ...x,
              status: "Paid",
              paymentDate: paidDate,
            }
          : x,
      ),
    );

    try {
      const headers = getAuthHeaders();
      // attempt PATCH
      try {
        const res = await axios.patch(
          `${API_BASE}/api/teacher/salary/${encodeURIComponent(String(id))}`,
          { status: "Paid", paymentDate: paidDate },
          { headers },
        );
        if (res.status >= 400) throw new Error(`Patch failed (${res.status})`);
      } catch (patchErr) {
        // fallback to PUT
        const res = await axios.put(
          `${API_BASE}/api/teacher/salary/${encodeURIComponent(String(id))}`,
          { status: "Paid", paymentDate: paidDate },
          { headers },
        );
        if (res.status >= 400) throw new Error(`Put fallback failed (${res.status})`);
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? "Failed to mark paid on server; UI was updated optimistically.");
      // rollback by re-fetching to ensure consistent state
      await fetchSalaries();
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        handleUnauthorized();
      }
    }
  };


  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Salaries</h1>
          <p className="text-slate-400 mt-1">Manage teacher salaries and payments</p>
        </div>
        <Button
          onClick={() => setShowForm((s) => !s)}
          className="bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-700 hover:to-cyan-700 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Salary Record
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Paid</p>
                <p className="text-2xl font-bold text-white mt-2">₹{(stats.totalPaid / 100000).toFixed(2)}L</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Pending Payments</p>
                <p className="text-2xl font-bold text-white mt-2">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Average Amount</p>
                <p className="text-2xl font-bold text-white mt-2">₹{(stats.averageSalary / 1000).toFixed(1)}K</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Add Salary Record</CardTitle>
            <CardDescription className="text-slate-400">Record a new salary payment</CardDescription>
          </CardHeader>
          <CardContent>
            {/* SalaryForm should call onSubmit({ teacherId, amount, paymentDate, paymentMode, status, remarks }) */}
            <SalaryForm onSubmit={handleAddSalary} onCancel={() => setShowForm(false)} saving={saving} />
          </CardContent>
        </Card>
      )}

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Salary Records</CardTitle>
          <CardDescription className="text-slate-400">Total: {salaries.length} records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search by teacher name, teacher ID, salary ID or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          {loading ? (
            <p className="text-slate-400">Loading...</p>
          ) : error ? (
            <p className="text-red-400">Error: {error}</p>
          ) : (
            <SalaryTable
              salaries={filteredSalaries}
              onDelete={(id) => handleDeleteSalary(id)}
              onMarkPaid={(id) => handleMarkPaid(id)}
              getTeacherName={getTeacherName}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
