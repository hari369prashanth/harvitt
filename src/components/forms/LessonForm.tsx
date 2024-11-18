"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { lessonSchema, LessonSchema } from "@/lib/formValidationSchemas";
import { createLesson, updateLesson } from "@/lib/actions";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const LessonForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData: {
    classes?: Array<{ id: number; name: string }>;
    teachers?: Array<{ id: string; name: string; surname: string }>;
    subjects?: Array<{ id: number; name: string }>;
  };
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
  });

  const onSubmit = handleSubmit(async (formData) => {
    console.log("Form Data Submitted:", formData); // Log the form data for debugging

    const lessonData = {
        id: data?.id,
      name: formData.name,
      classId: formData.classId,
      teachers: formData.teachers, // Should be an array
      subjectId: formData.subjectId,
      day: formData.day,
      startTime: formData.startTime, // Should be in proper format
      endTime: formData.endTime, // Should be in proper format
    };

    const action = type === "create" ? createLesson : updateLesson;

    try {
      const result = await action(lessonData);
      if (result.success) {
        toast(`Lesson ${type === "create" ? "created" : "updated"} successfully!`);
        setOpen(false);
        router.refresh();
      } else {
        toast.error("An error occurred while submitting the form.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("An unexpected error occurred.");
    }
  });

  const router = useRouter();

  useEffect(() => {
    if (errors) {
      console.log(errors); // For debugging validation errors
    }
  }, [errors]);

  const { classes = [], teachers = [], subjects = [] } = relatedData;

  return (
    <div className="block inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="relative w-full max-w-4xl  overflow-hidden">
      <form
        className="flex flex-col gap-6 p-6 bg-white bg-opacity-80 backdrop-blur-lg shadow-xl rounded-lg text-black overflow-y-auto h-full"
        onSubmit={onSubmit}
      >
        <h1 className="text-2xl font-bold text-center pb-4">
          {type === "create" ? "Create a New Lesson" : "Update the Lesson"}
        </h1>

        <span className="text-md text-gray-500 font-medium">Lesson Details</span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Lesson Name */}
          <InputField
            label="Lesson Name"
            name="name"
            defaultValue={data?.name}
            register={register}
            error={errors?.name}
            placeholder="Enter lesson name"
          />

          {/* Class Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">Class</label>
            <select
              {...register("classId", { valueAsNumber: true })}
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              defaultValue={data?.classId || ""}
            >
              <option value="" disabled>
                Select Class
              </option>
              {classes.length > 0 ? (
                classes.map((classItem) => (
                  <option value={classItem.id} key={classItem.id}>
                    {classItem.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No Classes Available
                </option>
              )}
            </select>
            {errors.classId && (
              <p className="text-xs text-red-400">{errors.classId.message}</p>
            )}
          </div>

          {/* Teacher Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">Teacher</label>
            <select
              multiple
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("teachers")}
              defaultValue={data?.teachers}
            >
              {teachers.map((teacher) => (
                <option value={teacher.id} key={teacher.id}>
                  {teacher.name + " " + teacher.surname}
                </option>
              ))}
            </select>
            {errors.teachers?.message && (
              <p className="text-xs text-red-400">
                {errors.teachers.message.toString()}
              </p>
            )}
          </div>

          {/* Subject Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">Subject</label>
            <select
              {...register("subjectId", { valueAsNumber: true })}
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              defaultValue={data?.subjectId || ""}
            >
              <option value="" disabled>
                Select Subject
              </option>
              {subjects.length > 0 ? (
                subjects.map((subject) => (
                  <option value={subject.id} key={subject.id}>
                    {subject.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No Subjects Available
                </option>
              )}
            </select>
            {errors.subjectId && (
              <p className="text-xs text-red-400">{errors.subjectId.message}</p>
            )}
          </div>

          {/* Day Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">Day</label>
            <select
              {...register("day")}
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              defaultValue={data?.day || ""}
            >
              <option value="" disabled>
                Select Day
              </option>
              {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"].map(
                (day) => (
                  <option value={day} key={day}>
                    {day}
                  </option>
                )
              )}
            </select>
            {errors.day && (
              <p className="text-xs text-red-400">{errors.day.message}</p>
            )}
          </div>

          {/* Start Time */}
          <InputField
            label="Start Date and Time"
            name="startTime"
            type="datetime-local"
            defaultValue={data?.startTime}
            register={register}
            error={errors?.startTime}
          />

          {/* End Time */}
          <InputField
            label="End Date and Time"
            name="endTime"
            type="datetime-local"
            defaultValue={data?.endTime}
            register={register}
            error={errors?.endTime}
          />
        </div>

        <button
          type="submit"
          className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          {type === "create" ? "Create Lesson" : "Update Lesson"}
        </button>
      </form>
    </div>
  </div>
  );
};

export default LessonForm;
