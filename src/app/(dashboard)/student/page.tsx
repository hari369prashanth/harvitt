import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import UserProfileCard from "../../../components/UserProfileCard";
import Performance from "@/components/Performance";

interface SearchParams {
  [key: string]: string | undefined;
}

const StudentPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { userId } = auth();

  const user = await prisma.student.findUnique({
    where: { id: userId! },
    select: {
      id: true,
      name: true,
      surname: true,
      email: true,
      phone: true,
      username: true,
      img: true,
      classId: true,
      birthday: true,
    },
  });

  if (!user) return <div>User not found</div>;

  const birthday = new Date(user.birthday);
  const age = new Date().getFullYear() - birthday.getFullYear();

  const classInfo = await prisma.class.findUnique({
    where: { id: user.classId },
    select: { name: true },
  });

  const className = classInfo?.name || "No Class";

  const userProfile = {
    ...user,
    age,
    role: "Student",
    className,
    email: user.email || "Not Provided",
    phone: user.phone || "Not Provided",
  };

  const classItem = await prisma.class.findMany({
    where: {
      students: { some: { id: userId! } },
    },
    select: { id: true, name: true },
  });

  const classId = classItem.length > 0 ? classItem[0].id : null;
  const classNameFallback = classItem.length > 0 ? classItem[0].name : "No Class";

  return (
    <div className="p-4 flex flex-col gap-6 xl:flex-row student-container">
      {/* LEFT */}
      <div className="w-full xl:w-1/3 bg-transparent-white-contrast rounded-md mb-4 xl:mb-0">
        <div className="mb-5">
          <UserProfileCard userProfile={userProfile} />
        </div>
        <Performance role="student" studentId={user.id} />
      </div>

      {/* MIDDLE */}
      <div className="w-full xl:w-2/3">
        <div className="bg-white p-4 rounded-md bg-transparent-white-contrast mb-4">
          <h1 className="text-xl font-bold text-[#5CE0FF]">Schedule ({classNameFallback})</h1>
          {classId ? (
            <BigCalendarContainer type="classId" id={classId} />
          ) : (
            <p className="text-gray-600">No class schedule available.</p>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <EventCalendarContainer searchParams={searchParams} />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;
