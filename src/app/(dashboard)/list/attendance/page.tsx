// Import necessary modules and components
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import AttendanceCalendar from "@/components/AttendanceCalendar";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { useState } from "react";

type AttendanceList = {
  id: number | null;
  studentName: string;
  studentSurname: string;
  lessons: { name: string | null; present: boolean | null }[];
  className: string;
  date: Date | null;
};

const AttendanceListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;
  const { date } = searchParams;
  const selectedDate = date ? new Date(date) : new Date();

  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  const columns = [
    { header: "Student", accessor: "student" },
    { header: "Lessons", accessor: "lessons" },
    { header: "Present", accessor: "present", className: "hidden md:table-cell" },
    ...(role === "admin" || role === "teacher"
      ? [{ header: "Actions", accessor: "action" }]
      : []),
  ];

  const renderRow = (item: AttendanceList) => (
  <tr key={item.id || Math.random()} className="border-b border-gray-200 text-sm hover:bg-cyan-600 hover:text-black">
    <td>{item.studentName + " " + item.studentSurname}</td>
    <td>
      {item.lessons.length > 0 ? (
        <ul>
          {item.lessons.map((lesson, index) => (
            <li key={index}>{lesson.name || "N/A"}</li> // Only display lesson name here
          ))}
        </ul>
      ) : (
        "N/A"
      )}
    </td>
    <td>
      {item.lessons.length > 0 ? (
        <ul>
          {item.lessons.map((lesson, index) => (
            <li key={index}>
              {lesson.present !== null ? (lesson.present ? "Yes" : "No") : "N/A" }
            </li> // Display the attendance status for each lesson
          ))}
        </ul>
      ) : (
        "N/A"
      )}
    </td>
    <td>
      <div className="flex items-center pl-3">
        {(role === "admin" || role === "teacher") && (
          <FormContainer table="attendance" type="update" data={item} />
        )}
      </div>
    </td>
  </tr>
);
  const query: Prisma.AttendanceWhereInput = {
    date: {
      gte: startOfDay,
      lte: endOfDay,
    },
  };

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "studentId":
            query.studentId = value;
            break;
          case "search":
            query.OR = [
              { student: { name: { contains: value, mode: "insensitive" } } },
              { lesson: { name: { contains: value, mode: "insensitive" } } },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  switch (role) {
    case "admin":
      // Admin has access to all attendance records, so no additional filtering is needed
      break;
  
    case "teacher":
      
      break;
  
    case "student":
      // Student sees only their own attendance records
      query.studentId = currentUserId!;
      break;
  
    case "parent":
      // Parent sees attendance records for their children
      query.student = {
        parentId: currentUserId!,
      };
      break;
  
    default:
      break;
  }
  const [classData, count] = await prisma.$transaction([
    prisma.class.findMany({
      select: {
        name: true,
        students: {
          select: {
            id: true,
            name: true,
            surname: true,
            attendances: {
              where: query,
              include: {
                lesson: { select: { name: true } },
              },
            },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.student.count(),
  ]);

  const groupedData: { [className: string]: AttendanceList[] } = {};

if (role === "admin" || role === "teacher") {
  classData.forEach((classItem) => {
    const className = classItem.name;
    groupedData[className] = [];

    classItem.students.forEach((student) => {
      const lessons = student.attendances.map((attendance) => ({
        name: attendance.lesson?.name || "N/A",
        present: attendance.present,
      }));

      if (lessons.length > 0) {
        groupedData[className].push({
          id: student.attendances.length ? student.attendances[0].id : null,
          studentName: student.name,
          studentSurname: student.surname,
          lessons,
          className,
          date: lessons.length ? student.attendances[0].date : null,
        });
      }
    });
  });
} else if (role === "student") {
  // For student role, show only their attendance
  classData.forEach((classItem) => {
    classItem.students.forEach((student) => {
      if (student.id === currentUserId) {
        const lessons = student.attendances.map((attendance) => ({
          name: attendance.lesson?.name || "N/A",
          present: attendance.present,
        }));

        if (lessons.length > 0) {
          groupedData[classItem.name] = [{
            id: student.attendances.length ? student.attendances[0].id : null,
            studentName: student.name,
            studentSurname: student.surname,
            lessons,
            className: classItem.name,
            date: lessons.length ? student.attendances[0].date : null,
          }];
        }
      }
    });
  });
}

  return (
    <div className="bg-transparent p-4 rounded-md flex-1 m-4 mt-10 text-white">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Attendance</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {(role === "admin" || role === "teacher") && (
              <FormContainer table="attendance" type="create" />
            )}
          </div>
        </div>
      </div>

      <AttendanceCalendar />

      {Object.keys(groupedData).map((className) => (
  role === "admin" || role === "teacher" ? (
    <details key={className} className="my-4">
      <summary className="cursor-pointer text-lg font-semibold mb-2">{className}</summary>
      <Table columns={columns} renderRow={renderRow} data={groupedData[className]} />
    </details>
  ) : (
    <Table key={className} columns={columns} renderRow={renderRow} data={groupedData[className]} />
  )
))}
    </div>
  );
};

export default AttendanceListPage;
