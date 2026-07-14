import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/db/supabase';
import { Category, Brand } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { uploadImage } from '@/utils/imageUpload';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id && id !== 'new');

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    name_az: '',
    name_en: '',
    name_ru: '',
    description_az: '',
    description_en: '',
    description_ru: '',
    sku: '',
    base_price: '',
    stock_quantity: '',
    category_id: '',
    brand_id: '',
    is_featured: false,
    specifications: {}
  });

  useEffect(() => {
    fetchOptions();
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  const fetchOptions = async () => {
    const [catRes, brandRes] = await Promise.all([
      supabase.from('categories').select('*'),
      supabase.from('brands').select('*')
    ]);
    if (catRes.data) setCategories(catRes.data);
    if (brandRes.data) setBrands(brandRes.data);
  };

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          name_az: data.name_az || '',
          name_en: data.name_en || '',
          name_ru: data.name_ru || '',
          description_az: data.description_az || '',
          description_en: data.description_en || '',
          description_ru: data.description_ru || '',
          sku: data.sku || '',
          base_price: data.base_price?.toString() || '',
          stock_quantity: data.stock_quantity?.toString() || '',
          category_id: data.category_id || '',
          brand_id: data.brand_id || '',
          is_featured: data.is_featured || false,
          specifications: data.specifications || {}
        });
        setImages(data.product_images || []);
      }
    } catch (error: any) {
      toast.error('Məhsul yüklənə bilmədi');
      navigate('/admin/products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImageFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const deleteExistingImage = async (imageId: string) => {
    if (!window.confirm('Şəkli silmək istəyirsiniz?')) return;
    try {
      await supabase.from('product_images').delete().eq('id', imageId);
      setImages(prev => prev.filter(img => img.id !== imageId));
      toast.success('Şəkil silindi');
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name_az || !formData.base_price || !formData.category_id) {
      toast.error('Ad (AZ), Qiymət və Kateqoriya mütləqdir');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name_az: formData.name_az,
        name_en: formData.name_en,
        name_ru: formData.name_ru,
        description_az: formData.description_az,
        description_en: formData.description_en,
        description_ru: formData.description_ru,
        sku: formData.sku,
        base_price: parseFloat(formData.base_price) || 0,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        category_id: formData.category_id,
        brand_id: formData.brand_id || null,
        is_featured: formData.is_featured,
        specifications: formData.specifications
      };

      let productId = id;

      if (isEditing) {
        const { error } = await supabase.from('products').update(payload).eq('id', productId);
        if (error) throw error;
        toast.success('Məhsul yeniləndi');
      } else {
        const { data, error } = await supabase.from('products').insert(payload).select().single();
        if (error) throw error;
        productId = data.id;
        toast.success('Yeni məhsul yaradıldı');
      }

      // Upload new images
      if (newImageFiles.length > 0 && productId) {
        for (let i = 0; i < newImageFiles.length; i++) {
          const file = newImageFiles[i];
          const url = await uploadImage(file, 'products');
          if (url) {
            await supabase.from('product_images').insert({
              product_id: productId,
              url: url,
              is_primary: images.length === 0 && i === 0, // Make first image primary if no existing images
              display_order: images.length + i
            });
          }
        }
      }

      navigate('/admin/products');
    } catch (error: any) {
      toast.error(error.message || 'Xəta baş verdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/products')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {isEditing ? 'Məhsulu Redaktə Et' : 'Yeni Məhsul'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white border rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2">Ümumi Məlumatlar</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name_az">Məhsulun Adı (AZ) *</Label>
              <Input id="name_az" value={formData.name_az} onChange={e => setFormData({...formData, name_az: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU (Barkod)</Label>
              <Input id="sku" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category_id">Kateqoriya *</Label>
              <select 
                id="category_id" 
                className="w-full flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.category_id}
                onChange={e => setFormData({...formData, category_id: e.target.value})}
                required
              >
                <option value="">Seçin...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name_az}</option>)}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="brand_id">Brend</Label>
              <select 
                id="brand_id" 
                className="w-full flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.brand_id}
                onChange={e => setFormData({...formData, brand_id: e.target.value})}
              >
                <option value="">Seçin...</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="base_price">Baza Qiyməti (₼) *</Label>
              <Input id="base_price" type="number" step="0.01" value={formData.base_price} onChange={e => setFormData({...formData, base_price: e.target.value})} required />
              <p className="text-xs text-slate-500">Müştəri rollarına görə marjalar bu qiymətin üzərinə gələcək.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Stok Miqdarı</Label>
              <Input id="stock_quantity" type="number" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="is_featured" 
              checked={formData.is_featured} 
              onChange={e => setFormData({...formData, is_featured: e.target.checked})}
              className="w-4 h-4 text-[#cc0000] focus:ring-[#cc0000]"
            />
            <Label htmlFor="is_featured">Əsas səhifədə seçilmiş kimi göstər (Featured)</Label>
          </div>
        </div>

        <div className="bg-white border rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2">Təsvir & Detallar</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description_az">Təsvir (AZ)</Label>
              <Textarea id="description_az" rows={4} value={formData.description_az} onChange={e => setFormData({...formData, description_az: e.target.value})} />
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2">Şəkillər</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Existing Images */}
            {images.map(img => (
              <div key={img.id} className="relative aspect-square rounded-lg border overflow-hidden group">
                <img src={img.url} alt="product" className="w-full h-full object-cover" />
                <button type="button" onClick={() => deleteExistingImage(img.id)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="h-3 w-3" />
                </button>
                {img.is_primary && <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-1">ƏSAS ŞƏKİL</div>}
              </div>
            ))}
            
            {/* New Images Preview */}
            {newImageFiles.map((file, idx) => (
              <div key={idx} className="relative aspect-square rounded-lg border overflow-hidden">
                <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover opacity-70" />
                <button type="button" onClick={() => removeNewImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1">
                  <X className="h-3 w-3" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-blue-500/80 text-white text-[10px] text-center py-1">YENİ</div>
              </div>
            ))}

            {/* Upload Button */}
            <label className="aspect-square rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 hover:text-slate-700 hover:border-slate-400 hover:bg-slate-50 cursor-pointer transition-colors">
              <Plus className="h-6 w-6 mb-2" />
              <span className="text-xs">Şəkil Əlavə Et</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>Ləğv et</Button>
          <Button type="submit" disabled={isSubmitting} className="bg-[#cc0000] hover:bg-[#a30000] text-white px-8">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Yadda Saxla
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;