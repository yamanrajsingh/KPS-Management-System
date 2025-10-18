"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, X } from "lucide-react"

interface FeeFiltersProps {
  onFilterChange: (filters: any) => void
}

export default function FeeFilters({ onFilterChange }: FeeFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    class: "",
    paymentStatus: "",
    paymentMode: "",
    dateFrom: "",
    dateTo: "",
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleReset = () => {
    const emptyFilters = {
      class: "",
      paymentStatus: "",
      paymentMode: "",
      dateFrom: "",
      dateTo: "",
    }
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={() => setShowFilters(!showFilters)}
        variant="outline"
        className="border-slate-600 text-slate-300 bg-transparent gap-2"
      >
        <Filter className="w-4 h-4" />
        Advanced Filters
      </Button>

      {showFilters && (
        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-sm text-slate-300">Class</label>
              <select
                value={filters.class}
                onChange={(e) => handleFilterChange("class", e.target.value)}
                className="mt-1 w-full bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2 text-sm"
              >
                <option value="">All Classes</option>
                <option value="Class 1">Class 1</option>
                <option value="Class 2">Class 2</option>
                <option value="Class 3">Class 3</option>
                <option value="Class 4">Class 4</option>
                <option value="Class 5">Class 5</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-300">Payment Status</label>
              <select
                value={filters.paymentStatus}
                onChange={(e) => handleFilterChange("paymentStatus", e.target.value)}
                className="mt-1 w-full bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2 text-sm"
              >
                <option value="">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-300">Payment Mode</label>
              <select
                value={filters.paymentMode}
                onChange={(e) => handleFilterChange("paymentMode", e.target.value)}
                className="mt-1 w-full bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2 text-sm"
              >
                <option value="">All Modes</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-300">From Date</label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                className="mt-1 bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">To Date</label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                className="mt-1 bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-slate-600 text-slate-300 bg-transparent gap-2"
            >
              <X className="w-4 h-4" />
              Reset Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
