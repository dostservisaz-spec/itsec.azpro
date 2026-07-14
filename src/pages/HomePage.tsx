import React, { useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';
import { Product, Category } from '@/types/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsRes, categoriesRes, bannersRes] = await Promise.all([
          supabase
            .from('products')
            .select(`
              *,
              categories(*),
              brands(*),
              product_images(*)
            `)
            .limit(4),
          supabase.from('categories').select('*').limit(6),
          supabase.from('banners').select('*').eq('is_active', true).order('display_order')
        ]);

        if (productsRes.data) setFeaturedProducts(productsRes.data);
        if (categoriesRes.data) setCategories(categoriesRes.data);
        if (bannersRes.data) setBanners(bannersRes.data);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up realtime subscription for products table
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

  const getLocalizedText = (item: any, field: string) => {
    return item[`${field}_${language}`] || item[`${field}_az`] || '';
  };

  // Default image mapping based on realistic AI images
  const categoryImages: Record<string, string> = {
    'ip-cameras': 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_91566288-d5c2-4619-9fc7-abc6909c5749.jpg',
    'analog': 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_8ee7767b-bfb7-4287-ae6c-acee579aee91.jpg',
    'dvr-nvr': 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_65d6f59c-5228-4dc7-8a51-1a2cf8aea8bb.jpg',
    'cables': 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_37e5b5ae-5f3f-47c1-80c1-b2d4d206d698.jpg',
    'access': 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_393a578d-b42f-4229-996d-136b8ad464e5.jpg',
    'alarms': 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_c7583b26-1ee8-42e7-a5b8-310c66225efb.jpg',
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full aspect-[4/3] md:aspect-[21/9] bg-muted overflow-hidden flex items-center">
        <div className="absolute inset-0">
          <img 
            src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_4d611c05-c76f-471c-b2cc-32877393da3c.jpg" 
            alt="Complete Security Solutions"
            className="w-full h-full object-cover object-center mix-blend-overlay opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        </div>
        <div className="container relative z-10 px-4 md:px-8">
          <div className="max-w-xl">
            <span className="inline-block bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 mb-4">
              AI POWERED SECURITY PLATFORM
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-4 tracking-tighter">
              Complete Security Solutions
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8">
              DVR, NVR, IP Cameras, Cables and more
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-[#cc0000] hover:bg-[#a30000] text-white px-8 rounded-sm font-semibold" asChild>
                <Link to="/products">Shop Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="border-[#cc0000] text-[#cc0000] hover:bg-[#cc0000]/10 rounded-sm font-semibold bg-white/80 backdrop-blur-sm" asChild>
                <a href="https://wa.me/994776117780" target="_blank" rel="noreferrer">
                  WhatsApp ilə sifariş
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b bg-white">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x">
            <div className="px-4 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-red-50 text-[#cc0000] rounded-xl flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">2500+</h3>
              <p className="text-sm text-slate-500">Məhsul</p>
            </div>
            <div className="px-4 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-red-50 text-[#cc0000] rounded-xl flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">3500+</h3>
              <p className="text-sm text-slate-500">Layihə</p>
            </div>
            <div className="px-4 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-red-50 text-[#cc0000] rounded-xl flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">5000+</h3>
              <p className="text-sm text-slate-500">Müştəri</p>
            </div>
            <div className="px-4 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-red-50 text-[#cc0000] rounded-xl flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V3"></path><path d="M12 15a4 4 0 0 1-4 4H5"></path><path d="M12 15a4 4 0 0 0 4 4h3"></path><path d="m19 11-3-3-3 3"></path><path d="m5 11 3-3 3 3"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">100%</h3>
              <p className="text-sm text-slate-500">Rəsmi Zəmanət</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Gallery */}
      <section className="py-16 bg-[#f8f9fa]">
        <div className="container">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-1 h-8 bg-[#cc0000]"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Kateqoriyaya görə bax</h2>
            <Link to="/products" className="ml-auto text-sm font-medium text-[#cc0000] hover:underline flex items-center">
              Hamısına bax <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Using the provided image and CSS to simulate the gallery layout */}
            <div className="col-span-2 md:col-span-1 rounded-2xl overflow-hidden bg-white relative group h-48 border hover:border-[#cc0000] hover:shadow-md transition-all">
              <Link to="/products?category=ip">
                <div className="absolute bottom-4 left-4 z-10 font-bold text-slate-900 bg-white/80 px-2 py-1 rounded">IP Cameras</div>
                <img src={categoryImages['ip-cameras']} alt="IP Cameras" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </Link>
            </div>
            
            <div className="col-span-2 md:col-span-1 rounded-2xl overflow-hidden bg-white relative group h-48 border hover:border-[#cc0000] hover:shadow-md transition-all">
              <Link to="/products?category=daxili">
                <div className="absolute bottom-4 left-4 z-10 font-bold text-slate-900 bg-white/80 px-2 py-1 rounded">Ağıllı Ev Kameraları</div>
                <img src={categoryImages['alarms']} alt="Daxili kameralar" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </Link>
            </div>
            
            <div className="col-span-2 md:col-span-1 rounded-2xl overflow-hidden bg-white relative group h-48 border hover:border-[#cc0000] hover:shadow-md transition-all">
              <Link to="/products?category=analog">
                <div className="absolute bottom-4 left-4 z-10 font-bold text-slate-900 bg-white/80 px-2 py-1 rounded">Analog Cameras</div>
                <img src={categoryImages['analog']} alt="Analog Cameras" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </Link>
            </div>
            
            <div className="col-span-2 md:col-span-1 rounded-2xl overflow-hidden bg-white relative group h-48 border hover:border-[#cc0000] hover:shadow-md transition-all">
              <Link to="/products?category=xarici">
                <div className="absolute bottom-4 left-4 z-10 font-bold text-slate-900 bg-white/80 px-2 py-1 rounded">Xarici kameralar</div>
                <img src={categoryImages['ip-cameras']} alt="Xarici kameralar" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </Link>
            </div>
            
            <div className="col-span-2 md:col-span-1 rounded-2xl overflow-hidden bg-white relative group h-48 border hover:border-[#cc0000] hover:shadow-md transition-all">
              <Link to="/products?category=dvr">
                <div className="absolute bottom-4 left-4 z-10 font-bold text-slate-900 bg-white/80 px-2 py-1 rounded">DVR / NVR</div>
                <img src={categoryImages['dvr-nvr']} alt="DVR / NVR" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </Link>
            </div>

            <div className="col-span-2 md:col-span-1 rounded-2xl overflow-hidden bg-white relative group h-48 border hover:border-[#cc0000] hover:shadow-md transition-all">
              <Link to="/products?category=switches">
                <div className="absolute bottom-4 left-4 z-10 font-bold text-slate-900 bg-white/80 px-2 py-1 rounded">Switches</div>
                <img src={categoryImages['cables']} alt="Switches" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </Link>
            </div>

            <div className="col-span-2 md:col-span-1 rounded-2xl overflow-hidden bg-white relative group h-48 border border-[#cc0000] shadow-md transition-all">
              <Link to="/products?category=cables">
                <div className="absolute bottom-4 left-4 z-10 font-bold text-[#cc0000] bg-white/90 px-2 py-1 rounded">Cables & Accessories</div>
                <img src={categoryImages['cables']} alt="Cables & Accessories" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </Link>
            </div>

            <div className="col-span-2 md:col-span-1 rounded-2xl overflow-hidden bg-white relative group h-48 border hover:border-[#cc0000] hover:shadow-md transition-all">
              <Link to="/products?category=access">
                <div className="absolute bottom-4 left-4 z-10 font-bold text-slate-900 bg-white/80 px-2 py-1 rounded">Access Control</div>
                <img src={categoryImages['access']} alt="Access Control" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-16 bg-white border-t">
        <div className="container">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Məşhur Məhsullar</h2>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-96 rounded-2xl bg-muted animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Force mock display if database is empty */}
              {[1, 2, 3, 4].map((idx) => {
                const product = featuredProducts[idx];
                const mockImage = [
                  categoryImages['ip-cameras'],
                  categoryImages['analog'],
                  categoryImages['dvr-nvr'],
                  categoryImages['alarms']
                ][idx % 4];
                
                const primaryImage = product?.product_images?.find((img: any) => img.is_primary)?.url || 
                                     product?.product_images?.[0]?.url || 
                                     mockImage;
                                     
                return (
                  <div key={product?.id || idx} className="group rounded-2xl border bg-[#f8f9fa] overflow-hidden transition-all hover:shadow-lg flex flex-col h-full">
                    <div className="p-4 bg-white">
                      <p className="text-[10px] font-bold text-[#cc0000] uppercase tracking-wider mb-1">FEATURED</p>
                      <Link to={`/products/${product?.id || idx}`} className="block relative aspect-[4/3] overflow-hidden rounded-xl">
                        <img 
                          src={primaryImage} 
                          alt="Camera" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>
                    </div>
                    <div className="p-5 flex-1 flex flex-col border-t bg-white">
                      <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">{product?.brands?.name || 'AVITEL'}</p>
                      <Link to={`/products/${product?.id || idx}`}>
                        <h3 className="font-semibold text-sm mb-3 line-clamp-2 hover:text-[#cc0000] min-h-[40px]">
                          {product ? getLocalizedText(product, 'name') : 'AVITEL-IPC-DiP5H 5MP'}
                        </h3>
                      </Link>
                      <div className="mt-auto pt-2 flex items-center justify-between">
                        <span className="font-bold text-lg text-[#cc0000]">₼{product ? (product.base_price * 1.1).toFixed(2) : '289.99'}</span>
                        <div className="flex gap-2">
                          <Button onClick={() => toast.success('Səbətə əlavə edildi')} size="icon" variant="outline" className="h-9 w-9 rounded-md border-[#cc0000] text-[#cc0000] hover:bg-[#cc0000] hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                          </Button>
                          <Button onClick={() => window.open(`https://wa.me/994776117780?text=Sifariş: ${getLocalizedText(product, 'name')}`, '_blank')} size="icon" variant="outline" className="h-9 w-9 rounded-md border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
