"use client";
import { AuthProtector } from "@/components/AuthProtector";

export default function TeacherLayout({ children }) {
  return (
    <AuthProtector allowedRoles={["TEACHER"]}>
      <div className="flex h-screen">
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </AuthProtector>
  );
}
