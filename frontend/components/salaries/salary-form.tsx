"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SalaryFormProps {
  onSubmit: (data: {
    teacherId: string | number
    // server expects these fields in the POST body
    amount: number
    paymentDate: string
    paymentMode: string
    status: string
    remarks?: string | null
  }) => void
  onCancel: () => void
  saving?: boolean
}

export default function SalaryForm({ onSubmit, onCancel, saving }: SalaryFormProps) {
  const today = new Date().toISOString().split("T")[0]

  const [formData, setFormData] = useState({
    teacherId: "",
    amount: "",
    paymentDate: today,
    paymentMode: "Bank Transfer",
    status: "Pending",
    remarks: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // basic client-side validation
    if (!formData.teacherId) {
      alert("Teacher ID is required")
      return
    }
    const amount = parseFloat(String(formData.amount))
    if (isNaN(amount) || amount <= 0) {
      alert("Amount must be a number greater than 0")
      return
    }
    if (!formData.paymentDate) {
      alert("Payment date is required")
      return
    }

    onSubmit({
      teacherId: formData.teacherId,
      amount,
      paymentDate: formData.paymentDate,
      paymentMode: formData.paymentMode,
      status: formData.status,
      remarks: formData.remarks ? formData.remarks : null,
    })

    // reset
    setFormData({
      teacherId: "",
      amount: "",
      paymentDate: today,
      paymentMode: "Bank Transfer",
      status: "Pending",
      remarks: "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-300">Teacher ID</label>
          <Input
            type="text"
            name="teacherId"
            value={formData.teacherId}
            onChange={handleChange}
            placeholder="e.g., 7 (teacher id)"
            className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">Amount (₹)</label>
          <Input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            placeholder="e.g., 36500.00"
            className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">Payment Date</label>
          <Input
            type="date"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleChange}
            className="mt-1 bg-slate-700/50 border-slate-600 text-white"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">Payment Mode</label>
          <select
            name="paymentMode"
            value={formData.paymentMode}
            onChange={handleChange}
            className="mt-1 w-full bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2"
          >
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cash">Cash</option>
            <option value="Cheque">Cheque</option>
            <option value="UPI">UPI</option>
          </select>
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
            <option value="Paid">Paid</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-300">Remarks (optional)</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="Optional remarks about the salary entry"
            className="mt-1 w-full bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 rounded-md p-2"
            rows={3}
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-slate-600 text-slate-300 bg-transparent"
          disabled={Boolean(saving)}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
          disabled={Boolean(saving)}
        >
          {saving ? "Saving..." : "Add Salary Record"}
        </Button>
      </div>
    </form>
  )
}
