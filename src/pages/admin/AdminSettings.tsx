import React, { useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const AdminSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    id: '',
    customer_margin: 10,
    wholesale_margin: 5,
    dealer_margin: 2,
    contact_phone: '+994776117780'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from('settings').select('*').limit(1).maybeSingle();
      if (error) throw error;
      if (data) {
        setSettings({
          id: data.id,
          customer_margin: Number(data.customer_margin) * 100, // Convert to percentage
          wholesale_margin: Number(data.wholesale_margin) * 100,
          dealer_margin: Number(data.dealer_margin) * 100,
          contact_phone: data.contact_phone
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Parametrlər yüklənərkən xəta baş verdi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const { error } = await supabase.from('settings').update({
        customer_margin: Number(settings.customer_margin) / 100, // Convert back to decimal
        wholesale_margin: Number(settings.wholesale_margin) / 100,
        dealer_margin: Number(settings.dealer_margin) / 100,
        contact_phone: settings.contact_phone,
        updated_at: new Date().toISOString()
      }).eq('id', settings.id);

      if (error) throw error;
      toast.success('Parametrlər uğurla yadda saxlanıldı');
    } catch (error: any) {
      toast.error('Xəta baş verdi: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div>Yüklənir...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Parametrlər</h1>
        <p className="text-muted-foreground">Sistemin ümumi tənzimləmələri və qiymət siyasəti</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-card border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Qiymət Faizləri (Marja)</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Məhsulların əsas qiymətinə (baza qiymətə) əlavə ediləcək faizlər. Hər rol üçün qiymət bu düsturla hesablanır: Baza Qiymət + (Baza Qiymət × Faiz)
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="customer_margin">Pərakəndə Müştəri (%)</Label>
              <Input
                id="customer_margin"
                name="customer_margin"
                type="number"
                min="0"
                step="1"
                value={settings.customer_margin}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">Standart alıcılar üçün əlavə dəyər</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="wholesale_margin">Topdancı (%)</Label>
              <Input
                id="wholesale_margin"
                name="wholesale_margin"
                type="number"
                min="0"
                step="1"
                value={settings.wholesale_margin}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">Topdan alıcılar üçün əlavə dəyər</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dealer_margin">Diler (%)</Label>
              <Input
                id="dealer_margin"
                name="dealer_margin"
                type="number"
                min="0"
                step="1"
                value={settings.dealer_margin}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">Dilerlər üçün əlavə dəyər</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Əlaqə Parametrləri</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Sifariş/WhatsApp Nömrəsi</Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                value={settings.contact_phone}
                onChange={handleChange}
                placeholder="+994776117780"
              />
              <p className="text-xs text-muted-foreground">Bütün WhatsApp sifarişləri bu nömrəyə göndəriləcək</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Yadda saxlanılır...' : 'Dəyişiklikləri Yadda Saxla'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
