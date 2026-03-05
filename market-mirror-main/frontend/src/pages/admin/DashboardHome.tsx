import { useQuery } from "@tanstack/react-query";
import { Package, Users, ShoppingBag, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiGet } from "@/lib/api";

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalCategories: number;
  recentOrders: any[];
  totalRevenue: number;
}

const DashboardHome = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => apiGet<DashboardStats>("/api/admin/stats"),
  });

  const statCards = [
    { title: "Total Products", value: stats?.totalProducts || 0, description: "Active products in store", icon: Package, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Total Users", value: stats?.totalUsers || 0, description: "Registered users", icon: Users, color: "text-primary", bgColor: "bg-blue-50" },
    { title: "Total Orders", value: stats?.totalOrders || 0, description: "Orders placed", icon: ShoppingBag, color: "text-purple-600", bgColor: "bg-purple-50" },
    { title: "Total Revenue", value: `$${(stats?.totalRevenue || 0).toFixed(2)}`, description: "Total sales revenue", icon: DollarSign, color: "text-orange-600", bgColor: "bg-orange-50" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2"><div className="h-4 bg-muted rounded w-3/4"></div></CardHeader>
              <CardContent><div className="h-8 bg-muted rounded w-1/2 mb-2"></div><div className="h-3 bg-muted rounded w-full"></div></CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the ThemeVault admin dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}><Icon className={`w-4 h-4 ${stat.color}`} /></div>
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{stat.value}</div><p className="text-xs text-muted-foreground">{stat.description}</p></CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShoppingBag className="w-5 h-5" />Recent Orders</CardTitle>
          <CardDescription>Latest orders placed by customers</CardDescription>
        </CardHeader>
        <CardContent>
          {stats?.recentOrders?.length ? (
            <div className="space-y-4">
              {stats.recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Order #{String(order.id).slice(0, 8)}</span>
                      <span className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{order.billing_name || order.billing_email || "Unknown customer"}</div>
                    <div className="text-sm">{order.order_items?.length || 0} items</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${Number(order.total_price || 0).toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.order_items?.[0]?.products?.title}
                      {order.order_items?.length > 1 && ` +${order.order_items.length - 1} more`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No orders yet</div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow"><CardHeader><CardTitle className="flex items-center gap-2"><Package className="w-5 h-5" />Add New Product</CardTitle><CardDescription>Create a new product listing</CardDescription></CardHeader></Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow"><CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />Manage Users</CardTitle><CardDescription>View and manage user accounts</CardDescription></CardHeader></Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow"><CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5" />View Analytics</CardTitle><CardDescription>See detailed sales analytics</CardDescription></CardHeader></Card>
      </div>
    </div>
  );
};

export default DashboardHome;
