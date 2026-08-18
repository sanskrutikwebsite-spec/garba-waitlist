import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { role, password } = await request.json();

    if (role === "admin" && password === process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: true });
    }

    if (role === "volunteer" && password === process.env.VOLUNTEER_PASSWORD) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
