import { Package, ShoppingCart, Search, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  type?: "products" | "cart" | "search" | "orders" | "general";
  message?: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

const EmptyState = ({ 
  type = "general", 
  message, 
  description, 
  action,
  className 
}: EmptyStateProps) => {
  const getIcon = () => {
    switch (type) {
      case "products":
        return <Package className="w-12 h-12" />;
      case "cart":
        return <ShoppingCart className="w-12 h-12" />;
      case "search":
        return <Search className="w-12 h-12" />;
      case "orders":
        return <FileText className="w-12 h-12" />;
      default:
        return <Package className="w-12 h-12" />;
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case "products":
        return "No products found";
      case "cart":
        return "Your cart is empty";
      case "search":
        return "No results found";
      case "orders":
        return "No orders yet";
      default:
        return "Nothing here";
    }
  };

  const getDefaultDescription = () => {
    switch (type) {
      case "products":
        return "Check back later for new products or try adjusting your filters.";
      case "cart":
        return "Add some products to your cart to see them here.";
      case "search":
        return "Try searching with different keywords or browse our categories.";
      case "orders":
        return "Once you place an order, it will appear here.";
      default:
        return "There's nothing to show at the moment.";
    }
  };

  const getDefaultAction = () => {
    switch (type) {
      case "products":
        return { label: "Browse Products", href: "/products" };
      case "cart":
        return { label: "Start Shopping", href: "/products" };
      case "search":
        return { label: "Clear Search", href: "/products" };
      case "orders":
        return { label: "Browse Products", href: "/products" };
      default:
        return null;
    }
  };

  const icon = getIcon();
  const title = message || getDefaultMessage();
  const desc = description || getDefaultDescription();
  const defaultAction = getDefaultAction();
  const finalAction = action || defaultAction;

  return (
    <div className={cn("text-center py-12 px-4", className)}>
      <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">{desc}</p>
      {finalAction && (
        <div className="space-y-2">
          {finalAction.href ? (
            <Link to={finalAction.href}>
              <Button className="btn-primary">
                {finalAction.label}
              </Button>
            </Link>
          ) : (
            <Button onClick={finalAction.onClick} className="btn-primary">
              {finalAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
