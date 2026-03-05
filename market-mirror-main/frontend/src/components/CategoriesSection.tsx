import { Monitor, ShoppingCart, FileCode, Mail, Layout, Pencil } from "lucide-react";
import CategoryCard from "./CategoryCard";
import { useCategories } from "@/hooks/useProducts";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap = {
  "WordPress Themes": Monitor,
  "eCommerce Templates": ShoppingCart,
  "Site Templates": FileCode,
  "Marketing Templates": Mail,
  "CMS Templates": Layout,
  "Blogging": Pencil,
};

const CategoriesSection = () => {
  const { data: categories, isLoading, error } = useCategories();

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center text-muted-foreground">
              Error loading categories
            </div>
          ) : categories && categories.length > 0 ? (
            categories.slice(0, 6).map((category) => {
              const IconComponent = iconMap[category.name as keyof typeof iconMap] || Monitor;
              return (
                <CategoryCard
                  key={category.id}
                  title={category.name}
                  description={category.description || `${category.name} templates and themes`}
                  icon={IconComponent}
                  count={category.item_count ? `${category.item_count}+ items` : "0 items"}
                  image={category.icon || undefined}
                />
              );
            })
          ) : (
            <div className="col-span-full text-center text-muted-foreground">
              No categories available
            </div>
          )}
        </div>

        <div className="text-center mt-10">
          <Link to="/products" className="btn-primary">
            View all categories
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
