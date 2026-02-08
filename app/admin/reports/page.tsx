'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from '@/components/ui/badge'
import { 
  Search, AlertCircle, Trash2, CheckCircle, 
  User, UserX, Mail, MessageSquare, Eye, ExternalLink, Send, BellRing, PackageSearch
} from 'lucide-react'
import {
  onReportsUpdate,
  deleteReport,
  updateReportStatus,
  sendNotification,
} from '@/lib/firebase-admin'

interface Report {
  id: string
  email: string
  type: string
  description: string
  productId?: string
  productTitle?: string // Lagu daray si loogu muujiyo magaca alaabta
  status: 'pending' | 'reviewed' | 'resolved'
  isLogged: boolean
  reporterId: string
  createdAt?: any
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const unsubscribe = onReportsUpdate((snapshot: any) => {
      const reportsData = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setReports(reportsData.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)))
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleResolveAndNotify = async (report: Report) => {
    setIsProcessing(true)
    try {
      await updateReportStatus(report.id, 'resolved');

      if (report.reporterId) {
        await sendNotification(
          report.reporterId,
          "Dhibaatadii aad soo sheegtay waa la xaliyay ✅",
          `Warbixintii '${report.type}': ${replyMessage || 'Waa la xaliyay, waad ku mahadsantahay caawintaada.'}`
        );
      }
      
      alert("Report-ka waa la xaliyay, fariinna waa loo diray user-ka!");
      setReplyMessage('');
      setSelectedReport(null);
    } catch (error) {
      console.error("Xalinta dhibka way fashilantay:", error);
      alert("Khalad ayaa dhacay xilliga xallinta.");
    } finally {
      setIsProcessing(false)
    }
  };

  const sendEmail = (email: string, subject: string, body: string) => {
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  }

  const filteredReports = reports.filter((report) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      report.email?.toLowerCase().includes(searchLower) ||
      report.type?.toLowerCase().includes(searchLower) ||
      report.productId?.toLowerCase().includes(searchLower) ||
      report.productTitle?.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <AlertCircle className="w-10 h-10 text-red-500" /> Product Reports
          </h1>
          <p className="text-slate-500 font-medium">Maamul warbixinada dhibka laga soo sheegay alaabaha Marketplace-ka.</p>
        </div>
      </div>

      <Card className="border-slate-100 shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden">
        <CardHeader className="border-b border-slate-50 bg-white/50">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input
              placeholder="Ka raadi Email, Nooca cabashada, ama Product ID..."
              className="pl-12 h-14 bg-slate-50 border-none rounded-2xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="py-5 pl-8 font-bold">Reporter</TableHead>
                <TableHead className="font-bold">Issue Type</TableHead>
                <TableHead className="font-bold">Target Product</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-right pr-8 font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="py-6 pl-8">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${report.isLogged ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                        {report.isLogged ? <User size={18} /> : <UserX size={18} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{report.email || 'Guest User'}</span>
                        <span className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">
                          {report.isLogged ? 'Registered User' : 'Guest'}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-lg capitalize font-bold text-red-600 border-red-100 bg-red-50/30">{report.type}</Badge>
                  </TableCell>
                  <TableCell>
                    {report.productId ? (
                      <div className="flex items-center gap-2 text-slate-600">
                        <PackageSearch size={16} className="text-slate-400" />
                        <span className="text-xs font-bold truncate max-w-[150px]">{report.productTitle || report.productId}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">General Issue</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={`rounded-full px-3 py-1 text-[10px] uppercase font-black border-none ${
                      report.status === 'pending' ? 'bg-blue-500' : report.status === 'reviewed' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex items-center justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-xl hover:bg-blue-50 text-blue-600"
                            onClick={() => setSelectedReport(report)}
                          >
                            <Eye size={18} />
                          </Button>
                        </DialogTrigger>
                        {/* REPORT DETAILS DIALOG */}
<DialogContent className="sm:max-w-[600px] rounded-[2.5rem] border-none shadow-2xl">
  <DialogHeader>
    <DialogTitle className="text-2xl font-black flex items-center gap-2">
      <AlertCircle className="text-red-500" size={24} /> Report Details
    </DialogTitle>
    <DialogDescription className="font-medium text-slate-500">
      Faahfaahinta cabashada laga soo sheegay alaabta.
    </DialogDescription>
  </DialogHeader>
  
  <div className="space-y-6 py-4">
    {/* Email iyo Nooca Cabashada */}
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Email-ka Macmiilka</p>
        <p className="font-bold text-slate-900 truncate">
          {selectedReport?.email || "N/A"}
        </p>
      </div>
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Nooca Cabashada</p>
        <p className="font-bold text-slate-900 capitalize">
          {selectedReport?.type || "General Report"}
        </p>
      </div>
    </div>

    {/* Faahfaahinta Dhibka */}
    <div className="p-5 bg-red-50/50 rounded-2xl border border-red-100/50">
      <p className="text-[10px] font-black text-red-500 uppercase mb-2 tracking-widest">Faahfaahinta Dhibka</p>
      <p className="text-slate-700 font-medium leading-relaxed">
        {selectedReport?.description || "Ma jiro faahfaahin dheeri ah oo la bixiyay."}
      </p>
    </div>

    {/* Product Details Section */}
    {selectedReport?.productId && (
      <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
        <div className="flex-1">
          <p className="text-[10px] font-black text-amber-500 uppercase mb-1">Product Details</p>
          <p className="font-bold text-amber-900 truncate max-w-[250px]">
            {selectedReport?.productTitle || "Alaab aan la aqoon"}
          </p>
          <p className="text-[10px] text-amber-700 font-mono">ID: {selectedReport?.productId}</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-xl border-amber-200 bg-white text-amber-700 font-bold hover:bg-amber-100"
          onClick={() => window.open(`/listings/${selectedReport?.productId}`, '_blank')}
        >
          View Item <ExternalLink size={14} className="ml-2" />
        </Button>
      </div>
    )}

    {/* Jawaabta User-ka */}
    <div className="space-y-3">
      <label className="text-[10px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1">
        <MessageSquare size={12} /> Message to User
      </label>
      <textarea 
        className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px] transition-all text-sm"
        placeholder="U qor macmiilka go'aanka aad ka qaadatay report-kan..."
        value={replyMessage}
        onChange={(e) => setReplyMessage(e.target.value)}
      />
    </div>
  </div>

  <DialogFooter className="gap-3 sm:justify-between items-center">
    <Button 
      variant="ghost" 
      className="rounded-xl font-bold text-slate-500 hover:bg-slate-100"
      onClick={() => sendEmail(selectedReport?.email || "", `Beecsan Support: Report Update`, replyMessage)}
    >
      <Mail className="mr-2" size={16} /> Open Email
    </Button>
    
    <Button 
      className="rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 px-6"
      onClick={() => selectedReport && handleResolveAndNotify(selectedReport)}
      disabled={isProcessing}
    >
      {isProcessing ? "Processing..." : (
        <span className="flex items-center gap-2">
          <BellRing size={16} /> Resolve & Notify
        </span>
      )}
    </Button>
  </DialogFooter>
</DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl text-red-500 hover:bg-red-50"
                        onClick={() => {
                          if(confirm("Ma tirtiraysaa report-kan?")) deleteReport(report.id)
                        }}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}