"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

// Setting up the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

const BigCalendar = ({
  data,
}: {
  data: { title: string; start: Date; end: Date }[];
}) => {
  const [view, setView] = useState<View>(Views.DAY); // Default to 'day' view
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  const handleDateSelect = (date: Date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    setSelectedDate(normalizedDate);
    setView(Views.DAY);
  };

  const handleNavigate = (date: Date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    setSelectedDate(normalizedDate);
  };

  // Filter events only for the selected date (Day View)
  const filteredData = view === Views.DAY
    ? data.filter((event) => {
        const eventDate = new Date(event.start);
        eventDate.setHours(0, 0, 0, 0); // Normalize event start date to midnight
        return eventDate.getTime() === selectedDate.getTime();
      })
    : data; // For Week View, show all events

  return (
    <Calendar
      localizer={localizer}
      events={filteredData}
      startAccessor="start"
      endAccessor="end"
      views={{ day: true, week: true }}
      date={selectedDate}
      view={view}
      style={{ height: "98%" }}
      onView={handleOnChangeView}
      selectable
      onSelectSlot={(slotInfo) => handleDateSelect(slotInfo.start)}
      onNavigate={handleNavigate}
      min={new Date(2025, 1, 0, 7, 0, 0)}
      max={new Date(2025, 1, 0, 19, 0, 0)}
    />
  );
};

export default BigCalendar;
