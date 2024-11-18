import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import MobileMenuToggle from "@/components/MobileMenuToggle";
import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server"; // Import server-side function

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser(); // Get the current user from Clerk

  // Ensure `role` is always a string
  const role = typeof user?.publicMetadata?.role === "string" 
    ? user.publicMetadata.role 
    : "Guest";

  return (
    <div className="h-screen flex flex-col md:flex-row text-white">
      {/* Include the Mobile Menu Toggle for mobile screens and pass the user role */}
      <MobileMenuToggle role={role} />

      {/* Desktop Menu - visible only on larger screens */}
      <div className="hidden md:flex w-[16%] h-full bg-dark-700 p-6 flex-col items-center">
        {/* Logo and Title */}
        <Link href="/" className="flex flex-col items-center mb-5">
          <Image src="/213.png" alt="logo" width={48} height={48} className="mt-8 mb-3" />
          <span className="font-bold text-3xl text-center">Harvitt</span>
        </Link>

        {/* Server-side Menu */}
        <Menu role={role} />
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-[84%] hide-scrollbar overflow-scroll flex flex-col">
        <Navbar />
        <div className="p-6 bg-dark-700 flex-1">{children}</div>
      </div>
    </div>
  );
}
