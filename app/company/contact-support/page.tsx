'use client';

import { useState } from 'react';
import Link from 'next/link';
import { db, auth } from '@/lib/firebase'; // Hubi in auth ay ka imanayso firebase config-kaaga
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/lib/auth-context'; // Haddii aad isticmaasho context
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, Mail, HelpCircle, Send, 
  CheckCircle2, AlertCircle, ShieldCheck, ChevronDown 
} from 'lucide-react';

export default function ContactSupportPage() {
  const { user } = useAuth(); // Ka soo qaado xogta user-ka hadda login-ka ah
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Account Issue',
    email: user?.email || '', // Haddii uu login yahay, email-kiisa si toos ah u geli
    description: ''
  });

  const faqs = [
    {
      question: 'How do I create an account?',
      answer: 'Click "Sign Up" at the top of the page. Enter your email, create a password, and fill in your profile information. Verify your email to activate your account.',
    },
    {
      question: 'How do I report a problem with a transaction?',
      answer: 'Contact our support team with details about the transaction, including the listing ID, buyer/seller name, and description of the issue.',
    },
    {
      question: 'Is my payment information safe?',
      answer: 'Yes. We use secure payment processing and never store full credit card details. All transactions are encrypted for your protection.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.description) return;

    setLoading(true);
    try {
      // Hubi haddii uu qofka login yahay xilliga uu dirayo
      const currentUser = auth.currentUser;

      await addDoc(collection(db, 'reports'), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp(),
        // LOGIC-GA CUSUB: Aqoonsiga Reporter-ka
        isLogged: !!currentUser, 
        reporterId: currentUser ? currentUser.uid : 'guest',
        reporterDetails: currentUser ? {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName || 'Beecsan User',
          // Halkan ku dar xog kasta oo kale (sida phone) haddii aad u baahato
        } : null
      });

      setSubmitted(true);
      setFormData({ type: 'Account Issue', email: user?.email || '', description: '' });
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Waan ka xunnahay, khalad ayaa dhacay. Fadlan mar kale isku day.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 px-6">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-slate-100 transition-all active:scale-90">
                <ArrowLeft className="w-5 h-5 text-slate-700" />
              </Button>
            </Link>
            <h1 className="font-black text-slate-900 uppercase tracking-tighter text-xl">Support Center</h1>
          </div>
          <div className="bg-blue-50 px-4 py-2 rounded-2xl flex items-center gap-2 border border-blue-100/50">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Official Support</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight">
            How can we <span className="text-blue-600 italic">help?</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Hadii aad wax su'aal ah qabto ama aad dhib kala kulantay adeegayaga, nala soo xiriir.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Report Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-10 shadow-2xl shadow-slate-200/40 relative">
              {submitted ? (
                <div className="py-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto ring-8 ring-green-50/50">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Report Received!</h3>
                    <p className="text-slate-500 font-medium px-4">Waad ku mahadsantahay. Kooxdayada ayaa dib kuugu soo jawaabi doonta email-kaaga.</p>
                  </div>
                  <Button 
                    onClick={() => setSubmitted(false)}
                    variant="outline" 
                    className="rounded-2xl font-bold px-8 h-12 hover:bg-slate-50"
                  >
                    Send Another Report
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-2 h-8 bg-blue-600 rounded-full" />
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Issue Details</h3>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">What's happening?</label>
                      <select 
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none appearance-none cursor-pointer"
                      >
                        <option>Account Issue</option>
                        <option>Transaction Problem</option>
                        <option>Listing Issue</option>
                        <option>Payment Issue</option>
                        <option>Safety Concern</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email for response</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="magacaaga@email.com"
                        className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-slate-50 font-medium text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                      <textarea
                        required
                        rows={5}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Fadlan si faahfaahsan noogu sharax dhibaatada..."
                        className="w-full p-5 rounded-2xl border border-slate-200 bg-slate-50 font-medium text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none resize-none"
                      />
                    </div>

                    <Button 
                      disabled={loading}
                      className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-70"
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="w-5 h-5" />
                          Send Report
                        </div>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0F172A] rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-600/20 rounded-full blur-2xl group-hover:bg-blue-600/40 transition-all" />
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20">
                <Mail className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black mb-3">Email Us</h3>
              <p className="text-slate-400 font-medium mb-8 leading-relaxed">
                Directly contact our team for business or technical inquiries.
              </p>
              <a 
                href="mailto:support@Beecsan.com" 
                className="block w-full py-4 text-center bg-white/5 hover:bg-white/10 rounded-2xl font-bold transition-all border border-white/10"
              >
                support@Beecsan.com
              </a>
            </div>

            <div className="bg-amber-50 rounded-[2.5rem] p-8 border border-amber-100 flex gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h4 className="font-black text-amber-900 text-sm uppercase tracking-wider mb-1">Response Time</h4>
                <p className="text-amber-800/70 text-xs font-semibold leading-relaxed">
                  Kooxdayadu waxay kuugu soo jawaabi doontaa 24 saac gudahood maalin kasta.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-24 space-y-8">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight pl-2">FAQ</h3>
          <div className="grid gap-3">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden transition-all hover:border-blue-200"
              >
                <summary className="px-8 py-6 cursor-pointer flex items-center justify-between font-bold text-slate-800 list-none">
                  {faq.question}
                  <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-8 pb-6 text-slate-500 font-medium leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}