"use client"; 

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { resultSchema, ResultSchema } from "@/lib/formValidationSchemas";
import { createResult, updateResult } from "@/lib/actions";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ResultForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any; // Includes students, exams, and assignments
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
  });

  const router = useRouter();

  const onSubmit = handleSubmit(async (formData) => {
    const action = type === "create" ? createResult : updateResult;

    const currentState = { success: false, error: false }; // Create an initial state

    try {
      // Forcefully convert score to a number using parseFloat
      const parsedData = {
        ...formData,
        id: data?.id,
        score: parseFloat(formData.score.toString()), // Ensuring score is a number
        examId: formData.examId ? Number(formData.examId) : null,
        assignmentId: formData.assignmentId ? Number(formData.assignmentId) : null,
      };

      // Check if score is a valid number before proceeding
      if (isNaN(parsedData.score)) {
        throw new Error("Score must be a valid number.");
      }

      const result = await action(currentState, parsedData);

      if (result.success) {
        toast(`Result has been ${type === "create" ? "created" : "updated"}!`);
        setOpen(false);
        router.refresh();
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error: unknown) {
      // Properly handle the error type
      const message = (error as Error).message || "Something went wrong!";
      toast.error(`Error: ${message}`);
      console.error("Submit error: ", error); // Log error for debugging
    }
  });

  const { students, exams, assignments } = relatedData || { students: [], exams: [], assignments: [] };

  return (
    <div className="block inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl  overflow-hidden">
        <form
          className="flex flex-col gap-6 p-6 bg-white bg-opacity-80 backdrop-blur-lg shadow-xl rounded-lg text-black overflow-y-auto h-full"
          onSubmit={onSubmit}
        >
          <h1 className="text-2xl font-bold text-center pb-4">
            {type === "create" ? "Create a New Result" : "Update Result"}
          </h1>

          <span className="text-sm text-gray-500 font-medium">
            Result Details
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputField
              label="Score"
              name="score"
              defaultValue={data?.score ?? 0}
              register={register}
              error={errors?.score}
              type="number"
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Student</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("studentId")}
                defaultValue={data?.studentId}
              >
                {students.map((student: { id: string; name: string }) => (
                  <option value={student.id} key={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
              {errors.studentId?.message && (
                <p className="text-xs text-red-400">
                  {errors.studentId.message.toString()}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Exam</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("examId")}
                defaultValue={data?.examId || ""}
              >
                <option value="">No Exam</option>
                {exams.map((exam: { id: number; title: string }) => (
                  <option value={exam.id} key={exam.id}>
                    {exam.title}
                  </option>
                ))}
              </select>
              {errors.examId?.message && (
                <p className="text-xs text-red-400">
                  {errors.examId.message.toString()}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Assignment</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("assignmentId")}
                defaultValue={data?.assignmentId || ""}
              >
                <option value="">No Assignment</option>
                {assignments.map((assignment: { id: number; title: string }) => (
                  <option value={assignment.id} key={assignment.id}>
                    {assignment.title}
                  </option>
                ))}
              </select>
              {errors.assignmentId?.message && (
                <p className="text-xs text-red-400">
                  {errors.assignmentId.message.toString()}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            {type === "create" ? "Create" : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResultForm;
