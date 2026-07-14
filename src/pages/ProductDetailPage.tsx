import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/db/supabase';
import { Product } from '@/types/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check, Heart } from 'lucide-react';
import { toast } from 'sonner';
import WhatsAppOrderSheet from '@/components/common/WhatsAppOrderSheet';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { language } = useLanguage();
  const { profile } = useAuth();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [margins, setMargins] = useState({ customer: 0.1, wholesale: 0.05, dealer: 0.02 });

  useEffect(() => {
    fetchMargins();
    if (id) fetchProduct();
  }, [id]);

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

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(*),
          brands(*),
          product_images(*)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setProduct(data);
        const primaryImg = data.product_images?.find((img: any) => img.is_primary)?.url || 
                           data.product_images?.[0]?.url || 
                           'https://via.placeholder.com/600?text=No+Image';
        setSelectedImage(primaryImg);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
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
    if (role === 'admin') margin = 0;
    
    return basePrice * (1 + margin);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, getCalculatedPrice(product.base_price));
    toast.success('Məhsul səbətə əlavə edildi');
  };

  if (isLoading) {
    return <div className="container py-12 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  if (!product) {
    return <div className="container py-12 text-center">Məhsul tapılmadı. <Link to="/products" className="text-primary hover:underline">Məhsullara qayıt</Link></div>;
  }

  const finalPrice = getCalculatedPrice(product.base_price);
  const images = product.product_images?.length ? product.product_images : [{ url: 'https://via.placeholder.com/600?text=No+Image', id: '1' }];

  return (
    <div className="container py-10">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-8 flex items-center gap-2">
        <Link to="/" className="hover:text-primary">Ana Səhifə</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary">Məhsullar</Link>
        {product.categories && (
          <>
            <span>/</span>
            <Link to={`/products?category=${product.categories.id}`} className="hover:text-primary">
              {getLocalizedText(product.categories, 'name')}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-foreground truncate w-40">{getLocalizedText(product, 'name')}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-white border rounded-2xl overflow-hidden p-6 flex items-center justify-center">
            <img src={selectedImage} alt={getLocalizedText(product, 'name')} className="max-w-full max-h-full object-contain" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map((img: any) => (
                <button 
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-20 h-20 shrink-0 bg-white border rounded-xl overflow-hidden p-2 flex items-center justify-center transition-all ${selectedImage === img.url ? 'border-primary ring-1 ring-primary' : 'hover:border-primary/50'}`}
                >
                  <img src={img.url} alt="thumbnail" className="max-w-full max-h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-2 text-primary font-medium">
            {product.brands?.name}
          </div>
          <h1 className="text-3xl font-bold mb-4">{getLocalizedText(product, 'name')}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="text-3xl font-bold">{finalPrice.toFixed(2)} ₼</div>
            {product.stock_quantity > 0 ? (
              <span className="inline-flex items-center text-sm font-medium text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full dark:bg-green-900/30 dark:text-green-400">
                <Check className="w-4 h-4 mr-1" /> Stokda var ({product.stock_quantity})
              </span>
            ) : (
              <span className="inline-flex items-center text-sm font-medium text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full dark:bg-red-900/30 dark:text-red-400">
                Stokda yoxdur
              </span>
            )}
          </div>

          <div className="text-muted-foreground mb-8 text-pretty whitespace-pre-wrap">
            {getLocalizedText(product, 'description')}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-8 bg-muted/30 p-4 rounded-xl border">
            <div className="flex flex-col">
              <span className="text-muted-foreground">SKU (Məhsul Kodu)</span>
              <span className="font-medium">{product.sku || '-'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Kateqoriya</span>
              <span className="font-medium">{product.categories ? getLocalizedText(product.categories, 'name') : '-'}</span>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t space-y-6">
            <div className="flex items-center gap-4">
              <span className="font-medium">Miqdar:</span>
              <div className="flex items-center border rounded-md">
                <button 
                  className="px-3 py-1.5 hover:bg-muted"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >-</button>
                <span className="px-4 py-1.5 font-medium border-x min-w-[48px] text-center">{quantity}</span>
                <button 
                  className="px-3 py-1.5 hover:bg-muted"
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  disabled={quantity >= product.stock_quantity}
                >+</button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="flex-1"
                disabled={product.stock_quantity <= 0}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> Səbətə Əlavə Et
              </Button>
              <Button size="lg" variant="outline" className="px-4" onClick={() => toast.success('Məhsul favorilərə əlavə edildi')}>
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            <div className="pt-2">
              <WhatsAppOrderSheet product={product} calculatedPrice={finalPrice} defaultQuantity={quantity} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
