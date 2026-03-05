import { Link } from "react-router-dom";
import { ShoppingCart, Star, CheckCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { usePurchaseStatus } from "@/hooks/usePurchaseStatus";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: string;
  title: string;
  author: string;
  category: string;
  categorySlug?: string;
  price: number;
  rating?: number;
  reviews?: number;
  sales: number;
  featured?: boolean;
  image?: string;
  livePreviewUrl?: string;
}

const ProductCard = ({
  id,
  title,
  author,
  category,
  categorySlug,
  price,
  rating,
  reviews,
  sales,
  featured = false,
  image,
  livePreviewUrl,
}: ProductCardProps) => {
  const { addToCart, isInCart } = useCart();
  const { isPurchased, isLoading: purchaseLoading } = usePurchaseStatus(id);
  const inCart = isInCart(id);

  return (
    <div className="product-card group">
      {/* Image */}
      <Link to={`/product/${id}`} className="block relative overflow-hidden rounded-xl">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="bg-gradient-to-br from-slate-600 to-slate-800 h-48 flex items-center justify-center">
            <span className="text-primary-foreground font-medium">{title.split(" ")[0]}</span>
          </div>
        )}
        {featured && (
          <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-lg">
            FEATURED
          </span>
        )}
        {isPurchased && (
          <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            PURCHASED
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 space-y-3">
        <Link to={`/product/${id}`}>
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground">
          by <span className="font-medium">{author}</span>
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-xs bg-muted px-2 py-1 rounded">{category}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">${price}</span>
          </div>
        </div>

        {rating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({reviews})</span>
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-1">{sales.toLocaleString()} Sales</p>
      </div>

      <div className="flex items-center gap-2 p-4 pt-0">
        {isPurchased ? (
          <Button 
            disabled 
            className="flex-1 bg-primary hover:bg-primary/90 text-white"
            size="sm"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Already Purchased
          </Button>
        ) : (
          <>
            <button 
              onClick={() => addToCart(id)}
              disabled={inCart || purchaseLoading}
              className="p-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
              title={inCart ? "Already in cart" : "Add to cart"}
            >
              <ShoppingCart className="w-4 h-4 text-muted-foreground" />
            </button>
            {livePreviewUrl ? (
              <a
                href={livePreviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary-modern text-sm flex-1 text-center"
              >
                Live Preview
              </a>
            ) : (
              <Link to={`/product/${id}`} className="btn-secondary-modern text-sm flex-1 text-center">
                View Details
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
