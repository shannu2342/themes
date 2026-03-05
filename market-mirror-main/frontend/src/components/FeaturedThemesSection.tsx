import ProductCard from "./ProductCard";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedThemesSection = () => {
  const { data: products, isLoading, error } = useFeaturedProducts(4);

  return (
    <section className="py-16 bg-category-bg">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 h-full flex flex-col justify-center">
              <h2 className="section-title mb-4">Featured themes</h2>
              <p className="text-muted-foreground mb-6">
                Every week, our staff personally hand-pick some of the best new website themes from
                our collection. Curated for quality & design excellence.
              </p>
              <Link to="/products?featured=true" className="btn-primary w-fit">
                View all featured themes
              </Link>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3 grid md:grid-cols-2 gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/4" />
                </div>
              ))
            ) : error ? (
              <div className="col-span-2 text-center text-muted-foreground">
                Error loading featured products
              </div>
            ) : products && products.length > 0 ? (
              products.map((product) => (
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
              <div className="col-span-2 text-center text-muted-foreground">
                No featured products available
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedThemesSection;
