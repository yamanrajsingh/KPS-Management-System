"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TeacherFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function TeacherForm({ initialData, onSubmit, onCancel }: TeacherFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    subject: "",
    qualification: "",
    phone: "",
    joinDate: new Date().toISOString().split("T")[0],
    dob: "",
    gender: "Male",
    assignedClass: "",
    address: "",
    status: "Active",
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const updated = { ...prev, [name]: value }
      if (name === "firstName" || name === "lastName") {
        updated.name = `${updated.firstName} ${updated.lastName}`.trim()
      }
      return updated
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    if (!initialData) {
      setFormData({
        firstName: "",
        lastName: "",
        name: "",
        email: "",
        subject: "",
        qualification: "",
        phone: "",
        joinDate: new Date().toISOString().split("T")[0],
        dob: "",
        gender: "Male",
        assignedClass: "",
        address: "",
        status: "Active",
      })
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
            placeholder="Phone number"
            className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
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
            required
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
          <label className="text-sm font-medium text-slate-300">Assigned Class</label>
          <Input
            type="text"
            name="assignedClass"
            value={formData.assignedClass}
            onChange={handleChange}
            placeholder="e.g., 10th A"
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
          {initialData ? "Update Teacher" : "Add Teacher"}
        </Button>
      </div>
    </form>
  )
}
