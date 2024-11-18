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
    <div className="block inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="relative w-full max-w-4xl h-full overflow-hidden">
      <form
        className="flex flex-col gap-6 p-6 bg-white bg-opacity-80 backdrop-blur-lg shadow-xl rounded-lg text-black overflow-y-auto h-full"
        onSubmit={onSubmit}
      >
        <h1 className="text-2xl font-bold text-center pb-4">
          {type === "create" ? "Create a New Parent" : "Update Parent"}
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
            label="Phone"
            name="phone"
            defaultValue={data?.phone}
            register={register}
            error={errors.phone}
          />
        </div>

        <span className="text-sm text-gray-500 font-medium">
          Personal Information
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <span className="text-sm text-gray-500 font-medium">
          Security Information
        </span>
        <InputField
          label="Password"
          name="password"
          defaultValue={type === "create" ? "Harvitt@36963" : data?.password}
          register={register}
          error={errors?.password}
          type="password"
        />

        {errors.studentId && (
          <span className="text-xs text-red-400">
            {errors.studentId.message}
          </span>
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

export default ParentForm;