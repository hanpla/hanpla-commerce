-- ========================================================
-- Hanpla Commerce - Supabase DB Schema & RLS Policies
-- ========================================================

-- 1. Profiles Table (회원 프로필 테이블)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT,
    phone TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. Cart Items Table (회원 전용 장바구니 테이블)
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id TEXT NOT NULL,
    color_name TEXT NOT NULL,
    color_hex TEXT NOT NULL,
    size TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_user_cart_item UNIQUE (user_id, product_id, color_name, size)
);

-- 3. Wishlist Items Table (회원 전용 위시리스트 테이블)
CREATE TABLE IF NOT EXISTS public.wishlist_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_user_wishlist_item UNIQUE (user_id, product_id)
);

-- 4. Addresses Table (회원 전용 배송지 테이블)
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    recipient TEXT NOT NULL,
    phone TEXT NOT NULL,
    zipcode TEXT NOT NULL,
    address TEXT NOT NULL,
    address_detail TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 5. Categories Table (카테고리 테이블)
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    count INTEGER DEFAULT 0 NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 6. Products Table (상품 테이블)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    price INTEGER NOT NULL,
    original_price INTEGER,
    discount_rate INTEGER,
    image_url TEXT NOT NULL,
    images TEXT[] NOT NULL DEFAULT '{}',
    description TEXT NOT NULL,
    rating NUMERIC(3,2) DEFAULT 5.0 NOT NULL,
    review_count INTEGER DEFAULT 0 NOT NULL,
    is_new BOOLEAN DEFAULT FALSE NOT NULL,
    is_best BOOLEAN DEFAULT FALSE NOT NULL,
    stock INTEGER DEFAULT 100 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 7. Product Options Table (상품 옵션 테이블 - 색상 및 사이즈)
