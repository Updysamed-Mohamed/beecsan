// 'use client';

// import React, { useState, useEffect, useRef, useMemo } from 'react';
// import { useAuth } from '@/lib/auth-context';
// import { Button } from '@/components/ui/button';
// import { Send, Search, ArrowLeft, MoreVertical, MessageSquare } from 'lucide-react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { db } from '@/lib/firebase';
// import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
// import { sendMessage, getUser } from '@/lib/firestore-utils';
// import type { Chat, Message, User } from '@/lib/types';

// function MessagesPage() {
//   const router = useRouter();
//   const { user, loading: authLoading } = useAuth();
  
//   const [chats, setChats] = useState<Chat[]>([]);
//   const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [messageText, setMessageText] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [userCache, setUserCache] = useState<Record<string, User>>({});
//   const [otherUser, setOtherUser] = useState<User | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // 1. Fetch chats and pre-load user data
//   useEffect(() => {
//     if (!user) return;
//     const q = query(
//       collection(db, 'chats'), 
//       where('participants', 'array-contains', user.uid), 
//       orderBy('lastTime', 'desc')
//     );

//     const unsubscribe = onSnapshot(q, async (snapshot) => {
//       const chatsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chat));
//       setChats(chatsData);
//       setLoading(false);

//       const missingUserIds = chatsData
//         .map(chat => chat.participants.find(id => id !== user.uid))
//         .filter((id): id is string => !!id && !userCache[id]);

//       if (missingUserIds.length > 0) {
//         const newUsers = await Promise.all(missingUserIds.map(async (id) => {
//           const data = await getUser(id);
//           return data ? { id, data } : null;
//         }));
//         setUserCache(prev => {
//           const next = { ...prev };
//           newUsers.forEach(item => { if (item) next[item.id] = item.data; });
//           return next;
//         });
//       }
//     });
//     return () => unsubscribe();
//   }, [user?.uid]);

//   // 2. Real-time Message Sync
//   useEffect(() => {
//     if (!selectedChatId || !user) return;
//     const msgQuery = query(
//       collection(db, 'chats', selectedChatId, 'messages'), 
//       orderBy('timestamp', 'asc')
//     );

//     const unsubscribe = onSnapshot(msgQuery, (snapshot) => {
//       setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
//       setTimeout(scrollToBottom, 100);
//     });
//     return () => unsubscribe();
//   }, [selectedChatId, user?.uid]);

//   // 3. Memoized filtering for search
//   const filteredChats = useMemo(() => {
//     return chats.filter(chat => {
//       const otherId = chat.participants.find(id => id !== user?.uid);
//       const name = otherId ? userCache[otherId]?.fullName?.toLowerCase() : '';
//       const msg = chat.lastMessage?.toLowerCase() || '';
//       const search = searchQuery.toLowerCase();
//       return name?.includes(search) || msg.includes(search);
//     });
//   }, [chats, userCache, searchQuery, user?.uid]);

//   // Update selected user info
//   useEffect(() => {
//     if (!selectedChatId || !user) return;
//     const chat = chats.find(c => c.id === selectedChatId);
//     const otherId = chat?.participants.find(id => id !== user.uid);
//     if (otherId && userCache[otherId]) setOtherUser(userCache[otherId]);
//   }, [selectedChatId, userCache, chats, user?.uid]);

//   const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedChatId || !user || !messageText.trim()) return;
//     const text = messageText.trim();
//     setMessageText('');
//     try { 
//       await sendMessage(selectedChatId, user.uid, text); 
//     } catch (error) { 
//       console.error('Send failed:', error); 
//     }
//   };

//   if (authLoading) return <div className="h-screen flex items-center justify-center bg-[#F8F9FA]">Loading...</div>;
//   if (!user) return <div className="h-screen flex items-center justify-center bg-[#F8F9FA]"><Button onClick={() => router.push('/auth/login')}>Sign In</Button></div>;

//   return (
//     <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
//       {/* HEADER: Matching Home Page Navbar */}
//       <header className="h-20 bg-white border-b border-gray-100 flex items-center sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between">
//           <Link href="/" className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-[#0F172A] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-900/10">
//               S
//             </div>
//             <div className="flex flex-col leading-none">
//               <span className="font-bold text-lg tracking-tight text-[#0F172A]">Beecsan</span>
//               <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Marketplace</span>
//             </div>
//           </Link>
//           <div className="hidden md:block flex-1 max-w-md mx-8">
//             <div className="relative">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input 
//                 className="w-full pl-11 pr-4 py-2.5 bg-[#F1F5F9] border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 transition-all" 
//                 placeholder="Search messages..." 
//               />
//             </div>
//           </div>
//           <div className="w-10 h-10 rounded-full bg-[#E2E8F0] flex items-center justify-center font-bold text-[#0F172A]">UN</div>
//         </div>
//       </header>

