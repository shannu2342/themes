import { apiPost } from "@/lib/api";

export const STATIC_ADMIN = {
  email: "admin@themevault.com",
  password: "admin123",
  name: "ThemeVault Admin",
};

export const isStaticAdmin = (email?: string) => email === STATIC_ADMIN.email;

export const ensureStaticAdmin = async (_userId: string, email: string) => {
  if (!isStaticAdmin(email)) return false;
  try {
    const result = await apiPost<{ success: boolean; isAdmin?: boolean }>("/api/admin/ensure-static", {});
    return Boolean(result.success);
  } catch (error) {
    console.error("Error ensuring static admin:", error);
    return false;
  }
};
