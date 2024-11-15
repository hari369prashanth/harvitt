// ParentForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect } from "react";
import { parentSchema, ParentSchema } from "@/lib/formValidationSchemas";
import { createParent, updateParent } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const ParentForm = ({
    type,
    data,
    setOpen,
    relatedData, // Add this line to accept the new prop
  }: {
    type: "create" | "update";
    data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: any; // Add this line to type the new prop
  }) => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<ParentSchema>({
      resolver: zodResolver(parentSchema),
    });
  
    const router = useRouter();
  
    const onSubmit = handleSubmit((data) => {
      const action = type === "create" ? createParent : updateParent;
      action(data).then((response) => {
        if (response.success) {
          toast(`Parent has been ${type === "create" ? "created" : "updated"}!`);
          setOpen(false);
          router.refresh();
        } else {
          toast.error("An error occurred. Please try again.");
        }
      });
    });

  return (
    <form className="flex flex-col gap-8 text-black" onSubmit={onSubmit}>
      <h1 className="text-2xl text-center font-bold pb-6">
        {type === "create" ? "Create a new parent" : "Update the parent"}
      </h1>
      <div className="flex justify-between flex-wrap gap-6">
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
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
      </div>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
        />
        <InputField
          label="Last Name"
          name="surname"
          defaultValue={data?.surname}
          register={register}
          error={errors.surname}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
        />
        <InputField
          label="Student ID"
          name="studentId"
          defaultValue={data?.studentId}
          register={register}
          error={errors.studentId}
        />
      </div>
      <InputField
      label="Password"
      name="password"
      defaultValue={data?.password || ""}
      register={register}
      error={errors?.password}
      type="password"
    />
      {errors.studentId && (
        <span className="text-red-500">{errors.studentId.message}</span>
      )}
      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ParentForm;
