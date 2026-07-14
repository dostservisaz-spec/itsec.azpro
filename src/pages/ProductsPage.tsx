import React, { useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';
import { Product, Category, Brand } from '@/types/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { toast } from 'sonner';

const ProductsPage = () => {
  const { language } = useLanguage();
  const { profile } = useAuth();
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [margins, setMargins] = useState({ customer: 0.1, wholesale: 0.05, dealer: 0.02 });

  const activeCategory = searchParams.get('category');
  const activeBrand = searchParams.get('brand');

  useEffect(() => {
    fetchFilters();
    fetchMargins();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, activeBrand]);

  const fetchMargins = async () => {
    try {
      const { data } = await supabase.from('settings').select('*').limit(1).maybeSingle();
      if (data) {
        setMargins({
          customer: Number(data.customer_margin) || 0.1,
          wholesale: Number(data.wholesale_margin) || 0.05,
          dealer: Number(data.dealer_margin) || 0.02
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchFilters = async () => {
    try {
      const [catsRes, brandsRes] = await Promise.all([
        supabase.from('categories').select('*'),
        supabase.from('brands').select('*')
      ]);
      if (catsRes.data) setCategories(catsRes.data);
      if (brandsRes.data) setBrands(brandsRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories(*),
          brands(*),
          product_images(*)
        `);

      if (activeCategory) {
        query = query.eq('category_id', activeCategory);
      }
      if (activeBrand) {
        query = query.eq('brand_id', activeBrand);
      }

      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocalizedText = (item: any, field: string) => {
    if (!item) return '';
    return item[`${field}_${language}`] || item[`${field}_az`] || '';
  };

  const getCalculatedPrice = (basePrice: number) => {
    const role = profile?.role || 'customer';
    let margin = margins.customer;
    if (role === 'wholesale') margin = margins.wholesale;
    if (role === 'dealer') margin = margins.dealer;
    if (role === 'admin') margin = 0; // Admin sees base price
    
    return basePrice * (1 + margin);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1, getCalculatedPrice(product.base_price));
    toast.success('Məhsul səbətə əlavə edildi');
  };

  const filteredProducts = products.filter(product => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const name = getLocalizedText(product, 'name').toLowerCase();
    const desc = getLocalizedText(product, 'description').toLowerCase();
    return name.includes(searchLower) || desc.includes(searchLower);
  });

  const updateParam = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0 space-y-8">
          <div>
            <div className="flex items-center gap-2 font-semibold text-lg mb-4">
              <SlidersHorizontal className="h-5 w-5" />
              Filterlər
            </div>
            {(activeCategory || activeBrand || searchTerm) && (
              <Button 
                variant="outline" 
                className="w-full mb-6" 
                onClick={() => {
                  setSearchParams({});
                  setSearchTerm('');
                }}
              >
                <X className="h-4 w-4 mr-2" /> Filterləri təmizlə
              </Button>
            )}
          </div>

          <div>
            <h3 className="font-medium mb-3 pb-2 border-b">Kateqoriyalar</h3>
            <div className="space-y-2">
              <button 
                onClick={() => updateParam('category', null)}
                className={`text-sm block w-full text-left px-2 py-1.5 rounded-md transition-colors ${!activeCategory ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'}`}
              >
                Bütün Kateqoriyalar
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => updateParam('category', cat.id)}
                  className={`text-sm block w-full text-left px-2 py-1.5 rounded-md transition-colors ${activeCategory === cat.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'}`}
                >
                  {getLocalizedText(cat, 'name')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3 pb-2 border-b">Brendlər</h3>
            <div className="space-y-2">
              <button 
                onClick={() => updateParam('brand', null)}
                className={`text-sm block w-full text-left px-2 py-1.5 rounded-md transition-colors ${!activeBrand ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'}`}
              >
                Bütün Brendlər
              </button>
              {brands.map(brand => (
                <button 
                  key={brand.id}
                  onClick={() => updateParam('brand', brand.id)}
                  className={`text-sm block w-full text-left px-2 py-1.5 rounded-md transition-colors ${activeBrand === brand.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'}`}
                >
                  {brand.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-8 relative">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Məhsul axtar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 rounded-xl bg-muted animate-pulse"></div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
              <h3 className="text-lg font-medium mb-2">Məhsul tapılmadı</h3>
              <p className="text-muted-foreground">Axtarışınıza uyğun heç bir məhsul tapılmadı.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const primaryImage = product.product_images?.find(img => img.is_primary)?.url || 
                                     product.product_images?.[0]?.url || 
                                     'https://via.placeholder.com/400?text=No+Image';
                const finalPrice = getCalculatedPrice(product.base_price);
                
                return (
                  <div key={product.id} className="group rounded-xl border bg-card overflow-hidden transition-all hover:shadow-lg flex flex-col h-full">
                    <Link to={`/products/${product.id}`} className="aspect-square overflow-hidden bg-white p-4 relative">
                      <img 
                        src={primaryImage} 
                        alt={getLocalizedText(product, 'name')} 
                        className="w-full h-full object-contain transition-transform group-hover:scale-105"
                      />
                      {product.stock_quantity <= 0 && (
                        <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
                          Stokda yoxdur
                        </div>
                      )}
                    </Link>
                    <div className="p-4 flex-1 flex flex-col">
                      <p className="text-xs text-muted-foreground mb-1">{product.brands?.name || 'Brend'}</p>
                      <Link to={`/products/${product.id}`}>
                        <h3 className="font-semibold text-sm md:text-base mb-2 line-clamp-2 hover:text-primary">
                          {getLocalizedText(product, 'name')}
                        </h3>
                      </Link>
                      <div className="mt-auto pt-4 flex items-center justify-between">
                        <span className="font-bold text-lg">{finalPrice.toFixed(2)} ₼</span>
                        <Button 
                          size="sm" 
                          disabled={product.stock_quantity <= 0}
                          onClick={() => handleAddToCart(product)}
                        >
                          Səbətə
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
