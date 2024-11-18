"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  studentSchema,
  StudentSchema,
  teacherSchema,
  TeacherSchema,
} from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import {
  createStudent,
  createTeacher,
  updateStudent,
  updateTeacher,
} from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";

const StudentForm = ({
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
  } = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
  });

  const [img, setImg] = useState<any>();

  const [state, formAction] = useFormState(
    type === "create" ? createStudent : updateStudent,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    console.log("hello");
    console.log(data);
    formAction({ ...data, img: img?.secure_url });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Student has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { grades, classes } = relatedData;

  return (
       <div className="block inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm ">

      <div className="relative w-full max-w-4xl h-[90vh] overflow-hidden ">
    <form
    className="flex flex-col gap-6 p-6 bg-white bg-opacity-80 backdrop-blur-lg shadow-xl rounded-lg text-black overflow-y-auto h-full"
    onSubmit={onSubmit}
  >
    <h1 className="text-2xl font-bold text-center pb-4">
      {type === "create" ? "Create a New Student" : "Update Student"}
    </h1>

    <span className="text-sm text-gray-500 font-medium">
      Authentication Information
    </span>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField
        label="Username"
        name="username"
        defaultValue={data?.username}
        register={register}
        error={errors?.username}
      />
      <InputField
        label="Email"
        name="email"
        defaultValue={data?.email}
        register={register}
        error={errors?.email}
      />
      <InputField
        label="Password"
        name="password"
        type="password"
        defaultValue={type === "create" ? "Harvitt@36963" : data?.password}
        register={register}
        error={errors?.password}
      />
    </div>

    <span className="text-sm text-gray-500 font-medium">
      Personal Information
    </span>
    <CldUploadWidget
      uploadPreset="school"
      onSuccess={(result, { widget }) => {
        setImg(result.info);
        widget.close();
      }}
    >
      {({ open }) => (
        <div
          className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
          onClick={() => open()}
        >
          <Image src="/upload.png" alt="Upload" width={28} height={28} />
          <span>Upload a photo</span>
        </div>
      )}
    </CldUploadWidget>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <InputField
        label="First Name"
        name="name"
        defaultValue={data?.name}
        register={register}
        error={errors?.name}
      />
      <InputField
        label="Last Name"
        name="surname"
        defaultValue={data?.surname}
        register={register}
        error={errors?.surname}
      />
      <InputField
        label="Phone"
        name="phone"
        defaultValue={data?.phone}
        register={register}
        error={errors?.phone}
      />
      <InputField
        label="Address"
        name="address"
        defaultValue={data?.address}
        register={register}
        error={errors?.address}
      />
      <InputField
        label="Blood Type"
        name="bloodType"
        defaultValue={data?.bloodType}
        register={register}
        error={errors?.bloodType}
      />
      <InputField
        label="Birthday"
        name="birthday"
        type="date"
        defaultValue={data?.birthday?.toISOString().split("T")[0]}
        register={register}
        error={errors?.birthday}
      />
      <InputField
        label="Parent Id"
        name="parentId"
        defaultValue={data?.parentId}
        register={register}
        error={errors?.parentId}
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-500">Sex</label>
        <select
          className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
          {...register("sex")}
          defaultValue={data?.sex}
        >
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>
        {errors.sex?.message && (
          <p className="text-xs text-red-400">{errors.sex.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-500">Grade</label>
        <select
          className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
          {...register("gradeId")}
          defaultValue={data?.gradeId}
        >
          {grades.map((grade: { id: number; level: number }) => (
            <option value={grade.id} key={grade.id}>
              {grade.level}
            </option>
          ))}
        </select>
        {errors.gradeId?.message && (
          <p className="text-xs text-red-400">{errors.gradeId.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-500">Class</label>
        <select
          className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
          {...register("classId")}
          defaultValue={data?.classId}
        >
          {classes.map(
            (classItem: {
              id: number;
              name: string;
              capacity: number;
              _count: { students: number };
            }) => (
              <option value={classItem.id} key={classItem.id}>
                ({classItem.name} -{" "}
                {classItem._count.students + "/" + classItem.capacity}{" "}
                Capacity)
              </option>
            )
          )}
        </select>
        {errors.classId?.message && (
          <p className="text-xs text-red-400">{errors.classId.message}</p>
        )}
      </div>
    </div>

    {state.error && (
      <span className="text-red-500">Something went wrong!</span>
    )}
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

export default StudentForm;
