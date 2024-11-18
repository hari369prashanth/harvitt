import { FaHome, FaChalkboardTeacher, FaUsers, FaBook, FaLayerGroup, FaSchool, FaBookReader, FaClipboardList, FaPen, FaClipboard, FaCalendarAlt, FaBullhorn } from "react-icons/fa"; // Importing icons from react-icons
import Link from "next/link";

const menuItems = [
  {
    title: "MENU",
    items: [
      { icon: FaHome, label: "Home", href: "/", visible: ["admin", "teacher", "student", "parent"] },
      { icon: FaChalkboardTeacher, label: "Teachers", href: "/list/teachers", visible: ["admin", "teacher"] },
      { icon: FaUsers, label: "Students", href: "/list/students", visible: ["admin", "teacher"] },
      { icon: FaUsers, label: "Parents", href: "/list/parents", visible: ["admin", "teacher"] },
      { icon: FaBook, label: "Subjects", href: "/list/subjects", visible: ["admin"] },
      { icon: FaLayerGroup, label: "Classes", href: "/list/classes", visible: ["admin", "teacher"] },
      { icon: FaSchool, label: "Lessons", href: "/list/lessons", visible: ["admin", "teacher"] },
      { icon: FaBookReader, label: "Exams", href: "/list/exams", visible: ["admin", "teacher", "student", "parent"] },
      { icon: FaClipboardList, label: "Assignments", href: "/list/assignments", visible: ["admin", "teacher", "student", "parent"] },
      { icon: FaClipboard, label: "Results", href: "/list/results", visible: ["admin", "teacher", "student", "parent"] },
      { icon: FaPen, label: "Attendance", href: "/list/attendance", visible: ["admin", "teacher", "student", "parent"] },
      { icon: FaCalendarAlt, label: "Events", href: "/list/events", visible: ["admin", "teacher", "student", "parent"] },
      { icon: FaBullhorn, label: "Announcements", href: "/list/announcements", visible: ["admin", "teacher", "student", "parent"] },
      { icon: FaBook, label: "Resources", href: "/list/resources", visible: ["admin", "teacher", "student", "parent"] },
    ],
  },
  {
    title: "OTHER",
    items: [
      { icon: FaUsers, label: "Profile", href: "/profile", visible: ["admin", "teacher", "student", "parent"] },
    ],
  },
];

const Menu = ({ role, closeMenu }: { role: string; closeMenu?: () => void }) => {
  return (
    <div className="bg-dark-800 text-white py-4 px-6 rounded-lg shadow-lg">
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
                  onClick={closeMenu} // Close the menu when the link is clicked
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
