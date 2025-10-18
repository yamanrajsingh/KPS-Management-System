"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StudentFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export default function StudentForm({
  onSubmit,
  onCancel,
  initialData,
}: StudentFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    className: "",
    dob: "",
    gender: "Male",
    phone: "",
    aadhaarNumber: "",
    guardianName: "",
    guardianPhone: "",
    address: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.className.trim()) newErrors.className = "Class is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.gender.trim()) newErrors.gender = "Gender is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, "")))
      newErrors.phone = "Phone must be 10 digits";
    if (!formData.aadhaarNumber.trim())
      newErrors.aadhaarNumber = "Aadhaar is required";
    if (!formData.guardianName.trim())
      newErrors.guardianName = "Guardian name is required";
    if (!formData.guardianPhone.trim())
      newErrors.guardianPhone = "Guardian phone is required";
    if (!/^\d{10}$/.test(formData.guardianPhone.replace(/\D/g, "")))
      newErrors.guardianPhone = "Guardian phone must be 10 digits";
    if (!formData.address.trim()) newErrors.address = "Address is required";

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
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {/* Name */}
        <div>
          <label className="text-xs md:text-sm font-medium text-slate-300">
            First Name *
          </label>
          <Input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First name"
            className={`mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 text-sm ${
              errors.firstName ? "border-red-500" : ""
            }`}
          />
          {errors.firstName && (
            <p className="text-xs text-red-400 mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="text-xs md:text-sm font-medium text-slate-300">
            Last Name *
          </label>
          <Input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last name"
            className={`mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 text-sm ${
              errors.lastName ? "border-red-500" : ""
            }`}
          />
          {errors.lastName && (
            <p className="text-xs text-red-400 mt-1">{errors.lastName}</p>
          )}
        </div>

        {/* DOB & Gender */}
        <div>
          <label className="text-xs md:text-sm font-medium text-slate-300">
            Date of Birth *
          </label>
          <Input
            type="date"
            name="dob"
            value={formData.dob?.split("T")[0] || ""}
            onChange={handleChange}
            className={`mt-1 bg-slate-700/50 border-slate-600 text-white text-sm ${
              errors.dob ? "border-red-500" : ""
            }`}
          />
          {errors.dob && (
            <p className="text-xs text-red-400 mt-1">{errors.dob}</p>
          )}
        </div>

        <div>
          <label className="text-xs md:text-sm font-medium text-slate-300">
            Gender *
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="mt-1 w-full bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2 text-sm"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Class & Phone */}
        <div>
          <label className="text-xs md:text-sm font-medium text-slate-300">
            Class *
          </label>
          <select
            name="className"
            value={formData.className}
            onChange={handleChange}
            className="mt-1 w-full bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2 text-sm"
          >
            <option value="">Select Class</option>
            <option value="NC">NC</option>
            <option value="KG">KG</option>
            <option value="I">I</option>
            <option value="II">II</option>
            <option value="III">III</option>
            <option value="IV">IV</option>
            <option value="V">V</option>
            <option value="VI">VI</option>
            <option value="VII">VII</option>
            <option value="VIII">VIII</option>
            <option value="IX">IX</option>
            <option value="X">X</option>
          </select>
          {errors.className && (
            <p className="text-xs text-red-400 mt-1">{errors.className}</p>
          )}
        </div>

        <div>
          <label className="text-xs md:text-sm font-medium text-slate-300">
            Phone *
          </label>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="10-digit phone number"
            className={`mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 text-sm ${
              errors.phone ? "border-red-500" : ""
            }`}
          />
          {errors.phone && (
            <p className="text-xs text-red-400 mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Aadhaar & Guardian */}
        <div>
          <label className="text-xs md:text-sm font-medium text-slate-300">
            Aadhaar Number *
          </label>
          <Input
            type="text"
            name="aadhaarNumber"
            value={formData.aadhaarNumber}
            onChange={handleChange}
            placeholder="XXXX XXXX XXXX"
            className={`mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 text-sm ${
              errors.aadhaarNumber ? "border-red-500" : ""
            }`}
          />
          {errors.aadhaarNumber && (
            <p className="text-xs text-red-400 mt-1">{errors.aadhaarNumber}</p>
          )}
        </div>

        <div>
          <label className="text-xs md:text-sm font-medium text-slate-300">
            Guardian Name *
          </label>
          <Input
            type="text"
            name="guardianName"
            value={formData.guardianName}
            onChange={handleChange}
            placeholder="Guardian name"
            className={`mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 text-sm ${
              errors.guardianName ? "border-red-500" : ""
            }`}
          />
          {errors.guardianName && (
            <p className="text-xs text-red-400 mt-1">{errors.guardianName}</p>
          )}
        </div>

        <div>
          <label className="text-xs md:text-sm font-medium text-slate-300">
            Guardian Phone *
          </label>
          <Input
            type="tel"
            name="guardianPhone"
            value={formData.guardianPhone}
            onChange={handleChange}
            placeholder="10-digit phone number"
            className={`mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 text-sm ${
              errors.guardianPhone ? "border-red-500" : ""
            }`}
          />
          {errors.guardianPhone && (
            <p className="text-xs text-red-400 mt-1">{errors.guardianPhone}</p>
          )}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="text-xs md:text-sm font-medium text-slate-300">
            Address *
          </label>

          <select
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 w-full bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2 text-sm"
          >
            <option value="">Address</option>
            <option value="Mahmoodpur">Mahmoodpur</option>
            <option value="Jamalpur">Jamalpur</option>
            <option value="Nagla Dleep">Nagla Dleep</option>
            <option value="Khanalampur">Khanalampur</option>
            <option value="Nagla Banzra">Nagla Banzra</option>
            <option value="Nagla Khautiya">Nagla Khautiya</option>
          </select>
          {errors.address && (
            <p className="text-xs text-red-400 mt-1">{errors.address}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-2 md:gap-3 justify-end pt-2 md:pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-slate-600 text-slate-300 bg-transparent text-sm"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-sm"
        >
          {initialData ? "Update Student" : "Add Student"}
        </Button>
      </div>
    </form>
  );
}
