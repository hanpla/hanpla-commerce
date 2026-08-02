import CategoryNav from "@/components/home/category-nav";
import FeaturedProducts from "@/components/home/featured-products";
import HeroCarousel from "@/components/home/hero-carousel";

const HomePage = () => {
  return (
    <div className="flex flex-col gap-4">
      <HeroCarousel />
      <CategoryNav />
      <FeaturedProducts />
    </div>
  );
};

export default HomePage;
