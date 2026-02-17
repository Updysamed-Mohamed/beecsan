// 'use client';

// import React from "react"

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/lib/auth-context';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { ArrowLeft, Upload, AlertCircle } from 'lucide-react';

// export default function CreateListingPage() {
//   const router = useRouter();
//   const { user, loading } = useAuth();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState('');

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     price: '',
//     category: 'other',
//     condition: 'used',
//     city: '',
//     images: [] as File[],
//   });

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push('/auth/login');
//     }
//   }, [user, loading, router]);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     setFormData(prev => ({
//       ...prev,
//       images: [...prev.images, ...files].slice(0, 5),
//     }));
//   };

//   const handleRemoveImage = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index),
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     if (!formData.title.trim()) {
//       setError('Title is required');
//       return;
//     }

//     if (!formData.price) {
//       setError('Price is required');
//       return;
//     }

//     if (formData.images.length === 0) {
//       setError('At least one image is required');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       // TODO: Upload images to Supabase and get URLs
//       // TODO: Create product in Firestore
//       console.log('Listing data:', formData);
//       router.push('/profile');
//     } catch (err: any) {
//       setError(err.message || 'Failed to create listing');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background">
//         <div className="text-center">
//           <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 animate-pulse"></div>
//           <p className="text-muted-foreground">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="sticky top-0 z-50 bg-surface border-b border-border">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
//           <Button variant="ghost" size="sm" onClick={() => router.back()}>
//             <ArrowLeft className="w-5 h-5" />
//           </Button>
//           <h1 className="text-xl font-bold text-foreground">Create New Listing</h1>
//         </div>
//       </header>

//       <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
//         {error && (
//           <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-3">
//             <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
//             <p className="text-sm text-destructive">{error}</p>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Title & Price */}
//           <Card className="border-0 p-6">
//             <h2 className="text-lg font-semibold mb-4 text-foreground">Basic Information</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Title *
//                 </label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   placeholder="E.g., iPhone 15 Pro Max..."
//                   className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Description *
//                 </label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   placeholder="Describe your item in detail..."
//                   rows={5}
//                   className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface"
//                 />
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Price *
//                   </label>
//                   <div className="flex items-center">
//                     <span className="px-3 py-2 bg-muted text-muted-foreground rounded-l-lg">
//                       $
//                     </span>
//                     <input
//                       type="number"
//                       name="price"
//                       value={formData.price}
//                       onChange={handleInputChange}
//                       placeholder="0.00"
//                       className="flex-1 px-4 py-2 border border-l-0 border-border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Category *
//                   </label>
//                   <select
//                     name="category"
//                     value={formData.category}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface"
//                   >
//                     <option value="electronics">Electronics</option>
//                     <option value="furniture">Furniture</option>
//                     <option value="clothing">Clothing</option>
//                     <option value="vehicles">Vehicles</option>
//                     <option value="services">Services</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </Card>

//           {/* Details */}
//           <Card className="border-0 p-6">
//             <h2 className="text-lg font-semibold mb-4 text-foreground">Details</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Condition
//                 </label>
//                 <select
//                   name="condition"
//                   value={formData.condition}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface"
//                 >
//                   <option value="new">New</option>
//                   <option value="like-new">Like New</option>
//                   <option value="used">Used</option>
//                   <option value="refurbished">Refurbished</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   City *
//                 </label>
//                 <input
//                   type="text"
//                   name="city"
//                   value={formData.city}
//                   onChange={handleInputChange}
//                   placeholder="Your city"
//                   className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface"
//                 />
//               </div>
//             </div>
//           </Card>

//           {/* Images */}
//           <Card className="border-0 p-6">
//             <h2 className="text-lg font-semibold mb-4 text-foreground">Photos *</h2>
//             <div className="mb-4">
//               <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition">
//                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                   <Upload className="w-8 h-8 text-muted-foreground mb-2" />
//                   <p className="text-sm text-muted-foreground">
//                     Click to upload or drag and drop
//                   </p>
//                 </div>
//                 <input
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   className="hidden"
//                 />
//               </label>
//             </div>

//             {formData.images.length > 0 && (
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                 {formData.images.map((file, index) => (
//                   <div key={index} className="relative group">
//                     <img
//                       src={URL.createObjectURL(file) || "/placeholder.svg"}
//                       alt={`Preview ${index + 1}`}
//                       className="w-full h-24 object-cover rounded-lg"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveImage(index)}
//                       className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </Card>

//           {/* Submit */}
//           <div className="flex gap-3">
//             <Button
//               type="button"
//               variant="outline"
//               className="flex-1 bg-transparent"
//               onClick={() => router.back()}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               disabled={isSubmitting}
//               className="flex-1 bg-primary hover:bg-primary/90 text-white"
//             >
//               {isSubmitting ? 'Creating...' : 'Create Listing'}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/lib/auth-context';
// import { db } from '@/lib/firebase';
// import { createClient } from '@supabase/supabase-js';
// import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// import { Button } from '@/components/ui/button';
// import { ArrowLeft, Upload, AlertCircle, X, CheckCircle2 } from 'lucide-react';

// // Supabase Setup
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// export default function CreateListingPage() {
//   const router = useRouter();
//   const { user } = useAuth();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [error, setError] = useState('');
//   const [selectedImages, setSelectedImages] = useState<File[]>([]);

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     price: '',
//     category: '',
//     city: '',
//   });

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const files = Array.from(e.target.files);
//       if (selectedImages.length + files.length > 5) {
//         return setError("Ugu badnaan 5 sawir kaliya ayaa loo ogol yahay.");
//       }
//       setSelectedImages(prev => [...prev, ...files]);
//       setError('');
//     }
//   };

//   const removeImage = (index: number) => {
//     setSelectedImages(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) return setError("Fadlan soo gal nidaamka ka hor intaadan wax xareyn.");
//     if (selectedImages.length === 0) return setError("Fadlan soo geli ugu yaraan hal sawir.");

//     setIsSubmitting(true);
//     setError('');

//     try {
//       // 🚀 FAST UPLOAD: Dhamaan sawirada hal mar (Parallel) ayay wada baxayaan
//       const uploadPromises = selectedImages.map(async (file) => {
//         const fileExt = file.name.split('.').pop();
//         const fileName = `${user.uid}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

//         const { error: uploadError, data } = await supabase.storage
//           .from('product-images')
//           .upload(fileName, file);

//         if (uploadError) throw uploadError;

//         const { data: { publicUrl } } = supabase.storage
//           .from('product-images')
//           .getPublicUrl(fileName);

//         return publicUrl;
//       });

//       const imageUrls = await Promise.all(uploadPromises);

    
//       await addDoc(collection(db, 'products'), {
//         title: formData.title.trim(),
//         description: formData.description.trim(),
//         price: parseFloat(formData.price),
//         category: formData.category.toLowerCase(),
//         city: formData.city.trim(),
//         image_urls: imageUrls,       // ✅ Sync with Home
//         status: 'available',         // ✅ Sync with Home filter
//         created_at: serverTimestamp(), // ✅ Sync with Home sorting
//         seller_id: user.uid,
//         seller_name: user.displayName || user.email?.split('@')[0],
//         seller_email: user.email,
//       });

//       setIsSuccess(true);
//       setTimeout(() => {
//         router.push('/');
//         router.refresh();
//       }, 1500);

//     } catch (err: any) {
//       console.error("Xareyntu way fashilantay:", err);
//       setError("Cillad ayaa dhacday: " + (err.message || "Internet-kaaga hubi."));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isSuccess) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
//         <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
//           <CheckCircle2 className="text-green-600 w-12 h-12" />
//         </div>
//         <h2 className="text-2xl font-black">Si guul leh ayay u xaroootay!</h2>
//         <p className="text-slate-500 mt-2 text-center">redirecting...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#FAFBFC] pb-20">
//       <div className="max-w-2xl mx-auto p-4 sm:p-8">
//         <button 
//           onClick={() => router.back()} 
//           className="flex items-center text-slate-500 font-bold mb-8 hover:text-slate-800 transition-colors"
//         >
//           <ArrowLeft className="mr-2 w-5 h-5" /> Back
//         </button>

//         <div className="bg-white rounded-[40px] p-6 sm:p-10 shadow-sm border border-slate-100">
//           <h1 className="text-3xl font-black text-slate-900 mb-2">Create Listing</h1>
//           <p className="text-slate-400 mb-8 font-medium">Buuxi macluumaadka alaabtaada</p>

//           {error && (
//             <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 border border-red-100">
//               <AlertCircle size={20} className="shrink-0" />
//               <p className="text-sm font-bold">{error}</p>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Multi-Image Upload */}
//             <div className="space-y-4">
//               <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Product Photos</label>
//               <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
//                 {selectedImages.map((file, i) => (
//                   <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200">
//                     <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
//                     <button 
//                       type="button"
//                       onClick={() => removeImage(i)}
//                       className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
//                     >
//                       <X size={12} />
//                     </button>
//                   </div>
//                 ))}
//                 {selectedImages.length < 5 && (
//                   <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors bg-slate-50/50">
//                     <Upload className="text-slate-300 mb-1" size={24} />
//                     <span className="text-[10px] font-black text-slate-400">ADD</span>
//                     <input type="file" multiple onChange={handleFileChange} className="hidden" accept="image/*" />
//                   </label>
//                 )}
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Title</label>
//                 <input 
//                   placeholder="Maxaad iibinaysaa?" 
//                   className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-primary/10 transition-all font-semibold"
//                   onChange={e => setFormData({...formData, title: e.target.value})}
//                   required
//                 />
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Category</label>
//                   <select 
//                     className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-100 outline-none font-semibold appearance-none"
//                     onChange={e => setFormData({...formData, category: e.target.value})}
//                     required
//                   >
//                     <option value="">Select Category</option>
//                     <option value="electronics">Electronics</option>
//                     <option value="vehicles">Vehicles</option>
//                     <option value="fashion">Fashion</option>
//                     <option value="furniture">Furniture</option>
//                     <option value="Beauty and care">Beauty and care</option>
//                     <option value="Construction Materials">Construction Materials</option>
//                     <option value="General Service">General Service</option>
//                   </select>
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Price ($)</label>
//                   <input 
//                     placeholder="0.00" 
//                     type="number"
//                     className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-100 outline-none font-semibold"
//                     onChange={e => setFormData({...formData, price: e.target.value})}
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">City</label>
//                 <input 
//                   placeholder="Mogadishu, Hargeisa, etc." 
//                   className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-100 outline-none font-semibold"
//                   onChange={e => setFormData({...formData, city: e.target.value})}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Description</label>
//                 <textarea 
//                   placeholder="Sharaxaad ka bixi alaabtaada..." 
//                   rows={4}
//                   className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-100 outline-none font-semibold resize-none"
//                   onChange={e => setFormData({...formData, description: e.target.value})}
//                   required
//                 />
//               </div>
//             </div>

//             <Button 
//               type="submit" 
//               disabled={isSubmitting}
//               className="w-full h-18 py-6 bg-slate-900 hover:bg-black text-white rounded-[24px] font-black text-lg shadow-xl shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
//             >
//               {isSubmitting ? (
//                 <div className="flex items-center gap-3">
//                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                   Xareynta waa socotaa...
//                 </div>
//               ) : "Post"}
//             </Button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/lib/auth-context';
// import { db } from '@/lib/firebase';
// import { createClient } from '@supabase/supabase-js';
// import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// import { Button } from '@/components/ui/button';
// import { ArrowLeft, Upload, AlertCircle, X, CheckCircle2 } from 'lucide-react';

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// // Configuration la mid ah Database-kaaga
// const categoryConfigs: Record<string, { label: string; fields: { name: string; label: string; type: string; placeholder: string }[] }> = {
//   electronics: { 
//     label: "Electronics", 
//     fields: [
//       { name: 'brand', label: 'Brand', type: 'text', placeholder: 'Tecno' },
//       { name: 'model', label: 'Model', type: 'text', placeholder: 'm4' },
//       { name: 'color', label: 'Color', type: 'text', placeholder: 'Black' }
//     ] 
//   },
//   vehicles: { 
//     label: "Vehicles", 
//     fields: [
//       { name: 'make', label: 'Nooca Gaariga', type: 'text', placeholder: 'Toyota' }, 
//       { name: 'model', label: 'Model', type: 'text', placeholder: 'Corolla' }, 
//       { name: 'year', label: 'Sanadka', type: 'text', placeholder: '2023' },
//       { name: 'km', label: 'km', type: 'text', placeholder: '0' }
//     ] 
//   },
//   // property: { 
//   //   label: "Property", 
//   //   fields: [
//   //     { name: 'phone_verification', label: 'Phone', type: 'text', placeholder: '+252...' },
//   //     { name: 'size', label: 'Size', type: 'text', placeholder: '120sqm' }
//   //   ] 
//   // },
//   property: { 
//     label: "Property & Real Estate", 
//     fields: [
//       { name: 'property_type', label: 'Nooca (House, Apartment, Land)', type: 'text', placeholder: 'e.g. Apartment' },
//       { name: 'phone_verification', label: 'Phone Number', type: 'text', placeholder: '+252...' },
//       { name: 'bedrooms', label: 'Qolalka Jiifka (Bedrooms)', type: 'text', placeholder: '3' },
//       { name: 'bathrooms', label: 'Musqulaha (Bathrooms)', type: 'text', placeholder: '2' },
//       { name: 'size', label: 'Baaxadda (Size)', type: 'text', placeholder: '120sqm ama 20x20' },
//     ] 
//   },
//   furniture: { label: "Furniture", fields: [{ name: 'material', label: 'Maaddada', type: 'text', placeholder: 'Kursi' }] },
//   fashions: { label: "Fashions", fields: [{ name: 'size', label: 'Size', type: 'text', placeholder: 'XL' }] },
//   beauty: { label: "Beauty", fields: [{ name: 'type', label: 'Nooca', type: 'text', placeholder: 'Cream' }] },
//   construction: { label: "Construction", fields: [{ name: 'item_type', label: 'Agabka', type: 'text', placeholder: 'Tools' }] },
//   services: { label: "Services", fields: [{ name: 'service_type', label: 'Nooca Adeegga', type: 'text', placeholder: 'Maintenance' }] }
// };

// export default function CreateListingPage() {
//   const router = useRouter();
//   const { user } = useAuth();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [error, setError] = useState('');
//   const [selectedImages, setSelectedImages] = useState<File[]>([]);
  
//   const [formData, setFormData] = useState({ 
//     title: '', description: '', price: '', category: '', city: '', 
//     condition: 'New', isNegotiable: false 
//   });
//   const [extraFields, setExtraFields] = useState<Record<string, string>>({});

//   const compressImageNative = (file: File): Promise<Blob> => {
//     return new Promise((resolve) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = (e) => {
//         const img = new Image();
//         img.src = e.target?.result as string;
//         img.onload = () => {
//           const canvas = document.createElement('canvas');
//           let w = img.width, h = img.height, max = 1200;
//           if (w > h ? w > max : h > max) { if (w > h) { h *= max / w; w = max; } else { w *= max / h; h = max; } }
//           canvas.width = w; canvas.height = h;
//           canvas.getContext('2d')?.drawImage(img, 0, 0, w, h);
//           canvas.toBlob((b) => resolve(b as Blob), 'image/jpeg', 0.8);
//         };
//       };
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user || selectedImages.length === 0) return setError("Fadlan sawir soo geli.");
//     setIsSubmitting(true);

//     try {
//       const uploadPromises = selectedImages.map(async (file) => {
//         const blob = await compressImageNative(file);
//         const name = `${user.uid}/${Date.now()}-${Math.random().toString(36).substr(7)}.jpg`;
//         await supabase.storage.from('product-images').upload(name, blob);
//         return supabase.storage.from('product-images').getPublicUrl(name).data.publicUrl;
//       });

//       const urls = await Promise.all(uploadPromises);

//       // Field names-ka halkan ayaa muhiim ah si ay ugu dhashaan sidii sawirkaaga
//       await addDoc(collection(db, 'products'), {
//         title: formData.title,
//         description: formData.description,
//         price: parseFloat(formData.price),
//         category: formData.category,
//         city: formData.city,
//         condition: formData.condition,
//         isNegotiable: formData.isNegotiable,
//         image_urls: urls, // Sida ku qoran db
//         status: 'pending',
//         created_at: serverTimestamp(),
//         seller_id: user.uid,
//         seller_name: user.displayName || user.email?.split('@')[0],
//         views: 0,
//         ...extraFields // Halkan waxaa ku daramaya make, model, year, iwm.
//       });

//       setIsSuccess(true);
//       setTimeout(() => router.push('/'), 1500);
//     } catch (err: any) {
//       setError(err.message);
//       setIsSubmitting(false);
//     }
//   };

//   if (isSuccess) return <div className="min-h-screen flex items-center justify-center font-black text-green-600"><CheckCircle2 className="mr-2" /> WAA LA XAREEYAY!</div>;

//   return (
//     <div className="min-h-screen bg-[#FAFBFC] p-4">
//       <div className="max-w-xl mx-auto bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
//         <button onClick={() => router.back()} className="flex items-center text-slate-400 font-bold mb-6 text-sm"><ArrowLeft size={16} className="mr-1" /> Back</button>
        
//         <h1 className="text-2xl font-black mb-6">Create Listing</h1>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Images */}
//           <div className="grid grid-cols-5 gap-2">
//             {selectedImages.map((f, i) => (
//               <div key={i} className="relative aspect-square rounded-lg overflow-hidden border">
//                 <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" alt="preview" />
//                 <button type="button" onClick={() => setSelectedImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-0 right-0 bg-black/50 text-white p-1"><X size={10} /></button>
//               </div>
//             ))}
//             {selectedImages.length < 5 && (
//               <label className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer bg-slate-50"><Upload size={18} className="text-slate-300" /><input type="file" multiple onChange={(e) => e.target.files && setSelectedImages(prev => [...prev, ...Array.from(e.target.files!)])} className="hidden" accept="image/*" /></label>
//             )}
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <select className="p-4 bg-slate-50 rounded-xl outline-none font-bold text-sm border-none" value={formData.category} onChange={e => { setFormData({...formData, category: e.target.value}); setExtraFields({}); }} required>
//               <option value="">Category</option>
//               {Object.keys(categoryConfigs).map(k => <option key={k} value={k}>{categoryConfigs[k].label}</option>)}
//             </select>
//             <select className="p-4 bg-slate-50 rounded-xl outline-none font-bold text-sm border-none" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}>
//               <option value="New">New</option>
//               <option value="Used">Used</option>
//             </select>
//           </div>

//           {/* Dynamic Extra Fields (Directly in main object) */}
//           {categoryConfigs[formData.category] && (
//             <div className="p-4 bg-slate-50/50 rounded-2xl grid grid-cols-2 gap-3">
//               {categoryConfigs[formData.category].fields.map(f => (
//                 <input key={f.name} placeholder={f.label} className="p-3 bg-white rounded-lg outline-none font-bold text-xs border border-slate-100 shadow-sm" onChange={e => setExtraFields({...extraFields, [f.name]: e.target.value})} required />
//               ))}
//             </div>
//           )}

//           <input placeholder="Ad Title" className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold text-sm" onChange={e => setFormData({...formData, title: e.target.value})} required />
          
//           <div className="grid grid-cols-2 gap-3">
//             <input placeholder="Price ($)" type="number" className="p-4 bg-slate-50 rounded-xl outline-none font-bold text-sm" onChange={e => setFormData({...formData, price: e.target.value})} required />
//             <input placeholder="City" className="p-4 bg-slate-50 rounded-xl outline-none font-bold text-sm" onChange={e => setFormData({...formData, city: e.target.value})} required />
//           </div>

//           <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
//             <span className="font-bold text-slate-700 text-xs">Negotiable (Gorgortan)</span>
//             <button type="button" onClick={() => setFormData({...formData, isNegotiable: !formData.isNegotiable})} className={`w-10 h-5 rounded-full relative transition-colors ${formData.isNegotiable ? 'bg-slate-900' : 'bg-slate-300'}`}><div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${formData.isNegotiable ? 'left-5' : 'left-1'}`} /></button>
//           </div>

//           <textarea placeholder="Description..." rows={3} className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold text-sm resize-none" onChange={e => setFormData({...formData, description: e.target.value})} required />

//           <Button type="submit" disabled={isSubmitting} className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black text-lg">
//             {isSubmitting ? "XAREYNTA..." : "POST NOW"}
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// }
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { createClient } from '@supabase/supabase-js';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Upload,
  X,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';

/* =========================
   SUPABASE
========================= */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* =========================
   LIMIT CONFIG
========================= */
const FREE_AD_LIMIT = 5;

/* =========================
   CATEGORY CONFIGS
========================= */
const categoryConfigs: Record<
  string,
  { label: string; fields: { name: string; label: string }[] }
> = {
  electronics: {
    label: 'Electronics',
    fields: [
      { name: 'brand', label: 'Brand' },
      { name: 'model', label: 'Model' },
      { name: 'color', label: 'Color' },
    ],
  },
  vehicles: {
    label: 'Vehicles',
    fields: [
      { name: 'model', label: 'Baabuurka Noociisa (Model)' },
    ],
  },
  property: {
    label: 'Property & Real Estate',
    fields: [
      { name: 'bedrooms', label: 'Bedrooms' },
      { name: 'bathrooms', label: 'Bathrooms' },
      { name: 'size', label: 'Size' },
    ],
  },
  furniture: { label: 'Furniture', fields: [] },
  fashions: { label: 'Fashion & Beauty', fields: [] },
  construction: { label: 'Construction & Repairs', fields: [] },
  services: { label: 'General Services', fields: [] },
};

const subCategoryConfigs: Record<string, { value: string; label: string }[]> = {
  electronics: [
    { value: 'phones', label: 'Phones' },
    { value: 'laptops', label: 'Laptops' },
    { value: 'tvs', label: 'TVs' },
    { value: 'accessories', label: 'Accessories' },
  ],
  vehicles: [
    { value: 'cars', label: 'Cars' },
    { value: 'bajaaj', label: 'Bajaaj' },
    { value: 'motorcycles', label: 'Motorcycles' },
    { value: 'trucks', label: 'Trucks & Trailers' },
  ],
  property: [
    { value: 'house', label: 'Guryo Kiro ah(Vila for rent)' },
    { value: 'apartment', label: 'Apartment for Rent' },
    { value: 'guest', label: 'Guest House' },
    { value: 'hotel', label: 'Hotels' },
  ],
};

/* =========================
   PAGE
========================= */
export default function CreateListingPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [extraFields, setExtraFields] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    city: '',
    condition: 'Used', // Default
    priceType: 'Negotiable', // Default
  });

  // Auto-hide error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  /* =========================
      VALIDATION & PREVIEW CHECK
  ========================= */
  const handlePreviewClick = () => {
    setError('');

    // 1. Check Images
    if (selectedImages.length === 0) {
      setError('Fadlan geli ugu yaraan hal sawir.');
      return;
    }

    // 2. Check Category
    if (!formData.category) {
      setError('Fadlan dooro Category.');
      return;
    }

    // 3. Check Subcategory (Only if the category HAS subcategories defined)
    const hasSubCategories = subCategoryConfigs[formData.category] && subCategoryConfigs[formData.category].length > 0;
    if (hasSubCategories && !formData.subcategory) {
      setError('Fadlan dooro Subcategory.');
      return;
    }

    // 4. Basic Text Fields
    if (!formData.title.trim()) {
      setError('Fadlan qor Ciwaanka (Title).');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError('Fadlan qor Qiimo sax ah.');
      return;
    }
    if (!formData.city.trim()) {
      setError('Fadlan qor Magaalada (City).');
      return;
    }
    if (!formData.description.trim()) {
      setError('Fadlan qor Faahfaahin (Description).');
      return;
    }

    // If all valid, show preview
    setShowPreview(true);
  };

  /* =========================
      CHECK FREE LIMIT
  ========================= */
  const checkAdLimit = async () => {
    if (!user) return false;
    const q = query(
      collection(db, 'products'),
      where('seller_id', '==', user.uid)
    );
    const snap = await getDocs(q);
    return snap.size < FREE_AD_LIMIT;
  };

  /* =========================
      PUBLISH
  ========================= */
  const handlePublish = async () => {
    if (!user) return;

    setIsSubmitting(true);
    setError('');

    try {
      // 1. Check Limit
      const allowed = await checkAdLimit();
      if (!allowed) {
        setError(`Waxaad gaartay ${FREE_AD_LIMIT} xayeysiis oo bilaash ah. Fadlan tirtir kuwii hore ama update samee.`);
        setIsSubmitting(false);
        setShowPreview(false);
        return;
      }

      // 2. Upload Images
      const uploadPromises = selectedImages.map(async (file) => {
        const name = `${user.uid}/${Date.now()}-${Math.random()}.jpg`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(name, file);
        if (uploadError) throw uploadError;
        return supabase.storage.from('product-images').getPublicUrl(name).data.publicUrl;
      });

      const urls = await Promise.all(uploadPromises);

      // 3. Save to Firestore
      await addDoc(collection(db, 'products'), {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        subcategory: formData.subcategory || null,
        city: formData.city,
        condition: formData.condition,
        priceType: formData.priceType,
        image_urls: urls,
        status: 'pending',
        created_at: serverTimestamp(),
        seller_id: user.uid,
        ...extraFields,
      });

      setIsSuccess(true);
      setTimeout(() => router.push('/'), 2000);

    } catch (err) {
      console.error(err);
      setError('Qalad ayaa dhacay intii lagu guda jiray daabacaada.');
      setIsSubmitting(false);
    }
  };

  // if (isSuccess) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center text-green-600 font-black">
  //       <CheckCircle2 className="mr-2" /> Xayeysiinta waa la gudbiyey (Pending)
  //     </div>
  //   );
  // }
  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
        <div className="max-w-sm w-full bg-white rounded-[32px] shadow-2xl border border-slate-100 p-8 text-center">
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 size={40} strokeWidth={3} />
          </div>
          
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Waa la Gudbiyey!
          </h2>
          
          <p className="text-slate-500 font-bold mb-8 leading-relaxed">
            Xayeysiintaada waa la diray, maamulka ayaa hubin doona (Pending Review).
          </p>

          <div className="flex items-center justify-center gap-2 text-slate-400 text-sm font-bold bg-slate-50 py-3 rounded-xl">
            <Loader2 size={16} className="animate-spin text-slate-900" />
            Dib ayaa laguugu celinayaa...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC] pb-20">
      
      {/* ERROR POPUP (TOAST) */}
      {error && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300 w-[90%] max-w-md">
          <div className="bg-red-500 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertCircle size={24} className="text-white/90" />
              <p className="font-bold text-sm leading-tight">{error}</p>
            </div>
            <button 
              onClick={() => setError('')} 
              className="p-1 hover:bg-white/20 rounded-full transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-xl mx-auto bg-white min-h-screen sm:min-h-0 sm:my-4 sm:rounded-[32px] border-x sm:border shadow-sm relative">

        {/* STICKY HEADER */}
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 pt-6 pb-4 rounded-t-[32px]">
          <button
            onClick={() => router.back()}
            className="flex items-center text-slate-500 font-bold mb-3 text-sm hover:text-slate-800 transition"
          >
            <ArrowLeft size={18} className="mr-1" /> Back
          </button>
          <h1 className="text-2xl font-black text-slate-900">Create Listing</h1>
        </div>

        <div className="p-6 pt-6">
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* IMAGES */}
            <div className="grid grid-cols-5 gap-2">
              {selectedImages.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                  <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" alt="preview" />
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImages(p => p.filter((_, idx) => idx !== i))
                    }
                    className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-red-500 transition"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {selectedImages.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition group">
                  <Upload size={20} className="text-slate-400 group-hover:text-slate-600 mb-1" />
                  <span className="text-[10px] font-bold text-slate-400">Add</span>
                  <input
                    type="file"
                    multiple
                    hidden
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files &&
                      setSelectedImages(p => [...p, ...Array.from(e.target.files!)])
                    }
                  />
                </label>
              )}
            </div>

            {/* CATEGORY */}
            <select
              className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition"
              value={formData.category}
              onChange={(e) => {
                setFormData({ ...formData, category: e.target.value, subcategory: '' });
                setExtraFields({});
              }}
              required
            >
              <option value="">Select Category</option>
              {Object.entries(categoryConfigs).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>

            {/* SUBCATEGORY */}
            {subCategoryConfigs[formData.category] && (
              <select
                className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition"
                value={formData.subcategory}
                onChange={(e) =>
                  setFormData({ ...formData, subcategory: e.target.value })
                }
                required
              >
                <option value="">Select Subcategory</option>
                {subCategoryConfigs[formData.category].map(sub => (
                  <option key={sub.value} value={sub.value}>{sub.label}</option>
                ))}
              </select>
            )}

            {/* EXTRA FIELDS */}
            {categoryConfigs[formData.category] && (
              <div className="grid grid-cols-2 gap-3">
                {categoryConfigs[formData.category].fields.map(f => (
                  <input
                    key={f.name}
                    placeholder={f.label}
                    className="p-4 bg-slate-50 rounded-xl font-bold text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition"
                    onChange={(e) =>
                      setExtraFields({ ...extraFields, [f.name]: e.target.value })
                    }
                  />
                ))}
              </div>
            )}

            {/* NEW/USED & PRICE TYPE */}
            <div className="grid grid-cols-2 gap-3">
               <select
                 className="p-4 bg-slate-50 rounded-xl font-bold text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition"
                 value={formData.condition}
                 onChange={(e) => setFormData({...formData, condition: e.target.value})}
               >
                 <option value="New">New</option>
                 <option value="Used">Used</option>
               </select>
               <select
                 className="p-4 bg-slate-50 rounded-xl font-bold text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition"
                 value={formData.priceType}
                 onChange={(e) => setFormData({...formData, priceType: e.target.value})}
               >
                 <option value="Fixed">Fixed Price</option>
                 <option value="Negotiable">Negotiable</option>
               </select>
            </div>

            <input 
              placeholder="Title (e.g. iPhone 14 Pro Max)" 
              className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })} 
            />

            <input 
              placeholder="Price ($)" 
              type="number" 
              className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })} 
            />

            <input 
              placeholder="City (e.g. Mogadishu)" 
              className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition"
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })} 
            />

            <textarea 
              placeholder="Description (Describe your item...)" 
              rows={4}
              className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })} 
            />

            <Button
              type="button"
              onClick={handlePreviewClick}
              className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            >
              Preview Ad
            </Button>
          </form>
        </div>

        {/* PREVIEW MODAL */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[60] backdrop-blur-sm">
            <div className="bg-white max-w-md w-full rounded-[24px] p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center border-b pb-3 border-dashed border-slate-200">
                <h2 className="font-black text-xl text-slate-900">Review Listing</h2>
                <button onClick={() => setShowPreview(false)} className="bg-slate-100 p-2 rounded-full hover:bg-slate-200">
                  <X size={16} />
                </button>
              </div>
              
              <div className="space-y-1">
                 <p className="text-xs text-blue-600 uppercase font-black tracking-wider bg-blue-50 inline-block px-2 py-1 rounded">
                   {categoryConfigs[formData.category]?.label}
                 </p>
                 <p className="font-bold text-2xl text-slate-900 leading-tight pt-2">{formData.title}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 font-semibold">
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-slate-300 mr-2"></span>{formData.city}</span>
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-slate-300 mr-2"></span>{formData.condition}</span>
                {formData.subcategory && (
                   <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-slate-300 mr-2"></span>{formData.subcategory}</span>
                )}
              </div>
              
              <div className="flex items-baseline gap-2">
                <p className="font-black text-3xl text-slate-900">${Number(formData.price).toLocaleString()}</p>
                <span className="text-sm font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{formData.priceType}</span>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-600 font-medium whitespace-pre-line line-clamp-4">
                  {formData.description}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1 font-bold border-2 border-slate-100 h-12 rounded-xl hover:bg-slate-50 hover:text-slate-900" 
                  onClick={() => setShowPreview(false)}
                >
                  Edit
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={isSubmitting}
                  className="flex-1 bg-slate-900 text-white font-bold h-12 rounded-xl hover:bg-slate-800"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" /> Publishing...
                    </>
                  ) : (
                    'Confirm & Publish'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}