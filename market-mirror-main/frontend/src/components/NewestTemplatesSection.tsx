import { useState } from "react";
import ProductCard from "./ProductCard";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const NewestTemplatesSection = () => {
  const [activeCategory, setActiveCategory] = useState("All categories");
  const { data: products, isLoading, error } = useProducts({ 
    limit: 8,
    sortBy: "newest"
  });
  const { data: categoriesData } = useCategories();

  // Create categories array with "All categories" + dynamic categories
  const categories = ["All categories", ...(categoriesData?.map(cat => cat.name) || [])];

  const filteredProducts = products?.filter(product => {
    if (activeCategory === "All categories") return true;
    return product.category?.name === activeCategory;
  });

  return (
    <section className="py-16 bg-category-bg">
      {/* Top Banner */}
      <div className="bg-highlight-blue py-3 mb-12">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <span className="text-foreground font-medium">
            AI tools + unlimited creative stock assets. All in one subscription.
          </span>
          <button className="bg-foreground text-background px-5 py-2 rounded font-semibold text-sm hover:bg-foreground/90 transition-colors">
            Start now
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="section-title mb-4">Check out our newest themes and templates</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            We carefully review new entries from our community one by one to make sure they meet
            high-quality design and functionality standards. From multipurpose themes to niche
            templates, you'll always find something that catches your eye.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`category-pill ${
                activeCategory === category
                  ? "category-pill-active"
                  : "category-pill-inactive"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/4" />
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center text-muted-foreground">
              Error loading newest products
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                id={product.id}
                title={product.title}
                author={product.author || "Unknown"}
                category={product.category?.name || "Uncategorized"}
                price={product.price}
                sales={product.sales_count || 0}
                rating={product.rating || undefined}
                reviews={product.reviews_count || undefined}
                image={product.images?.[0] ? product.images[0] : undefined}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground">
              No products found in this category
            </div>
          )}
        </div>

        {/* Load More */}
        <div className="text-center mt-10">
          <Link to="/products" className="btn-outline">
            Load more templates
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewestTemplatesSection;
