import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AdminUser {
  id: string;
  full_name?: string;
  email: string;
  created_at?: string;
  user_roles?: Array<{ role: string }>;
}

const AdminUsers = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => apiGet<AdminUser[]>("/api/admin/users"),
  });

  if (isLoading) return <div className="text-muted-foreground">Loading users...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Users</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {!users?.length ? (
            <p className="text-muted-foreground">No users found.</p>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="border rounded-lg p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{user.full_name || "No name"}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Joined: {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {(user.user_roles || []).length ? (
                      user.user_roles!.map((r, idx) => (
                        <Badge key={`${user.id}-${idx}`} variant={r.role === "admin" ? "default" : "secondary"}>
                          {r.role}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="secondary">user</Badge>
                    )}
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

export default AdminUsers;
