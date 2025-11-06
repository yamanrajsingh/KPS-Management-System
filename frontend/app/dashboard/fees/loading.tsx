"use client"

import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
      {/* Animated spinner */}
      <motion.div
        className="w-16 h-16 rounded-full border-4 border-transparent border-t-green-500 border-r-green-400"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />

      {/* Fade-in text */}
      <motion.h2
        className="mt-6 text-slate-200 text-xl font-semibold tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Loading your fees...
      </motion.h2>

      {/* Optional tagline or school name */}
      <motion.p
        className="mt-2 text-slate-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        Kisan Public School • Mahmoodpur, Aligarh
      </motion.p>
    </div>
  )
}
