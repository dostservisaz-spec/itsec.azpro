import React, { useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';
import { Category } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { uploadImage } from '@/utils/imageUpload';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name_az: '',
    name_en: '',
    name_ru: '',
    slug: '',
    image_url: '',
    display_order: 0
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('display_order');
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      toast.error('Kateqoriyalar yüklənə bilmədi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingId(category.id);
      setFormData({
        name_az: category.name_az,
        name_en: category.name_en || '',
        name_ru: category.name_ru || '',
        slug: category.slug,
        image_url: category.image_url || '',
        display_order: category.display_order || 0
      });
    } else {
      setEditingId(null);
      setFormData({
        name_az: '',
        name_en: '',
        name_ru: '',
        slug: '',
        image_url: '',
        display_order: categories.length
      });
    }
    setFile(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name_az || !formData.slug) {
      toast.error('Ad (AZ) və Slug mütləqdir');
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
        const { error } = await supabase.from('categories').update(payload).eq('id', editingId);
        if (error) throw error;
        toast.success('Kateqoriya yeniləndi');
      } else {
        const { error } = await supabase.from('categories').insert(payload);
        if (error) throw error;
        toast.success('Yeni kateqoriya yaradıldı');
      }

      setIsDialogOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || 'Xəta baş verdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu kateqoriyanı silmək istədiyinizə əminsiniz? (Bütün əlaqəli məhsullar da təsirlənə bilər)')) return;
    
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      toast.success('Kateqoriya silindi');
      fetchCategories();
    } catch (error: any) {
      toast.error('Silinmə zamanı xəta: ' + error.message);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Kateqoriyalar</h1>
          <p className="text-sm text-slate-500">Məhsul kateqoriyalarının idarə edilməsi</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-[#cc0000] hover:bg-[#a30000] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Yeni Kateqoriya
        </Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-3 w-24">Şəkil</th>
              <th className="px-6 py-3">Ad (AZ)</th>
              <th className="px-6 py-3">Slug</th>
              <th className="px-6 py-3">Sıra</th>
              <th className="px-6 py-3 text-right">Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Yüklənir...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Kateqoriya tapılmadı</td></tr>
            ) : (
              categories.map(cat => (
                <tr key={cat.id} className="border-b hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="h-10 w-10 rounded bg-slate-100 border flex items-center justify-center overflow-hidden">
                      {cat.image_url ? (
                        <img src={cat.image_url} alt={cat.name_az} className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{cat.name_az}</td>
                  <td className="px-6 py-4 text-slate-500">{cat.slug}</td>
                  <td className="px-6 py-4">{cat.display_order}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => handleOpenDialog(cat)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => handleDelete(cat.id)}>
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
              <DialogTitle>{editingId ? 'Kateqoriyanı Redaktə Et' : 'Yeni Kateqoriya'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name_az">Ad (AZ) *</Label>
                <Input id="name_az" value={formData.name_az} onChange={e => setFormData({...formData, name_az: e.target.value})} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug (URL üçün) *</Label>
                <Input id="slug" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="numune-kateqoriya" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name_en">Ad (EN)</Label>
                  <Input id="name_en" value={formData.name_en} onChange={e => setFormData({...formData, name_en: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name_ru">Ad (RU)</Label>
                  <Input id="name_ru" value={formData.name_ru} onChange={e => setFormData({...formData, name_ru: e.target.value})} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="display_order">Sıra Nömrəsi</Label>
                <Input id="display_order" type="number" value={formData.display_order} onChange={e => setFormData({...formData, display_order: parseInt(e.target.value) || 0})} />
              </div>
              <div className="grid gap-2">
                <Label>Şəkil</Label>
                <Input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
                {formData.image_url && !file && (
                  <div className="mt-2 h-20 w-20 relative rounded border overflow-hidden">
                    <img src={formData.image_url} className="w-full h-full object-cover" alt="Current" />
                  </div>
                )}
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

export default AdminCategories;