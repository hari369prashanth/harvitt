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
    <form className="flex flex-col gap-8 text-black" onSubmit={onSubmit}>
      <h1 className="text-2xl text-center font-bold pb-6">
        {type === "create" ? "Create a new result" : "Update the result"}
      </h1>

      <div className="flex justify-between flex-wrap gap-8">
        <InputField
          label="Score"
          name="score"
          defaultValue={data?.score ?? 0} // Ensure default value is numeric
          register={register}
          error={errors?.score}
          type="number"
          
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-black">Student</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full text-black"
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

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-black">Exam</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full text-black"
            {...register("examId")}
            defaultValue={data?.examId || ""} // Ensure default value is a string for the select
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

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-black">Assignment</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full text-black"
            {...register("assignmentId")}
            defaultValue={data?.assignmentId || ""} // Ensure default value is a string for the select
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

      <button type="submit" className="bg-blue-400 text-black p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ResultForm;
