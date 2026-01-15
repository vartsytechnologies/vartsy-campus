"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

export function useRecruiters() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["recruiters", user?.role, user?.schoolId, user?.id],
    queryFn: async () => {
      let endpoint = "/api/recruiters";

      if (user?.role === "root") {
        endpoint = "/api/recruiters";
      } else if (user?.role === "admin") {
        endpoint = `/api/schools/${user.schoolId}/recruiters`;
      } else if (user?.role === "recruiter") {
        endpoint = `/api/recruiters/${user.id}`;
      }

      const res = await fetch(endpoint, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch recruiters");
      return res.json();
    },
    enabled: !!user && ["root", "admin", "recruiter"].includes(user.role),
  });
}
