"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

export function useSchools() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["schools", user?.role, user?.schoolId],
    queryFn: async () => {
      let endpoint = "/api/schools";

      if (user?.role === "root") {
        endpoint = "/api/schools";
      } else if (user?.role === "admin") {
        endpoint = `/api/schools/${user.schoolId}`; // Just their school
      }

      const res = await fetch(endpoint, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!user && ["root", "admin"].includes(user.role),
  });
}
