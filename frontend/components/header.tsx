"use client"

import { useEffect, useState } from "react"
import { Bell, Settings, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onMenuClick?: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    if (email) setUserEmail(email)
  }, [])

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden text-slate-400 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden sm:block">
          <h2 className="text-lg md:text-xl font-semibold text-white">Welcome back</h2>
          <p className="text-xs md:text-sm text-slate-400 truncate">{userEmail}</p>
        </div>
        <div className="sm:hidden">
          <h2 className="text-base font-semibold text-white">Welcome</h2>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
          <Settings className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}
