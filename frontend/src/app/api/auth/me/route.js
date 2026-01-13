import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decodeJWT } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = decodeJWT(token);

  if (!user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  return NextResponse.json({
    userId: user.userId,
    email: user.email,
    role: user.role,
  });
}
