"use client";

import { useEffect, useState } from "react";
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
import FeeTable from "@/components/fees/fee-table";
import FeeForm from "@/components/fees/fee-form";
import FeeAnalytics from "@/components/fees/fee-analytics";
import FeeFilters from "@/components/fees/fee-filters";
import FeeReceipt from "@/components/fees/fee-receipt";
import { Plus, Search, Download } from "lucide-react";

export default function FeesPage() {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingFee, setEditingFee] = useState<any>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [filters, setFilters] = useState({
    class: "",
    paymentStatus: "",
    paymentMode: "",
    dateFrom: "",
    dateTo: "",
  });
    const [currentPage, setCurrentPage] = useState(0); // zero-based page
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("asc");

  const BASE_URL = "http://localhost:8080/api/students/fee";

  // 🟢 FETCH ALL FEES
  const fetchFees = async () => {
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL + "/");
      const formatted = res.data.map((f: any) => ({
        id: f.id,
        studentId: f.studentId,
        studentName: `${f.student.firstName} ${f.student.lastName}`,
        class: f.student.className,
        academicYear: f.academicYear,
        totalAmount: f.totalAmount,
        amountPaid: f.amountPaid,
        dueAmount: f.dueAmount,
        paymentMode: f.paymentMode,
        paymentDate: f.paymentDate,
        receiptNumber: f.receiptNumber,
        remarks: f.remarks,
        status: f.status,
        lastUpdated: f.paymentDate,
      }));
      setFees(formatted);
    } catch (error) {
      console.error("Error fetching fees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  // 🟡 ADD OR UPDATE FEE
  const handleAddFee = async (newFee: any) => {
    try {
      if (editingFee) {
        // Only send fields your backend expects
        const payload = {
          academicYear: newFee.academicYear,
          totalAmount: newFee.totalAmount,
          amountPaid: newFee.amountPaid,
          paymentDate: newFee.paymentDate,
          paymentMode: newFee.paymentMode,
          remarks: newFee.remarks,
        };
        await axios.put(`${BASE_URL}/${editingFee.id}`, payload);
      } else {
        const payload = {
          studentId: newFee.studentId, // only for new record
          academicYear: newFee.academicYear,
          totalAmount: newFee.totalAmount,
          amountPaid: newFee.amountPaid,
          paymentDate: newFee.paymentDate,
          paymentMode: newFee.paymentMode,
          remarks: newFee.remarks,
        };
        await axios.post(BASE_URL + "/", payload);
      }
      fetchFees();
      setShowForm(false);
      setEditingFee(null);
    } catch (error) {
      console.error("Error saving fee:", error);
    }
  };

  // 🔴 DELETE FEE
  const handleDeleteFee = async (id: number) => {
    if (confirm("Are you sure you want to delete this fee record?")) {
      try {
        await axios.delete(`${BASE_URL}/${id}`);
        fetchFees();
      } catch (error) {
        console.error("Error deleting fee:", error);
      }
    }
  };

  // 🟠 EDIT MODE
  const handleEditFee = async (fee: any) => {
    try {
      // Fetch latest fee data from backend
      const res = await axios.get(`${BASE_URL}/fId/${fee.id}`);
      const f = res.data;
      const formatted = {
        id: f.id,
        studentId: f.studentId,
        studentName: `${f.student.firstName} ${f.student.lastName}`,
        class: f.student.className,
        academicYear: f.academicYear,
        totalAmount: f.totalAmount,
        amountPaid: f.amountPaid,
        dueAmount: f.dueAmount,
        paymentMode: f.paymentMode,
        paymentDate: f.paymentDate,
        receiptNumber: f.receiptNumber,
        remarks: f.remarks,
        status: f.status,
      };
      setEditingFee(formatted);
      setShowForm(true);
    } catch (error) {
      console.error("Error fetching fee by ID:", error);
    }
  };

  // 🟣 MARK AS PAID
  const handleMarkPaid = async (id: number) => {
    try {
      const feeToUpdate = fees.find((f) => f.id === id);
      if (!feeToUpdate) return;
      const updatedFee = {
        academicYear: feeToUpdate.academicYear,
        totalAmount: feeToUpdate.totalAmount,
        amountPaid: feeToUpdate.totalAmount,
        paymentDate: new Date().toISOString().split("T")[0],
        paymentMode: feeToUpdate.paymentMode,
        remarks: feeToUpdate.remarks,
      };
      await axios.put(`${BASE_URL}/${id}`, updatedFee);
      fetchFees();
    } catch (error) {
      console.error("Error marking fee as paid:", error);
    }
  };

  // 🔵 EXPORT AS CSV
  const handleExport = () => {
    const csv = [
      [
        "Student Name",
        "Class",
        "Total Amount",
        "Amount Paid",
        "Due Amount",
        "Status",
        "Payment Mode",
        "Payment Date",
      ],
      ...fees.map((f) => [
        f.studentName,
        f.class,
        f.totalAmount,
        f.amountPaid,
        f.dueAmount,
        f.status,
        f.paymentMode,
        f.paymentDate,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fees_report.csv";
    a.click();
  };

  // 🧩 Apply Filters and Search
  const filteredFees = fees.filter((fee) => {
    const matchesSearch =
      fee.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(fee.studentId).includes(searchTerm) ||
      fee.receiptNumber.includes(searchTerm);

    const matchesClass = !filters.class || fee.class === filters.class;
    const matchesStatus =
      !filters.paymentStatus || fee.status === filters.paymentStatus;
    const matchesMode =
      !filters.paymentMode || fee.paymentMode === filters.paymentMode;
    const matchesDateFrom =
      !filters.dateFrom ||
      new Date(fee.paymentDate || fee.lastUpdated) >=
        new Date(filters.dateFrom);
    const matchesDateTo =
      !filters.dateTo ||
      new Date(fee.paymentDate || fee.lastUpdated) <= new Date(filters.dateTo);

    return (
      matchesSearch &&
      matchesClass &&
      matchesStatus &&
      matchesMode &&
      matchesDateFrom &&
      matchesDateTo
    );
  });

  return (
    <div className="p-3 md:p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Fees Management
          </h1>
          <p className="text-slate-400 mt-1 text-sm md:text-base">
            Track and manage student fee payments
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            onClick={() => {
              setEditingFee(null);
              setShowForm(!showForm);
            }}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white gap-2 flex-1 md:flex-none"
          >
            <Plus className="w-4 h-4" />
            Add Fee
          </Button>
          <Button
            onClick={handleExport}
            variant="outline"
            className="border-slate-600 text-slate-300 bg-transparent gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <FeeAnalytics fees={filteredFees} />

      {showForm && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              {editingFee ? "Edit Fee Record" : "Add Fee Record"}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {editingFee
                ? "Update fee payment details"
                : "Record a new fee payment or entry"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FeeForm
              onSubmit={handleAddFee}
              onCancel={() => {
                setShowForm(false);
                setEditingFee(null);
              }}
              initialData={editingFee}
            />
          </CardContent>
        </Card>
      )}

      <FeeFilters onFilterChange={setFilters} />

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Fee Records</CardTitle>
          <CardDescription className="text-slate-400">
            {loading ? "Loading..." : `Total: ${filteredFees.length} records`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search by student name, ID, or receipt number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>
          <FeeTable
            fees={filteredFees}
            onDelete={handleDeleteFee}
            onMarkPaid={handleMarkPaid}
            onEdit={handleEditFee}
            onViewReceipt={setSelectedReceipt}
          />

            <div className="flex items-center justify-center gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          Previous
        </Button>

        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
            <Button
              key={page}
              size="sm"
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
            >
              {page + 1}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
          }
          disabled={currentPage === totalPages - 1}
        >
          Next
        </Button>
      </div>
        </CardContent>
      </Card>

      {selectedReceipt && (
        <FeeReceipt
          fee={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
}
