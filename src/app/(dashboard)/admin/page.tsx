import Announcements from "@/components/Announcements";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import CountChartContainer from "@/components/CountChartContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import UserCard from "@/components/UserCard";

const AdminPage = ({ searchParams }: { searchParams: { [keys: string]: string | undefined } }) => {
  return (
    <div className="p-4 flex flex-col gap-6 xl:flex-row admin-container">
      {/* LEFT */}
      <div className="w-full xl:w-2/3 flex flex-col gap-6">
        {/* USER CARDS */}
        <div className="flex flex-wrap gap-4">
          <UserCard type="admin" />
          <UserCard type="teacher" />
          <UserCard type="student" />
          <UserCard type="parent" />
        </div>
        
        {/* CHARTS */}
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer />
          </div>
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChartContainer />
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
        <EventCalendarContainer searchParams={searchParams} />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
