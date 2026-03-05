import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Crown, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { promoteUserByEmailSimple } from "@/lib/admin-simple";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminSetup = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const createFirstAdmin = async () => {
    if (!user?.email) {
      toast({
        title: "Error",
        description: "User email not found",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const result = await promoteUserByEmailSimple(user.email);
      
      if (result.success) {
        toast({
          title: "Admin Created",
          description: "You are now an administrator! Redirecting to dashboard...",
        });
        // Redirect to admin dashboard after a short delay
        setTimeout(() => {
          window.location.href = "/admin/dashboard";
        }, 1500);
      } else {
        toast({
          title: "Setup Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Setup Error",
        description: "Failed to create admin account",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  // If user is already admin, redirect to dashboard
  if (isAdmin) {
    navigate("/admin/dashboard");
    return null;
  }

  // If no user is logged in, redirect to login
  if (!user) {
    navigate("/admin/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Crown className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Setup</CardTitle>
            <CardDescription>
              Set up the first administrator for ThemeVault
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="w-6 h-6 text-primary mr-2" />
                  <span className="font-medium">Current User</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {user.email}
                </div>
                <div className="text-sm text-muted-foreground">
                  {user.user_metadata?.full_name || "No name set"}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">What this does:</h3>
                <ul className="text-sm text-muted-foreground space-y-1 text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Promotes your account to administrator
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Grants access to admin dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Allows managing products, orders, and users
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> This will make you an administrator. 
                  Only proceed if you are authorized to manage this marketplace.
                </p>
              </div>
            </div>

            <Button 
              onClick={createFirstAdmin}
              disabled={isCreating}
              className="w-full btn-primary"
            >
              <Crown className="w-4 h-4 mr-2" />
              {isCreating ? "Creating Admin..." : "Make Me Administrator"}
            </Button>

            <div className="text-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
                className="text-sm"
              >
                Cancel and go to homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSetup;
