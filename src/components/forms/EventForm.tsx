"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { eventSchema, EventSchema } from "@/lib/formValidationSchemas";
import { createEvent, updateEvent, deleteEvent } from "@/lib/actions";
import InputField from "../InputField";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type EventFormProps = {
  type: "create" | "update" | "delete";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: { classes?: { id: number; name: string }[] };
};

const EventForm = ({ type, data, setOpen, relatedData }: EventFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventSchema>({
    resolver: zodResolver(eventSchema),
    defaultValues: data,
  });

  const router = useRouter();

  const onSubmit = handleSubmit(async (formData) => {
    let result;
    if (type === "create") {
      result = await createEvent(formData);
    } else if (type === "update") {
      result = await updateEvent(formData);
    }

    if (result?.success) {
      toast(`Event has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  });

  return (
    <div className="block inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="relative w-full max-w-4xl h-full overflow-hidden">
    <form className="flex flex-col gap-6 p-6 bg-white bg-opacity-80 backdrop-blur-lg shadow-xl rounded-lg text-black overflow-y-auto h-full" onSubmit={onSubmit}>
      <h1 className="text-2xl text-center font-bold pb-6">
        {type === "create" ? "Create a New Event" : "Update the Event"}
      </h1>
      <span className="text-sm text-gray-500 font-medium">
          Event Details
        </span>

      <InputField
        label="Event Title"
        name="title"
        register={register}
        error={errors.title}
        defaultValue={data?.title}
      />

      <InputField
        label="Description"
        name="description"
        register={register}
        error={errors.description}
        defaultValue={data?.description}
      />

      <InputField
        label="Start Time"
        name="startTime"
        register={register}
        error={errors.startTime}
        type="datetime-local"
        defaultValue={data?.startTime}
      />

      <InputField
        label="End Time"
        name="endTime"
        register={register}
        error={errors.endTime}
        type="datetime-local"
        defaultValue={data?.endTime}
      />

      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500">Class</label>
        <select
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("classId")}
          defaultValue={data?.classId ?? ""}
        >
          <option value="">All Classes</option>
          {relatedData?.classes?.map((classItem) => (
            <option value={classItem.id} key={classItem.id}>
              {classItem.name}
            </option>
          ))}
        </select>
        {errors.classId && (
          <p className="text-xs text-red-400">{errors.classId.message}</p>
        )}
      </div>

      <button
        type="submit"
        className={`bg-blue-400 text-white p-2 rounded-md ${
          type === "delete" ? "bg-red-400" : "bg-blue-400"
        }`}
      >
        {type === "create" ? "Create" : type === "update" ? "Update" : "Delete"}
      </button>
    </form>
    </div>
    </div>
  );
};

export default EventForm;
