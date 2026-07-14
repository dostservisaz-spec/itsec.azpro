-- Enums
CREATE TYPE public.user_role AS ENUM ('admin', 'customer', 'wholesale', 'dealer');
CREATE TYPE public.order_status AS ENUM ('new', 'confirmed', 'shipped', 'completed', 'cancelled');
CREATE TYPE public.product_status AS ENUM ('in_stock', 'out_of_stock');
CREATE TYPE public.contact_status AS ENUM ('new', 'read', 'replied');

-- Trigger function for auth.users
CREATE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'customer'::public.user_role)
  );
  RETURN NEW;
END;
$$;

-- 1. Profiles Table
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text,
  full_name text,
  phone text,
  role public.user_role NOT NULL DEFAULT 'customer'::public.user_role,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Profiles Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.get_user_role(uid uuid)
RETURNS public.user_role
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = uid;
$$;

CREATE POLICY "Admins have full access to profiles" ON public.profiles
  FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM public.get_user_role(auth.uid()));

CREATE VIEW public.public_profiles AS
  SELECT id, role, full_name FROM public.profiles;

-- Create auth trigger AFTER profiles table is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 2. Settings Table (for percentages and global settings)
CREATE TABLE public.settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_margin numeric NOT NULL DEFAULT 0.10,
  wholesale_margin numeric NOT NULL DEFAULT 0.05,
  dealer_margin numeric NOT NULL DEFAULT 0.02,
  contact_phone text NOT NULL DEFAULT '+994776117780',
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Insert default settings
INSERT INTO public.settings (id, customer_margin, wholesale_margin, dealer_margin) VALUES ('00000000-0000-0000-0000-000000000001', 0.10, 0.05, 0.02);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON public.settings FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- 3. Categories Table
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_az text NOT NULL,
  name_en text,
  name_ru text,
  slug text UNIQUE NOT NULL,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- 4. Brands Table
CREATE TABLE public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Admins can manage brands" ON public.brands FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- 5. Products Table
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  brand_id uuid REFERENCES public.brands(id) ON DELETE SET NULL,
  name_az text NOT NULL,
  name_en text,
  name_ru text,
  description_az text,
  description_en text,
  description_ru text,
  base_price numeric NOT NULL,
  status public.product_status NOT NULL DEFAULT 'in_stock'::public.product_status,
  sku text,
  stock_quantity integer NOT NULL DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- 6. Product Images Table
CREATE TABLE public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  url text NOT NULL,
  is_primary boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read product images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Admins can manage product images" ON public.product_images FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- 7. Favorites Table
CREATE TABLE public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own favorites" ON public.favorites FOR ALL TO authenticated USING (auth.uid() = user_id);

-- 8. Addresses Table
CREATE TABLE public.addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  city text,
  zip_code text,
  is_default boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own addresses" ON public.addresses FOR ALL TO authenticated USING (auth.uid() = user_id);

-- 9. Orders Table
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_number text UNIQUE NOT NULL,
  status public.order_status NOT NULL DEFAULT 'new'::public.order_status,
  total_amount numeric NOT NULL,
  customer_name text,
  customer_phone text,
  shipping_address text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'ORD-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substring(md5(random()::text) from 1 for 6));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_order_created
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all orders" ON public.orders FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- 10. Order Items Table
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  quantity integer NOT NULL,
  unit_price numeric NOT NULL,
  total_price numeric NOT NULL,
  product_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own order items" ON public.order_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can insert their own order items" ON public.order_items FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Admins can manage all order items" ON public.order_items FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- 11. Banners Table
CREATE TABLE public.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_az text,
  title_en text,
  title_ru text,
  description_az text,
  description_en text,
  description_ru text,
  image_url text NOT NULL,
  link_url text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active banners" ON public.banners FOR SELECT USING (is_active = true OR public.get_user_role(auth.uid()) = 'admin'::public.user_role);
CREATE POLICY "Admins can manage banners" ON public.banners FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- 12. Blogs Table
CREATE TABLE public.blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_az text NOT NULL,
  title_en text,
  title_ru text,
  content_az text,
  content_en text,
  content_ru text,
  image_url text,
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_published boolean DEFAULT true,
  view_count integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published blogs" ON public.blogs FOR SELECT USING (is_published = true OR public.get_user_role(auth.uid()) = 'admin'::public.user_role);
CREATE POLICY "Admins can manage blogs" ON public.blogs FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- 13. Contacts/Quotes Table
CREATE TABLE public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  subject text,
  message text NOT NULL,
  status public.contact_status NOT NULL DEFAULT 'new'::public.contact_status,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert contacts" ON public.contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage contacts" ON public.contacts FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- Supabase Storage Bucket for Images
INSERT INTO storage.buckets (id, name, public) VALUES ('public-images', 'public-images', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'public-images' );
CREATE POLICY "Admins can upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'public-images' AND public.get_user_role(auth.uid()) = 'admin'::public.user_role );
CREATE POLICY "Admins can update" ON storage.objects FOR UPDATE USING ( bucket_id = 'public-images' AND public.get_user_role(auth.uid()) = 'admin'::public.user_role );
CREATE POLICY "Admins can delete" ON storage.objects FOR DELETE USING ( bucket_id = 'public-images' AND public.get_user_role(auth.uid()) = 'admin'::public.user_role );
