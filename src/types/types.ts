export type UserRole = 'admin' | 'customer' | 'wholesale' | 'dealer';
export type OrderStatus = 'new' | 'confirmed' | 'shipped' | 'completed' | 'cancelled';
export type ProductStatus = 'in_stock' | 'out_of_stock';
export type ContactStatus = 'new' | 'read' | 'replied';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  id: string;
  customer_margin: number;
  wholesale_margin: number;
  dealer_margin: number;
  contact_phone: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name_az: string;
  name_en: string;
  name_ru: string;
  slug: string;
  image_url: string;
  display_order?: number;
  created_at: string;
}

export interface Brand {
  id: string;
  name: string;
  logo_url: string;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  brand_id: string;
  name_az: string;
  name_en: string;
  name_ru: string;
  description_az: string;
  description_en: string;
  description_ru: string;
  base_price: number;
  status: ProductStatus;
  sku: string;
  stock_quantity: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  categories?: Category;
  brands?: Brand;
  product_images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  price: number;
  priceType: 'standart' | 'premium' | 'toplu';
}
