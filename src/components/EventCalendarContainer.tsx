import Image from "next/image";
import EventCalendar from "./EventCalendar";
import EventList from "./EventList";
import Link from "next/link";

const EventCalendarContainer = async ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  const { date } = searchParams;
  return (
    <div className="bg-transparent-white-contrast p-4 rounded-md">
      <EventCalendar />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4 text-white">Events</h1>
        <Link href="/list/events">
        <Image src="/moreDark.png" alt="" width={20} height={20} />
        </Link>
      </div>
      <Link href="/list/events">
      <div className="flex flex-col gap-4">
        <EventList dateParam={date} />

      </div>
      </Link >
    </div>
  );
};

export default EventCalendarContainer;
