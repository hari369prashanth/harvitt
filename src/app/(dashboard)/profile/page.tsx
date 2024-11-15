import { auth } from "@clerk/nextjs/server";  
import prisma from "@/lib/prisma";
import Image from "next/image";

const UserProfilePage = async () => {
  const { userId } = auth();

  if (!userId) {
    return <div className="text-white">You are not logged in</div>;
  }

  const user = await prisma.student.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      surname: true,  
      email: true,
      phone: true,
      username: true,
      img: true,
      class: { select: { name: true } },
      birthday: true,
    },
  }) || await prisma.teacher.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      surname: true, 
      email: true,
      phone: true,
      username: true,
      img: true,
      birthday: true,
      subjects: true,
    },
  });

  if (!user) {
    return <div className="text-white">User not found</div>;
  }

  const birthday = new Date(user.birthday);
  const age = new Date().getFullYear() - birthday.getFullYear();

  let role = "";
  let className = "N/A";
  if ("class" in user) {
    role = "Student";
    className = user.class?.name || "No Class";
  } else {
    role = "Teacher";
  }

  const userProfile = {
    ...user,
    age,
    role,
    className,
  };

  return (
    <div className="to-black p-6 min-h-screen flex justify-center items-center">
      <div className="max-w-lg w-full flex flex-col items-center gap-8 p-8 rounded-2xl shadow-lg bg-gray-800 backdrop-blur-lg bg-opacity-30">
        
        {/* Profile Image and Name */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-32 h-32">
            <Image
              src={userProfile.img || "/noAvatar.png"}
              alt="Profile Image"
              layout="fill"
              className="rounded-full object-cover shadow-lg transform hover:scale-110 hover:shadow-2xl transition-all"
            />
          </div>
          <h2 className="text-4xl font-semibold text-white text-center">{userProfile.name} {userProfile.surname}</h2>
          <p className="text-xl text-gray-300 text-center">{userProfile.role}</p>
        </div>

        {/* User Details */}
        <div className="mt-6 w-full space-y-4 text-lg text-gray-300">
          <div className="flex justify-between border-b border-gray-600 py-2">
            <span className="text-white font-medium">Email:</span>
            <span>{userProfile.email}</span>
          </div>
          <div className="flex justify-between border-b border-gray-600 py-2">
            <span className="text-white font-medium">Phone:</span>
            <span>{userProfile.phone}</span>
          </div>
          <div className="flex justify-between border-b border-gray-600 py-2">
            <span className="text-white font-medium">Username:</span>
            <span>{userProfile.username}</span>
          </div>
          <div className="flex justify-between border-b border-gray-600 py-2">
            <span className="text-white font-medium">Class:</span>
            <span>{userProfile.className}</span>
          </div>
          <div className="flex justify-between border-b border-gray-600 py-2">
            <span className="text-white font-medium">Age:</span>
            <span>{userProfile.age}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
