import React from "react";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Resource, Prisma } from "@prisma/client";
import { FaDownload } from "react-icons/fa";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import Image from "next/image";

type ResourceList = Resource;

const ResourceListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Description",
      accessor: "description",
      className: "hidden md:table-cell",
    },
    {
      header: "Class",
      accessor: "className",
      className: "hidden md:table-cell",
    },
    {
      header: "Download",
      accessor: "download",
    },
    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: ResourceList & { className: string }) => {
    const isValidUrl = item.fileUrl && item.fileUrl.startsWith("https://res.cloudinary.com");

    return (
      <tr key={item.id} className="border-b border-gray-200 text-sm hover:bg-cyan-600 hover:text-black">
        <td className="p-4">{item.title}</td>
        <td className="hidden md:table-cell">{item.description}</td>
        <td className="hidden md:table-cell">{item.className}</td>
        <td className="px-5">
          {isValidUrl ? (
            <a href={item.fileUrl ?? undefined} target="_blank" download className="w-7 h-7 flex items-center justify-center rounded-full bg-green-500" title="Download Resource">
              <FaDownload className="text-white" />
            </a>
          ) : (
            "No file available"
          )}
        </td>
        <td>
          <div className="flex items-center gap-2">
            {role === "admin" && (
              <>
                <FormContainer table="resource" type="update" data={item} />
                <FormContainer table="resource" type="delete" id={item.id} />
              </>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // Set query based on role
  const query: Prisma.ResourceWhereInput = {};
  if (role === "student") {
    const student = await prisma.student.findUnique({
      where: { id: currentUserId ?? undefined },
      include: { class: true },
    });

    if (student?.classId) {
      query.classId = student.classId;
    }
  } else if (queryParams.classId) {
    query.classId = parseInt(queryParams.classId);
  }

  if (queryParams.search) {
    query.title = { contains: queryParams.search, mode: "insensitive" };
  }

  const [data, count] = await prisma.$transaction([
    prisma.resource.findMany({
      where: query,
      include: { class: { select: { name: true } } },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.resource.count({ where: query }),
  ]);

  const resourceData = data.map((resource) => ({
    ...resource,
    className: resource.class?.name || "N/A",
  }));

  // Return JSX layout
  return (
    <div className="bg-transparent p-4 rounded-md flex-1 m-4 mt-10 text-white">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Resources</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            {role === "admin" && <FormContainer table="resource" type="create" />}
          </div>
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={resourceData} />
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ResourceListPage;
