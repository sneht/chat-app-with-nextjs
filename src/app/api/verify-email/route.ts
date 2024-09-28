import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";
import { signIn } from "@/auth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        lastLogin: new Date(),
      },
    });
    await signIn("credentials", {
      email: user?.email,
      redirect: false,
    });

    return NextResponse.redirect(new URL("/email-verified", request.url));
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
