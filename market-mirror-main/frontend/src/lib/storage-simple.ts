import { apiUploadFile } from "@/lib/api";

export const uploadProductFileSimple = async (
  file: File,
  _productId: string
): Promise<{ url: string; error: Error | null }> => {
  try {
    const result = await apiUploadFile("/api/upload/file", file);
    return { url: result.url, error: null };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { url: "", error: error as Error };
  }
};

export const uploadProductImageSimple = async (
  file: File,
  _productId: string,
  _index: number = 0
): Promise<{ url: string; error: Error | null }> => {
  try {
    const result = await apiUploadFile("/api/upload/image", file);
    return { url: result.url, error: null };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { url: "", error: error as Error };
  }
};

export const uploadMultipleImagesAsBase64 = async (files: FileList): Promise<{ urls: string[]; error: Error | null }> => {
  try {
    const fileArray = Array.from(files);
    const results = await Promise.all(fileArray.map((file, index) => uploadProductImageSimple(file, `temp-${Date.now()}`, index)));
    const urls = results.map((result) => result.url).filter(Boolean);
    const firstError = results.find((result) => result.error)?.error || null;
    return { urls, error: firstError };
  } catch (error) {
    return { urls: [], error: error as Error };
  }
};

export const uploadFileAsBase64 = async (file: File): Promise<{ url: string; error: Error | null }> => {
  try {
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve({ url: event.target?.result as string, error: null });
      reader.onerror = () => resolve({ url: "", error: new Error("Failed to read file") });
      reader.readAsDataURL(file);
    });
  } catch (error) {
    return { url: "", error: error as Error };
  }
};
