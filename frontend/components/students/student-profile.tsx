"use client"

import { X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StudentProfileProps {
  student: any
  onClose: () => void
}

export default function StudentProfile({ student, onClose }: StudentProfileProps) {
  const handleGenerateIDCard = () => {
    const content = `
      STUDENT ID CARD
      ================
      ID: ${student.id}
      Name: ${student.firstName} ${student.lastName}
      Class: ${student.className}
      DOB: ${student.dob}
      Gender: ${student.gender}
      Aadhaar: ${student.aadhaarNumber}
      Admission Date: ${student.admissionDate || ""}
    `
    const blob = new Blob([content], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${student.firstName}-${student.lastName}-ID-Card.txt`
    a.click()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-slate-800 border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 md:p-6">
          <CardTitle className="text-lg md:text-xl text-white">Student Profile</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className="p-4 md:p-6 pt-0 md:pt-0 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400">Student ID</p>
                <p className="text-sm text-white font-medium">{student.id}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Name</p>
                <p className="text-sm text-white font-medium">{student.firstName} {student.lastName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Date of Birth</p>
                <p className="text-sm text-white">{student.dob}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Gender</p>
                <p className="text-sm text-white">{student.gender}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Aadhaar Number</p>
                <p className="text-sm text-white">{student.aadhaarNumber}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Phone</p>
                <p className="text-sm text-white">{student.phone}</p>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400">Class</p>
                <p className="text-sm text-white font-medium">{student.className}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Admission Date</p>
                <p className="text-sm text-white">{student.admissionDate || "-"}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400">Phone</p>
                <p className="text-sm text-white">{student.phone}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Address</p>
                <p className="text-sm text-white">{student.address}</p>
              </div>
            </div>
          </div>

          {/* Guardian Information */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Guardian Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400">Guardian Name</p>
                <p className="text-sm text-white font-medium">{student.guardianName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Guardian Phone</p>
                <p className="text-sm text-white">{student.guardianPhone}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-4">
            <Button
              onClick={handleGenerateIDCard}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white gap-2 flex-1 text-sm"
            >
              <Download className="w-4 h-4" />
              Generate ID Card
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700/50 flex-1 text-sm bg-transparent"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
