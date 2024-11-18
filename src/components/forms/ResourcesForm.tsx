import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { resourceSchema, ResourceSchema } from "@/lib/formValidationSchemas";
import { createResource, updateResource } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";

const ResourceForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: { classes: { id: number; name: string }[] };
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResourceSchema>({
    resolver: zodResolver(resourceSchema),
  });

  const [fileUrl, setFileUrl] = useState<string | null>(data?.fileUrl || null);
  const router = useRouter();

  const onSubmit = async (formData: ResourceSchema) => {
    const payload = {
      ...formData,
      fileUrl: fileUrl ?? data?.fileUrl,
      classId: parseInt(formData.classId.toString(), 10),
    };

    const response = type === "create" ? await createResource(payload) : await updateResource(payload);

    if (response.success) {
      toast.success(`Resource has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    } else {
      toast.error("An error occurred while saving the resource.");
    }
  };

  useEffect(() => {
    if (data && data.fileUrl) setFileUrl(data.fileUrl);
  }, [data]);

  return (
    <form
      className="flex flex-col gap-6 bg-white bg-opacity-80  p-6 rounded-lg shadow-lg  mx-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-2xl font-bold text-black  text-center mb-2">
        {type === "create" ? "Create a New Resource" : "Update Resource"}
      </h1>
      <span className="text-sm text-black font-medium">Resource Information</span>

      <InputField
        label="Title"
        name="title"
        defaultValue={data?.title}
        register={register}
        error={errors?.title}
        className="w-full"
      />

      <InputField
        label="Description"
        name="description"
        defaultValue={data?.description}
        register={register}
        error={errors?.description}
        className="w-full h-auto resize-none" 
      />

      {/* ClassId Dropdown */}
      <label className="block text-sm font-medium text-black">Class</label>
      <select
        {...register("classId", { valueAsNumber: true })}
        defaultValue={data?.classId}
        className="border rounded p-2 text-black focus:border-blue-400"
      >
        <option value="">Select Class</option>
        {relatedData?.classes?.map((cls) => (
          <option key={cls.id} value={cls.id}>
            {cls.name}
          </option>
        ))}
      </select>
      {errors.classId && (
        <p className="text-red-500 text-xs mt-1">{errors.classId.message}</p>
      )}

      <CldUploadWidget
        uploadPreset="pdfupload"
        options={{
          resourceType: "auto",
        }}
        onSuccess={(result: CloudinaryUploadWidgetResults) => {
          if (result.info && typeof result.info === "object" && "secure_url" in result.info) {
            const fileUrl = (result.info as any).secure_url ?? '';
            setFileUrl(fileUrl);
          } else {
            toast.error("Failed to retrieve secure URL for uploaded file.");
          }
        }}
      >
        {({ open }) => (
          <div
            className="text-sm text-blue-500 flex justify-center items-center gap-2 cursor-pointer mt-4"
            onClick={() => open()}
          >
            <Image src="/upload.png" alt="Upload" width={28} height={28} />
            <span>{fileUrl ? "File uploaded" : "Upload a file"}</span>
          </div>
        )}
      </CldUploadWidget>

      {fileUrl && (
        <p className="text-xs text-green-500 justify-center ">File uploaded successfully.</p>
      )}

      <button
        type="submit"
        className="bg-blue-500 text-white p-3 rounded-md mt-4 hover:bg-blue-600 transition-all"
      >
        {type === "create" ? "Create Resource" : "Update Resource"}
      </button>
    </form>
  );
};

export default ResourceForm;
