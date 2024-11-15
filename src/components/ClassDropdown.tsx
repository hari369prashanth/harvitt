"use client";

import { useRouter } from "next/navigation";

type ClassDropdownProps = {
  classes: string[];
  selectedClass?: string;
};

const ClassDropdown: React.FC<ClassDropdownProps> = ({ classes, selectedClass }) => {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    router.push(`/list/attendance?selectedClass=${selected}`);
  };

  return (
    <div className="my-4">
      <label htmlFor="classDropdown" className="font-semibold mr-2">
        Select Class:
      </label>
      <select
        id="classDropdown"
        name="classDropdown"
        className="p-2 border rounded-md"
        onChange={handleChange}
        defaultValue={selectedClass || ""}
      >
        <option value="">All Classes</option>
        {classes.map((className) => (
          <option key={className} value={className}>
            {className}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ClassDropdown;
