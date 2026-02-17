'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/auth-context'
import { 
  collection, query, where, orderBy, 
  onSnapshot, doc, updateDoc, deleteDoc, writeBatch 
} from 'firebase/firestore'
import { Bell, Trash2, ChevronLeft, Inbox, CheckCircle2, MoreHorizontal, X, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'

interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: any
  type?: 'system' | 'order' | 'message' // Optional types
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null) // State for Modal

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[]
      setNotifications(notifs)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  // Mark single notification as read
  const handleNotifClick = async (notif: Notification) => {
    setSelectedNotif(notif)
    if (!notif.read) {
      try {
        await updateDoc(doc(db, 'notifications', notif.id), { read: true })
      } catch (error) {
        console.error("Error marking read:", error)
      }
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    if (!user || notifications.length === 0) return
    const unread = notifications.filter(n => !n.read)
    if (unread.length === 0) return

    const batch = writeBatch(db)
    unread.forEach((notif) => {
      batch.update(doc(db, 'notifications', notif.id), { read: true })
    })
    await batch.commit()
  }

  // Delete notification
  const deleteNotification = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    try {
      await deleteDoc(doc(db, 'notifications', id))
      if (selectedNotif?.id === id) setSelectedNotif(null) // Close modal if deleted
    } catch (error) {
      console.error("Error deleting:", error)
    }
  }

  if (loading) return <LoadingState />

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      
      {/* NAVIGATION BAR */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors bg-white/50 p-2 rounded-full hover:bg-slate-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-black uppercase tracking-widest text-slate-900">Notifications</span>
          <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8">
        
        {/* HEADER ACTIONS */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black text-slate-900">
            Inbox 
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full align-middle">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </h1>
          
          {notifications.some(n => !n.read) && (
            <button 
              onClick={markAllAsRead}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-full transition-all flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {/* NOTIFICATIONS LIST */}
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm">
              <Inbox className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-black text-slate-900">No Notifications</h3>
            <p className="text-slate-400 text-sm mt-2 max-w-[200px] leading-relaxed">
              We'll let you know when we have something for you.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div 
                key={notif.id}
                onClick={() => handleNotifClick(notif)}
                className={`
                  relative p-4 rounded-2xl transition-all duration-200 cursor-pointer border group
                  ${notif.read 
                    ? 'bg-white border-slate-100 hover:border-slate-200' 
                    : 'bg-white border-blue-100 shadow-sm shadow-blue-100/50 ring-1 ring-blue-50'}
                `}
              >
                <div className="flex gap-4">
                  {/* ICON */}
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors
                    ${notif.read ? 'bg-slate-50 text-slate-400' : 'bg-blue-50 text-blue-600'}
                  `}>
                    <Bell className="w-5 h-5" />
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-bold text-sm truncate pr-2 ${notif.read ? 'text-slate-600' : 'text-slate-900'}`}>
                        {notif.title}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 shrink-0 bg-slate-50 px-1.5 py-0.5 rounded">
                        {notif.createdAt ? formatDistanceToNow(notif.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                      </span>
                    </div>
                    
                    <p className={`text-xs leading-relaxed line-clamp-2 ${notif.read ? 'text-slate-400' : 'text-slate-500 font-medium'}`}>
                      {notif.message}
                    </p>
                  </div>
                </div>

                {/* UNREAD DOT */}
                {!notif.read && (
                  <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full ring-4 ring-white" />
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- DETAIL MODAL --- */}
      {selectedNotif && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedNotif(null)} 
          />
          
          <div className="relative bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-[2rem] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Modal Drag Handle (Mobile) */}
            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6 sm:hidden" />
            
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Bell className="w-6 h-6" />
              </div>
              <button 
                onClick={() => setSelectedNotif(null)}
                className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">
              {selectedNotif.title}
            </h3>
            
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-6 uppercase tracking-wide">
              <Clock className="w-3.5 h-3.5" />
              {selectedNotif.createdAt ? formatDistanceToNow(selectedNotif.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl mb-8 border border-slate-100">
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                {selectedNotif.message}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setSelectedNotif(null)}
                className="w-full h-12 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => deleteNotification(selectedNotif.id)}
                className="w-full h-12 rounded-xl font-bold text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

function LoadingState() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 space-y-4">
      <div className="flex justify-between items-center mb-8">
        <div className="h-8 w-32 bg-slate-100 rounded-lg animate-pulse" />
        <div className="h-6 w-20 bg-slate-100 rounded-full animate-pulse" />
      </div>
      {[1,2,3,4,5].map(i => (
        <div key={i} className="h-24 bg-white border border-slate-100 rounded-2xl animate-pulse p-4 flex gap-4">
           <div className="w-12 h-12 bg-slate-50 rounded-xl" />
           <div className="flex-1 space-y-2 py-1">
              <div className="h-4 w-3/4 bg-slate-50 rounded" />
              <div className="h-3 w-1/2 bg-slate-50 rounded" />
           </div>
        </div>
      ))}
    </div>
  )
}