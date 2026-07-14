import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Image as ImageIcon,
  FileText,
  MessageSquare,
  LogOut,
  Menu,
  BarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const AdminLayout = () => {
  const { profile, isLoading, signOut } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Yüklənir...</div>;
  }

  if (!profile || profile.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const sidebarLinks = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', path: '/admin' },
    { icon: <Package className="h-5 w-5" />, label: 'Products', path: '/admin/products' },
    { icon: <ShoppingCart className="h-5 w-5" />, label: 'Orders', path: '/admin/orders' },
    { icon: <Users className="h-5 w-5" />, label: 'Customers', path: '/admin/customers' },
    { icon: <BarChart className="h-5 w-5" />, label: 'Reports', path: '/admin/reports' },
    { icon: <ImageIcon className="h-5 w-5" />, label: 'Banners', path: '/admin/banners' },
    { icon: <FileText className="h-5 w-5" />, label: 'Blog', path: '/admin/blog' },
    { icon: <MessageSquare className="h-5 w-5" />, label: 'Quotes', path: '/admin/quotes' },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', path: '/admin/settings' },
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-[#f8f9fa] border-r">
      <div className="flex flex-col shrink-0 px-6 py-6 border-b bg-[#f8f9fa]">
        <Link to="/" className="flex flex-col">
          <span className="font-bold text-xl tracking-tight text-slate-900">IT<span className="text-[#cc0000]">Security</span>.az</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground font-medium">Admin Panel</span>
            <span className="text-[10px] bg-[#cc0000] text-white px-1.5 py-0.5 rounded font-bold">ADMIN</span>
          </div>
        </Link>
      </div>

      <div className="px-6 py-4">
        <p className="text-xs text-muted-foreground mb-1">Signed in as</p>
        <p className="font-bold text-sm text-slate-900">Admin</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          <span className="text-xs text-green-500">Administrator</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 pb-4">
        {sidebarLinks.map((link) => {
          const isActive = location.pathname === link.path || (link.path !== '/admin' && location.pathname.startsWith(link.path));
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors relative ${
                isActive
                  ? 'bg-red-50 text-[#cc0000]'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#cc0000] rounded-r-md"></div>
              )}
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4 bg-[#f8f9fa]">
        <p className="text-xs text-muted-foreground mb-4 px-2">{profile?.email || 'admin@prosecurity.az'}</p>
        <Button variant="ghost" className="w-full justify-start text-[#cc0000] hover:text-[#cc0000] hover:bg-red-50" onClick={signOut}>
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </Button>
        <div className="mt-6 text-center">
          <p className="text-[10px] text-muted-foreground">Protected by Jozef</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-[#f8f9fa]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col bg-[#f8f9fa]">
        {/* Mobile Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold tracking-tight hidden md:block">Admin Dashboard</h1>
            <h1 className="text-lg font-bold md:hidden">Admin</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm font-medium border rounded-md px-2 py-1 bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <span>AZ</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
