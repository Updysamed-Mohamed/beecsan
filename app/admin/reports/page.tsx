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
import { Badge } from '@/components/ui/badge'
import { Search, AlertCircle, Trash2, CheckCircle } from 'lucide-react'
import {
  onReportsUpdate,
  deleteReport,
  deleteProductAndReport,
} from '@/lib/firebase-admin'

interface Report {
  id: string
  reporterEmail?: string
  productId?: string
  reason: string
  status?: string
  severity?: 'low' | 'medium' | 'high'
  created_at?: any
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'reviewed' | 'resolved'>('all')

  useEffect(() => {
    const unsubscribe = onReportsUpdate((snapshot: any) => {
      const reportsData = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setReports(reportsData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      (report.reporterEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.productId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.reason || '').toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === 'all' || report.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const handleDeleteProduct = async (reportId: string, productId: string) => {
    if (confirm('This will delete the reported product. Continue?')) {
      await deleteProductAndReport(productId, reportId)
    }
  }

  const handleStatusChange = async (reportId: string, newStatus: string) => {
    // Implement status change logic here
  }

  const severityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/10 text-red-600 dark:text-red-400'
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
      case 'low':
        return 'bg-green-500/10 text-green-600 dark:text-green-400'
      default:
        return ''
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-foreground">Loading reports...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports Management</h1>
        <p className="text-muted-foreground mt-1">Review and manage user reports</p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search by reporter, product ID, or reason..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">All Reports</CardTitle>
          <CardDescription>Total: {filteredReports.length} reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-foreground">Reporter</TableHead>
                  <TableHead className="text-foreground">Product ID</TableHead>
                  <TableHead className="text-foreground">Reason</TableHead>
                  <TableHead className="text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="text-foreground font-medium">
                        {report.reporterEmail || 'Unknown'}
                      </TableCell>
                      <TableCell className="text-foreground font-mono text-sm">
                        {report.productId || 'N/A'}
                      </TableCell>
                      <TableCell className="text-foreground">{report.reason}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                            onClick={() =>
                              handleDeleteProduct(
                                report.id,
                                report.productId || ''
                              )
                            }
                          >
                            <Trash2 size={16} className="mr-1" />
                            Delete Product
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteReport(report.id)}
                          >
                            Dismiss
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No reports found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">All Reports</CardTitle>
          <CardDescription>Total: {filteredReports.length} reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-foreground">Reporter</TableHead>
                  <TableHead className="text-foreground">Reported Item</TableHead>
                  <TableHead className="text-foreground">Reason</TableHead>
                  <TableHead className="text-foreground">Severity</TableHead>
                  <TableHead className="text-foreground">Status</TableHead>
                  <TableHead className="text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="text-foreground font-medium">{report.reporterEmail}</TableCell>
                    <TableCell className="text-foreground">{report.productId}</TableCell>
                    <TableCell className="text-foreground">{report.reason}</TableCell>
                    <TableCell>
                      <Badge className={`${severityColor(report.severity ?? '')} border-0`}>
                        {report.severity
                          ? report.severity.charAt(0).toUpperCase() + report.severity.slice(1)
                          : 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          report.status === 'pending'
                            ? 'secondary'
                            : report.status === 'reviewed'
                              ? 'outline'
                              : 'default'
                        }
                      >
                        {report.status
                          ? report.status.charAt(0).toUpperCase() + report.status.slice(1)
                          : 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {report.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(report.id, 'reviewed')}
                          >
                            <AlertCircle size={16} className="mr-1" />
                            Review
                          </Button>
                        )}
                        {report.status === 'reviewed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(report.id, 'resolved')}
                          >
                            <CheckCircle size={16} className="mr-1" />
                            Resolve
                          </Button>
                        )}
                        {report.status === 'resolved' && (
                          <span className="text-sm text-muted-foreground">Completed</span>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(report.id, report.productId || '')}
                        >
                          <Trash2 size={16} className="mr-1" />
                          Delete Product
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
