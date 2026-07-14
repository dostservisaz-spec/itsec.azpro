import React, { useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';
import { Product, Category, Brand } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Search, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();

    // Subscribe to realtime changes
    const productsSubscription = supabase
      .channel('public:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(productsSubscription);
    };
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        supabase
          .from('products')
          .select(`*, categories(*), brands(*), product_images(*)`)
          .order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name_az'),
        supabase.from('brands').select('*').order('name')
      ]);

      if (productsRes.error) throw productsRes.error;
      if (productsRes.data) setProducts(productsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (brandsRes.data) setBrands(brandsRes.data);
    } catch (error: any) {
      toast.error('Məhsullar yüklənərkən xəta baş verdi');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu məhsulu silmək istədiyinizə əminsiniz?')) return;
    
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast.success('Məhsul silindi');
    } catch (error: any) {
      toast.error('Silinmə zamanı xəta: ' + error.message);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name_az.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.name_en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Məhsullar</h1>
          <p className="text-sm text-slate-500">Bütün məhsulların idarə edilməsi</p>
        </div>
        <Button className="bg-[#cc0000] hover:bg-[#a30000] text-white" asChild>
          <Link to="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Məhsul
          </Link>
        </Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Məhsul axtar (ad, SKU)..."
              className="w-full pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#cc0000]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-sm text-slate-500">
            Cəmi: <span className="font-bold text-slate-900">{filteredProducts.length}</span> məhsul
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3">Şəkil</th>
                <th className="px-6 py-3">Ad & SKU</th>
                <th className="px-6 py-3">Brend / Kateqoriya</th>
                <th className="px-6 py-3">Qiymət (Baza)</th>
                <th className="px-6 py-3">Stok</th>
                <th className="px-6 py-3 text-right">Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">Yüklənir...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Məhsul tapılmadı. Yeni məhsul əlavə edin.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const primaryImg = product.product_images?.find(i => i.is_primary)?.url || product.product_images?.[0]?.url;
                  
                  return (
                    <tr key={product.id} className="border-b hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="h-12 w-12 rounded bg-slate-100 border flex items-center justify-center overflow-hidden">
                          {primaryImg ? (
                            <img src={primaryImg} alt={product.name_az} className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 line-clamp-1">{product.name_az}</div>
                        <div className="text-xs text-slate-500">{product.sku || 'SKU yoxdur'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{product.brands?.name || '-'}</div>
                        <div className="text-xs text-slate-500">{product.categories?.name_az || '-'}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-[#cc0000]">
                        ₼{product.base_price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          product.stock_quantity > 10 ? 'bg-green-100 text-green-700' :
                          product.stock_quantity > 0 ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {product.stock_quantity} ədəd
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" asChild>
                            <Link to={`/admin/products/${product.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;