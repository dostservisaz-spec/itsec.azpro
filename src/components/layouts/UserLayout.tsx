import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from './Header';
import Footer from './Footer';
import { User as UserIcon, ShoppingBag, MapPin, Heart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UserLayout = () => {
  const { profile, isLoading, signOut } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Yüklənir...</div>;
  }

  if (!profile) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const basePath = profile.role === 'customer' ? '/user' : `/${profile.role}`;

  const navLinks = [
    { icon: <UserIcon className="h-4 w-4" />, label: 'Profil', path: basePath },
    { icon: <ShoppingBag className="h-4 w-4" />, label: 'Sifarişlərim', path: `${basePath}/orders` },
    { icon: <MapPin className="h-4 w-4" />, label: 'Ünvanlarım', path: `${basePath}/addresses` },
    { icon: <Heart className="h-4 w-4" />, label: 'Favorilərim', path: `${basePath}/favorites` },
  ];

  if (profile.role === 'dealer') {
    navLinks.push({ icon: <ShoppingBag className="h-4 w-4" />, label: 'Qiymət Cədvəli', path: `${basePath}/pricing` });
  }

  return (
    <div className="flex min-h-screen flex-col w-full bg-muted/20">
      <Header />
      <main className="flex-1 min-w-0 container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="rounded-lg border bg-card overflow-hidden">
              <div className="p-6 border-b bg-muted/30">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{profile.full_name || 'İstifadəçi'}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{profile.role}</p>
                  </div>
                </div>
              </div>
              <nav className="flex flex-col p-2">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  );
                })}
                <Button 
                  variant="ghost" 
                  className="mt-2 justify-start px-4 text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50" 
                  onClick={signOut}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Çıxış
                </Button>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
