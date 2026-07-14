import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Menu, Moon, Sun, User as UserIcon, Phone, MapPin, Clock, Search, Heart, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header = () => {
  const { user, profile, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { name: 'Məhsullar', path: '/products' },
    { name: 'Hikvision', path: '/products?brand=hikvision' },
    { name: 'Alətlər', path: '/tools' },
    { name: 'Blog', path: '/blog' },
    { name: 'Əlaqə', path: '/contact' },
  ];

  const getDashboardPath = () => {
    if (!profile) return '/';
    switch (profile.role) {
      case 'admin':
        return '/admin';
      case 'wholesale':
        return '/wholesale';
      case 'dealer':
        return '/dealer';
      default:
        return '/user';
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b shadow-sm">
      {/* Top Bar */}
      <div className="hidden md:flex border-b bg-muted/40">
        <div className="container flex h-10 items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-6">
            <a href="tel:+994776117780" className="flex items-center hover:text-primary transition-colors">
              <Phone className="h-3.5 w-3.5 mr-2 text-primary" />
              +994 77 611 77 80
            </a>
            <div className="flex items-center">
              <MapPin className="h-3.5 w-3.5 mr-2 text-primary" />
              Baku, Azadliq prospekti 143
            </div>
            <div className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-2 text-primary" />
              09:00-18:00 (Mon-Sat)
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-green-600 font-medium">Pulsuz Konsultasiya mövcuddur</span>
            <div className="flex items-center">
              <button 
                onClick={() => setLanguage('az')} 
                className={`px-2 py-1 ${language === 'az' ? 'bg-primary text-primary-foreground font-bold' : 'hover:text-foreground'}`}
              >
                AZ
              </button>
              <button 
                onClick={() => setLanguage('en')} 
                className={`px-2 py-1 ${language === 'en' ? 'bg-primary text-primary-foreground font-bold' : 'hover:text-foreground'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('ru')} 
                className={`px-2 py-1 ${language === 'ru' ? 'bg-primary text-primary-foreground font-bold' : 'hover:text-foreground'}`}
              >
                RU
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container flex h-20 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-1 shrink-0">
          <span className="font-black text-2xl tracking-tighter">İT<span className="text-primary">SEC</span><span className="text-sm tracking-normal">.az</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors hover:text-primary ${
                location.pathname === link.path ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 transition-colors hover:text-primary text-foreground/80 outline-none">
              Kateqoriyalar <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem asChild><Link to="/products?category=cctv">Müşahidə Kameraları</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/products?category=access-control">Girişə Nəzarət</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/products?category=network">Şəbəkə Avadanlıqları</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/products?category=cables">Kabellər və Aksesuarlar</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-3 shrink-0 flex-1 justify-end lg:flex-none">
          <form onSubmit={handleSearch} className="hidden xl:flex relative w-64 max-w-sm items-center">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search cameras, NVR..."
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <Button className="hidden sm:flex bg-green-600 hover:bg-green-700 text-white gap-2" asChild>
            <a href="https://wa.me/994776117780" target="_blank" rel="noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
              </svg>
              WhatsApp ilə sifariş
            </a>
          </Button>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <Button onClick={() => {}} variant="ghost" size="icon" className="hidden sm:flex h-9 w-9 text-muted-foreground hover:text-foreground">
              <Heart className="h-5 w-5" />
            </Button>

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground hover:text-foreground">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {totalItems}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                  <UserIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user ? (
                  <>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {profile?.full_name && <p className="font-medium">{profile.full_name}</p>}
                        <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuItem asChild><Link to={getDashboardPath()}>{t('dashboard')}</Link></DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer" onClick={signOut}>{t('logout')}</DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild><Link to="/login">{t('login')}</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/register">Qeydiyyat</Link></DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9 shrink-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-6 py-4">
                  <Link to="/" className="flex items-center space-x-1">
                    <span className="font-black text-2xl tracking-tighter">İT<span className="text-primary">SEC</span>.az</span>
                  </Link>
                  <form onSubmit={handleSearch} className="relative w-full items-center">
                    <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link key={link.path} to={link.path} className={`text-lg font-medium ${location.pathname === link.path ? 'text-primary' : 'text-foreground/80'}`}>
                        {link.name}
                      </Link>
                    ))}
                    <Link to="/products" className="text-lg font-medium text-foreground/80">Kateqoriyalar</Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
