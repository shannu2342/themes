import { apiPost } from "@/lib/api";

export const createFirstAdmin = async (_userId: string): Promise<{ success: boolean; error: Error | null }> => {
  try {
    await apiPost("/api/admin/ensure-static", {});
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error as Error };
  }
};

export const getUserByEmail = async (email: string) => {
  return { email };
};

export const promoteUserByEmailSimple = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const result = await apiPost<{ success: boolean; message?: string }>("/api/admin/promote-by-email", { email });
    return { success: true, message: result.message || `User ${email} has been promoted to admin` };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to promote user" };
  }
};
