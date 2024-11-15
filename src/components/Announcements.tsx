import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

const Announcements = async () => {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: userId! } } },
    student: { students: { some: { id: userId! } } },
    parent: { students: { some: { parentId: userId! } } },
  };

  const data = await prisma.announcement.findMany({
    take: 3,
    orderBy: { date: "desc" },
    where: {
      // Admins see all announcements
      ...(role !== "admin" && {
        // Non-admin users see announcements either for their classes or global announcements
        OR: [
          { classId: null }, // Global announcements
          { class: roleConditions[role as keyof typeof roleConditions] || {} }, // Role-based class-specific announcements
        ],
      }),
    },
  });

  return (
    <div className="bg-white p-4 rounded-md bg-transparent-white-contrast">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold  text-white">Announcements</h1>
        <Link href="/list/announcements">
          < span className="text-xs text-light-gray hover:text-cyan">View All</span>
        </Link>
      </div>
      <Link href="/list/announcements">
      <div className="flex flex-col gap-4 mt-4">
        {data[0] && (
          <div className="bg-transparent-purple-contrast  hover-effect rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-white">{data[0].title}</h2>
              <span className="text-xs text-light-gray rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(data[0].date)}
              </span>
            </div>
            <p className="text-sm text-light-gray mt-1">{data[0].description}</p>
          </div>
        )}
        {data[1] && (
          <div className="bg-transparent-purple-contrast hover-effect rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium  text-white">{data[1].title}</h2>
              <span className="text-xs text-light-gray rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(data[1].date)}
              </span>
            </div>
            <p className="text-sm text-light-gray mt-1">{data[1].description}</p>
          </div>
        )}
        {data[2] && (
          <div className="bg-transparent-purple-contrast hover-effect rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[2].title}</h2>
              <span className="text-xs text-light-gray rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(data[2].date)}
              </span>
            </div>
            <p className="text-sm text-light-gray mt-1">{data[2].description}</p>
          </div>
        )}
      </div>
      </Link>
    </div>
  );
};

export default Announcements;