//       <main className="flex-1 flex max-w-7xl mx-auto w-full p-4 md:p-6 gap-6 overflow-hidden">
//         {/* SIDEBAR: Category-style List */}
//         <div className={`w-full md:w-96 flex flex-col gap-4 transition-all ${selectedChatId ? 'hidden md:flex' : 'flex'}`}>
//           <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 flex flex-col h-full overflow-hidden">
//             <h2 className="text-2xl font-black text-[#0F172A] mb-4 tracking-tight">Messages</h2>
//             <div className="relative mb-6">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input 
//                 className="w-full pl-10 pr-4 py-3 bg-[#F8F9FA] border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10" 
//                 placeholder="Search conversations..." 
//                 value={searchQuery}
//                 onChange={e => setSearchQuery(e.target.value)}
//               />
//             </div>
//             <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
//               {loading ? (
//                 <div className="text-center p-4 text-gray-400 text-sm">Loading chats...</div>
//               ) : filteredChats.map(chat => {
//                 const otherId = chat.participants.find(id => id !== user.uid);
//                 const p = otherId ? userCache[otherId] : null;
//                 const isActive = selectedChatId === chat.id;
//                 return (
//                   <button 
//                     key={chat.id} 
//                     onClick={() => setSelectedChatId(chat.id)}
//                     className={`w-full p-4 flex gap-4 rounded-2xl transition-all border ${
//                       isActive 
//                       ? 'bg-white border-blue-100 shadow-md shadow-blue-500/5 ring-1 ring-blue-50' 
//                       : 'bg-transparent border-transparent hover:bg-gray-50'
//                     }`}
//                   >
//                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 ${
//                       isActive ? 'bg-blue-600 text-white' : 'bg-[#F1F5F9] text-[#0F172A]'
//                     }`}>
//                       {p?.fullName?.[0].toUpperCase() || '?'}
//                     </div>
//                     <div className="min-w-0 flex-1 text-left">
//                       <span className="font-bold text-[#0F172A] block truncate">{p?.fullName || 'User'}</span>
//                       <p className={`text-xs truncate ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>{chat.lastMessage}</p>
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* CHAT AREA */}
//         <div className={`flex-1 flex flex-col bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden ${!selectedChatId ? 'hidden md:flex' : 'flex'}`}>
//           {selectedChatId && otherUser ? (
//             <>
//               <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-md">
//                 <div className="flex items-center gap-4">
//                   <Button variant="ghost" size="icon" className="md:hidden rounded-xl" onClick={() => setSelectedChatId(null)}>
//                     <ArrowLeft className="w-5 h-5"/>
//                   </Button>
//                   <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center font-bold text-blue-600">{otherUser.fullName?.[0]}</div>
//                   <div>
//                     <h2 className="font-bold text-[#0F172A] leading-none">{otherUser.fullName}</h2>
//                     <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{otherUser.role}</span>
//                   </div>
//                 </div>
//                 <Button variant="ghost" size="icon" className="rounded-xl"><MoreVertical className="w-5 h-5 text-gray-400"/></Button>
//               </div>

//               <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FDFDFD]">
//                 {messages.map(m => (
//                   <div key={m.id} className={`flex ${m.senderId === user.uid ? 'justify-end' : 'justify-start'}`}>
//                     <div className="max-w-[75%]">
//                       <div className={`p-4 text-sm leading-relaxed shadow-sm ${
//                         m.senderId === user.uid 
//                           ? 'bg-[#0F172A] text-white rounded-[1.5rem] rounded-tr-none' 
//                           : 'bg-white border border-gray-100 text-[#0F172A] rounded-[1.5rem] rounded-tl-none'
//                       }`}>
//                         {m.text}
//                       </div>
//                       {/* FIXED TIMESTAMP LOGIC */}
//                       <p className={`text-[10px] mt-1.5 font-medium text-gray-400 uppercase tracking-tighter ${m.senderId === user.uid ? 'text-right' : 'text-left'}`}>
//                         {(() => {
//                           if (!m.timestamp) return '';
//                           const ts = m.timestamp as any;
//                           const date = ts.toDate ? ts.toDate() : new Date(ts);
//                           return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//                         })()}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//               </div>

