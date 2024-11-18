"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
  examSchema,
  ExamSchema,
  subjectSchema,
  SubjectSchema,
} from "@/lib/formValidationSchemas";
import {
  createExam,
  createSubject,
  updateExam,
  updateSubject,
} from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ExamForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExamSchema>({
    resolver: zodResolver(examSchema),
  });

  // AFTER REACT 19 IT'LL BE USEACTIONSTATE

  const [state, formAction] = useFormState(
    type === "create" ? createExam : updateExam,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Exam has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { lessons } = relatedData;

  return (
    <div className="block inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="relative w-full max-w-4xl  overflow-hidden">
      <form
        className="flex flex-col gap-6 p-6 bg-white bg-opacity-80 backdrop-blur-lg shadow-xl rounded-lg text-black overflow-y-auto h-full"
        onSubmit={onSubmit}
      >
        <h1 className="text-2xl font-bold text-center pb-4">
          {type === "create" ? "Create a New Exam" : "Update the Exam"}
        </h1>

        <span className="text-sm text-gray-500 font-medium">Exam Details</span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Exam Title */}
          <InputField
            label="Exam Title"
            name="title"
            defaultValue={data?.title}
            register={register}
            error={errors?.title}
            placeholder="Enter exam title"
          />

          {/* Start Date */}
          <InputField
            label="Start Date"
            name="startTime"
            type="datetime-local"
            defaultValue={data?.startTime}
            register={register}
            error={errors?.startTime}
          />

          {/* End Date */}
          <InputField
            label="End Date"
            name="endTime"
            type="datetime-local"
            defaultValue={data?.endTime}
            register={register}
            error={errors?.endTime}
          />

          {/* Lesson Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">Lesson</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("lessonId")}
              defaultValue={data?.lessonId || ""}
            >
              <option value="" disabled>
                Select Lesson
              </option>
              {lessons?.length > 0 ? (
                lessons.map((lesson: { id: number; name: string }) => (
                  <option value={lesson.id} key={lesson.id}>
                    {lesson.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No Lessons Available
                </option>
              )}
            </select>
            {errors.lessonId?.message && (
              <p className="text-xs text-red-400">
                {errors.lessonId.message.toString()}
              </p>
            )}
          </div>

          {/* Hidden ID Field */}
          {data && (
            <InputField
              label="ID"
              name="id"
              defaultValue={data?.id}
              register={register}
              error={errors?.id}
              hidden
            />
          )}
        </div>

        {/* Error Display */}
        {state.error && (
          <p className="text-sm text-center text-red-500">
            Something went wrong! Please try again.
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          {type === "create" ? "Create Exam" : "Update Exam"}
        </button>
      </form>
    </div>
  </div>
  );
};

export default ExamForm;