CREATE TABLE IF NOT EXISTS public.product_options (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    color_name TEXT NOT NULL,
    color_hex TEXT NOT NULL,
    sizes TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 8. Orders Table (주문 헤더 테이블)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id TEXT UNIQUE NOT NULL,
    order_name TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'DONE',
    payment_key TEXT,
    recipient_name TEXT NOT NULL,
    recipient_phone TEXT NOT NULL,
    zipcode TEXT NOT NULL,
    address TEXT NOT NULL,
    address_detail TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 9. Order Items Table (주문 상품 상세 테이블)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    product_image TEXT NOT NULL,
    color_name TEXT NOT NULL,
    color_hex TEXT NOT NULL,
    size TEXT NOT NULL,
    price INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ========================================================
-- RLS (Row Level Security) Policies (재실행 가능 멱등성 보장)
-- ========================================================

-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Cart Items RLS
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own cart items" ON public.cart_items;
CREATE POLICY "Users can view their own cart items"
    ON public.cart_items FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own cart items" ON public.cart_items;
CREATE POLICY "Users can insert their own cart items"
    ON public.cart_items FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own cart items" ON public.cart_items;
CREATE POLICY "Users can update their own cart items"
    ON public.cart_items FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own cart items" ON public.cart_items;
CREATE POLICY "Users can delete their own cart items"
    ON public.cart_items FOR DELETE
    USING (auth.uid() = user_id);

-- Wishlist Items RLS
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own wishlist items" ON public.wishlist_items;
CREATE POLICY "Users can view their own wishlist items"
    ON public.wishlist_items FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own wishlist items" ON public.wishlist_items;
CREATE POLICY "Users can insert their own wishlist items"
    ON public.wishlist_items FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own wishlist items" ON public.wishlist_items;
CREATE POLICY "Users can delete their own wishlist items"
    ON public.wishlist_items FOR DELETE
    USING (auth.uid() = user_id);

-- Addresses RLS
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own addresses" ON public.addresses;
CREATE POLICY "Users can view their own addresses"
    ON public.addresses FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own addresses" ON public.addresses;
CREATE POLICY "Users can insert their own addresses"
    ON public.addresses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own addresses" ON public.addresses;
CREATE POLICY "Users can update their own addresses"
    ON public.addresses FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own addresses" ON public.addresses;
CREATE POLICY "Users can delete their own addresses"
    ON public.addresses FOR DELETE
    USING (auth.uid() = user_id);

-- Categories RLS (Anyone can read)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
CREATE POLICY "Anyone can view categories"
    ON public.categories FOR SELECT
    USING (true);

-- Products RLS (Anyone can read)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
CREATE POLICY "Anyone can view products"
    ON public.products FOR SELECT
    USING (true);

-- Product Options RLS (Anyone can read)
ALTER TABLE public.product_options ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view product_options" ON public.product_options;
CREATE POLICY "Anyone can view product_options"
    ON public.product_options FOR SELECT
    USING (true);

-- Orders RLS (Users can view and insert their own orders)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders"
    ON public.orders FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
CREATE POLICY "Users can insert their own orders"
    ON public.orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Order Items RLS (Users can view and insert their own order items)
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
CREATE POLICY "Users can view their own order items"
    ON public.order_items FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own order items" ON public.order_items;
CREATE POLICY "Users can insert their own order items"
    ON public.order_items FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ========================================================
-- Seed Data (초기 시드 데이터)
-- ========================================================

INSERT INTO public.categories (id, name, count, image_url) VALUES
('outer', '아우터', 12, 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop'),
('top', '상의', 24, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop'),
('bottom', '하의', 18, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop'),
('shoes', '신발', 10, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop'),
('acc', '악세서리', 15, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, name, brand, category, price, original_price, discount_rate, image_url, images, description, rating, review_count, is_new, is_best, stock, created_at) VALUES
('prod-1', '오버사이즈 울 블렌드 트렌치 코트', 'HANPLA STUDIO', 'outer', 248000, 310000, 20, 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'], '고급 울 블렌드 소재로 우수한 드레이프성과 따뜻한 착용감을 제공하는 오버사이즈 트렌치 코트입니다. 더블 브레스티드 디자인과 와이드 라펠이 현대적인 실루엣을 완성합니다.', 4.9, 128, true, true, 45, '2026-07-15T00:00:00Z'),
('prod-2', '크루넥 헤비웨이트 옥스포드 셔츠', 'HANPLA ESSENTIAL', 'top', 69000, 89000, 22, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop'], '탄탄한 수피마 코튼 100% 옥스포드 원단으로 세탁 후에도 변형이 적으며 클래식한 데일리웨어로 안성맞춤입니다.', 4.8, 94, false, true, 80, '2026-06-20T00:00:00Z'),
('prod-3', '와이드 턱 원단 셀비지 데님 팬츠', 'HANPLA DENIM', 'bottom', 119000, 139000, 14, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=800&auto=format&fit=crop'], '14oz 프리미엄 일본 셀비지 데님 원단을 사용한 와이드 턱 팬츠입니다. 자연스러운 딥블루 워싱과 매력적인 실루엣이 특징입니다.', 4.7, 67, true, false, 30, '2026-07-28T00:00:00Z'),
('prod-4', '스웨이드 첼시 더비 슈즈', 'ATELIER HANPLA', 'shoes', 189000, 220000, 14, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop'], '천연 이태리 천연 카우 스웨이드 레더와 쿠셔닝 인솔을 결합하여 가볍고 유연한 착화감을 자랑하는 모던 더비 슈즈입니다.', 4.9, 42, false, true, 20, '2026-05-10T00:00:00Z'),
('prod-5', '최상급 실버 925 체인 넥클리스', 'HANPLA JEWELRY', 'acc', 79000, NULL, NULL, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop'], '법정순은 Silver 925 소재로 제작되어 알러지 걱정 없이 세련된 포인트를 줄 수 있는 펜던트 미니 체인 목걸이입니다.', 4.6, 31, true, false, 50, '2026-07-01T00:00:00Z'),
('prod-6', '캐시미어 블렌드 라운드 니트', 'HANPLA ESSENTIAL', 'top', 98000, 128000, 23, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop'], '파인 몽골리안 캐시미어 30% 함유로 부드러운 터치감과 차분한 컬러감이 매력적인 기본 니트웨어입니다.', 4.8, 110, false, true, 60, '2026-04-12T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.product_options (product_id, color_name, color_hex, sizes) VALUES
('prod-1', 'Beige', '#D7C4B7', ARRAY['M', 'L', 'XL']),
('prod-1', 'Black', '#111111', ARRAY['S', 'M', 'L', 'XL']),
('prod-2', 'White', '#FFFFFF', ARRAY['S', 'M', 'L', 'XL']),
('prod-2', 'Sky Blue', '#87CEEB', ARRAY['M', 'L']),
('prod-3', 'Raw Indigo', '#1F2937', ARRAY['S', 'M', 'L']),
('prod-3', 'Washed Blue', '#3B82F6', ARRAY['S', 'M', 'L', 'XL']),
('prod-4', 'Dark Brown', '#3D2314', ARRAY['M', 'L']),
('prod-4', 'Black', '#111111', ARRAY['S', 'M', 'L', 'XL']),
('prod-5', 'Silver', '#E5E7EB', ARRAY['FREE']),
('prod-6', 'Oatmeal', '#E3DAC9', ARRAY['S', 'M', 'L']),
('prod-6', 'Charcoal', '#36454F', ARRAY['M', 'L', 'XL']);
