"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface FeeFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  initialData?: any
}

export default function FeeForm({ onSubmit, onCancel, initialData }: FeeFormProps) {
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    class: "",
    academicYear: "2024-2025",
    totalAmount: "",
    amountPaid: "",
    paymentMode: "Cash",
    paymentDate: "",
    receiptNumber: "",
    remarks: "",
    status: "Pending",
  })

  const [errors, setErrors] = useState<any>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        studentId: initialData.studentId,
        studentName: initialData.studentName,
        class: initialData.class,
        academicYear: initialData.academicYear,
        totalAmount: initialData.totalAmount.toString(),
        amountPaid: initialData.amountPaid.toString(),
        paymentMode: initialData.paymentMode,
        paymentDate: initialData.paymentDate || "",
        receiptNumber: initialData.receiptNumber,
        remarks: initialData.remarks,
        status: initialData.status,
      })
    }
  }, [initialData])

  const validateForm = () => {
    const newErrors: any = {}
    if (!formData.studentId.trim()) newErrors.studentId = "Student ID is required"
    if (!formData.studentName.trim()) newErrors.studentName = "Student name is required"
    if (!formData.class) newErrors.class = "Class is required"
    if (!formData.totalAmount) newErrors.totalAmount = "Total amount is required"
    if (!formData.amountPaid) newErrors.amountPaid = "Amount paid is required"
    if (Number(formData.amountPaid) > Number(formData.totalAmount))
      newErrors.amountPaid = "Amount paid cannot exceed total amount"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const totalAmount = Number(formData.totalAmount)
    const amountPaid = Number(formData.amountPaid)
    const dueAmount = totalAmount - amountPaid

    let status = formData.status
    if (amountPaid === 0) status = "Pending"
    else if (amountPaid === totalAmount) status = "Paid"
    else if (amountPaid > 0) status = "Partially Paid"

    onSubmit({
      ...formData,
      totalAmount,
      amountPaid,
      dueAmount,
      status,
    })

    setFormData({
      studentId: "",
      studentName: "",
      class: "",
      academicYear: "2024-2025",
      totalAmount: "",
      amountPaid: "",
      paymentMode: "Cash",
      paymentDate: "",
      receiptNumber: "",
      remarks: "",
      status: "Pending",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-300">Student ID *</label>
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
          {errors.studentId && <p className="text-red-400 text-xs mt-1">{errors.studentId}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">Student Name *</label>
          <Input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            placeholder="Student name"
            className={`mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 ${
              errors.studentName ? "border-red-500" : ""
            }`}
          />
          {errors.studentName && <p className="text-red-400 text-xs mt-1">{errors.studentName}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">Class *</label>
          <select
            name="class"
            value={formData.class}
            onChange={handleChange}
            className={`mt-1 w-full bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2 ${
              errors.class ? "border-red-500" : ""
            }`}
          >
            <option value="">Select Class</option>
            <option value="Class 1">Class 1</option>
            <option value="Class 2">Class 2</option>
            <option value="Class 3">Class 3</option>
            <option value="Class 4">Class 4</option>
            <option value="Class 5">Class 5</option>
          </select>
          {errors.class && <p className="text-red-400 text-xs mt-1">{errors.class}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">Academic Year</label>
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
          <label className="text-sm font-medium text-slate-300">Total Amount (₹) *</label>
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
          {errors.totalAmount && <p className="text-red-400 text-xs mt-1">{errors.totalAmount}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">Amount Paid (₹) *</label>
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
          {errors.amountPaid && <p className="text-red-400 text-xs mt-1">{errors.amountPaid}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">Payment Mode</label>
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
          <label className="text-sm font-medium text-slate-300">Payment Date</label>
          <Input
            type="date"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleChange}
            className="mt-1 bg-slate-700/50 border-slate-600 text-white"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">Receipt Number</label>
          <Input
            type="text"
            name="receiptNumber"
            value={formData.receiptNumber}
            onChange={handleChange}
            placeholder="e.g., RCP001"
            className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 w-full bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2"
          >
            <option value="Pending">Pending</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
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
  )
}
