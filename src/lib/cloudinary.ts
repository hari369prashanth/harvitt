// lib/cloudinary.ts
export const uploadFileToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  if (!result.secure_url) throw new Error("File upload failed.");
  return result.secure_url;
};
