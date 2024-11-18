import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

const Navbar = async () => {
  const user = await currentUser();
  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();

  return (
    <div className="flex items-center justify-between mt-10 p-4">
      
      <span className="hidden md:block font-bold text-2xl text-grey-800">Dashboard</span>

      {/* Centered Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2 lg:hidden  ">
        <Image
          src="/213.png" // Replace with your logo path
          alt="Logo"
          width={40} // Adjust size as needed
          height={40}
        />
      </div>

      <div className="flex items-center gap-3 justify-end w-full pr-10">
        <div className="flex flex-col hidden md:block text-right pr-2">
          <span className="text-md leading-1 font-medium text-white py-1">{fullName || 'User'}</span>
          <div></div>
          <span className="text-sm text-gray-200 ">
            {user?.publicMetadata?.role as string || 'Guest'}
          </span>
        </div>
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
