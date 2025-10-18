"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, BookOpen, DollarSign, Wallet, LogOut, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  onClose?: () => void
}

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/students", label: "Students", icon: Users },
  { href: "/dashboard/teachers", label: "Teachers", icon: BookOpen },
  { href: "/dashboard/fees", label: "Fees", icon: DollarSign },
  { href: "/dashboard/salaries", label: "Salaries", icon: Wallet },
]

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userEmail")
    window.location.href = "/"
  }

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col h-full">
      <div className="p-6 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">KPS</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-white font-bold text-lg">School Admin</h1>
            <p className="text-xs text-slate-400">Management System</p>
          </div>
        </div>
        <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} onClick={onClose}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-slate-300 hover:text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </aside>
  )
}
