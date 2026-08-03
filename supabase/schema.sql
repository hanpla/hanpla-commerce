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
-- Seed Data (대용량 고품질 상품 30종 시드 데이터)
-- ========================================================

INSERT INTO public.categories (id, name, count, image_url) VALUES
('outer', '아우터', 7, 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop'),
('top', '상의', 8, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop'),
('bottom', '하의', 7, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop'),
('shoes', '신발', 7, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop'),
('acc', '악세서리', 6, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop')
ON CONFLICT (id) DO UPDATE SET
name = EXCLUDED.name,
count = EXCLUDED.count,
image_url = EXCLUDED.image_url;

INSERT INTO public.products (id, name, brand, category, price, original_price, discount_rate, image_url, images, description, rating, review_count, is_new, is_best, stock, created_at) VALUES
-- Outer (7개)
('prod-1', '오버사이즈 울 블렌드 트렌치 코트', 'HANPLA STUDIO', 'outer', 248000, 310000, 20, 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop'], '고급 울 블렌드 소재로 우수한 드레이프성과 따뜻한 착용감을 제공하는 오버사이즈 트렌치 코트입니다.', 4.9, 128, true, true, 45, '2026-07-15T00:00:00Z'),
('prod-7', '미니멀라이즈 테일러드 2버튼 자켓', 'MINIMAL HANPLA', 'outer', 189000, 229000, 17, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'], '클래식한 라인과 현대적인 피팅감이 돋보이는 테일러드 블레이저입니다.', 4.8, 85, true, false, 35, '2026-07-20T00:00:00Z'),
('prod-8', '헤비웨이트 숏 덤블 구스다운 점퍼', 'HANPLA ATHLETIC', 'outer', 289000, 349000, 17, 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop'], '충전재 구스다운 90:10 비율의 풍성한 보온성을 자랑하는 숏 패딩 점퍼입니다.', 4.9, 210, false, true, 60, '2026-06-10T00:00:00Z'),
('prod-9', '빈티지 레더 싱글 라이더스 자켓', 'HANPLA ARCHIVE', 'outer', 329000, 399000, 17, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop'], '이태리 프리미엄 천연 램스킨으로 은은한 광택과 뛰어난 착용감을 지닌 가죽 자켓입니다.', 4.7, 54, false, false, 25, '2026-05-18T00:00:00Z'),
('prod-10', '딥 인디고 워싱 데님 트러커 자켓', 'HANPLA DENIM', 'outer', 139000, 169000, 17, 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop'], '탄탄한 13.5oz 데님으로 세련된 엠보 워싱과 트렌디한 핏을 연출해줍니다.', 4.8, 92, true, false, 50, '2026-07-22T00:00:00Z'),
('prod-11', '더블 브레스티드 수트 자켓', 'ATELIER HANPLA', 'outer', 219000, 259000, 15, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop'], '격식 있는 자리는 물론 포멀룩 스타일링에 필수적인 더블 자켓입니다.', 4.9, 43, false, true, 30, '2026-04-15T00:00:00Z'),
('prod-12', '캐시미어 멜톤 롱 싱글 코트', 'HANPLA STUDIO', 'outer', 358000, 428000, 16, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop'], '우아한 드레이프 핏과 따뜻한 착용감을 선사하는 최고급 캐시미어 롱 코트입니다.', 5.0, 77, true, true, 20, '2026-07-30T00:00:00Z'),

-- Top (8개)
('prod-2', '크루넥 헤비웨이트 옥스포드 셔츠', 'HANPLA ESSENTIAL', 'top', 69000, 89000, 22, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop'], '탄탄한 수피마 코튼 100% 옥스포드 원단으로 클래식한 데일리 셔츠입니다.', 4.8, 94, false, true, 80, '2026-06-20T00:00:00Z'),
('prod-6', '캐시미어 블렌드 라운드 니트', 'HANPLA ESSENTIAL', 'top', 98000, 128000, 23, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop'], '부드러운 터치감과 차분한 컬러감이 매력적인 기본 라운드 니트웨어입니다.', 4.8, 110, false, true, 60, '2026-04-12T00:00:00Z'),
('prod-13', '피그먼트 다잉 드롭숄더 후디', 'URBAN HANPLA', 'top', 89000, 109000, 18, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop'], '빈티지한 피그먼트 워싱과 여유로운 드롭숄더 핏의 헤비웨이트 후드티입니다.', 4.9, 142, true, true, 70, '2026-07-25T00:00:00Z'),
('prod-14', '헤비 코튼 스웨트셔츠 맨투맨', 'HANPLA ATHLETIC', 'top', 65000, 79000, 17, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop'], '탄탄한 시보리와 내부 기모로 따뜻하고 활동성이 우수한 맨투맨입니다.', 4.7, 168, false, true, 90, '2026-05-30T00:00:00Z'),
('prod-15', '수피마 코튼 오버핏 티셔츠 3PACK', 'MINIMAL HANPLA', 'top', 59000, 75000, 21, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop'], '최고급 수피마 원사로 보풀이 적고 은은한 광택을 지닌 3팩 팩티셔츠 세트입니다.', 4.9, 320, true, true, 150, '2026-07-05T00:00:00Z'),
('prod-16', '스트라이프 보트넥 오버사이즈 롱슬리브', 'HANPLA ARCHIVE', 'top', 54000, 65000, 16, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop'], '감각적인 스트라이프 패턴과 단단한 보트넥 구조의 데일리 긴팔 티셔츠입니다.', 4.6, 88, false, false, 40, '2026-06-01T00:00:00Z'),
('prod-17', '모던 리넨 블렌드 릴렉스 셔츠', 'HANPLA STUDIO', 'top', 79000, 95000, 16, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop'], '통기성이 우수한 내추럴 리넨 혼방으로 여름 시즌 청량감을 더해줍니다.', 4.8, 62, true, false, 55, '2026-07-10T00:00:00Z'),
('prod-18', '울 니트 반집업 아노락 sweater', 'ATELIER HANPLA', 'top', 119000, 139000, 14, 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=800&auto=format&fit=crop'], '트렌디한 하프집업 구도와 촘촘한 짜임이 매력적인 모던 집업 니트입니다.', 4.7, 79, false, true, 45, '2026-05-15T00:00:00Z'),

-- Bottom (7개)
('prod-3', '와이드 턱 원단 셀비지 데님 팬츠', 'HANPLA DENIM', 'bottom', 119000, 139000, 14, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop'], '14oz 프리미엄 일본 셀비지 데님 원단을 사용한 와이드 턱 팬츠입니다.', 4.7, 67, true, false, 30, '2026-07-28T00:00:00Z'),
('prod-19', '원턱 핀스트라이프 와이드 슬랙스', 'HANPLA STUDIO', 'bottom', 89000, 109000, 18, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop'], '체형을 커버하고 길어 보이는 와이드 드레이프 핏의 프리미엄 슬랙스입니다.', 4.9, 134, true, true, 65, '2026-07-18T00:00:00Z'),
('prod-20', '딥 블랙 워싱 테이퍼드 데님', 'HANPLA DENIM', 'bottom', 98000, 119000, 17, 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=800&auto=format&fit=crop'], '깔끔하게 떨어지는 슬림 테이퍼드 핏의 데일리 블랙 진입니다.', 4.8, 105, false, true, 50, '2026-06-05T00:00:00Z'),
('prod-21', '파라슈트 유틸리티 카고 팬츠', 'URBAN HANPLA', 'bottom', 95000, 115000, 17, 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=800&auto=format&fit=crop'], '밑단 스트링 조절로 조거와 카고 스타일을 자유롭게 넘나드는 파라슈트 팬츠입니다.', 4.9, 189, true, true, 80, '2026-07-12T00:00:00Z'),
('prod-22', '클래식 워시드 치노 팬츠', 'HANPLA ESSENTIAL', 'bottom', 75000, 89000, 15, 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800&auto=format&fit=crop'], '내추럴 가먼트 다잉 워싱으로 매력적인 색감을 지닌 스트레이트 치노 팬츠입니다.', 4.7, 76, false, false, 45, '2026-05-22T00:00:00Z'),
('prod-23', '스웨트 조거 팬츠 라운지웨어', 'HANPLA ATHLETIC', 'bottom', 59000, 69000, 14, 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=800&auto=format&fit=crop'], '편안한 착용감과 덤블 워싱 코튼 원단으로 부드러운 스웨트 조거 팬츠입니다.', 4.8, 142, false, true, 95, '2026-04-18T00:00:00Z'),
('prod-24', '버뮤다 와이드 데님 쇼츠', 'MINIMAL HANPLA', 'bottom', 68000, 82000, 17, 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop'], '무릎 아래로 떨어지는 트렌디한 버뮤다 실루엣의 와이드 하프 팬츠입니다.', 4.6, 58, true, false, 40, '2026-07-02T00:00:00Z'),

-- Shoes (7개)
('prod-4', '스웨이드 첼시 더비 슈즈', 'ATELIER HANPLA', 'shoes', 189000, 220000, 14, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop'], '천연 이태리 카우 스웨이드 레더와 쿠셔닝 인솔을 결합한 더비 슈즈입니다.', 4.9, 42, false, true, 20, '2026-05-10T00:00:00Z'),
('prod-25', '클래식 레더 카프스킨 로퍼', 'ATELIER HANPLA', 'shoes', 198000, 238000, 16, 'https://images.unsplash.com/photo-1560343776-97c7d202ff0e?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1560343776-97c7d202ff0e?q=80&w=800&auto=format&fit=crop'], '정교한 페니 디테일과 고급 카프스킨 소재의 클래식 로퍼입니다.', 4.8, 64, true, true, 30, '2026-07-14T00:00:00Z'),
('prod-26', '어반 미니멀 스웨이드 스니커즈', 'URBAN HANPLA', 'shoes', 139000, 169000, 17, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop'], '내추럴 고무 아웃솔과 스웨이드 매칭이 돋보이는 독일군 스타일 스니커즈입니다.', 4.9, 230, true, true, 110, '2026-07-21T00:00:00Z'),
('prod-27', '쿠셔닝 라이트 러닝 스니커즈', 'HANPLA ATHLETIC', 'shoes', 125000, 149000, 16, 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop'], '초경량 폼 소재 적용으로 장시간 착용에도 가벼운 러닝 슈즈입니다.', 4.8, 115, false, true, 75, '2026-06-12T00:00:00Z'),
('prod-28', '천연소가죽 스퀘어토 첼시 부츠', 'ATELIER HANPLA', 'shoes', 239000, 279000, 14, 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop'], '샤프한 스퀘어토 디자인과 측면 신축 밴딩으로 스포티한 첼시 부츠입니다.', 4.9, 48, true, false, 25, '2026-07-29T00:00:00Z'),
('prod-29', '슬라이드 스웨이드 뮬 샌들', 'MINIMAL HANPLA', 'shoes', 89000, 109000, 18, 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=800&auto=format&fit=crop'], '여름철 편안하고 감각적인 루즈 스타일을 살려주는 슬라이드 뮬입니다.', 4.6, 73, false, false, 40, '2026-05-08T00:00:00Z'),
('prod-30', '하이탑 캔버스 스트리트 슈즈', 'URBAN HANPLA', 'shoes', 79000, 95000, 16, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop'], '견고한 캔버스 원단과 빈티지 스티치 라인의 하이탑 스니커즈입니다.', 4.7, 98, false, true, 60, '2026-04-20T00:00:00Z'),

-- Acc (6개)
('prod-5', '최상급 실버 925 체인 넥클리스', 'HANPLA JEWELRY', 'acc', 79000, 99000, 20, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop'], '법정순은 Silver 925 소재로 제작되어 세련된 포인트를 주는 체인 목걸이입니다.', 4.6, 31, true, false, 50, '2026-07-01T00:00:00Z'),
('prod-31', '모던 미니멀 이태리 레더 벨트', 'HANPLA ARCHIVE', 'acc', 65000, 79000, 17, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop'], '새틴 버클 디테일과 이태리 풀그레인 소가죽으로 수공예 제작된 벨트입니다.', 4.9, 125, true, true, 80, '2026-07-16T00:00:00Z'),
('prod-32', '아날로그 드레스 가죽 워치', 'HANPLA STUDIO', 'acc', 169000, 199000, 15, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop'], '사파이어 글라스와 스위스 쿼츠 무브먼트를 탑재한 클래식 가죽 시계입니다.', 4.9, 88, true, true, 35, '2026-07-24T00:00:00Z'),
('prod-33', '워시드 워크웨어 코튼 볼캡', 'URBAN HANPLA', 'acc', 39000, 48000, 18, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop'], '자연스러운 빈티지 워싱과 깊은 스몰 바이저 핏의 코튼 볼캡 모자입니다.', 4.8, 195, false, true, 120, '2026-06-18T00:00:00Z'),
('prod-34', '아세테이트 아비에이터 선글라스', 'HANPLA ARCHIVE', 'acc', 119000, 149000, 20, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop'], 'UV400 렌즈와 핸드메이드 프리미엄 아세테이트 프레임 선글라스입니다.', 4.7, 52, true, false, 30, '2026-07-08T00:00:00Z'),
('prod-35', '레더 토트 백 & 크로스 스트랩', 'ATELIER HANPLA', 'acc', 219000, 259000, 15, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop'], '노트북 및 소지품 수납에 최적화된 고급 카우 레더 토트백입니다.', 4.9, 74, false, true, 40, '2026-05-25T00:00:00Z')
ON CONFLICT (id) DO UPDATE SET
name = EXCLUDED.name,
brand = EXCLUDED.brand,
category = EXCLUDED.category,
price = EXCLUDED.price,
original_price = EXCLUDED.original_price,
discount_rate = EXCLUDED.discount_rate,
image_url = EXCLUDED.image_url,
images = EXCLUDED.images,
description = EXCLUDED.description,
rating = EXCLUDED.rating,
review_count = EXCLUDED.review_count,
is_new = EXCLUDED.is_new,
is_best = EXCLUDED.is_best,
stock = EXCLUDED.stock;

-- 30종 상품 옵션 데이터
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
('prod-6', 'Charcoal', '#36454F', ARRAY['M', 'L', 'XL']),
('prod-7', 'Navy', '#000080', ARRAY['S', 'M', 'L', 'XL']),
('prod-7', 'Black', '#111111', ARRAY['M', 'L', 'XL']),
('prod-8', 'Beige', '#F5F5DC', ARRAY['S', 'M', 'L']),
('prod-8', 'Black', '#111111', ARRAY['M', 'L', 'XL']),
('prod-9', 'Black', '#111111', ARRAY['M', 'L']),
('prod-9', 'Brown', '#8B4513', ARRAY['M', 'L', 'XL']),
('prod-10', 'Deep Blue', '#00008B', ARRAY['S', 'M', 'L', 'XL']),
('prod-11', 'Charcoal', '#36454F', ARRAY['M', 'L', 'XL']),
('prod-11', 'Black', '#111111', ARRAY['S', 'M', 'L']),
('prod-12', 'Camel', '#C19A6B', ARRAY['M', 'L']),
('prod-12', 'Black', '#111111', ARRAY['M', 'L', 'XL']),
('prod-13', 'Charcoal', '#36454F', ARRAY['S', 'M', 'L', 'XL']),
('prod-13', 'Grey', '#808080', ARRAY['M', 'L', 'XL']),
('prod-14', 'Melange Grey', '#D3D3D3', ARRAY['S', 'M', 'L', 'XL']),
('prod-14', 'Navy', '#000080', ARRAY['M', 'L']),
('prod-15', 'White', '#FFFFFF', ARRAY['S', 'M', 'L', 'XL']),
('prod-15', 'Black', '#111111', ARRAY['S', 'M', 'L', 'XL']),
('prod-16', 'Black/White', '#111111', ARRAY['M', 'L', 'XL']),
('prod-17', 'White', '#FFFFFF', ARRAY['M', 'L', 'XL']),
('prod-17', 'Beige', '#D7C4B7', ARRAY['S', 'M', 'L']),
('prod-18', 'Ivory', '#FFFFF0', ARRAY['M', 'L', 'XL']),
('prod-18', 'Black', '#111111', ARRAY['M', 'L']),
('prod-19', 'Black', '#111111', ARRAY['S', 'M', 'L', 'XL']),
('prod-19', 'Charcoal', '#36454F', ARRAY['M', 'L']),
('prod-20', 'Black', '#111111', ARRAY['S', 'M', 'L', 'XL']),
('prod-21', 'Khaki', '#F0E68C', ARRAY['S', 'M', 'L', 'XL']),
('prod-21', 'Black', '#111111', ARRAY['M', 'L', 'XL']),
('prod-22', 'Beige', '#D7C4B7', ARRAY['S', 'M', 'L']),
('prod-22', 'Olive', '#808000', ARRAY['M', 'L', 'XL']),
('prod-23', 'Melange Grey', '#D3D3D3', ARRAY['S', 'M', 'L', 'XL']),
('prod-24', 'Indigo', '#4B0082', ARRAY['S', 'M', 'L']),
('prod-25', 'Black', '#111111', ARRAY['S', 'M', 'L', 'XL']),
('prod-25', 'Dark Brown', '#3D2314', ARRAY['M', 'L']),
('prod-26', 'White/Grey', '#FFFFFF', ARRAY['S', 'M', 'L', 'XL']),
('prod-27', 'Black', '#111111', ARRAY['S', 'M', 'L', 'XL']),
('prod-28', 'Black', '#111111', ARRAY['M', 'L', 'XL']),
('prod-29', 'Sand Beige', '#F4A460', ARRAY['S', 'M', 'L']),
('prod-30', 'Black', '#111111', ARRAY['S', 'M', 'L', 'XL']),
('prod-31', 'Black', '#111111', ARRAY['FREE']),
('prod-31', 'Dark Brown', '#3D2314', ARRAY['FREE']),
('prod-32', 'Black Leather', '#111111', ARRAY['FREE']),
('prod-33', 'Washed Black', '#222222', ARRAY['FREE']),
('prod-33', 'Beige', '#D7C4B7', ARRAY['FREE']),
('prod-34', 'Black Tint', '#111111', ARRAY['FREE']),
('prod-35', 'Black Leather', '#111111', ARRAY['FREE']);
