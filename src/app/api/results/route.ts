// src/app/api/results/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse `studentId` from query parameters
    const url = new URL(req.url);
    const studentId = url.searchParams.get("studentId");

    // Determine whose data to fetch: specific student (admin) or logged-in user
    const targetStudentId = studentId || userId;

    const results = await prisma.result.findMany({
      where: { studentId: targetStudentId },
      select: { score: true },
    });

    if (!results || results.length === 0) {
      return NextResponse.json({ gradePoint: "0" });
    }

    const totalScore = results.reduce((sum, item) => sum + item.score, 0);
    const averageScore = totalScore / results.length;
    const gradePoint = (averageScore / 100) * 10;

    return NextResponse.json({ gradePoint: gradePoint.toFixed(1) });
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
