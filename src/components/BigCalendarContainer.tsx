import prisma from "@/lib/prisma";
import BigCalendar from "./BigCalender";

const BigCalendarContainer = async ({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number;
}) => {
  const dataRes = await prisma.lesson.findMany({
    where: {
      ...(type === "teacherId"
        ? { teacherId: id as string }
        : { classId: id as number }),
    },
  });

  // Map and format data for the calendar component
  const data = dataRes.map((lesson) => ({
    title: lesson.name,
    start: new Date(lesson.startTime), // Ensure start and end times are Date objects
    end: new Date(lesson.endTime),
  }));

  return (
    <div className="calendar-container">
      <BigCalendar data={data} />
    </div>
  );
};

export default BigCalendarContainer;
