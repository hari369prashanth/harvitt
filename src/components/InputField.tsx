import { FieldError, UseFormRegister } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: "text" | "email" | "password" | "number" | "time" | "datetime-local" | "date";
  register: UseFormRegister<any>;
  name: string;
  defaultValue?: string | number | Date; // Accept Date as an input
  error?: FieldError;
  hidden?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  placeholder?: string;
  className?: string; 
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  hidden,
  inputProps,
  className,
}: InputFieldProps) => {
  // Format Date to string (yyyy-mm-dd) if the input type is 'date'
  const formattedDefaultValue =
    type === "date" && defaultValue instanceof Date
      ? defaultValue.toISOString().split("T")[0] // yyyy-mm-dd
      : defaultValue; // Else, leave as is for other types

  return (
    <div className={`${hidden ? "hidden" : "flex flex-col gap-2 w-full"} ${className}`}>
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        {...register(name, type === "number" ? { valueAsNumber: true } : {})}
        className={`ring-[1.5px] p-2 rounded-md text-sm w-full text-black placeholder:text-black focus:text-black ${
          error ? "ring-red-400" : "ring-gray-300"
        }`}
        defaultValue={formattedDefaultValue as string | number} // Convert Date to string if needed
        {...inputProps}
      />
      {error?.message && (
        <p className="text-xs text-red-400">{error.message}</p>
      )}
    </div>
  );
};

export default InputField;
