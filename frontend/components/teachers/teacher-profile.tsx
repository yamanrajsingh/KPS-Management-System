"use client"

import { X, Mail, Phone, MapPin, Calendar, BookOpen, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function TeacherProfile({ teacher, onClose }: { teacher: any; onClose: () => void }) {
  if (!teacher) return null

  const calculateExperience = (joinDate?: string) => {
    if (!joinDate) return 0
    const years = new Date().getFullYear() - new Date(joinDate).getFullYear()
    return years
  }

  // Use name initial if firstName isn't provided
  const initial = (teacher.name && typeof teacher.name === "string" && teacher.name.length > 0)
    ? teacher.name[0].toUpperCase()
    : (teacher.firstName && typeof teacher.firstName === "string" ? teacher.firstName[0].toUpperCase() : "?")

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-slate-800 border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Teacher Profile</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <CardContent className="pt-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{initial}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{teacher.name}</h3>
              <p className="text-cyan-400">{teacher.subject}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Personal Details</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="text-white">{teacher.email ?? "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="text-white">{teacher.phone ?? "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-xs text-slate-400">Date of Birth</p>
                    <p className="text-white">{teacher.dob ?? "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-xs text-slate-400">Address</p>
                    <p className="text-white">{teacher.address ?? "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Professional Details</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-xs text-slate-400">Subject</p>
                    <p className="text-white">{teacher.subject ?? "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-xs text-slate-400">Qualification</p>
                    <p className="text-white">{teacher.qualification ?? "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-xs text-slate-400">Join Date</p>
                    <p className="text-white">{teacher.joiningDate ?? teacher.joinDate ?? "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-xs text-slate-400">Experience</p>
                    <p className="text-white">{calculateExperience(teacher.joiningDate ?? teacher.joinDate)} years</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-xs text-slate-400">
              Assigned Class: <span className="text-white font-semibold">{teacher.assignedClass ?? "-"}</span>
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Gender: <span className="text-white font-semibold">{teacher.gender ?? "-"}</span>
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Status: <span className="text-green-400 font-semibold">{teacher.status ?? "-"}</span>
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Last Updated: <span className="text-white font-semibold">{teacher.lastUpdated ?? "-"}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
