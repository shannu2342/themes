import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { X, Upload, Image as ImageIcon, File, Plus, Trash2 } from "lucide-react";
import { useCategories } from "@/hooks/useProducts";
import { uploadProductImageSimple, uploadProductFileSimple } from "@/lib/storage-simple";
import { apiPost, apiPut } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductFormProps {
  product?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProductForm = ({ product, onSuccess, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category_id: "",
    featured: false,
    is_active: true,
    author: "",
    live_demo_url: "",
    compatibility: [] as string[],
    features: [] as string[],
  });
  const [images, setImages] = useState<string[]>([]);
  const [productFile, setProductFile] = useState<string>("");
  const [newFeature, setNewFeature] = useState("");
  const [newCompatibility, setNewCompatibility] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<number[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);

  const { data: categories } = useCategories();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!product) return;
    setFormData({
      title: product.title || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      category_id: product.category_id || "",
      featured: product.featured || false,
      is_active: product.is_active ?? true,
      author: product.author || "",
      live_demo_url: product.live_demo_url || "",
      compatibility: product.compatibility || [],
      features: product.features || [],
    });
    setImages(product.images || []);
    setProductFile(product.file_url || "");
  }, [product]);

  const handleImageUpload = async (files: FileList) => {
    const imageFiles = Array.from(files);
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const uploadIndex = Date.now() + i;
      setUploadingImages((prev) => [...prev, uploadIndex]);
      try {
        const productId = product?.id || `temp-${Date.now()}`;
        const { url, error } = await uploadProductImageSimple(file, productId, images.length + i);
        if (error) throw error;
        setImages((prev) => [...prev, url]);
      } catch {
        toast({ title: "Upload Error", description: `Failed to upload ${file.name}`, variant: "destructive" });
      } finally {
        setUploadingImages((prev) => prev.filter((idx) => idx !== uploadIndex));
      }
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploadingFile(true);
    try {
      const productId = product?.id || `temp-${Date.now()}`;
      const { url, error } = await uploadProductFileSimple(file, productId);
      if (error) throw error;
      setProductFile(url);
      toast({ title: "File Uploaded", description: "Product file uploaded successfully" });
    } catch {
      toast({ title: "Upload Error", description: "Failed to upload product file", variant: "destructive" });
    } finally {
      setUploadingFile(false);
    }
  };

  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));
  const addFeature = () => newFeature.trim() && (setFormData((prev) => ({ ...prev, features: [...prev.features, newFeature.trim()] })), setNewFeature(""));
  const removeFeature = (index: number) => setFormData((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  const addCompatibility = () => newCompatibility.trim() && (setFormData((prev) => ({ ...prev, compatibility: [...prev.compatibility, newCompatibility.trim()] })), setNewCompatibility(""));
  const removeCompatibility = (index: number) => setFormData((prev) => ({ ...prev, compatibility: prev.compatibility.filter((_, i) => i !== index) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!formData.title.trim()) {
      toast({ title: "Validation Error", description: "Product title is required", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }
    if (!formData.description.trim()) {
      toast({ title: "Validation Error", description: "Product description is required", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast({ title: "Validation Error", description: "Product price must be greater than 0", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category_id: formData.category_id || null,
        featured: formData.featured,
        is_active: formData.is_active,
        author: formData.author?.trim() || "",
        live_demo_url: formData.live_demo_url?.trim() || "",
        compatibility: formData.compatibility,
        features: formData.features,
        images,
        file_url: productFile || "",
      };

      if (product?.id) {
        await apiPut(`/api/admin/products/${product.id}`, payload);
      } else {
        await apiPost("/api/admin/products", payload);
      }

      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: "Success", description: `Product ${product ? "updated" : "created"} successfully` });
      onSuccess();
    } catch (error: any) {
      toast({ title: "Error", description: error?.message || "Failed to save product", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{product ? "Edit Product" : "Add New Product"}</h2>
        <div className="flex gap-2"><Button variant="outline" onClick={onCancel}>Cancel</Button></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle><CardDescription>Essential product details</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="title">Product Title *</Label><Input id="title" value={formData.title} onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} required /></div>
              <div className="space-y-2"><Label htmlFor="price">Price ($) *</Label><Input id="price" type="number" step="0.01" min="0" value={formData.price} onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))} required /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="description">Description *</Label><Textarea id="description" value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} rows={4} required /></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2"><Label htmlFor="author">Author</Label><Input id="author" value={formData.author} onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))} /></div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData((prev) => ({ ...prev, category_id: value }))}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{categories?.map((category) => (<SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label htmlFor="demo_url">Demo URL</Label><Input id="demo_url" type="url" value={formData.live_demo_url} onChange={(e) => setFormData((prev) => ({ ...prev, live_demo_url: e.target.value }))} /></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2"><Checkbox id="featured" checked={formData.featured} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: !!checked }))} /><Label htmlFor="featured">Featured Product</Label></div>
              <div className="flex items-center space-x-2"><Checkbox id="active" checked={formData.is_active} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: !!checked }))} /><Label htmlFor="active">Active</Label></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Product Images</CardTitle><CardDescription>Upload product preview images</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <label htmlFor="image-upload" className="cursor-pointer"><span className="btn-primary inline-block"><Upload className="w-4 h-4 mr-2" />Upload Images</span><input id="image-upload" type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && handleImageUpload(e.target.files)} /></label>
            </div>
            {images.length > 0 && (
              <div className="space-y-2">
                <Label>Uploaded Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img src={image} alt={`Product image ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                      <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeImage(index)}><Trash2 className="w-3 h-3" /></Button>
                      {uploadingImages.includes(index) && <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center"><div className="text-white text-xs">Uploading...</div></div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Digital Product File</CardTitle><CardDescription>Upload downloadable product file</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <File className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <label htmlFor="file-upload" className="cursor-pointer"><span className="btn-primary inline-block"><Upload className="w-4 h-4 mr-2" />Upload Product File</span><input id="file-upload" type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} /></label>
              {uploadingFile && <p className="text-xs text-muted-foreground mt-2">Uploading file...</p>}
            </div>
            {productFile && <div className="flex items-center justify-between p-3 bg-muted rounded-lg"><span className="text-sm">File uploaded</span><Button type="button" variant="outline" size="sm" onClick={() => setProductFile("")}><Trash2 className="w-3 h-3 mr-1" />Remove</Button></div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Product Features</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2"><Input value={newFeature} onChange={(e) => setNewFeature(e.target.value)} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())} /><Button type="button" onClick={addFeature}><Plus className="w-4 h-4" /></Button></div>
            {formData.features.length > 0 && <div className="flex flex-wrap gap-2">{formData.features.map((feature, index) => <Badge key={index} variant="secondary" className="flex items-center gap-1">{feature}<Button type="button" variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent" onClick={() => removeFeature(index)}><X className="w-3 h-3" /></Button></Badge>)}</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Compatibility</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2"><Input value={newCompatibility} onChange={(e) => setNewCompatibility(e.target.value)} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCompatibility())} /><Button type="button" onClick={addCompatibility}><Plus className="w-4 h-4" /></Button></div>
            {formData.compatibility.length > 0 && <div className="flex flex-wrap gap-2">{formData.compatibility.map((item, index) => <Badge key={index} variant="outline" className="flex items-center gap-1">{item}<Button type="button" variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent" onClick={() => removeCompatibility(index)}><X className="w-3 h-3" /></Button></Badge>)}</div>}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : product ? "Update Product" : "Create Product"}</Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
