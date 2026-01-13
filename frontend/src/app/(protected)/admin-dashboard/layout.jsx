"use client";
import { AuthProtector } from "@/components/AuthProtector";

export default function AdminLayout({ children }) {
  return (
    <AuthProtector allowedRoles={["ADMIN"]}>
      <div className="flex h-screen">
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </AuthProtector>
  );
}
