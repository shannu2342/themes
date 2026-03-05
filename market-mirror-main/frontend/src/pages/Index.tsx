import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import UniqueBudgetSection from "@/components/UniqueBudgetSection";
import FeaturedThemesSection from "@/components/FeaturedThemesSection";
import AIToolsSection from "@/components/AIToolsSection";
import NewestTemplatesSection from "@/components/NewestTemplatesSection";
import FeaturedCreatorSection from "@/components/FeaturedCreatorSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
        <UniqueBudgetSection />
        <FeaturedThemesSection />
        <AIToolsSection />
        <NewestTemplatesSection />
        <FeaturedCreatorSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
