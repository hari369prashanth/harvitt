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

  // Fetch user profile data
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
      classId: true,  // Assuming classId is available
      birthday: true,
    },
  });

  if (!user) return <div>User not found</div>;

  const birthday = new Date(user.birthday);
  const age = new Date().getFullYear() - birthday.getFullYear();

  // Fetch class name using classId
  const classInfo = await prisma.class.findUnique({
    where: { id: user.classId },
    select: { name: true },
  });

  const className = classInfo?.name || "No Class"; // Default value if className is not found

  // Prepare userProfile object, handle null for email and phone
  const userProfile = {
    ...user,
    age,
    role: "Student",
    className,
    email: user.email || "Not Provided",  // Default value if email is null
    phone: user.phone || "Not Provided",  // Default value if phone is null
  };

  // Fetch class items and get classId and className if available
  const classItem = await prisma.class.findMany({
    where: {
      students: { some: { id: userId! } },
    },
    select: { id: true, name: true },
  });

  const classId = classItem.length > 0 ? classItem[0].id : null;
  const classNameFallback = classItem.length > 0 ? classItem[0].name : "No Class";

  return (
    <div>
      
    <div className="p-4 flex gap-4 flex-col xl:flex-row student-container">
      {/* LEFT */}
      <div className="w-full xl:w-1/3 h-full rounded-md bg-transparent-white-contrast">
      <div className="mb-5">
        <UserProfileCard userProfile={userProfile} />
        </div>
        <Performance  role="student" studentId={user.id}/>
      </div>
      

      {/* MIDDLE */}
      <div className="w-full xl:w-2/3">
      
      
      
        <div className="  bg-white p-4 rounded-md bg-transparent-white-contrast ">
          
          <h1 className="text-2xl font-bold text-[#5CE0FF]">Schedule ({classNameFallback})</h1>
          {classId ? (
            
            <BigCalendarContainer type="classId" id={classId} />
          ) : (
            <p className="text-white">No class schedule available.</p>
          )}
        </div>
        
      </div>
      
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendarContainer searchParams={searchParams} />
        <Announcements />
        
      </div>
      
    </div> </div>
  );
};

export default StudentPage;
