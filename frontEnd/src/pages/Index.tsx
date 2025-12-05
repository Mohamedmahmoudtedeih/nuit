import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import StarListings from '@/components/home/StarListings';
import CarForSaleListings from '@/components/home/CarForSaleListings';
import CarForRentListings from '@/components/home/CarForRentListings';
import PropertyForSaleListings from '@/components/home/PropertyForSaleListings';
import PropertyForRentListings from '@/components/home/PropertyForRentListings';
import AllListings from '@/components/home/AllListings';
import CTASection from '@/components/home/CTASection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <StarListings />
        <CarForSaleListings />
        <CarForRentListings />
        <PropertyForSaleListings />
        <PropertyForRentListings />
        <AllListings />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
