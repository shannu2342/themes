import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, ExternalLink, Calendar, FileText, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiDelete, apiGet } from "@/lib/api";

interface PurchasedProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  file_url?: string;
  file_name?: string;
  purchase_date: string;
  order_id: string;
  images?: string[];
}

const DownloadsSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [purchasedProducts, setPurchasedProducts] = useState<PurchasedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPurchasedProducts();
    } else {
      setIsLoading(false);
      setPurchasedProducts([]);
    }
  }, [user?.id]);

  const fetchPurchasedProducts = async () => {
    try {
      const purchases = await apiGet<PurchasedProduct[]>("/api/purchased-products");
      setPurchasedProducts(purchases || []);
    } catch (error) {
      console.error("Error fetching purchased products:", error);
      toast({
        title: "Error",
        description: "Failed to load your purchased products.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePurchase = async (product: PurchasedProduct) => {
    try {
      if (!window.confirm(`Are you sure you want to delete \"${product.title}\" from your purchases?`)) return;
      await apiDelete(`/api/purchases/${product.id}?order_id=${encodeURIComponent(product.order_id)}`);
      await fetchPurchasedProducts();
      toast({ title: "Purchase Deleted", description: `\"${product.title}\" has been removed from your purchases.` });
    } catch (error) {
      console.error("Delete purchase error:", error);
      toast({ title: "Delete Failed", description: "Failed to delete the purchase. Please try again.", variant: "destructive" });
    }
  };

  const handleDownload = async (product: PurchasedProduct) => {
    try {
      if (!product.file_url) {
        toast({ title: "Download Unavailable", description: "This product doesn't have a downloadable file yet.", variant: "destructive" });
        return;
      }
      const link = document.createElement("a");
      link.href = product.file_url;
      link.download = product.file_name || `${product.title}.zip`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: "Download Started", description: `Downloading ${product.title}...` });
    } catch (error) {
      console.error("Download error:", error);
      toast({ title: "Download Failed", description: "Failed to download the file. Please try again.", variant: "destructive" });
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">My Downloads</h2>
        <div className="grid gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                  <div className="h-10 bg-muted rounded w-24"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (purchasedProducts.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">My Downloads</h2>
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Purchased Products</h3>
            <p className="text-muted-foreground mb-6">You haven't purchased any products yet. Browse our marketplace to find digital products.</p>
            <Button onClick={() => (window.location.href = "/products")}>Browse Products</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Downloads</h2>
        <div className="text-sm text-muted-foreground">
          {purchasedProducts.length} product{purchasedProducts.length !== 1 ? "s" : ""} purchased
        </div>
      </div>

      <div className="grid gap-4">
        {purchasedProducts.map((product) => (
          <Card key={`${product.id}-${product.order_id}`} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1 truncate">{product.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Purchased {formatDate(product.purchase_date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Order #{product.order_id?.slice?.(-8) || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button onClick={() => handleDownload(product)} className="whitespace-nowrap">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  {product.file_url && (
                    <Button variant="outline" size="sm" onClick={() => window.open(product.file_url, "_blank")}>
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                  )}
                  <Button variant="destructive" size="sm" onClick={() => handleDeletePurchase(product)} className="whitespace-nowrap">
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DownloadsSection;
