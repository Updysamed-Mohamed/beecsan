'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Send, Search, ArrowLeft, Flag, AlertTriangle, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import type { Chat, Message, User } from '@/lib/types';
import { getUser } from '@/lib/firestore-utils';

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userCache, setUserCache] = useState<Record<string, User>>({});
  
  // Report States
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReporting, setIsReporting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // URL Params
  const sId = searchParams.get('sellerId');
  const pTitle = searchParams.get('pTitle');
  const pImg = searchParams.get('pImg');
  const pPrice = searchParams.get('pPrice');
  const pId = searchParams.get('pId');

  // 1. INITIALIZE & FETCH CHATS
  useEffect(() => {
    if (!user) return;

    if (sId && sId !== user.uid) {
      const pairId = user.uid < sId ? `${user.uid}_${sId}` : `${sId}_${user.uid}`;
      setSelectedChatId(pairId);
      if (pTitle && !messageText) setMessageText(`Asc, ma heli karaa: ${pTitle}?`);
    }

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user.uid),
      orderBy('lastTime', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chat));
      setChats(chatsData);
      setLoading(false);

      const missingUserIds = new Set<string>();
      chatsData.forEach(chat => {
        const otherId = chat.participants.find(id => id !== user.uid);
        if (otherId && !userCache[otherId]) missingUserIds.add(otherId);
      });

      if (missingUserIds.size > 0) {
        const newUsers: Record<string, User> = {};
        await Promise.all(Array.from(missingUserIds).map(async (id) => {
          const userData = await getUser(id);
          if (userData) newUsers[id] = userData;
        }));
        setUserCache(prev => ({ ...prev, ...newUsers }));
      }
    });

    return () => unsubscribe();
  }, [user, sId]);

  // 2. FETCH MESSAGES
  useEffect(() => {
    if (!selectedChatId) return;
    const msgQuery = query(collection(db, 'chats', selectedChatId, 'messages'), orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(msgQuery, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'auto' }), 100);
    });

    return () => unsubscribe();
  }, [selectedChatId]);

  // 3. SEND MESSAGE
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChatId || !user || !messageText.trim()) return;

    const text = messageText.trim();
    setMessageText('');

    try {
      await setDoc(doc(db, 'chats', selectedChatId), {
        participants: selectedChatId.split('_'),
        lastMessage: text,
        lastTime: serverTimestamp(),
      }, { merge: true });

      await addDoc(collection(db, 'chats', selectedChatId, 'messages'), {
        senderId: user.uid,
        text: text,
        timestamp: serverTimestamp(),
        ...(messages.length === 0 && pId ? {
          productCard: { id: pId, title: pTitle, image: pImg, price: pPrice }
        } : {})
      });

      if (pId) router.replace('/messages');
    } catch (err) { console.error(err); }
  };

  // 4. REPORT USER LOGIC
  const handleReportUser = async () => {
    if (!selectedChatId || !user || !reportReason) return;
    setIsReporting(true);
    const reportedUserId = selectedChatId.split('_').find(id => id !== user.uid);

    try {
      await addDoc(collection(db, 'reports'), {
        reporterId: user.uid,
        reportedUserId: reportedUserId,
        chatId: selectedChatId,
        reason: reportReason,
        timestamp: serverTimestamp(),
        status: 'pending'
      });
      setShowReportModal(false);
      setReportReason('');
      alert('Report submitted successfully.');
    } catch (error) {
      console.error(error);
      alert('Error submitting report.');
    } finally {
      setIsReporting(false);
    }
  };

  const filteredChats = chats.filter(chat => {
    const otherId = chat.participants.find(id => id !== user?.uid);
    const name = otherId ? userCache[otherId]?.fullName : '';
    return name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const currentChatUser = selectedChatId 
    ? userCache[selectedChatId.split('_').find(id => id !== user?.uid) || ''] 
    : null;

  if (authLoading) return null;
  if (!user) { router.push('/auth/login'); return null; }

  return (
    // FIX: Use 'fixed inset-0' to force it to take viewport only, preventing page scroll
    // <div className="fixed inset-0 z-50 bg-white flex h-screen">
<div className="w-full h-full flex">

      
      {/* =======================
          SIDEBAR (List)
      ======================= */}
      <div className={`
        flex-col w-full md:w-[400px] border-r border-slate-200 bg-white h-full
        ${selectedChatId ? 'hidden md:flex' : 'flex'}
      `}>
        
        {/* HEADER: STRICTLY FIXED HEIGHT */}
        <div className="flex-none h-16 flex items-center justify-between px-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
             <Link href="/" className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors">
               <ArrowLeft size={20} className="text-slate-900" />
             </Link>
             <h1 className="text-xl font-black text-slate-900">Messages</h1>
          </div>
        </div>

        {/* SEARCH: STRICTLY FIXED HEIGHT */}
        <div className="flex-none p-4">
           <div className="relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input 
               className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/5 placeholder:text-slate-400"
               placeholder="Search..."
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
             />
           </div>
        </div>

        {/* LIST: SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4">
          {filteredChats.map(chat => {
             const otherId = chat.participants.find(id => id !== user.uid);
             const otherUser = otherId ? userCache[otherId] : null;
             const isActive = selectedChatId === chat.id;

             return (
               <div 
                 key={chat.id} 
                 onClick={() => setSelectedChatId(chat.id)}
                 className={`group p-4 flex gap-4 rounded-xl cursor-pointer transition-all ${isActive ? 'bg-slate-900 text-white shadow-md' : 'hover:bg-slate-50'}`}
               >
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {otherUser?.fullName?.[0]?.toUpperCase() || 'U'}
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                       <h3 className={`font-bold truncate text-sm ${isActive ? 'text-white' : 'text-slate-900'}`}>
                         {otherUser?.fullName || 'User'}
                       </h3>
                       {chat.lastTime && (
                         <span className={`text-[10px] font-bold ${isActive ? 'text-slate-400' : 'text-slate-400'}`}>
                           {chat.lastTime?.toDate().toLocaleDateString()}
                         </span>
                       )}
                    </div>
                    <p className={`text-xs truncate font-medium ${isActive ? 'text-slate-400' : 'text-slate-500'}`}>
                      {chat.lastMessage || 'No messages yet'}
                    </p>
                 </div>
               </div>
             );
          })}
        </div>
      </div>

     {/* =======================
    CHAT AREA
======================= */}
<div className={`
  flex flex-col w-full flex-1 min-h-0 bg-[#FAFBFC] relative
  ${!selectedChatId ? 'hidden md:flex' : 'flex'}
`}>



  
  {selectedChatId ? (
    <>
      {/* 1. CHAT HEADER: FIXED HEIGHT */}
      <div className="flex-none h-16 px-4 bg-white/90 backdrop-blur-sm border-b border-slate-100 flex items-center justify-between z-20 shadow-sm">
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setSelectedChatId(null)} 
               className="md:hidden p-2 -ml-2 bg-white hover:bg-slate-50 border border-slate-100 rounded-full"
             >
               <ArrowLeft size={18} className="text-slate-900" />
             </button>
             
             <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center font-black text-white shrink-0">
                 {currentChatUser?.fullName?.[0]?.toUpperCase()}
             </div>
             <div className="overflow-hidden">
               <h2 className="font-black text-slate-900 text-base leading-tight truncate">
                   {currentChatUser?.fullName || 'Chat'}
               </h2>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active</span>
             </div>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full"
            onClick={() => setShowReportModal(true)}
          >
             <Flag size={18} />
          </Button>
      </div>

      {/* 2. MESSAGES: SCROLLABLE AREA */}
      {/* ADDED: min-h-0 is crucial for flex children to scroll correctly on mobile */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#FAFBFC] scroll-smooth min-h-0">
          {pTitle && messages.length === 0 && (
            <div className="flex justify-center mb-6">
               <div className="bg-white p-3 px-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-slate-900"></div>
                  <p className="text-xs font-bold text-slate-500">
                    Inquiring about: <span className="text-slate-900">{pTitle}</span>
                  </p>
               </div>
            </div>
          )}

          <div className="space-y-4">
            {messages.map((m, idx) => {
              const isMe = m.senderId === user.uid;
              const product = (m as any).productCard;

              return (
                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                   <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                     
                     {product && (
                        <div className="mb-2 bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm w-64 cursor-pointer hover:shadow-md transition-all" onClick={() => router.push(`/listings/${product.id}`)}>
                           <img src={product.image} className="w-full h-32 object-cover bg-slate-100" />
                           <div className="p-3">
                             <h4 className="font-bold text-slate-900 text-sm truncate">{product.title}</h4>
                             <p className="text-slate-900 font-black text-sm">${product.price}</p>
                           </div>
                        </div>
                     )}

                     <div className={`
                        px-5 py-3 rounded-[20px] text-[15px] font-medium shadow-sm break-words relative
                        ${isMe 
                          ? 'bg-slate-900 text-white rounded-tr-none' 
                          : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}
                     `}>
                        {m.text}
                     </div>
                     
                     <span className="text-[10px] font-bold text-slate-300 mt-1 px-1">
                       {m.timestamp?.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                     </span>
                   </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
      </div>

      {/* 3. INPUT: PINS TO BOTTOM */}
      {/* UPDATED: Added pb-safe or extra padding for mobile home indicators */}
      <div className="flex-none p-4 bg-white border-t border-slate-100 pb-6 md:pb-4">
          <form onSubmit={handleSendMessage} className="flex gap-2 items-center max-w-4xl mx-auto">
             <input 
                className="flex-1 bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                placeholder="Type a message..."
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
             />
             <Button 
               type="submit" 
               size="icon" 
               className={`w-12 h-12 rounded-2xl shrink-0 shadow-sm transition-all ${messageText.trim() ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-200 text-slate-400'}`}
               disabled={!messageText.trim()}
             >
                <Send size={20} className={messageText.trim() ? 'ml-0.5' : ''} />
             </Button>
          </form>
      </div>
    </>
  ) : (
    /* EMPTY STATE */
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#FAFBFC]">
        <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mb-6">
          <Send size={32} className="text-slate-300" />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">Beecsan Messages</h2>
        <p className="text-slate-400 font-bold text-sm max-w-[250px]">
          Select a conversation to start chatting securely.
        </p>
    </div>
  )}
</div>

      {/* REPORT MODAL (Fixed Overlay) */}
      {showReportModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                 <AlertTriangle className="text-red-500" size={20} /> Report User
              </h3>
              <button onClick={() => setShowReportModal(false)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            
            <p className="text-sm text-slate-500 font-bold mb-4">Why are you reporting this user?</p>
            
            <textarea 
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm min-h-[120px] mb-4 focus:outline-none focus:ring-2 focus:ring-red-100 resize-none border-none"
              placeholder="Describe the issue..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
            
            <Button 
              onClick={handleReportUser}
              disabled={!reportReason || isReporting}
              className="w-full py-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black"
            >
              {isReporting ? <Loader2 className="animate-spin" /> : 'Submit Report'}
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="fixed inset-0 flex items-center justify-center bg-white"><Loader2 className="animate-spin" /></div>}>
      <MessagesContent />
    </Suspense>
  );
}