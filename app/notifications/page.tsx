'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/auth-context'
import { 
  collection, query, where, orderBy, 
  onSnapshot, doc, updateDoc, deleteDoc, writeBatch, getDocs 
} from 'firebase/firestore'
import { Bell, Trash2, Clock, ChevronLeft, Inbox, CheckCircle2, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns' // Ma ilowday? Ku dar: npm install date-fns

interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: any
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

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

  const markAllAsRead = async () => {
    if (!user || notifications.length === 0) return
    const unread = notifications.filter(n => !n.read)
    if (unread.length === 0) return

    const batch = writeBatch(db)
    unread.forEach((notif) => {
      const ref = doc(db, 'notifications', notif.id)
      batch.update(ref, { read: true })
    })
    await batch.commit()
  }

  const markAsRead = async (id: string, isRead: boolean) => {
    if (isRead) return
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true })
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', id))
    } catch (error) {
      console.error("Error:", error)
    }
  }

  if (loading) return <LoadingState />

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.back()} 
            className="group flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-bold">Back</span>
          </button>
          <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Inbox</span>
          <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-10">
        {/* Header Section */}
        <div className="flex items-end justify-between mb-10 px-1">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Notifications</h1>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full">
                {notifications.filter(n => !n.read).length} Unread
              </span>
            </div>
          </div>
          {notifications.some(n => !n.read) && (
            <button 
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors pb-1"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Content */}
        {notifications.length === 0 ? (
          <div className="bg-white rounded-[40px] border border-dashed border-slate-200 py-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center mb-6">
              <Inbox className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">All caught up!</h3>
            <p className="text-slate-400 text-sm max-w-[240px] mt-2 font-medium">
              You don't have any notifications right now. We'll let you know when something happens.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div 
                key={notif.id}
                onClick={() => markAsRead(notif.id, notif.read)}
                className={`group relative p-5 rounded-[32px] transition-all duration-300 border ${
                  notif.read 
                  ? 'bg-transparent border-transparent hover:bg-white hover:border-slate-100' 
                  : 'bg-white border-slate-100 shadow-sm shadow-slate-200/50'
                }`}
              >
                <div className="flex gap-5">
                  {/* Icon Area */}
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                      notif.read ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white'
                    }`}>
                      <Bell className="w-5 h-5" />
                    </div>
                    {!notif.read && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary border-2 border-white rounded-full" />
                    )}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className={`font-bold text-[15px] truncate pr-4 ${notif.read ? 'text-slate-500' : 'text-slate-900'}`}>
                        {notif.title}
                      </h3>
                      <time className="text-[10px] font-bold text-slate-400 uppercase shrink-0 mt-1">
                        {notif.createdAt ? formatDistanceToNow(new Date(notif.createdAt.seconds * 1000)) + ' ago' : 'Now'}
                      </time>
                    </div>
                    <p className={`text-sm leading-relaxed mb-3 ${notif.read ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>
                      {notif.message}
                    </p>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                      className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 space-y-4">
      <div className="h-12 w-48 bg-slate-100 rounded-full animate-pulse mb-10" />
      {[1,2,3,4].map(i => (
        <div key={i} className="h-28 bg-white border border-slate-100 rounded-[32px] animate-pulse" />
      ))}
    </div>
  )
}