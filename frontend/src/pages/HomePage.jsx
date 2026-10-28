import HeroSection from "../components/home/HeroSection";
import CategoryChips from "../components/home/CategoryChips";
import FeaturedRestaurants from "../components/home/FeaturedRestaurants";
import HowItWorks from "../components/home/HowItWorks";
import StatsBanner from "../components/home/StatsBanner";
import PartnerCTA from "../components/home/PartnerCTA";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoryChips />
      <FeaturedRestaurants />
      <HowItWorks />
      <StatsBanner />
      <PartnerCTA />
    </div>
  );
}