import { Search } from "lucide-react";
import heroCollage from "@/assets/hero-themes-collage.jpg";
import { useStats } from "@/hooks/useStats";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const { data: stats, isLoading } = useStats();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("search") as string;
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <section className="bg-background py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Professional Themes & Templates for any project
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover thousands of easy to customize themes, templates & CMS products, made by
              world-class developers. Get started with beautiful, responsive designs today.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex max-w-xl">
              <input
                type="text"
                name="search"
                placeholder="e.g. responsive WordPress"
                className="search-input flex-1"
              />
              <button type="submit" className="btn-primary flex items-center gap-2 rounded-l-none">
                <Search className="w-5 h-5" />
                Search
              </button>
            </form>

            {/* Dynamic Stats */}
            <div className="flex items-center gap-8 pt-4">
              {isLoading ? (
                <>
                  <div>
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div>
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div>
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </>
              ) : stats ? (
                <>
                  <div>
                    <span className="text-2xl font-bold text-foreground">
                      {stats.productsCount.toLocaleString()}+
                    </span>
                    <p className="text-sm text-muted-foreground">Items Available</p>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-foreground">
                      {stats.downloads.toLocaleString()}+
                    </span>
                    <p className="text-sm text-muted-foreground">Downloads</p>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-foreground">
                      {stats.creators.toLocaleString()}+
                    </span>
                    <p className="text-sm text-muted-foreground">Creators</p>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* Right Content - Theme Previews */}
          <div className="hidden lg:block">
            <img
              src={heroCollage}
              alt="Collection of professional website themes and templates"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
