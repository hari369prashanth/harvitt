"use client"; 

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { parseISO } from "date-fns";
import { AttendanceSchema, attendanceSchema } from "@/lib/formValidationSchemas";
import { createAttendance, updateAttendance, deleteAttendance } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface AttendanceFormProps {
  type: "create" | "update";
  data?: any; // Attendance data to populate form for update
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: {
    students: { id: string; name: string }[];
    lessons: { id: number; name: string }[];
  };
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({ type, data, setOpen, relatedData }) => {
  const router = useRouter();
  
  // Initialize form hook
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<AttendanceSchema>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      studentId: data?.studentId || "", // Default to provided studentId for update
      date: data?.date ? (typeof data.date === "string" ? parseISO(data.date) : data.date) : new Date(),
      lessons: data?.lessons || [{ lessonId: 0, present: false }], // Default lessons if data exists
    },
  });

  // Fetch data when editing an existing attendance record
  useEffect(() => {
    if (data) {
      setValue("studentId", data.studentId); // Set studentId in form
      if (data.date) {
        const parsedDate = typeof data.date === "string" ? parseISO(data.date) : data.date;
        setValue("date", parsedDate); // Set date in form
      }
      // Set lessons (with presence) if any exist in the data
      data.lessons.forEach((lesson: any, index: number) => {
        setValue(`lessons.${index}.lessonId`, lesson.lessonId);
        setValue(`lessons.${index}.present`, lesson.present);
      });
    }
  }, [data, setValue]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lessons",
  });

  const onSubmit = async (formData: AttendanceSchema) => {
    // Ensure the date is parsed if it's a string
    if (typeof formData.date === "string") {
      formData.date = parseISO(formData.date);
    }

    const action = type === "create" ? createAttendance : updateAttendance;
    const result = await action(formData);

    if (result.success) {
      toast(`Attendance ${type === "create" ? "created" : "updated"} successfully!`);
      setOpen(false); // Close form after success
      router.refresh(); // Refresh the page to get the updated data
    } else {
      toast.error("Failed to submit attendance.");
    }
  };

  const handleDeleteAttendance = async () => {
    if (data?.id) {
      const result = await deleteAttendance(data.id);
      if (result.success) {
        toast("Attendance deleted successfully!");
        setOpen(false); // Close the form after deletion
        router.refresh(); // Refresh the page to reflect changes
      } else {
        toast.error("Failed to delete attendance.");
      }
    }
  };

  return (
    <div className="block inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="relative w-full max-w-4xl h-full overflow-hidden">
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 p-6 bg-white bg-opacity-80 backdrop-blur-lg shadow-xl rounded-lg text-black overflow-y-auto h-full">
      <h1 className="text-2xl text-center font-bold">
        {type === "create" ? "Create a new attendance" : "Update the attendance"}
      </h1>
      {/* Student Selection */}
      <div>
        <label>Student</label>
        <select
          {...register("studentId", { required: "Please select a student" })}
          className="border p-2 w-full"
          disabled={!!data?.studentId} // Disable if updating, as student should be selected
        >
          <option value="">Select a student</option>
          {relatedData?.students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
        {errors.studentId && <p className="text-red-500">{errors.studentId.message}</p>}
      </div>

      {/* Date Field */}
      <div>
        <label>Date</label>
        <input
          type="date"
          {...register("date")}
          className="border p-2 w-full"
        />
        {errors.date && <p className="text-red-500">{errors.date.message}</p>}
      </div>

      {/* Lessons and Attendance Status */}
      {fields.map((field, index) => (
        <div key={field.id} className="flex space-x-4 items-center">
          <div className="flex-1">
            <label>Lesson</label>
            <select
              {...register(`lessons.${index}.lessonId`, {
                required: "Select a lesson",
                valueAsNumber: true,
              })}
              className="border p-2 w-full"
            >
              <option value="">Select a lesson</option>
              {relatedData?.lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.name}
                </option>
              ))}
            </select>
            {errors.lessons?.[index]?.lessonId && (
              <p className="text-red-500">{errors.lessons[index].lessonId.message}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <label>Present</label>
            <input
              type="checkbox"
              {...register(`lessons.${index}.present`)}
              className="h-5 w-5"
            />
          </div>
        </div>
      ))}

      {/* Add Lesson Button */}
      <button
        type="button"
        onClick={() => append({ lessonId: 0, present: false })}
        className="bg-blue-500 text-white p-2 rounded mt-2"
      >
        Add Lesson
      </button>

      {/* Form Submission */}
      <div className="flex space-x-4">
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          {type === "create" ? "Create" : "Update"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="bg-gray-500 text-white p-2 rounded"
        >
          Cancel
        </button>
      </div>

      {/* Delete Button for Update */}
      {type === "update" && data?.id && (
        <div className="mt-4">
          <button
            type="button"
            onClick={handleDeleteAttendance}
            className="bg-red-600 text-white p-2 rounded"
          >
            Delete Attendance
          </button>
        </div>
      )}
    </form>
    </div>
    </div>
  );
};

export default AttendanceForm;
