"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { parentSchema, ParentSchema } from "@/lib/formValidationSchemas";
import { createParent, updateParent } from "@/lib/actions";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";

interface ParentFormProps {
  type: "create" | "update";
  data?: ParentSchema;
  relatedData?: { students: { id: string; name: string; surname: string }[] };
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ParentForm = ({ type, data, relatedData, setOpen }: ParentFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ParentSchema>({
    resolver: zodResolver(parentSchema),
    defaultValues: data,
  });

  const onSubmit = async (formData: ParentSchema) => {
    const action = type === "create" ? createParent : updateParent;
    const result = await action(formData);

    if (result.success) {
      toast(`${type === "create" ? "Parent created!" : "Parent updated!"}`);
      setOpen(false);
    } else {
      toast.error("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Username"
        {...register("username")}
        className="input"
      />
      {errors.username && <p className="text-red-600">{errors.username.message}</p>}

      <input
        type="text"
        placeholder="First Name"
        {...register("name")}
        className="input"
      />
      {errors.name && <p className="text-red-600">{errors.name.message}</p>}

      <input
        type="text"
        placeholder="Last Name"
        {...register("surname")}
        className="input"
      />
      {errors.surname && <p className="text-red-600">{errors.surname.message}</p>}

      <input
        type="email"
        placeholder="Email"
        {...register("email")}
        className="input"
      />
      {errors.email && <p className="text-red-600">{errors.email.message}</p>}

      <input
        type="text"
        placeholder="Phone"
        {...register("phone")}
        className="input"
      />
      {errors.phone && <p className="text-red-600">{errors.phone.message}</p>}

      <input
        type="text"
        placeholder="Address"
        {...register("address")}
        className="input"
      />
      {errors.address && <p className="text-red-600">{errors.address.message}</p>}

      {/* Select associated students */}
      <Controller
        name="studentIds" // Ensure this matches the schema definition
        control={control}
        render={({ field }) => (
          <select {...field} multiple className="input">
            {relatedData?.students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} {student.surname}
              </option>
            ))}
          </select>
        )}
      />
      {errors.studentIds && <p className="text-red-600">{errors.studentIds.message}</p>}

      <button type="submit" className="btn-primary">
        {type === "create" ? "Create Parent" : "Update Parent"}
      </button>
    </form>
  );
};

export default ParentForm;
