// 'use client'

// import { useEffect, useState } from 'react'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table'
// import { Badge } from '@/components/ui/badge'
// import { Avatar, AvatarFallback } from '@/components/ui/avatar'
// import { Search, Mail, Ban, CheckCircle } from 'lucide-react'
// import { onUsersUpdate, updateUserStatus } from '@/lib/firebase-admin'

// interface User {
//   id: string
//   fullName?: string
//   email: string
//   phone?: string
//   role?: string
//   status?: string
// }

// export default function UsersPage() {
//   const [users, setUsers] = useState<User[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchQuery, setSearchQuery] = useState('')

//   useEffect(() => {
//     const unsubscribe = onUsersUpdate((snapshot: any) => {
//       const usersData = snapshot.docs.map((doc: any) => ({
//         id: doc.id,
//         ...doc.data(),
//       }))
//       setUsers(usersData)
//       setLoading(false)
//     })

//     return () => unsubscribe()
//   }, [])

//   const filteredUsers = users.filter(
//     (user) =>
//       (user.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (user.email || '').toLowerCase().includes(searchQuery.toLowerCase())
//   )

//   const handleToggleStatus = async (id: string, currentStatus: string) => {
//     const newStatus = currentStatus === 'active' ? 'blocked' : 'active'
//     await updateUserStatus(id, newStatus)
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-foreground">Loading users...</p>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
//         <p className="text-muted-foreground mt-1">Manage user accounts and permissions</p>
//       </div>

//       {/* Search Bar */}
//       <Card>
//         <CardContent className="pt-6">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
//             <Input
//               placeholder="Search by name or email..."
//               className="pl-10"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         </CardContent>
//       </Card>

//       {/* Users Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-foreground">All Users</CardTitle>
//           <CardDescription>Total: {filteredUsers.length} users</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="text-foreground">User</TableHead>
//                   <TableHead className="text-foreground">Email</TableHead>
//                   <TableHead className="text-foreground">Role</TableHead>
//                   <TableHead className="text-foreground">Status</TableHead>
//                   <TableHead className="text-foreground">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredUsers.map((user) => (
//                   <TableRow key={user.id}>
//                     <TableCell className="text-foreground">
//                       <div className="flex items-center gap-3">
//                         <Avatar>
//                           <AvatarFallback className="bg-primary text-primary-foreground">
//                             {(user.fullName || 'U').substring(0, 2).toUpperCase()}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div>
//                           <p className="font-medium">{user.fullName || 'Unknown'}</p>
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-foreground">
//                       <div className="flex items-center gap-2">
//                         <Mail size={16} className="text-muted-foreground" />
//                         {user.email}
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-foreground capitalize">{user.role || 'user'}</TableCell>
//                     <TableCell>
//                       <Badge
//                         variant={user.status === 'active' ? 'default' : 'destructive'}
//                       >
//                         {user.status || 'active'}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() =>
//                           handleToggleStatus(user.id, user.status || 'active')
//                         }
//                         className={
//                           user.status === 'blocked'
//                             ? 'text-green-600 hover:text-green-700'
//                             : 'text-destructive hover:text-destructive/80'
//                         }
//                       >
//                         {user.status === 'active' || !user.status ? (
//                           <>
//                             <Ban size={16} className="mr-1" />
//                             Block
//                           </>
//                         ) : (
//                           <>
//                             <CheckCircle size={16} className="mr-1" />
//                             Unblock
//                           </>
//                         )}
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search, Mail, Ban, CheckCircle, Loader2, Users, ShieldAlert, ShieldCheck } from 'lucide-react'
import { onUsersUpdate, updateUserStatus } from '@/lib/firebase-admin'

interface User {
  id: string
  fullName?: string
  email: string
  phone?: string
  role?: string
  status?: string
  createdAt?: any 
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onUsersUpdate((snapshot: any) => {
      try {
        const usersData = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setUsers(usersData)
      } catch (error) {
        console.error("Error mapping users:", error)
      } finally {
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      (user.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Stats calculation
  const totalUsers = users.length
  const activeUsers = users.filter(u => u.status !== 'blocked').length
  const blockedUsers = users.filter(u => u.status === 'blocked').length

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const action = currentStatus === 'blocked' ? 'unblock' : 'block';
    if (!confirm(`Ma hubtaa inaad ${action} garayso isticmaalahan?`)) return;

    setProcessingId(id)
    try {
      const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
      await updateUserStatus(id, newStatus);
    } catch (error) {
      alert("Cillad ayaa dhacday markii status-ka la bedelayay.");
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-bold tracking-tight">Accessing User Database...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-2">
      {/* Header & Stats Section */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">Users Management</h1>
          <p className="text-muted-foreground font-medium">Kormeerka iyo maamulka dadka isticmaala nidaamka.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary"><Users size={24} /></div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Users</p>
                <h3 className="text-2xl font-black">{totalUsers}</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-green-500/5 border-green-500/10">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-xl text-green-600"><ShieldCheck size={24} /></div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Active</p>
                <h3 className="text-2xl font-black text-green-600">{activeUsers}</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-destructive/5 border-destructive/10">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-destructive/10 rounded-xl text-destructive"><ShieldAlert size={24} /></div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Blocked</p>
                <h3 className="text-2xl font-black text-destructive">{blockedUsers}</h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="shadow-sm border-none bg-slate-100/50">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Raadi magaca ama email-ka..."
              className="pl-12 h-12 bg-white border-none shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-none shadow-xl overflow-hidden rounded-2xl">
        <CardHeader className="bg-white border-b border-slate-50">
          <CardTitle className="text-xl font-black uppercase tracking-tighter">Database Records</CardTitle>
          <CardDescription>Accounts found: {filteredUsers.length}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold py-4 px-6 text-slate-900">IDENTIFIER</TableHead>
                  <TableHead className="font-bold text-slate-900">CONTACT INFO</TableHead>
                  <TableHead className="font-bold text-slate-900">ROLE</TableHead>
                  <TableHead className="font-bold text-slate-900">STATUS</TableHead>
                  <TableHead className="font-bold text-right px-6 text-slate-900">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                            <AvatarFallback className="bg-primary text-primary-foreground font-black">
                              {(user.fullName || user.email || 'U').substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-black text-slate-900 leading-none">{user.fullName || 'No Name'}</p>
                            <p className="text-xs text-muted-foreground mt-1">ID: {user.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Mail size={12} className="text-slate-400" />
                            {user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`font-bold border-none capitalize ${user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                          {user.role || 'user'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className="font-bold px-3 py-1 rounded-full shadow-sm"
                          variant={user.status === 'blocked' ? 'destructive' : 'default'}
                        >
                          {user.status || 'active'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={processingId === user.id}
                          onClick={() => handleToggleStatus(user.id, user.status || 'active')}
                          className={`font-black rounded-lg transition-all active:scale-95 ${
                            user.status === 'blocked'
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-destructive hover:bg-red-50'
                          }`}
                        >
                          {processingId === user.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : user.status === 'blocked' ? (
                            <><CheckCircle size={16} className="mr-2" /> Unblock</>
                          ) : (
                            <><Ban size={16} className="mr-2" /> Block</>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-40 text-center">
                       <p className="text-muted-foreground font-bold italic">Natiijo lama helin...</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}