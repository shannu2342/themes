import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { usePurchasedProducts, useOrders } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Package, ShoppingBag, Loader2, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import DownloadsSection from "@/components/dashboard/DownloadsSection";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { data: purchasedProducts, isLoading: productsLoading } = usePurchasedProducts();
  const { data: orders, isLoading: ordersLoading } = useOrders();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Please sign in</h1>
          <p className="text-muted-foreground mb-6">You need to sign in to view your dashboard.</p>
          <Link to="/auth">
            <Button>Sign In</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isLoading = productsLoading || ordersLoading;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="outline" onClick={signOut} className="mt-4 md:mt-0">
            Sign Out
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Downloads Section - New */}
            <DownloadsSection />

            {/* Order History */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Order History</h2>
              </div>

              {orders?.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-8 text-center">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">No orders yet</p>
                  <Link to="/products">
                    <Button variant="outline">Browse Products</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders?.map((order) => (
                    <div
                      key={order.id}
                      className="bg-card border border-border rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={order.payment_status === 'completed' ? 'default' : 'secondary'}>
                            {order.payment_status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Order #{order.id.slice(-8)}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(order.created_at), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">${order.total_price?.toFixed(2)}</span>
                        <Link to={`/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
