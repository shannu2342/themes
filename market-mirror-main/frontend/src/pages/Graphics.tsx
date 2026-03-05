import { useState } from "react";
import { Search, Filter, Image as ImageIcon, Download, Star, Clock, Palette, Brush, Layers, PenTool } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { Loader2 } from "lucide-react";

const Graphics = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  // Get real categories from database
  const { data: categories } = useCategories();
  
  // Filter categories that are relevant to graphics assets
  const graphicsCategories = [
    { id: "all", name: "All Graphics", icon: ImageIcon },
    { id: "vectors", name: "Vector Graphics", icon: PenTool },
    { id: "illustrations", name: "Illustrations", icon: Brush },
    { id: "icons", name: "Icons", icon: Layers },
    { id: "patterns", name: "Patterns", icon: Palette },
  ];

  // Get real products from database
  const { data: products, isLoading } = useProducts({
    search: searchQuery,
    sortBy: sortBy as "newest" | "popular" | "price-asc" | "price-desc",
  });

  // Filter products for graphics category
  const filteredProducts = products?.filter(product => {
    return product.category?.name?.toLowerCase().includes('graphic') || 
           product.category?.name?.toLowerCase().includes('vector') ||
           product.category?.name?.toLowerCase().includes('illustration') ||
           product.category?.name?.toLowerCase().includes('icon') ||
           product.title?.toLowerCase().includes('graphic') ||
           product.title?.toLowerCase().includes('vector') ||
           product.title?.toLowerCase().includes('illustration') ||
           product.title?.toLowerCase().includes('icon') ||
           selectedCategory === "all";
  }) || [];

  const featuredProducts = filteredProducts?.filter(product => product.featured) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary/20 rounded-full">
                  <ImageIcon className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Premium <span className="text-primary">Graphics</span> Assets
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                High-quality vector graphics, illustrations, icons, and patterns for every creative project.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative mb-8">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search graphics, vectors, icons..."
                  className="pl-12 pr-4 py-3 text-lg h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    <category.icon className="h-4 w-4" />
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-8 bg-background border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{filteredProducts.length}+</div>
                <div className="text-sm text-muted-foreground">Graphics Assets</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">800+</div>
                <div className="text-sm text-muted-foreground">Graphic Designers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">300K+</div>
                <div className="text-sm text-muted-foreground">Downloads</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">4.8★</div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {selectedCategory === "all" && !searchQuery && featuredProducts.length > 0 && (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8">Featured Graphics Assets</h2>
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      title={product.title}
                      author={product.author}
                      category={product.category?.name}
                      categorySlug={product.category?.slug}
                      price={product.price}
                      rating={product.rating}
                      reviews={product.reviews_count}
                      sales={product.sales_count}
                      featured={product.featured}
                      image={product.images?.[0]}
                      livePreviewUrl={product.live_demo_url}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* All Products */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">
                {selectedCategory === "all" ? "All Graphics Assets" : graphicsCategories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No graphics assets found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    author={product.author}
                    category={product.category?.name}
                    categorySlug={product.category?.slug}
                    price={product.price}
                    rating={product.rating}
                    reviews={product.reviews_count}
                    sales={product.sales_count}
                    featured={product.featured}
                    image={product.images?.[0]}
                    livePreviewUrl={product.live_demo_url}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Start Selling Your Graphics
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of graphic designers earning passive income by selling their vectors and illustrations on ThemeVault.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Become a Seller
                <ImageIcon className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                View Guidelines
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Graphics;
