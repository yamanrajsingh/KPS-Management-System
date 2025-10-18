"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SalaryFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function SalaryForm({ onSubmit, onCancel }: SalaryFormProps) {
  const [formData, setFormData] = useState({
    teacherId: "",
    teacherName: "",
    baseSalary: "",
    allowances: "",
    deductions: "",
    month: "",
    status: "Pending",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      baseSalary: Number.parseInt(formData.baseSalary),
      allowances: Number.parseInt(formData.allowances),
      deductions: Number.parseInt(formData.deductions),
      paidDate: formData.status === "Paid" ? new Date().toISOString().split("T")[0] : null,
    })
    setFormData({
      teacherId: "",
      teacherName: "",
      baseSalary: "",
      allowances: "",
      deductions: "",
      month: "",
      status: "Pending",
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
            placeholder="e.g., T001"
            className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300">Teacher Name</label>
          <Input
            type="text"
            name="teacherName"
            value={formData.teacherName}
            onChange={handleChange}
            placeholder="Teacher name"
            className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300">Base Salary (₹)</label>
          <Input
            type="number"
            name="baseSalary"
            value={formData.baseSalary}
            onChange={handleChange}
            placeholder="45000"
            className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300">Allowances (₹)</label>
          <Input
            type="number"
            name="allowances"
            value={formData.allowances}
            onChange={handleChange}
            placeholder="5000"
            className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300">Deductions (₹)</label>
          <Input
            type="number"
            name="deductions"
            value={formData.deductions}
            onChange={handleChange}
            placeholder="2000"
            className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300">Month</label>
          <Input
            type="text"
            name="month"
            value={formData.month}
            onChange={handleChange}
            placeholder="e.g., February 2024"
            className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
            required
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
            <option value="Paid">Paid</option>
          </select>
        </div>
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
          Add Salary Record
        </Button>
      </div>
    </form>
  )
}
