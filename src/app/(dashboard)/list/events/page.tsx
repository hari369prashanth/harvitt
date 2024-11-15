import FormContainer from "@/components/FormContainer"; 
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Event, Prisma } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

type EventList = Event & { class: Class };

const EventListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Class", accessor: "class" },
    { header: "Date", accessor: "date", className: "hidden md:table-cell" },
    { header: "Description", accessor: "description", className: "hidden lg:table-cell" },
    { header: "Start Time", accessor: "startTime", className: "hidden md:table-cell" },
    { header: "End Time", accessor: "endTime", className: "hidden md:table-cell" },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const renderRow = (item: EventList) => (
    <tr key={item.id} className="border-b border-gray-200 text-sm hover:bg-cyan-600 hover:text-black">
      <td className="flex items-center gap-4 p-4">{item.title}</td>
      <td>{item.class?.name || "-"}</td>
      <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-US").format(item.startTime)}</td>
      <td className="hidden lg:table-cell">{item.description || "-"}</td>
      <td className="hidden md:table-cell">
        {item.startTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
      </td>
      <td className="hidden md:table-cell">
        {item.endTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="event" type="update" data={item} />
              <FormContainer table="event" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page = "1", ...queryParams } = searchParams;
  const currentPage = parseInt(page);

  // Define base query with search and role-based conditions
  const query: Prisma.EventWhereInput = {};
  if (queryParams.search) {
    query.title = { contains: queryParams.search, mode: "insensitive" };
  }

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: currentUserId! } } },
    student: { students: { some: { id: currentUserId! } } },
    parent: { students: { some: { parentId: currentUserId! } } },
  };

  query.OR = [
    { classId: null },
    { class: roleConditions[role as keyof typeof roleConditions] || {} },
  ];

  const currentDateTime = new Date();

  const upcomingEventsQuery: Prisma.EventWhereInput = {
    ...query,
    startTime: { gte: currentDateTime },
  };
  const completedEventsQuery: Prisma.EventWhereInput = {
    ...query,
    endTime: { lt: currentDateTime },
  };

  // Fetch upcoming and completed events with pagination
  const [upcomingData, completedData, count] = await prisma.$transaction([
    prisma.event.findMany({
      where: upcomingEventsQuery,
      include: { class: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (currentPage - 1),
    }),
    prisma.event.findMany({
      where: completedEventsQuery,
      include: { class: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (currentPage - 1),
    }),
    prisma.event.count({ where: query }),
  ]);

  return (
    <div className="bg-transparent p-4 rounded-md flex-1 m-4 mt-10 text-white">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormContainer table="event" type="create" />}
          </div>
        </div>
      </div>
      
      <h2 className="text-lg font-semibold mt-4">Upcoming Events</h2>
      <Table columns={columns} renderRow={renderRow} data={upcomingData} />
      <Pagination page={currentPage} count={count} />

      <h2 className="text-lg font-semibold mt-8">Completed Events</h2>
      <Table columns={columns} renderRow={renderRow} data={completedData} />
      <Pagination page={currentPage} count={count} />
    </div>
  );
};

export default EventListPage;
