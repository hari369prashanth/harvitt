import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@clerk/nextjs/server";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement"
    | "resource";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
  relatedData?: {
    parent?: { id: string; name: string; surname: string }[];
    students?: { id: string; name: string; surname: string }[];
    teachers?: { id: string; name: string; surname: string }[];
    subjects?: { id: number; name: string }[];
    classes?: { id: number; name: string }[];
    lessons?: { id: number; name: string }[];
    exams?: { id: number; title: string }[];
    assignments?: { id: number; title: string }[];   
  };
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData: any = {};
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  if (type !== "delete") {
    switch (table) {
      case "subject":
        relatedData.teachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        break;
      case "class":
        relatedData = {
          teachers: await prisma.teacher.findMany({
            select: { id: true, name: true, surname: true },
          }),
          grades: await prisma.grade.findMany({
            select: { id: true, level: true },
          }),
        };
        break;
      case "teacher":
        relatedData.subjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        break;
      case "student":
        relatedData = {
          classes: await prisma.class.findMany({
            include: { _count: { select: { students: true } } },
          }),
          grades: await prisma.grade.findMany({
            select: { id: true, level: true },
          }),
          parents: await prisma.parent.findMany({
            select: { id: true, name: true, surname: true },
          }),
        };
        break;
      case "exam":
        relatedData.lessons = await prisma.lesson.findMany({
          where: role === "teacher" ? { teacherId: currentUserId! } : {},
          select: { id: true, name: true },
        });
        break;
      case "assignment":
        relatedData = {
          classes: await prisma.class.findMany({
            select: { id: true, name: true },
          }),
          subjects: await prisma.subject.findMany({
            select: { id: true, name: true },
          }),
          lessons: await prisma.lesson.findMany({
            select: { id: true, name: true },
          }),
        };
        break;
      
      case "lesson":
        relatedData = {
          classes: await prisma.class.findMany({
            select: { id: true, name: true },
          }),
          subjects: await prisma.subject.findMany({
            select: { id: true, name: true },
          }),
          teachers: await prisma.teacher.findMany({
            select: { id: true, name: true, surname: true },
          }),
          lessons: await prisma.lesson.findMany({
            select: { id: true, name: true },
          }),
        };
        break;
      case "event":
        relatedData.classes = await prisma.class.findMany({
          select: { id: true, name: true },
        });
        break;
      case "announcement":
        relatedData = {
          classes: await prisma.class.findMany({
            select: { id: true, name: true },
          }),
          teachers: await prisma.teacher.findMany({
            select: { id: true, name: true, surname: true },
          }),
        };
        break;
      case "result":
        relatedData = {
          students: await prisma.student.findMany({
            select: { id: true, name: true, surname: true },
          }),
          exams: await prisma.exam.findMany({
            select: { id: true, title: true },
          }),
          assignments: await prisma.assignment.findMany({
            select: { id: true, title: true },
          }),
        };
        break;
      case "parent":
        relatedData.parent = await prisma.parent.findMany({
          select: { id: true, name: true, surname: true },
        });
        break;
        case "attendance":
          relatedData = {
            students: await prisma.student.findMany({
              select: { id: true, name: true, surname: true },
            }),
            lessons: await prisma.lesson.findMany({
              select: { id: true, name: true },
            }),
          };
          break;
          case "resource":
        relatedData.classes = await prisma.class.findMany({
          select: { id: true, name: true },
        });
        break;
  
      default:
        break;
    }
  }

  return (
    <div>
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
