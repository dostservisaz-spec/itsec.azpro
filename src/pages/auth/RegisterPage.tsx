import React, { useState } from 'react';
import { supabase } from '@/db/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  if (session) {
    navigate('/user', { replace: true });
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.password || !formData.phone) {
      toast.error('Bütün sahələri doldurun');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Şifrələr uyğun gəlmir');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Şifrə ən azı 6 simvoldan ibarət olmalıdır');
      return;
    }

    if (!acceptedTerms) {
      toast.error('İstifadə qaydaları və məxfilik siyasəti ilə razılaşmalısınız');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            role: 'customer' // Default role
          }
        }
      });

      if (error) throw error;

      toast.success('Qeydiyyat uğurla tamamlandı! İndi daxil ola bilərsiniz.');
      navigate('/login');
    } catch (error: any) {
      let errorMsg = error.message;
      if (error.message.includes('already registered')) {
        errorMsg = 'Bu email artıq qeydiyyatdan keçib';
      }
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-12 flex justify-center items-center min-h-[calc(100vh-16rem)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-full mb-4">
            <Shield className="h-8 w-8" />
          </Link>
          <h1 className="text-2xl font-bold">Qeydiyyat</h1>
          <p className="text-muted-foreground mt-2">Sistemə qoşulmaq üçün məlumatlarınızı daxil edin</p>
        </div>

        <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Ad və Soyad</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Məs: Əli Əliyev"
                value={formData.fullName}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email ünvanı</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nümunə@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon Nömrəsi</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+994"
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Şifrə</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Şifrəni Təsdiqlə</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="flex items-start space-x-3 pt-2 pb-2">
              <Checkbox 
                id="terms" 
                checked={acceptedTerms} 
                onCheckedChange={(c) => setAcceptedTerms(c as boolean)} 
                disabled={isLoading}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground leading-snug cursor-pointer">
                  <a href="#" className="text-primary hover:underline">İstifadə qaydaları</a> və <a href="#" className="text-primary hover:underline">Məxfilik siyasəti</a> ilə razıyam.
                </Label>
              </div>
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Qeydiyyat aparılır...
                </>
              ) : (
                'Qeydiyyatdan Keç'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Artıq hesabınız var?</span>{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Daxil olun
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
