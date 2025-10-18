"use client"

import { Card, CardContent } from "@/components/ui/card"

export default function TeacherFilters({ filters, setFilters, teachers }: any) {
  const subjects = [...new Set(teachers.map((t: any) => t.subject))]
  const classes = [...new Set(teachers.map((t: any) => t.assignedClass))]

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-300">Subject</label>
            <select
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              className="mt-2 w-full bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">Class</label>
            <select
              value={filters.class}
              onChange={(e) => setFilters({ ...filters, class: e.target.value })}
              className="mt-2 w-full bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Classes</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">Gender</label>
            <select
              value={filters.gender}
              onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
              className="mt-2 w-full bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="mt-2 w-full bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2 text-sm"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
