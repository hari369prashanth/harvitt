"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const AttendanceCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  const router = useRouter();

  
  useEffect(() => {
    if (value instanceof Date) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;
      router.push(`?date=${dateString}`);
    }
  }, [value, router]);

  return <Calendar onChange={onChange} value={value} />;
};

export default AttendanceCalendar;
