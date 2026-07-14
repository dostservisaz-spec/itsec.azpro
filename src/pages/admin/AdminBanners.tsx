import React, { useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { uploadImage } from '@/utils/imageUpload';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const AdminBanners = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title_az: '',
    title_en: '',
    title_ru: '',
    description_az: '',
    image_url: '',
    link_url: '',
    is_active: true,
    display_order: 0
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase.from('banners').select('*').order('display_order');
      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      toast.error('Bannerlər yüklənə bilmədi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (banner?: any) => {
    if (banner) {
      setEditingId(banner.id);
      setFormData({
        title_az: banner.title_az || '',
        title_en: banner.title_en || '',
        title_ru: banner.title_ru || '',
        description_az: banner.description_az || '',
        image_url: banner.image_url || '',
        link_url: banner.link_url || '',
        is_active: banner.is_active,
        display_order: banner.display_order
      });
    } else {
      setEditingId(null);
      setFormData({
        title_az: '',
        title_en: '',
        title_ru: '',
        description_az: '',
        image_url: '',
        link_url: '',
        is_active: true,
        display_order: banners.length
      });
    }
    setFile(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url && !file) {
      toast.error('Şəkil mütləqdir');
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImageUrl = formData.image_url;

      if (file) {
        const uploadedUrl = await uploadImage(file, 'public');
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      }

      const payload = {
        ...formData,
        image_url: finalImageUrl
      };

      if (editingId) {
        const { error } = await supabase.from('banners').update(payload).eq('id', editingId);
        if (error) throw error;
        toast.success('Banner yeniləndi');
      } else {
        const { error } = await supabase.from('banners').insert(payload);
        if (error) throw error;
        toast.success('Yeni banner yaradıldı');
      }

      setIsDialogOpen(false);
      fetchBanners();
    } catch (error: any) {
      toast.error(error.message || 'Xəta baş verdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu banneri silmək istədiyinizə əminsiniz?')) return;
    
    try {
      const { error } = await supabase.from('banners').delete().eq('id', id);
      if (error) throw error;
      toast.success('Banner silindi');
      fetchBanners();
    } catch (error: any) {
      toast.error('Silinmə zamanı xəta: ' + error.message);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Bannerlər</h1>
          <p className="text-sm text-slate-500">Əsas səhifə slaydlarının idarə edilməsi</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-[#cc0000] hover:bg-[#a30000] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Yeni Banner
        </Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-3 w-40">Şəkil</th>
              <th className="px-6 py-3">Başlıq (AZ)</th>
              <th className="px-6 py-3">Sıra</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Yüklənir...</td></tr>
            ) : banners.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Banner tapılmadı</td></tr>
            ) : (
              banners.map(banner => (
                <tr key={banner.id} className="border-b hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="h-16 w-24 rounded border flex items-center justify-center overflow-hidden bg-slate-100">
                      {banner.image_url ? (
                        <img src={banner.image_url} alt="banner" className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{banner.title_az || '-'}</td>
                  <td className="px-6 py-4">{banner.display_order}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${banner.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                      {banner.is_active ? 'Aktiv' : 'Passiv'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => handleOpenDialog(banner)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => handleDelete(banner.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg max-w-[calc(100%-2rem)]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Banneri Redaktə Et' : 'Yeni Banner'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Şəkil *</Label>
                <Input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
                {formData.image_url && !file && (
                  <div className="mt-2 h-24 w-full relative rounded border overflow-hidden">
                    <img src={formData.image_url} className="w-full h-full object-cover" alt="Current" />
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title_az">Başlıq (AZ)</Label>
                <Input id="title_az" value={formData.title_az} onChange={e => setFormData({...formData, title_az: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description_az">Mətn (AZ)</Label>
                <Input id="description_az" value={formData.description_az} onChange={e => setFormData({...formData, description_az: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="display_order">Sıra Nömrəsi</Label>
                  <Input id="display_order" type="number" value={formData.display_order} onChange={e => setFormData({...formData, display_order: parseInt(e.target.value) || 0})} />
                </div>
                <div className="flex items-center gap-2 mt-8">
                  <input 
                    type="checkbox" 
                    id="is_active" 
                    checked={formData.is_active} 
                    onChange={e => setFormData({...formData, is_active: e.target.checked})}
                    className="w-4 h-4 text-[#cc0000] focus:ring-[#cc0000]"
                  />
                  <Label htmlFor="is_active">Aktivdir</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Ləğv et</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#cc0000] hover:bg-[#a30000] text-white">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Yadda Saxla
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBanners;