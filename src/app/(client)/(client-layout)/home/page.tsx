import { HeroBanner } from "./_components/HeroBanner";
import { PopularCategories } from "./_components/PopularCategories";
import { PopularRestaurants } from "./_components/PopularRestaurants";
// import { JoinUs } from "./_components/JoinUs";
import { Stats } from "./_components/Stats";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroBanner />

      <PopularCategories />

      <PopularRestaurants />

      {/* <JoinUs /> */}

      <Stats />
    </div>
  );
}
