import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import UserProfileCard from "@/components/UserProfileCard";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

interface SearchParams {
  [key: string]: string | undefined;
}

const TeacherPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { userId } = auth();

  const user = await prisma.teacher.findUnique({
    where: { id: userId! },
    select: {
      id: true,
      name: true,
      surname: true,
      email: true,
      phone: true,
      username: true,
      img: true,
      birthday: true,
    },
  });

  if (!user) return <div>User not found</div>;

  const birthday = new Date(user.birthday);
  const age = new Date().getFullYear() - birthday.getFullYear();

  const userProfile = {
    ...user,
    age,
    role: "Teacher",
    email: user.email || "Not Provided",
    phone: user.phone || "Not Provided",
  };

  return (
    <div className="p-4 flex flex-col gap-6 xl:flex-row teacher-container">
      {/* LEFT */}
      <div className="w-full xl:w-1/3 bg-transparent-white-contrast rounded-md mb-4 xl:mb-0">
        <UserProfileCard userProfile={userProfile} />
      </div>

      {/* MIDDLE */}
      <div className="w-full xl:w-2/3">
        <div className="bg-white p-4 rounded-md bg-transparent-white-contrast mb-4">
          <h1 className="text-xl font-bold text-[#5CE0FF]">Schedule</h1>
          <BigCalendarContainer type="teacherId" id={userId!} />
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

export default TeacherPage;
