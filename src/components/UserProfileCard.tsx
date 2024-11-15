import Image from "next/image"; 
import { FaEnvelope, FaPhone, FaUser, FaGraduationCap, FaHeart, FaClock } from "react-icons/fa";

interface UserProfile {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  username: string;
  img?: string | null;
  age: number;
  role: string;
  className?: string;
  bloodType?: string | null;
}

const UserProfileCard = ({ userProfile }: { userProfile: UserProfile }) => {
  return (
    <div className=" border-2 border-gray-600 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center space-y-6 text-white hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105">
      
      {/* Welcome Message */}
      <h2 className="text-3xl font-semibold text-gray-100">Welcome, {userProfile.username}!</h2>

      {/* Profile Picture */}
      <div className="relative w-28 h-28 hover:scale-125 transition-transform duration-150">
        <Image
          src={userProfile.img || "/noAvatar.png"}
          alt="Profile Image"
          width={112}
          height={112}
          className="rounded-full border-4 border-blue-500 shadow-md"
        />
      </div>

      {/* User Details */}
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-gray-200">{userProfile.name} {userProfile.surname}</h2>
        <p className="text-lg text-cyan-200 font-medium">{userProfile.role}</p>
        
        {/* Information Fields */}
        <div className="mt-6 w-full border-t border-gray-500 pt-4 space-y-3">
          <p className="flex items-center justify-center">
            <FaEnvelope className="mr-2 text-cyan-200" /> 
            <span className="text-gray-300">{userProfile.email}</span>
          </p>
          <p className="flex items-center justify-center">
            <FaPhone className="mr-2 text-cyan-200" /> 
            <span className="text-gray-300">{userProfile.phone}</span>
          </p>
          <p className="flex items-center justify-center">
            <FaUser className="mr-2 text-cyan-200" /> 
            <span className="text-gray-300">{userProfile.username}</span>
          </p>
          <p className="flex items-center justify-center">
            <FaGraduationCap className="mr-2 text-cyan-200" /> 
            <span className="text-gray-300">{userProfile.className}</span>
          </p>
          <p className="flex items-center justify-center">
            <FaHeart className="mr-2 text-cyan-200" /> 
            <span className="text-gray-300">{userProfile.bloodType || "N/A"}</span>
          </p>
          <p className="flex items-center justify-center">
            
            <strong className="mr-2 text-white">Age:</strong>
            <span className="text-gray-300">{userProfile.age}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
