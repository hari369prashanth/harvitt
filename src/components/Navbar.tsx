import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

const Navbar = async () => {
  const user = await currentUser();
  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();

  return (
    <div className="flex items-center justify-between mt-10 p-4 ">
      
      <span className="font-bold text-2xl text-center text-grey-800 ">  Dashboard </span>
      <div className="flex items-center gap-3 justify-end w-full pr-10">
        
        <div className="flex flex-col">
          <span className="text-md leading-1 font-medium text-white py-1">{fullName || 'User'}</span>
          <span className="text-sm text-gray-200 text-right">
            {user?.publicMetadata?.role as string || 'Guest'}
          </span>
        </div>
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
