import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex  text-white">
      {/* LEFT */}
      <div className="w-[16%] p-6  flex flex-col items-center">
        {/* Logo and Title */}
        <Link
          href="/"
          className="flex flex-col items-center mb-5 "
        >
          <Image src="/213.png" alt="logo" width={48} height={48} className="mt-8 mb-3"/>
          <span className="font-bold text-3xl text-center  ">Harvitt </span>

          
        </Link>

        {/* Menu */}
        <Menu />
      </div>

      {/* RIGHT */}
      <div className="w-[84%] hide-scrollbar overflow-scroll flex flex-col ">
        <Navbar  />
        <div className="p-6 bg-dark-700 flex-1">{children}</div>
      </div>
    </div>
  );
}
