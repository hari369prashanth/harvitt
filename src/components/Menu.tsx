import { currentUser } from "@clerk/nextjs/server";
import { FaHome, FaChalkboardTeacher, FaUsers, FaBook, FaLayerGroup, FaSchool, FaBookReader, FaClipboardList, FaPen, FaClipboard, FaCalendarAlt, FaBullhorn } from "react-icons/fa"; // Importing icons from react-icons
import Link from "next/link";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: FaHome, // Replacing with FaHome icon
        label: "Home",
        href: "/",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: FaChalkboardTeacher, // Replacing with FaChalkboardTeacher icon
        label: "Teachers",
        href: "/list/teachers",
        visible: ["admin", "teacher"],
      },
      {
        icon: FaUsers, // Replacing with FaUsers icon
        label: "Students",
        href: "/list/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: FaUsers, // Replacing with FaUsers icon (same for Parents)
        label: "Parents",
        href: "/list/parents",
        visible: ["admin", "teacher"],
      },
      {
        icon: FaBook, // Replacing with FaBook icon
        label: "Subjects",
        href: "/list/subjects",
        visible: ["admin"],
      },
      {
        icon: FaLayerGroup, // Replacing with FaLayerGroup icon
        label: "Classes",
        href: "/list/classes",
        visible: ["admin", "teacher"],
      },
      {
        icon: FaSchool, // Replacing with FaSchool icon
        label: "Lessons",
        href: "/list/lessons",
        visible: ["admin", "teacher"],
      },
      {
        icon: FaBookReader, // Replacing with FaBookReader icon
        label: "Exams",
        href: "/list/exams",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: FaClipboardList, // Replacing with FaClipboardList icon
        label: "Assignments",
        href: "/list/assignments",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: FaClipboard, // Replacing with FaClipboard icon
        label: "Results",
        href: "/list/results",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: FaPen, // Replacing with FaPen icon
        label: "Attendance",
        href: "/list/attendance",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: FaCalendarAlt, // Replacing with FaCalendarAlt icon
        label: "Events",
        href: "/list/events",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: FaBullhorn, // Replacing with FaBullhorn icon
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: FaBook, // Icon for Resources
        label: "Resources",
        href: "/list/resources", // Link to ResourceListPage
        visible: ["admin", "teacher", "student", "parent"], // Visible to all users
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: FaUsers, // Replacing with FaUsers icon (same for Profile)
        label: "Profile",
        href: "/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const Menu = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;
  return (
    <div className=" bg-dark-800 text-white py-4 px-6 rounded-lg shadow-lg">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-4 mb-6 text-center" key={i.title}>
          <span className="text-lg text-lamaSkyLight font-semibold">{i.title}</span>
          {i.items.map((item) => {
            if (item.visible.includes(role)) {
              const Icon = item.icon; // Dynamically selecting the icon
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center gap-4 text-gray-300 py-3 px-4 rounded-md hover:bg-cyan-600 hover:text-white transition duration-300 ease-in-out"
                >
                  <Icon size={24} /> {/* Render icon */}
                  <span>{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