//               <div className="p-6 bg-white border-t border-gray-50">
//                 <form onSubmit={handleSendMessage} className="flex gap-3 items-center bg-[#F1F5F9] p-2 rounded-[1.5rem]">
//                   <input 
//                     className="flex-1 bg-transparent border-none px-4 py-2 text-sm focus:ring-0 placeholder:text-gray-400 text-[#0F172A]" 
//                     placeholder="Write a message..." 
//                     value={messageText}
//                     onChange={e => setMessageText(e.target.value)}
//                   />
//                   <Button type="submit" size="icon" className="rounded-2xl h-11 w-11 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 shrink-0" disabled={!messageText.trim()}>
//                     <Send className="w-4 h-4"/>
//                   </Button>
//                 </form>
//               </div>
//             </>
//           ) : (
//             <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
//               <div className="w-24 h-24 bg-[#F8F9FA] rounded-[2.5rem] flex items-center justify-center mb-6 border border-dashed border-gray-200">
//                 <MessageSquare className="w-10 h-10 text-gray-300" />
//               </div>
//               <h3 className="text-xl font-black text-[#0F172A] mb-2">Your Inbox</h3>
//               <p className="text-gray-400 max-w-xs text-sm font-medium">Select a conversation to start chatting.</p>
//             </div>
//           )}
//         </div>
//       </main>

//       <style jsx global>{`
//         .custom-scrollbar::-webkit-scrollbar { width: 4px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
//       `}</style>
//     </div>
//   );
// }

// export default MessagesPage;

'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Send, Search, ArrowLeft, MoreVertical, MessageSquare, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { getUser } from '@/lib/firestore-utils';
import type { Chat, Message, User } from '@/lib/types';

