import React from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import AdminLayout from './components/layouts/AdminLayout';
import UserLayout from './components/layouts/UserLayout';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import UserProfile from './pages/user/UserProfile';
import DealerPricing from './pages/user/DealerPricing';

// Pages placeholders
const ToolsPage = () => <div>Tools Page</div>;

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminCategories from './pages/admin/AdminCategories';
import AdminBanners from './pages/admin/AdminBanners';
import AdminSettings from './pages/admin/AdminSettings';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'tools', element: <ToolsPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'products', element: <AdminProducts /> },
      { path: 'products/:id/edit', element: <AdminProductForm /> },
      { path: 'products/new', element: <AdminProductForm /> },
      { path: 'orders', element: <div className="p-6">Sifarişlər tezliklə...</div> },
      { path: 'customers', element: <div className="p-6">Müştərilər tezliklə...</div> },
      { path: 'categories', element: <AdminCategories /> },
      { path: 'banners', element: <AdminBanners /> },
      { path: 'blog', element: <div className="p-6">Bloq tezliklə...</div> },
      { path: 'quotes', element: <div className="p-6">Müraciətlər tezliklə...</div> },
      { path: 'reports', element: <div className="p-6">Hesabatlar tezliklə...</div> },
      { path: 'settings', element: <AdminSettings /> },
      { path: '*', element: <Navigate to="/admin" replace /> },
    ]
  },
  {
    path: '/user',
    element: <UserLayout />,
    children: [
      { index: true, element: <UserProfile /> },
      { path: 'orders', element: <div>Sifarişlərim tezliklə...</div> },
      { path: 'addresses', element: <div>Ünvanlarım tezliklə...</div> },
      { path: 'favorites', element: <div>Favorilərim tezliklə...</div> },
      { path: '*', element: <Navigate to="/user" replace /> },
    ]
  },
  {
    path: '/wholesale',
    element: <UserLayout />,
    children: [
      { index: true, element: <UserProfile /> },
      { path: 'orders', element: <div>Sifarişlərim tezliklə...</div> },
      { path: 'addresses', element: <div>Ünvanlarım tezliklə...</div> },
      { path: 'favorites', element: <div>Favorilərim tezliklə...</div> },
      { path: '*', element: <Navigate to="/wholesale" replace /> },
    ]
  },
  {
    path: '/dealer',
    element: <UserLayout />,
    children: [
      { index: true, element: <UserProfile /> },
      { path: 'orders', element: <div>Sifarişlərim tezliklə...</div> },
      { path: 'addresses', element: <div>Ünvanlarım tezliklə...</div> },
      { path: 'favorites', element: <div>Favorilərim tezliklə...</div> },
      { path: 'pricing', element: <DealerPricing /> },
      { path: '*', element: <Navigate to="/dealer" replace /> },
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
];
