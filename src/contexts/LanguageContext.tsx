import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'az' | 'en' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  az: {
    home: 'Ana Səhifə',
    products: 'Məhsullar',
    tools: 'Alətlər',
    blog: 'Bloq',
    about: 'Haqqımızda',
    contact: 'Əlaqə',
    login: 'Giriş',
    register: 'Qeydiyyat',
    logout: 'Çıxış',
    profile: 'Profil',
    dashboard: 'İdarə Paneli',
    admin_panel: 'Admin Paneli',
    cart: 'Səbət',
    add_to_cart: 'Səbətə əlavə et',
    search: 'Axtarış...',
    categories: 'Kateqoriyalar',
    price: 'Qiymət',
    order_now: 'Sifariş Ver',
    whatsapp_order: 'WhatsApp ilə sifariş ver',
  },
  en: {
    home: 'Home',
    products: 'Products',
    tools: 'Tools',
    blog: 'Blog',
    about: 'About',
    contact: 'Contact',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    profile: 'Profile',
    dashboard: 'Dashboard',
    admin_panel: 'Admin Panel',
    cart: 'Cart',
    add_to_cart: 'Add to Cart',
    search: 'Search...',
    categories: 'Categories',
    price: 'Price',
    order_now: 'Order Now',
    whatsapp_order: 'Order via WhatsApp',
  },
  ru: {
    home: 'Главная',
    products: 'Товары',
    tools: 'Инструменты',
    blog: 'Блог',
    about: 'О нас',
    contact: 'Контакты',
    login: 'Войти',
    register: 'Регистрация',
    logout: 'Выйти',
    profile: 'Профиль',
    dashboard: 'Панель',
    admin_panel: 'Админ панель',
    cart: 'Корзина',
    add_to_cart: 'В корзину',
    search: 'Поиск...',
    categories: 'Категории',
    price: 'Цена',
    order_now: 'Заказать',
    whatsapp_order: 'Заказать через WhatsApp',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'az';
  });

  const setLanguage = (lang: Language) => {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
