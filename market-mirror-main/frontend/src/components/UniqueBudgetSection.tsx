import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const UniqueBudgetSection = () => {
  const { data: products, isLoading, error } = useProducts({ 
    limit: 4,
    sortBy: "popular"
  });

  return (
    <section className="py-16 bg-category-bg">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Preview Grid */}
          <div className="grid grid-cols-2 gap-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))
            ) : error ? (
              <div className="col-span-2 text-center text-muted-foreground">
                Error loading products
              </div>
            ) : products && products.length > 0 ? (
              products.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="rounded-lg overflow-hidden h-48 relative group shadow-lg hover:shadow-xl transition-shadow"
                >
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                      <span className="text-white font-medium">{product.title.split(" ")[0]}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <span className="text-primary-foreground text-xs font-medium opacity-80">
                      {product.category?.name || "Premium Theme"}
                    </span>
                    <h3 className="text-primary-foreground text-xl font-bold line-clamp-2">{product.title}</h3>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-2 text-center text-muted-foreground">
                No products available at the moment.
              </div>
            )}
          </div>

          {/* Right - Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Unique themes and templates for every budget and every project.
            </h2>
            <p className="text-muted-foreground text-lg">
              From $12 starter templates to premium $59 enterprise solutions, we have options 
              for freelancers, startups, and Fortune 500 companies alike. Every theme includes 
              lifetime updates and 6 months of support.
            </p>
            <div className="flex gap-4">
              <button className="btn-primary">View all themes</button>
              <button className="btn-outline">Browse categories</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UniqueBudgetSection;
