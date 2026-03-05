import ProductCard from "./ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const FeaturedCreatorSection = () => {
  const { data: products, isLoading, error } = useProducts({ 
    limit: 3,
    sortBy: "popular",
    featured: true
  });

  return (
    <section className="py-16 bg-background">
      {/* Top Banner */}
      <div className="bg-highlight-blue py-3 mb-12">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <span className="text-foreground font-medium">
            Featured products from our top creators
          </span>
          <Link to="/products?featured=true" className="btn-primary w-fit">
            View all featured products
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">Featured Creator Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover premium products from our most talented creators. Hand-picked for quality, 
            design excellence, and outstanding user experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/4" />
              </div>
            ))
          ) : error ? (
            <div className="col-span-3 text-center text-muted-foreground">
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
                rating={product.rating || 0}
                reviews={0} // Using default since reviews field doesn't exist
                sales={0} // Using default since sales field doesn't exist
                featured={product.featured}
                image={product.images?.[0]}
                livePreviewUrl={undefined} // Using undefined since field doesn't exist
              />
            ))
          ) : (
            <div className="col-span-3 text-center text-muted-foreground">
              No featured products available at the moment.
            </div>
          )}
        </div>

        {products && products.length > 0 && (
          <div className="text-center mt-12">
            <Link to="/products?featured=true" className="btn-primary">
              View All Featured Products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCreatorSection;
