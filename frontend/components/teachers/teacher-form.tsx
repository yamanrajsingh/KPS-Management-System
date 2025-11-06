"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TeacherFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

type FormState = {
  id?: number | string
  firstName: string
  lastName: string
  name: string
  email: string
  subject: string
  qualification: string
  salary: string // keep as string for input, convert to number when submitting
  phone: string
  joinDate: string
  dob: string
  gender: string
  address: string
  aadhaarNumber: string
  assignedClass: string
  status: string
  lastUpdated?: string
}

export default function TeacherForm({ initialData, onSubmit, onCancel }: TeacherFormProps) {
  const emptyState: FormState = {
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    subject: "",
    qualification: "",
    salary: "",
    phone: "",
    joinDate: new Date().toISOString().split("T")[0],
    dob: "",
    gender: "Male",
    address: "",
    aadhaarNumber: "",
    assignedClass: "",
    status: "Active",
    lastUpdated: undefined,
  }

  const [formData, setFormData] = useState<FormState>(emptyState)

  useEffect(() => {
    if (initialData) {
      // normalize incoming data into the form state shape
      setFormData({
        id: initialData.id ?? initialData.teacherId ?? undefined,
        firstName: initialData.firstName ?? "",
        lastName: initialData.lastName ?? "",
        name:
          initialData.name ?? `${initialData.firstName ?? ""} ${initialData.lastName ?? ""}`.trim(),
        email: initialData.email ?? "",
        subject: initialData.subject ?? "",
        qualification: initialData.qualification ?? "",
        salary:
          initialData.salary !== undefined && initialData.salary !== null
            ? String(initialData.salary)
            : "",
        phone: initialData.phone ?? initialData.phoneNumber ?? "",
        joinDate:
          initialData.joinDate ?? initialData.joiningDate ?? new Date().toISOString().split("T")[0],
        dob: initialData.dob ?? "",
        gender: initialData.gender ?? "Male",
        address: initialData.address ?? "",
        aadhaarNumber: initialData.aadhaarNumber ?? "",
        assignedClass: initialData.assignedClass ?? initialData.assigned_class ?? "",
        status: initialData.status ?? "Active",
        lastUpdated: initialData.lastUpdated ?? undefined,
      })
    } else {
      setFormData(emptyState)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // build payload matching TeacherDto shape
    const payload: any = {
      // only include id when updating
      ...(formData.id ? { id: formData.id } : {}),
      firstName: formData.firstName,
      lastName: formData.lastName,
      name: formData.name || `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      subject: formData.subject,
      qualification: formData.qualification,
      salary: formData.salary ? Number(formData.salary) : null,
      phone: formData.phone,
      joinDate: formData.joinDate,
      dob: formData.dob || null,
      gender: formData.gender,
      address: formData.address,
      aadhaarNumber: formData.aadhaarNumber,
      assignedClass: formData.assignedClass,
      status: formData.status,
      lastUpdated: new Date().toISOString().split("T")[0],
    }

    onSubmit(payload)

    // reset only when creating new
    if (!initialData) {
      setFormData(emptyState)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-300">First Name</label>
          <Input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First name"
            className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">Last Name</label>
          <Input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last name"
            className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">Display Name</label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Dr. Rajesh Kumar"
            className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">Email</label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="teacher@school.com"
            className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">Phone</label>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="9876543210"
            className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">Aadhaar Number</label>
          <Input
            type="text"
            name="aadhaarNumber"
            value={formData.aadhaarNumber}
            onChange={handleChange}
            placeholder="123456789012"
            className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
            maxLength={12}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">Subject</label>
          <Input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="e.g., Mathematics"
            className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">Qualification</label>
          <Input
            type="text"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            placeholder="e.g., M.Sc, B.Ed"
            className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">Salary</label>
          <Input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="e.g., 55000"
            step="0.01"
            className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">Join Date</label>
          <Input
            type="date"
            name="joinDate"
            value={formData.joinDate}
            onChange={handleChange}
            className="mt-1 bg-slate-700/50 border-slate-600 text-white"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">Date of Birth</label>
          <Input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="mt-1 bg-slate-700/50 border-slate-600 text-white"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="mt-1 w-full bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">Assigned Class</label>
          <Input
            type="text"
            name="assignedClass"
            value={formData.assignedClass}
            onChange={handleChange}
            placeholder="e.g., 10th A"
            className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-300">Address</label>
          <Input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Full address"
            className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
            required
          />
        </div>
      </div>

      <div className="flex gap-3 justify-between items-center pt-4">
        

        <div className="flex gap-3">
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
            {initialData ? "Update Teacher" : "Add Teacher"}
          </Button>
        </div>
      </div>
    </form>
  )
}
