import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getApiBaseUrl } from "@/lib/api";

const Cancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cancelled = searchParams.get('cancelled') === 'true';
  const sessionId = searchParams.get('session_id');
  const { toast } = useToast();
  const backendBaseUrl = getApiBaseUrl();

  useEffect(() => {
    // Log cancellation for analytics
    console.log('Payment cancelled by user');

    if (!sessionId) return;

    (async () => {
      try {
        const response = await fetch(`${backendBaseUrl}/api/mark-order-cancelled`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_id: sessionId }),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result?.error || 'Failed to mark order cancelled');
        }

        if (result.success) {
          toast({
            title: 'Order Cancelled',
            description: 'Your order was cancelled and saved in your order history.',
          });
        }
      } catch (error: any) {
        console.error('Cancel handling error:', error);
      }
    })();
  }, [sessionId, backendBaseUrl, toast]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto text-center">
          {/* Cancel Icon */}
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Payment Cancelled
          </h1>

          {/* Description */}
          <p className="text-muted-foreground mb-8">
            {cancelled 
              ? "Your payment has been cancelled. No charges were made to your account."
              : "You've cancelled the payment process. You can try again whenever you're ready."
            }
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/checkout')}
              className="w-full"
              size="lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/products')}
              className="w-full"
              size="lg"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Why was my payment cancelled?
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 text-left space-y-1">
              <li>• You clicked the "Cancel" button during payment</li>
              <li>• You closed the payment window</li>
              <li>• Your browser was refreshed or navigated away</li>
              <li>• Payment was declined by your bank</li>
            </ul>
          </div>

          {/* Security Note */}
          <div className="mt-6 text-xs text-muted-foreground">
            <p>🔒 Your payment information is secure. No charges were made.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cancel;
