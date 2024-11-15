// lib/getLessonData.ts
import prisma from "@/lib/prisma";

export async function getLessonData(type: "teacherId" | "classId", id: string | number) {
  const lessons = await prisma.lesson.findMany({
    where: type === "teacherId" ? { teacherId: id as string } : { classId: id as number },
  });
  return lessons.map((lesson) => ({
    title: lesson.name,
    start: new Date(lesson.startTime),
    end: new Date(lesson.endTime),
  }));
}
