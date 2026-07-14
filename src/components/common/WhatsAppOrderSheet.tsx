import React, { useState } from 'react';
import { Product } from '@/types/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MessageCircle } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { toast } from 'sonner';

interface WhatsAppOrderSheetProps {
  product: Product;
  calculatedPrice: number;
  defaultQuantity?: number;
}

const WhatsAppOrderSheet: React.FC<WhatsAppOrderSheetProps> = ({ 
  product, 
  calculatedPrice, 
  defaultQuantity = 1 
}) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '+994',
    quantity: defaultQuantity,
    qualityType: 'Standart',
    installments: false,
    delivery: false,
    installation: false,
    warranty: false,
    invoice: false,
    notes: ''
  });

  const getLocalizedText = (item: any, field: string) => {
    if (!item) return '';
    return item[`${field}_${language}`] || item[`${field}_az`] || '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleQuantityChange = (change: number) => {
    setFormData(prev => ({ 
      ...prev, 
      quantity: Math.max(1, Math.min(product.stock_quantity, prev.quantity + change)) 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || formData.phone.length < 10) {
      toast.error('Zəhmət olmasa ad və düzgün telefon nömrəsi daxil edin');
      return;
    }

    const productName = getLocalizedText(product, 'name');
    const totalAmount = (calculatedPrice * formData.quantity).toFixed(2);
    
    const messageParts = [
      `*YENİ SİFARİŞ (İTSEC AZ)*`,
      `-------------------`,
      `*Müştəri:* ${formData.name}`,
      `*Əlaqə:* ${formData.phone}`,
      `-------------------`,
      `*Məhsul:* ${productName}`,
      `*SKU:* ${product.sku || '-'}`,
      `*Qiymət (1 ədəd):* ${calculatedPrice.toFixed(2)} AZN`,
      `*Miqdar:* ${formData.quantity} ədəd`,
      `*CƏM MƏBLƏĞ:* ${totalAmount} AZN`,
      `-------------------`,
      `*Keyfiyyət/Sifariş növü:* ${formData.qualityType}`,
      `*Xidmət Şərtləri:*`,
      formData.installments ? `✅ Hissə-hissə ödəniş (3-12 ay)` : `❌ Hissə-hissə ödəniş`,
      formData.delivery ? `✅ Çatdırılma xidməti` : `❌ Çatdırılma xidməti`,
      formData.installation ? `✅ Quraşdırma xidməti` : `❌ Quraşdırma xidməti`,
      formData.warranty ? `✅ Uzadılmış zəmanət` : `❌ Uzadılmış zəmanət`,
      formData.invoice ? `✅ Rəsmi faktura` : `❌ Rəsmi faktura`,
    ];

    if (formData.notes) {
      messageParts.push(`-------------------`);
      messageParts.push(`*Əlavə Qeydlər:* ${formData.notes}`);
    }

    const text = encodeURIComponent(messageParts.join('\n'));
    const url = `https://wa.me/994776117780?text=${text}`;
    
    setIsOpen(false);
    window.open(url, '_blank');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="w-full bg-green-600 hover:bg-green-700 text-white" size="lg">
          <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp ilə Sifariş Ver
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto" side="right">
        <SheetHeader className="text-left mb-6">
          <SheetTitle className="text-xl">WhatsApp ilə Sifariş</SheetTitle>
          <SheetDescription>
            Aşağıdakı məlumatları dolduraraq sifarişinizi birbaşa WhatsApp-a göndərə bilərsiniz.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Müştəri Məlumatları</h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">Ad, Soyad <span className="text-red-500">*</span></Label>
              <Input 
                id="name" 
                name="name" 
                required 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Məsələn: Əli Əliyev" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon nömrəsi <span className="text-red-500">*</span></Label>
              <Input 
                id="phone" 
                name="phone" 
                required 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="+994 55 123 45 67" 
              />
            </div>
          </div>

          <div className="space-y-4 bg-muted/30 p-4 rounded-xl border">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Məhsul Məlumatı</h3>
            <p className="font-medium text-sm line-clamp-2">{getLocalizedText(product, 'name')}</p>
            
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm">1 ədəd:</span>
              <span className="font-semibold">{calculatedPrice.toFixed(2)} ₼</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Miqdar:</span>
              <div className="flex items-center border rounded-md bg-background">
                <button type="button" className="px-3 py-1 hover:bg-muted" onClick={() => handleQuantityChange(-1)} disabled={formData.quantity <= 1}>-</button>
                <span className="px-3 py-1 font-medium border-x min-w-[40px] text-center text-sm">{formData.quantity}</span>
                <button type="button" className="px-3 py-1 hover:bg-muted" onClick={() => handleQuantityChange(1)} disabled={formData.quantity >= product.stock_quantity}>+</button>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="font-medium">Cəm:</span>
              <span className="font-bold text-primary text-lg">{(calculatedPrice * formData.quantity).toFixed(2)} ₼</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Sifariş Növü</h3>
            <RadioGroup defaultValue={formData.qualityType} onValueChange={(v) => setFormData(prev => ({ ...prev, qualityType: v }))}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Standart" id="q-standart" />
                <Label htmlFor="q-standart" className="cursor-pointer">Standart Sifariş</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Premium" id="q-premium" />
                <Label htmlFor="q-premium" className="cursor-pointer">Premium (Özəl qablaşdırma)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Toplu/Topdancı" id="q-wholesale" />
                <Label htmlFor="q-wholesale" className="cursor-pointer">Toplu/Topdancı</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Xidmət Şərtləri</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox id="installments" checked={formData.installments} onCheckedChange={(c) => handleCheckboxChange('installments', c as boolean)} />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="installments" className="cursor-pointer">Hissə-hissə ödəniş (3-12 ay)</Label>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Checkbox id="delivery" checked={formData.delivery} onCheckedChange={(c) => handleCheckboxChange('delivery', c as boolean)} />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="delivery" className="cursor-pointer">Çatdırılma xidməti lazımdır</Label>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Checkbox id="installation" checked={formData.installation} onCheckedChange={(c) => handleCheckboxChange('installation', c as boolean)} />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="installation" className="cursor-pointer">Quraşdırma xidməti lazımdır</Label>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Checkbox id="warranty" checked={formData.warranty} onCheckedChange={(c) => handleCheckboxChange('warranty', c as boolean)} />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="warranty" className="cursor-pointer">Uzadılmış zəmanət istəyirəm</Label>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Checkbox id="invoice" checked={formData.invoice} onCheckedChange={(c) => handleCheckboxChange('invoice', c as boolean)} />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="invoice" className="cursor-pointer">Rəsmi faktura lazımdır</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Əlavə qeydlər</Label>
            <Textarea 
              id="notes" 
              name="notes" 
              value={formData.notes} 
              onChange={handleChange} 
              placeholder="Sifarişinizlə bağlı əlavə istəkləriniz..." 
              className="resize-none"
              rows={3}
            />
          </div>

          <SheetFooter className="pt-4 pb-8 sm:pb-0">
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
              Sifarişi WhatsApp-a göndər
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default WhatsAppOrderSheet;
