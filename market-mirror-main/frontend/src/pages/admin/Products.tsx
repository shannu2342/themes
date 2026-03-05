import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Eye, EyeOff, Search, MoreHorizontal } from "lucide-react";
import { apiDelete, apiGet, apiPatch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import ProductForm from "@/components/admin/ProductForm";

const ProductsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["admin-products", searchTerm, showInactive],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      params.set("showInactive", String(showInactive));
      return apiGet<any[]>(`/api/admin/products?${params.toString()}`);
    },
  });

  const toggleProductStatus = useMutation({
    mutationFn: async ({ productId, isActive }: { productId: string; isActive: boolean }) =>
      apiPatch(`/api/admin/products/${productId}/status`, { is_active: !isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: "Product Updated", description: "Product status has been updated successfully" });
    },
    onError: () => toast({ title: "Error", description: "Failed to update product status", variant: "destructive" }),
  });

  const deleteProduct = useMutation({
    mutationFn: async (productId: string) => apiDelete(`/api/admin/products/${productId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: "Product Deleted", description: "Product has been deleted successfully" });
    },
    onError: (error: any) => toast({ title: "Error", description: `Failed to delete product: ${error?.message || "Unknown error"}`, variant: "destructive" }),
  });

  if (showAddForm) {
    return <ProductForm product={editingProduct} onSuccess={() => { setShowAddForm(false); setEditingProduct(null); }} onCancel={() => { setShowAddForm(false); setEditingProduct(null); }} />;
  }

  if (isLoading) return <div className="flex items-center justify-center h-64"><LoadingState message="Loading products..." size="lg" /></div>;
  if (error) return <div className="text-center text-destructive">Error loading products: {(error as Error).message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products Management</h1>
          <p className="text-muted-foreground">Manage your product catalog, add new products, and update existing ones</p>
        </div>
        <Button onClick={() => { setShowAddForm(true); setEditingProduct(null); }} className="btn-primary"><Plus className="w-4 h-4 mr-2" />Add New Product</Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Filters & Search</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </div>
            <Button variant={showInactive ? "default" : "outline"} onClick={() => setShowInactive(!showInactive)}>
              <Eye className="w-4 h-4 mr-2" />{showInactive ? "Show Active" : "Show All"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {products?.length ? (
        <div className="space-y-4">
          {products.map((product: any) => (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{product.title}</h3>
                      <Badge variant={product.is_active ? "default" : "secondary"}>{product.is_active ? "Active" : "Inactive"}</Badge>
                      {product.featured && <Badge variant="outline">Featured</Badge>}
                    </div>
                    <p className="text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span>Price: ${product.price}</span>
                      <span>Sales: {product.sales_count || 0}</span>
                      <span>Rating: {product.rating || "N/A"}</span>
                      {product.category && <span>Category: {product.category.name}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setEditingProduct(product); setShowAddForm(true); }}><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleProductStatus.mutate({ productId: product.id, isActive: product.is_active })}>
                          {product.is_active ? <><EyeOff className="w-4 h-4 mr-2" />Deactivate</> : <><Eye className="w-4 h-4 mr-2" />Activate</>}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => window.confirm("Delete this product?") && deleteProduct.mutate(product.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState type="products" message="No products found" description={searchTerm ? "Try adjusting your search terms" : "Start by adding your first product"} action={{ label: "Add New Product", onClick: () => { setShowAddForm(true); setEditingProduct(null); } }} />
      )}
    </div>
  );
};

export default ProductsManagement;
