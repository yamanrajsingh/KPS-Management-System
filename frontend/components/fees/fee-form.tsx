"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const [formData, setFormData] = useState({
    studentId: "",
    academicYear: "2024-2025",
    totalAmount: "",
    amountPaid: "",
    paymentMode: "Cash",
    paymentDate: "",
    remarks: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        studentId: initialData.studentId,
        academicYear: initialData.academicYear,
        totalAmount: initialData.totalAmount.toString(),
        amountPaid: initialData.amountPaid.toString(),
        paymentMode: initialData.paymentMode,
        paymentDate: initialData.paymentDate || "",
        remarks: initialData.remarks,
      });
    }
    setIsClient(true);
  }, [initialData]);

  const validateForm = () => {
    const newErrors: any = {};

    // Convert to string before trim or just check for falsy value
    if (!formData.studentId || String(formData.studentId).trim() === "") {
      newErrors.studentId = "Student ID is required";
    }

    if (!formData.totalAmount)
      newErrors.totalAmount = "Total amount is required";
    if (!formData.amountPaid) newErrors.amountPaid = "Amount paid is required";

    if (Number(formData.amountPaid) > Number(formData.totalAmount)) {
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
      setErrors((prev: any) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      academicYear: formData.academicYear,
      totalAmount: Number(formData.totalAmount),
      amountPaid: Number(formData.amountPaid),
      paymentMode: formData.paymentMode,
      paymentDate: formData.paymentDate || null,
      remarks: formData.remarks,
    };

    try {
      let response;
      if (initialData && initialData.id) {
        // Update fee
        response = await fetch(
          `http://localhost:8080/api/students/fee/${initialData.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      } else {
        // Create new fee
        response = await fetch(
          `http://localhost:8080/api/students/fee/create/${formData.studentId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        alert("Something went wrong! Check console.");
        return;
      }

      const data = await response.json();
      onSubmit(data);
      onCancel();

      // Reset form
      setFormData({
        studentId: "",
        academicYear: "2024-2025",
        totalAmount: "",
        amountPaid: "",
        paymentMode: "Cash",
        paymentDate: "",
        remarks: "",
      });
    } catch (err) {
      console.error("Network Error:", err);
      alert("Network error! Try again.");
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
