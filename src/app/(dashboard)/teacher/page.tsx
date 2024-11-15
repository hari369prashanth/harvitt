import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import UserProfileCard from "@/components/UserProfileCard";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
interface SearchParams {
  [key: string]: string | undefined;
}
const TeacherPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { userId } = auth();

  // Fetch user profile data
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
        // Assuming classId is available
      birthday: true,
    },
  });

  if (!user) return <div>User not found</div>;

  const birthday = new Date(user.birthday);
  const age = new Date().getFullYear() - birthday.getFullYear();

  // Fetch class name using classId
  

  // Prepare userProfile object, handle null for email and phone
  const userProfile = {
    ...user,
    age,
    role: "Teacher",
    
    email: user.email || "Not Provided",  // Default value if email is null
    phone: user.phone || "Not Provided",  // Default value if phone is null
  };

  return (
    <div>
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div >
        <UserProfileCard userProfile={userProfile} />
        </div>
      <div className="w-full xl:w-2/3">
      
        <div className=" bg-white p-4 rounded-md bg-transparent-white-contrast">
          <h1 className="text-xl font-semibold">Schedule</h1>
          <BigCalendarContainer type="teacherId" id={userId!} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="  w-full xl:w-1/3 flex flex-col gap-8">
      <EventCalendarContainer searchParams={searchParams} />
        <Announcements />
      </div>
    </div>
    </div>
  );
};

export default TeacherPage;
