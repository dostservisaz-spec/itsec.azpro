import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trash2, MessageCircle, ArrowRight } from 'lucide-react';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { language } = useLanguage();

  const getLocalizedText = (item: any, field: string) => {
    if (!item) return '';
    return item[`${field}_${language}`] || item[`${field}_az`] || '';
  };

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;

    const messageParts = [
      `*YENİ SƏBƏT SİFARİŞİ (İTSEC AZ)*`,
      `-------------------`,
    ];

    items.forEach((item, index) => {
      const name = getLocalizedText(item.product, 'name');
      messageParts.push(`${index + 1}. *${name}*`);
      messageParts.push(`   SKU: ${item.product.sku || '-'}`);
      messageParts.push(`   Növ: ${item.priceType}`);
      messageParts.push(`   Qiymət: ${item.price.toFixed(2)} AZN x ${item.quantity} ədəd = ${(item.price * item.quantity).toFixed(2)} AZN`);
    });

    messageParts.push(`-------------------`);
    messageParts.push(`*ÜMUMİ MƏBLƏĞ:* ${totalPrice.toFixed(2)} AZN`);
    messageParts.push(`-------------------`);
    messageParts.push(`Zəhmət olmasa sifarişi təsdiqləyin və çatdırılma/quraşdırma detallarını müzakirə edək.`);

    const text = encodeURIComponent(messageParts.join('\n'));
    const url = `https://wa.me/994776117780?text=${text}`;
    
    window.open(url, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="container py-20 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Səbətiniz boşdur</h1>
        <p className="text-muted-foreground mb-8 max-w-md text-pretty">
          Təhlükəsizlik sistemləri və avadanlıqları ilə tanış olmaq üçün kataloqa keçid edin.
        </p>
        <Link to="/products">
          <Button size="lg">Məhsullara bax</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Səbətiniz</h1>
      
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border rounded-2xl overflow-hidden">
            <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b bg-muted/30 text-sm font-medium text-muted-foreground">
              <div className="col-span-6">Məhsul</div>
              <div className="col-span-2 text-center">Qiymət</div>
              <div className="col-span-2 text-center">Miqdar</div>
              <div className="col-span-2 text-right">Cəm</div>
            </div>
            
            <div className="divide-y">
              {items.map((item) => {
                const primaryImage = item.product.product_images?.find((img: any) => img.is_primary)?.url || 
                                     item.product.product_images?.[0]?.url || 
                                     'https://via.placeholder.com/200?text=No+Image';
                return (
                  <div key={`${item.product.id}-${item.priceType}`} className="p-4 sm:grid sm:grid-cols-12 gap-4 items-center flex flex-col">
                    {/* Mobile layout */}
                    <div className="col-span-6 flex items-center gap-4 w-full">
                      <Link to={`/products/${item.product.id}`} className="w-20 h-20 bg-white border rounded-md shrink-0 p-1 flex items-center justify-center">
                        <img src={primaryImage} alt={getLocalizedText(item.product, 'name')} className="max-w-full max-h-full object-contain" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${item.product.id}`}>
                          <h3 className="font-medium text-sm line-clamp-2 hover:text-primary">{getLocalizedText(item.product, 'name')}</h3>
                        </Link>
                        <p className="text-xs text-muted-foreground mt-1">Növ: {item.priceType}</p>
                        {/* Mobile price - visible only on mobile */}
                        <div className="sm:hidden font-semibold mt-2">{item.price.toFixed(2)} ₼</div>
                      </div>
                    </div>
                    
                    {/* Desktop price */}
                    <div className="col-span-2 text-center hidden sm:block font-medium">
                      {item.price.toFixed(2)} ₼
                    </div>
                    
                    {/* Quantity */}
                    <div className="col-span-2 w-full sm:w-auto flex justify-between sm:justify-center items-center mt-4 sm:mt-0">
                      <span className="sm:hidden text-sm text-muted-foreground">Miqdar:</span>
                      <div className="flex items-center border rounded-md bg-background">
                        <button 
                          className="px-2 py-1 hover:bg-muted"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >-</button>
                        <span className="px-3 py-1 text-sm font-medium border-x min-w-[36px] text-center">{item.quantity}</span>
                        <button 
                          className="px-2 py-1 hover:bg-muted"
                          onClick={() => updateQuantity(item.product.id, Math.min(item.product.stock_quantity, item.quantity + 1))}
                        >+</button>
                      </div>
                    </div>
                    
                    {/* Total & Delete */}
                    <div className="col-span-2 w-full sm:w-auto flex justify-between sm:justify-end items-center mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0">
                      <span className="font-bold text-primary sm:text-foreground">{(item.price * item.quantity).toFixed(2)} ₼</span>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors sm:ml-2"
                        title="Sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4">
            <Link to="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center">
              ← Alış-verişə davam et
            </Link>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Sifarişin Xülasəsi</h2>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ara cəm:</span>
                <span className="font-medium">{totalPrice.toFixed(2)} ₼</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Çatdırılma:</span>
                <span className="font-medium text-green-600">Ödənişsiz</span>
              </div>
            </div>
            
            <div className="border-t pt-4 mb-8 flex justify-between items-end">
              <span className="font-medium">Ümumi məbləğ:</span>
              <span className="text-2xl font-bold text-primary">{totalPrice.toFixed(2)} ₼</span>
            </div>
            
            <div className="space-y-3">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white" size="lg" onClick={handleWhatsAppCheckout}>
                <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp ilə Sifariş Et
              </Button>
              <p className="text-xs text-center text-muted-foreground text-pretty">
                Sifarişinizi təsdiqləmək üçün WhatsApp-a yönləndiriləcəksiniz. Ödəniş və digər detallar orada dəqiqləşdiriləcək.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
