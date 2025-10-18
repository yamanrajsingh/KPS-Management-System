"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Printer } from "lucide-react"

interface FeeReceiptProps {
  fee: any
  onClose: () => void
}

export default function FeeReceipt({ fee, onClose }: FeeReceiptProps) {
  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    alert("PDF download feature will be implemented with a PDF library")
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-white border-slate-300 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-900">Fee Receipt</CardTitle>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
              ✕
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Receipt Header */}
          <div className="text-center border-b pb-4">
            <h2 className="text-2xl font-bold text-slate-900">SCHOOL NAME</h2>
            <p className="text-sm text-slate-600">School Address, City - PIN</p>
            <p className="text-sm text-slate-600">Phone: +91-XXXXXXXXXX | Email: school@example.com</p>
          </div>

          {/* Receipt Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-600">Receipt Number</p>
              <p className="font-semibold text-slate-900">{fee.receiptNumber || fee.id}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600">Receipt Date</p>
              <p className="font-semibold text-slate-900">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Student Details */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-slate-900 mb-3">Student Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-600">Student Name</p>
                <p className="font-medium text-slate-900">{fee.studentName}</p>
              </div>
              <div>
                <p className="text-slate-600">Student ID</p>
                <p className="font-medium text-slate-900">{fee.studentId}</p>
              </div>
              <div>
                <p className="text-slate-600">Class</p>
                <p className="font-medium text-slate-900">{fee.class || "N/A"}</p>
              </div>
              <div>
                <p className="text-slate-600">Academic Year</p>
                <p className="font-medium text-slate-900">{fee.academicYear || "2024-2025"}</p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-slate-900 mb-3">Payment Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Amount</span>
                <span className="font-medium text-slate-900">₹{fee.amount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Amount Paid</span>
                <span className="font-medium text-slate-900">
                  ₹{fee.amountPaid?.toLocaleString() || fee.amount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Due Amount</span>
                <span className="font-medium text-slate-900">
                  ₹{(fee.amount - (fee.amountPaid || fee.amount))?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold text-slate-900">Payment Mode</span>
                <span className="font-medium text-slate-900">{fee.paymentMode || "Cash"}</span>
              </div>
            </div>
          </div>

          {/* Remarks */}
          {fee.remarks && (
            <div className="border-t pt-4">
              <p className="text-sm text-slate-600">Remarks</p>
              <p className="text-slate-900">{fee.remarks}</p>
            </div>
          )}

          {/* Signature Line */}
          <div className="border-t pt-4 flex justify-between">
            <div>
              <p className="text-xs text-slate-600 mb-8">Authorized Signature</p>
              <div className="border-t border-slate-900 w-32"></div>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-8">Date</p>
              <div className="border-t border-slate-900 w-32"></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end border-t pt-4 print:hidden">
            <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
