"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

export function useStudents() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["students", user?.role, user?.schoolId, user?.id],
    queryFn: async () => {
      let endpoint = "/api/students";

      if (user?.role === "root") {
        endpoint = "/api/students";
      } else if (user?.role === "admin") {
        endpoint = `/api/schools/${user.schoolId}/students`;
      } else if (user?.role === "student") {
        endpoint = `/api/students/${user.id}`;
      } else if (user?.role === "teacher") {
        endpoint = `/api/teachers/${user.id}/students`;
      }

      const res = await fetch(endpoint, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!user,
  });
}