export default function MessagesPage() {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Xogta alaabta URL-ka (Params)
  const sId = searchParams.get('sellerId');
  const pTitle = searchParams.get('pTitle');
  const pImg = searchParams.get('pImg');
  const pPrice = searchParams.get('pPrice');
  const pId = searchParams.get('pId');

  // 1. UNIQUE CHAT LOGIC: Hubi in hal chat kaliya u dhaxeeyo labada qof
  useEffect(() => {
    if (!user) return;

    // Create a Unique ID based on both User IDs (A_B where A < B)
    if (sId && sId !== user.uid) {
      const pairId = user.uid < sId ? `${user.uid}_${sId}` : `${sId}_${user.uid}`;
      setSelectedChatId(pairId);

      // Pre-fill fariinta haddii ay tahay alaab cusub
      if (pTitle && messageText === '') {
        setMessageText(`Asc, ma heli karaa: ${pTitle}?`);
      }
    }

    const q = query(collection(db, 'chats'), where('participants', 'array-contains', user.uid), orderBy('lastTime', 'desc'));
    return onSnapshot(q, async (snapshot) => {
      const chatsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chat));
      setChats(chatsData);
      setLoading(false);

      const missingUserIds = chatsData
        .map(chat => chat.participants.find(id => id !== user.uid))
        .filter((id): id is string => !!id && !userCache[id]);

      if (missingUserIds.length > 0) {
        const users = await Promise.all(missingUserIds.map(async (id) => ({ id, data: await getUser(id) })));
        setUserCache(prev => {
          const next = { ...prev };
          users.forEach(u => { if (u.data) next[u.id] = u.data; });
          return next;
        });
      }
    });
  }, [user?.uid, sId]);

  // 2. Sync Messages
  useEffect(() => {
    if (!selectedChatId) return;
    const msgQuery = query(collection(db, 'chats', selectedChatId, 'messages'), orderBy('timestamp', 'asc'));
    return onSnapshot(msgQuery, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
  }, [selectedChatId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChatId || !user || !messageText.trim()) return;

    const text = messageText.trim();
    setMessageText(''); // Nadiifi markiiba

    try {
      // 1. Create/Update Chat Meta (Single doc per pair)
      await setDoc(doc(db, 'chats', selectedChatId), {
        participants: selectedChatId.split('_'),
        lastMessage: text,
        lastTime: serverTimestamp(),
      }, { merge: true });

      // 2. Add Message with optional Product Card
      await addDoc(collection(db, 'chats', selectedChatId, 'messages'), {
        senderId: user.uid,
        text: text,
        timestamp: serverTimestamp(),
        // Ku dar card-ka haddii ay tahay fariinta kowaad ee chat-ka
        ...(messages.length === 0 && pId && {
          productCard: { id: pId, title: pTitle, image: pImg, price: pPrice }
        })
      });

      // Clear params si uusan card-ka ugu soo noqnoqon URL-ka
      if (pId) router.replace('/messages');

    } catch (err) { console.error(err); }
  };

  const filteredChats = useMemo(() => {
    return chats.filter(chat => {
      const otherId = chat.participants.find(id => id !== user?.uid);
      const name = otherId ? userCache[otherId]?.fullName?.toLowerCase() : '';
      return name?.includes(searchQuery.toLowerCase()) || chat.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [chats, userCache, searchQuery, user?.uid]);

  if (authLoading) return null;
  if (!user) return <div className="h-screen flex items-center justify-center"><Button onClick={() => router.push('/auth/login')}>Sign In</Button></div>;

  return (
    <div className="h-screen bg-[#FAFBFC] flex flex-col overflow-hidden">
      {/* HEADER: Exactly like Home Page + Back Arrow */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
    
    {/* Left Side: Arrow + Logo */}
    <div className="flex items-center gap-2 sm:gap-4">
      <button 
        onClick={() => router.push('/')} 
        className="p-2 hover:bg-slate-100 rounded-full transition-colors shrink-0"
      >
        <ArrowLeft className="w-6 h-6 text-slate-900" />
      </button>

      <Link href="/" className="flex items-center shrink-0 group">
        <img 
          src="/logo_becsan.png" 
          alt="Beecsan Logo" 
          className="h-12 w-auto sm:h-16 object-contain transition-transform group-hover:scale-105"
        />
      </Link>
    </div>

    {/* Center/Right: Search Bar */}
    <div className="flex-1 max-w-lg relative group hidden xs:block">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-11 pr-4 py-2.5 bg-slate-100/80 border border-transparent rounded-full text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/20 transition-all"
      />
    </div>

  </div>
</header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 flex gap-6 overflow-hidden">
        {/* SIDEBAR: Messages List */}
        <div className={`w-full md:w-80 flex flex-col bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden ${selectedChatId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6">
            <h2 className="text-2xl font-black text-slate-900 mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10" 
                placeholder="Search conversations..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-2 space-y-1">
            {filteredChats.map(chat => {
              const otherId = chat.participants.find(id => id !== user.uid);
              const otherUser = otherId ? userCache[otherId] : null;
              const isActive = selectedChatId === chat.id;
              return (
                <button key={chat.id} onClick={() => setSelectedChatId(chat.id)}
                  className={`w-full p-4 flex gap-4 rounded-[1.8rem] transition-all ${isActive ? 'bg-slate-900 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-600'}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 ${isActive ? 'bg-white/20' : 'bg-slate-100'}`}>
                    {otherUser?.fullName?.[0] || 'U'}
                  </div>
                  <div className="min-w-0 text-left">
                    <span className="font-bold block truncate">{otherUser?.fullName || 'User'}</span>
                    <p className={`text-xs truncate opacity-60`}>{chat.lastMessage}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CHAT AREA */}
        <div className={`flex-1 flex flex-col bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden ${!selectedChatId ? 'hidden md:flex' : 'flex'}`}>
          {selectedChatId ? (
            <>
              {/* Product Header inside Chat */}
              {pTitle && (
                <div className="p-4 px-6 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <img src={pImg!} className="w-10 h-10 object-cover rounded-xl border border-slate-100" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{pTitle}</h4>
                      <p className="text-blue-600 font-black text-xs">${pPrice}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => router.push(`/listings/${pId}`)} className="rounded-full h-9 text-xs font-bold">View Product</Button>
                </div>
              )}

              {/* Message Bubbles */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAFBFC]">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex ${m.senderId === user.uid ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] flex flex-col ${m.senderId === user.uid ? 'items-end' : 'items-start'}`}>
                      
                      {/* Product Card Inside Message Bubble */}
                      {(m as any).productCard && (
                        <div className="mb-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden w-64">
                           <img src={(m as any).productCard.image} className="w-full h-32 object-cover" />
                           <div className="p-3">
                              <p className="text-xs font-bold truncate text-slate-800">{(m as any).productCard.title}</p>
                              <p className="text-blue-600 font-black text-sm mt-1">${(m as any).productCard.price}</p>
                           </div>
                        </div>
                      )}

                      <div className={`p-4 px-6 rounded-[1.8rem] text-sm font-medium shadow-sm ${
                        m.senderId === user.uid ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 bg-white border-t border-slate-50">
                <form onSubmit={handleSendMessage} className="flex gap-3 bg-slate-50 p-2 rounded-[1.8rem]">
                  <input 
                    className="flex-1 bg-transparent border-none px-4 py-3 text-sm outline-none placeholder:text-slate-400 font-medium" 
                    placeholder="Write your message..." 
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                  />
                  <Button type="submit" size="icon" className="w-12 h-12 rounded-[1.2rem] bg-slate-900 hover:bg-slate-800 shrink-0 shadow-lg" disabled={!messageText.trim()}>
                    <Send className="w-5 h-5"/>
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-40">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 border-2 border-dashed border-slate-200">
                <MessageSquare className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Select a chat</h3>
              <p className="text-sm font-medium text-slate-400">Your conversations will appear here</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

