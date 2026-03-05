import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { getApiBaseUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, ArrowRight, Home, Clock } from "lucide-react";

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [hasClearedCart, setHasClearedCart] = useState(false);
  const { user } = useAuth();
  const { clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const backendBaseUrl = getApiBaseUrl();

  useEffect(() => {
    if (!sessionId) {
      setIsLoading(false);
      return;
    }

    verifyPayment();
  }, [sessionId]);

  useEffect(() => {
    // Auto-redirect countdown after order is created
    if (!isLoading && order) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/dashboard');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLoading, order, navigate]);

  useEffect(() => {
    if (!order || !user || hasClearedCart) return;

    (async () => {
      await clearCart();
      setHasClearedCart(true);
    })();
  }, [order, user, hasClearedCart, clearCart]);

  const verifyPayment = async () => {
    try {
      // Call backend to verify payment and create purchase records
      const response = await fetch(`${backendBaseUrl}/api/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setOrder({
          id: result.order_id,
          status: 'completed',
          total: 0, // Will be updated from order details
          session_id: sessionId,
          products_count: result.products_count,
          created_at: new Date().toISOString()
        });
        
        // Clear the cart after successful payment verification
        if (user) {
          await clearCart();
          console.log('🛒 Cart cleared from frontend after successful payment');
          setHasClearedCart(true);
        }
        
        toast({
          title: "Payment Successful! 🎉",
          description: `Your order has been completed. ${result.products_count} product${result.products_count > 1 ? 's' : ''} added to your dashboard.`,
        });
      } else {
        throw new Error(result.error || 'Payment verification failed');
      }
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      toast({
        title: "Payment Verification Failed",
        description: error.message || "There was an issue verifying your payment. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const skipToDashboard = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Processing your order...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Payment Successful! 🎉</h1>
            <p className="text-muted-foreground">Thank you for your purchase. Your order has been completed.</p>
          </div>

          {/* Auto-redirect countdown */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-700 dark:text-blue-300 font-medium">
                Redirecting to dashboard in {countdown} seconds...
              </span>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
              You'll be able to download your purchased products from your dashboard.
            </p>
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / 5) * 100}%` }}
              ></div>
            </div>
            <Button 
              onClick={skipToDashboard}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Go to Dashboard Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {order && (
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Order Details</h2>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono text-sm">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="text-primary font-medium">{order.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Session ID:</span>
                  <span className="font-mono text-xs">{order.session_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-bold">${order.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-2">
              <Download className="w-5 h-5" />
              <span className="font-medium">Download Ready</span>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Your purchased files are now available in your dashboard for immediate download.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate('/products')}>
              <Home className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
            <Button onClick={skipToDashboard}>
              View Downloads
              <Download className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Success;
