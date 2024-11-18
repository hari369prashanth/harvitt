"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
  classSchema,
  ClassSchema,
  subjectSchema,
  SubjectSchema,
} from "@/lib/formValidationSchemas";
import {
  createClass,
  createSubject,
  updateClass,
  updateSubject,
} from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ClassForm = ({
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
  } = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
  });

  // AFTER REACT 19 IT'LL BE USEACTIONSTATE

  const [state, formAction] = useFormState(
    type === "create" ? createClass : updateClass,
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
      toast(`Subject has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { teachers, grades } = relatedData;

  return (
    <div className="block inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="relative w-full max-w-4xl  overflow-hidden">
      <form
        className="flex flex-col gap-6 p-6 bg-white bg-opacity-80 backdrop-blur-lg shadow-xl rounded-lg text-black overflow-y-auto h-full"
        onSubmit={onSubmit}
      >
        <h1 className="text-2xl font-bold text-center pb-4">
          {type === "create" ? "Create a New Class" : "Update the Class"}
        </h1>

        <span className="text-sm text-gray-500 font-medium">Class Details</span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputField
            label="Class Name"
            name="name"
            defaultValue={data?.name}
            register={register}
            error={errors?.name}
          />
          <InputField
            label="Capacity"
            name="capacity"
            defaultValue={data?.capacity}
            register={register}
            error={errors?.capacity}
          />
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

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">Supervisor</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("supervisorId")}
              defaultValue={data?.teachers}
            >
              {teachers.map(
                (teacher: { id: string; name: string; surname: string }) => (
                  <option
                    value={teacher.id}
                    key={teacher.id}
                    selected={data && teacher.id === data.supervisorId}
                  >
                    {teacher.name + " " + teacher.surname}
                  </option>
                )
              )}
            </select>
            {errors.supervisorId?.message && (
              <p className="text-xs text-red-400">
                {errors.supervisorId.message.toString()}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">Grade</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("gradeId")}
              defaultValue={data?.gradeId}
            >
              {grades.map((grade: { id: number; level: number }) => (
                <option
                  value={grade.id}
                  key={grade.id}
                  selected={data && grade.id === data.gradeId}
                >
                  {grade.level}
                </option>
              ))}
            </select>
            {errors.gradeId?.message && (
              <p className="text-xs text-red-400">
                {errors.gradeId.message.toString()}
              </p>
            )}
          </div>
        </div>

        {state.error && (
          <span className="text-red-500">Something went wrong!</span>
        )}
        <button
          className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          {type === "create" ? "Create" : "Update"}
        </button>
      </form>
    </div>
  </div>
  );
};

export default ClassForm;
