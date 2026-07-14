import React, { useState } from 'react';
import { supabase } from '@/db/supabase';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const from = location.state?.from?.pathname || '/user';

  if (session) {
    navigate(from, { replace: true });
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Bütün sahələri doldurun');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        if (error.message === 'Invalid login credentials') {
          throw new Error('Yanlış email və ya şifrə');
        }
        throw error;
      }

      toast.success('Uğurla daxil oldunuz');
      
      // Navigate to correct dashboard based on role
      if (data.user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
        if (profile) {
          if (profile.role === 'admin') navigate('/admin', { replace: true });
          else if (profile.role === 'wholesale') navigate('/wholesale', { replace: true });
          else if (profile.role === 'dealer') navigate('/dealer', { replace: true });
          else navigate(from, { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-20 flex justify-center items-center min-h-[calc(100vh-16rem)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-full mb-4">
            <Shield className="h-8 w-8" />
          </Link>
          <h1 className="text-2xl font-bold">Xoş Gəlmisiniz</h1>
          <p className="text-muted-foreground mt-2">Davam etmək üçün hesabınıza daxil olun</p>
        </div>

        <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Şifrə</Label>
                <Link to="#" className="text-sm text-primary hover:underline" onClick={(e) => {
                  e.preventDefault();
                  toast.info('Şifrəni sıfırlamaq üçün info@itsec.az ilə əlaqə saxlayın');
                }}>
                  Şifrəni unutmusunuz?
                </Link>
              </div>
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

            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Daxil olunur...
                </>
              ) : (
                'Daxil Ol'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Hesabınız yoxdur?</span>{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Qeydiyyatdan keçin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
