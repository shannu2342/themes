import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPatch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdminOrder {
  id: string;
  billing_name?: string;
  billing_email?: string;
  total_price: number;
  payment_status: string;
  created_at: string;
  order_items?: Array<{ id: string }>;
}

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => apiGet<AdminOrder[]>("/api/admin/orders"),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) =>
      apiPatch(`/api/admin/orders/${orderId}/status`, { payment_status: status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast({ title: "Order updated" });
    },
    onError: (error: any) => {
      toast({ title: "Update failed", description: error?.message || "Failed to update order", variant: "destructive" });
    },
  });

  if (isLoading) return <div className="text-muted-foreground">Loading orders...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {!orders?.length ? (
            <p className="text-muted-foreground">No orders found.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="font-medium">Order #{String(order.id).slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{order.billing_name || order.billing_email || "Unknown customer"}</p>
                    <p className="text-sm">Items: {order.order_items?.length || 0}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold">${Number(order.total_price || 0).toFixed(2)}</p>
                    <Select
                      value={order.payment_status || "pending"}
                      onValueChange={(value) => updateStatusMutation.mutate({ orderId: order.id, status: value })}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;
