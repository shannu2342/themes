import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ExternalLink, Star, Check, Loader2 } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id || "");
  const { addToCart, isInCart } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
          <Link to="/products" className="text-primary hover:underline">
            Back to products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const inCart = isInCart(product.id);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <Link to="/products" className="text-muted-foreground hover:text-foreground">Products</Link>
          {product.category && (
            <>
              <span className="mx-2 text-muted-foreground">/</span>
              <Link
                to={`/products?category=${product.category.slug}`}
                className="text-muted-foreground hover:text-foreground"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="text-foreground">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                  <span className="text-white font-medium text-2xl">{product.title.split(" ")[0]}</span>
                </div>
              )}
            </div>
            
            {/* Thumbnail gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <div key={i} className="w-20 h-14 flex-shrink-0 rounded overflow-hidden border border-border">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.featured && (
                <Badge className="mb-2 bg-primary text-primary-foreground">Featured</Badge>
              )}
              <h1 className="text-3xl font-bold text-foreground">{product.title}</h1>
              <p className="text-muted-foreground mt-2">
                by <span className="text-link-blue">{product.author}</span> in{" "}
                <Link to={`/products?category=${product.category?.slug}`} className="text-link-blue hover:underline">
                  {product.category?.name || "Uncategorized"}
                </Link>
              </p>
            </div>

            {/* Rating & Sales */}
            <div className="flex items-center gap-4">
              {product.rating && product.rating > 0 && (
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating!) ? "fill-star-gold text-star-gold" : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">
                    ({product.reviews_count} reviews)
                  </span>
                </div>
              )}
              <span className="text-sm text-muted-foreground">
                {(product.sales_count || 0).toLocaleString()} Sales
              </span>
            </div>

            {/* Price */}
            <div className="text-4xl font-bold text-foreground">${product.price}</div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                onClick={() => addToCart(product.id)}
                disabled={inCart}
                className="flex-1"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {inCart ? "In Cart" : "Add to Cart"}
              </Button>
              
              {product.live_demo_url && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.open(product.live_demo_url!, "_blank")}
                  className="flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live Demo
                </Button>
              )}
            </div>

            {/* Description */}
            <div className="border-t border-border pt-6">
              <h3 className="font-semibold text-foreground mb-3">Description</h3>
              <p className="text-muted-foreground whitespace-pre-line">
                {product.description || "No description available."}
              </p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-3">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Compatibility */}
            {product.compatibility && product.compatibility.length > 0 && (
              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-3">Compatibility</h3>
                <div className="flex flex-wrap gap-2">
                  {product.compatibility.map((item, i) => (
                    <Badge key={i} variant="secondary">{item}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;
