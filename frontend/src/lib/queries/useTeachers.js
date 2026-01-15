"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

export function useTeachers() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["teachers", user?.role, user?.schoolId, user?.id],
    queryFn: async () => {
      let endpoint = "/api/teachers";

      if (user?.role === "root") {
        endpoint = "/api/teachers";
      } else if (user?.role === "admin") {
        endpoint = `/api/schools/${user.schoolId}/teachers`;
      } else if (user?.role === "teacher") {
        endpoint = `/api/teachers/${user.id}`;
      }

      const res = await fetch(endpoint, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!user && ["root", "admin", "teacher"].includes(user.role),
  });
}
