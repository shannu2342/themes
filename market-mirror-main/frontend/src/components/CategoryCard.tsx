import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  count?: string;
  featured?: boolean;
  image?: string;
}

const CategoryCard = ({
  title,
  description,
  icon: Icon,
  count,
  featured = false,
  image,
}: CategoryCardProps) => {
  return (
    <div
      className={`p-6 rounded-lg border-2 transition-all hover:shadow-lg cursor-pointer ${
        featured
          ? "border-accent bg-accent/5"
          : "border-transparent bg-category-bg hover:border-accent/30"
      }`}
    >
      <div className="text-center space-y-4">
        <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
          <Icon className="w-7 h-7 text-accent" />
        </div>
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
        {count && (
          <p className="text-xs text-muted-foreground">{count}</p>
        )}
        <div className="flex items-center justify-center gap-4">
          <a href="#" className="category-link">
            Newest
          </a>
          <a href="#" className="category-link">
            Bestsellers
          </a>
        </div>
      </div>

      {/* Preview Image */}
      <div className="mt-6 rounded-lg overflow-hidden shadow-md h-40">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="bg-gradient-to-br from-slate-100 to-slate-200 h-full flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Preview</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;
