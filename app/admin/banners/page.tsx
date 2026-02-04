'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Eye, EyeOff, Upload, Loader2 } from 'lucide-react';
import { onBannersUpdate, createBanner, updateBanner, deleteBanner } from '@/lib/firebase-admin';
import { supabase } from '@/lib/supabase'; // ✅ Supabase client

export default function BannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [bannerLink, setBannerLink] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const unsubscribe = onBannersUpdate((snapshot: any) => {
      const bannersData = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBanners(bannersData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleUploadAndSave = async () => {
    if (!file) return alert('Fadlan dooro sawir marka hore');
    setIsUploading(true);

    try {
      // 1. Sawirka u dir Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('images') // ✅ Magaca Bucket-kaaga ee Supabase
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Soo qaad URL-ka sawirka la geliyay
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // 3. Xogta ku kaydi Firebase
      await createBanner({
        image_url: publicUrl,
        link: bannerLink || '',
        status: 'active',
        created_at: new Date(),
      });

      setFile(null);
      setBannerLink('');
      alert('Banner-ka waa lagu daray!');
    } catch (error: any) {
      console.error(error);
      alert('Cilad ayaa dhacday: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen font-bold">Loading Banners...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-[#4d1d80]">Banners Management</h1>

      <Card className="border-2 border-dashed border-slate-200 shadow-none">
        <CardHeader><CardTitle>Add New Promotional Banner</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                <Upload size={16} /> Choose Banner Image
              </label>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="cursor-pointer"
              />
            </div>

            {/* Link Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">Target Link (Optional)</label>
              <Input 
                placeholder="https://beecsan.com/category/electronics" 
                value={bannerLink}
                onChange={(e) => setBannerLink(e.target.value)}
              />
            </div>
          </div>

          <Button 
            onClick={handleUploadAndSave} 
            disabled={isUploading || !file} 
            className="w-full bg-[#4d1d80] hover:bg-[#3a1661] text-white font-black py-6 rounded-xl"
          >
            {isUploading ? <Loader2 className="animate-spin mr-2" /> : <Plus className="mr-2" />}
            {isUploading ? 'Uploading to Supabase...' : 'Save & Publish Banner'}
          </Button>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <img src={banner.image_url} className="h-16 w-32 rounded-lg object-cover shadow-sm" alt="Banner" />
                  </TableCell>
                  <TableCell className="text-xs font-medium text-slate-500 max-w-[150px] truncate">
                    {banner.link || 'No link'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={banner.status === 'active' ? 'default' : 'secondary'}>
                      {banner.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => updateBanner(banner.id, { status: banner.status === 'active' ? 'inactive' : 'active' })}>
                        {banner.status === 'active' ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => confirm('Ma hubtaa?') && deleteBanner(banner.id)}>
                        <Trash2 size={16} />
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
  );
}