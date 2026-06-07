import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-provider";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function useIndustryStats(slug: string) {
  const { user, token } = useAuth();
  const path = slug === "education" ? `/api/education/stats` : `/api/industries/${slug}/stats`;

  const { data, isLoading, error } = useQuery({
    queryKey: ["industry-stats", slug, user?.organizationId],
    queryFn: async () => {
      const res = await fetch(`${API}${path}?organizationId=${user!.organizationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load stats");
      return res.json() as Promise<Record<string, number>>;
    },
    enabled: !!user?.organizationId && !!token,
    staleTime: 60_000,
    retry: 1,
  });

  return { data: data ?? null, loading: isLoading, error: error?.message ?? null };
}
