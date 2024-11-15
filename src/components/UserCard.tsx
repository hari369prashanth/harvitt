import prisma from "@/lib/prisma";
import Image from "next/image";

const UserCard = async ({
  type,
}: {
  type: "admin" | "teacher" | "student" | "parent";
}) => {
  const modelMap: Record<typeof type, any> = {
    admin: prisma.admin,
    teacher: prisma.teacher,
    student: prisma.student,
    parent: prisma.parent,
  };

  const data = await modelMap[type].count();

  return (
    <div className="rounded-2xl odd:bg-transparent-purple-contrast even:bg-transparent-yellow-contrast p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        
        
      </div>
      <h1 className="text-2xl font-semibold my-4">{data}</h1>
      <h2 className="capitalize text-l font-medium text-white-500">{type}s</h2>
    </div>
  );
};

export default UserCard;
