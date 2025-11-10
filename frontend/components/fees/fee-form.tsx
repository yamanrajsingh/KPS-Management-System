"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface FeeFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export default function FeeForm({
  onSubmit,
  onCancel,
  initialData,
}: FeeFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    studentId: "",
    academicYear: "2024-2025",
    totalAmount: "",
    amountPaid: "",
    paymentMode: "Cash",
    paymentDate: "",
    remarks: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    const t = localStorage.getItem("authToken");
    if (!t) {
      console.error("No auth token found. Please log in.");
      // redirect to login/home
      router.push("/");
      return;
    }
    setToken(t);

    if (initialData) {
      setFormData({
        studentId: initialData.studentId ?? "",
        academicYear: initialData.academicYear ?? "2024-2025",
        totalAmount:
          initialData.totalAmount !== undefined
            ? String(initialData.totalAmount)
            : "",
        amountPaid:
          initialData.amountPaid !== undefined ? String(initialData.amountPaid) : "",
        paymentMode: initialData.paymentMode ?? "Cash",
        paymentDate: initialData.paymentDate ?? "",
        remarks: initialData.remarks ?? "",
      });
    }

    setIsClient(true);
    // we intentionally do not add router/initialData to deps that would re-run unnecessarily
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.studentId || String(formData.studentId).trim() === "") {
      newErrors.studentId = "Student ID is required";
    }

    if (!formData.totalAmount || String(formData.totalAmount).trim() === "") {
      newErrors.totalAmount = "Total amount is required";
    } else if (Number.isNaN(Number(formData.totalAmount)) || Number(formData.totalAmount) < 0) {
      newErrors.totalAmount = "Total amount must be a non-negative number";
    }

    if (!formData.amountPaid || String(formData.amountPaid).trim() === "") {
      newErrors.amountPaid = "Amount paid is required";
    } else if (Number.isNaN(Number(formData.amountPaid)) || Number(formData.amountPaid) < 0) {
      newErrors.amountPaid = "Amount paid must be a non-negative number";
    }

    if (
      !newErrors.amountPaid &&
      !newErrors.totalAmount &&
      Number(formData.amountPaid) > Number(formData.totalAmount)
    ) {
      newErrors.amountPaid = "Amount paid cannot exceed total amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!token) {
      // should not happen because we check token in useEffect, but safe-guard
      alert("No auth token found. Please login again.");
      router.push("/");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      academicYear: formData.academicYear,
      totalAmount: Number(formData.totalAmount),
      amountPaid: Number(formData.amountPaid),
      paymentMode: formData.paymentMode,
      paymentDate: formData.paymentDate || null,
      remarks: formData.remarks,
    };

    try {
      const base = typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE
        ? process.env.NEXT_PUBLIC_API_BASE
        : "http://localhost:8080";

      let url = "";
      let method: "POST" | "PUT" = "POST";

      if (initialData && initialData.id) {
        // update
        url = `${base}/api/students/fee/${initialData.id}`;
        method = "PUT";
      } else {
        // create
        url = `${base}/api/students/fee/create/${encodeURIComponent(formData.studentId)}`;
        method = "POST";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // try parse JSON error, otherwise fallback to statusText
        let errMsg = `Request failed: ${res.status} ${res.statusText}`;
        try {
          const errJson = await res.json();
          if (errJson && errJson.message) errMsg = String(errJson.message);
        } catch {
          // ignore parse error
        }
        console.error("API Error:", errMsg);
        alert(errMsg);
        setIsSubmitting(false);
        return;
      }

      const data = await res.json();
      onSubmit(data);
      onCancel();

      // reset form only when creating (if you edited, typically you won't reset)
      if (!(initialData && initialData.id)) {
        setFormData({
          studentId: "",
          academicYear: "2024-2025",
          totalAmount: "",
          amountPaid: "",
          paymentMode: "Cash",
          paymentDate: "",
          remarks: "",
        });
      }
    } catch (err: any) {
      console.error("Network Error:", err);
      alert("Network error! Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient) return null;
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-300">
            Student ID *
          </label>
          <Input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            placeholder="e.g., S001"
            className={`mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 ${
              errors.studentId ? "border-red-500" : ""
            }`}
          />
          {errors.studentId && (
            <p className="text-red-400 text-xs mt-1">{errors.studentId}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">
            Academic Year
          </label>
          <Input
            type="text"
            name="academicYear"
            value={formData.academicYear}
            onChange={handleChange}
            placeholder="2024-2025"
            className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">
            Total Amount (₹) *
          </label>
          <Input
            type="number"
            name="totalAmount"
            value={formData.totalAmount}
            onChange={handleChange}
            placeholder="50000"
            className={`mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 ${
              errors.totalAmount ? "border-red-500" : ""
            }`}
          />
          {errors.totalAmount && (
            <p className="text-red-400 text-xs mt-1">{errors.totalAmount}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">
            Amount Paid (₹) *
          </label>
          <Input
            type="number"
            name="amountPaid"
            value={formData.amountPaid}
            onChange={handleChange}
            placeholder="0"
            className={`mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 ${
              errors.amountPaid ? "border-red-500" : ""
            }`}
          />
          {errors.amountPaid && (
            <p className="text-red-400 text-xs mt-1">{errors.amountPaid}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">
            Payment Mode
          </label>
          <select
            name="paymentMode"
            value={formData.paymentMode}
            onChange={handleChange}
            className="mt-1 w-full bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2"
          >
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">
            Payment Date
          </label>
          <Input
            type="date"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleChange}
            className="mt-1 bg-slate-700/50 border-slate-600 text-white"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300">Remarks</label>
        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          placeholder="Add any remarks or notes..."
          className="mt-1 w-full bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2 placeholder:text-slate-500"
          rows={3}
        />
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-slate-600 text-slate-300 bg-transparent"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
        >
          {initialData ? "Update Fee Record" : "Add Fee Record"}
        </Button>
      </div>
    </form>
  );
}
