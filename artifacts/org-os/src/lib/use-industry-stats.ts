import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-provider";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface StatsResult {
  data: Record<string, number> | null;
  loading: boolean;
  error: string | null;
}

export function useIndustryStats(slug: string): StatsResult {
  const { user, token } = useAuth();
  const [data, setData] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.organizationId) return;
    setLoading(true);
    const path = slug === "education" ? `/api/education/stats` : `/api/industries/${slug}/stats`;
    fetch(`${API}${path}?organizationId=${user.organizationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : Promise.reject("Failed"))
      .then(setData)
      .catch(() => setError("Failed to load stats"))
      .finally(() => setLoading(false));
  }, [user?.organizationId, token, slug]);

  return { data, loading, error };
}
