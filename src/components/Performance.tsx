"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface PerformanceProps {
  role: string; // Admin or Student
  studentId?: string; // Optional, only for admin
}

const Performance: React.FC<PerformanceProps> = ({ role, studentId }) => {
  const [gradePoint, setGradePoint] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGradePoint = async () => {
      try {
        const endpoint =
          role === "admin" && studentId
            ? `/api/results?studentId=${studentId}`
            : "/api/results";

        const response = await fetch(endpoint);
        const data = await response.json();

        if (response.ok) {
          setGradePoint(parseFloat(data.gradePoint));
        } else {
          console.error("Error:", data.error || "Unknown error");
        }
      } catch (error) {
        console.error("Error fetching grade point:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGradePoint();
  }, [role, studentId]);

  const chartData =
    gradePoint !== null
      ? [
          { name: "Achieved", value: gradePoint * 10 },
          { name: "Remaining", value: 100 - gradePoint * 10 },
        ]
      : [];

  const COLORS = ["#5CE0FF", "#243B55"];

  return (
    <div className="border bg-gradient-to-br from-[#0d1117]/40 to-[#1f2937]/40 p-6 rounded-xl shadow-lg h-80 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-[#5CE0FF]">Performance</h1>
        <Image
          src="/moreDark.png"
          alt="More options"
          width={20}
          height={20}
          className="filter invert"
        />
      </div>

      {/* Loader or Chart */}
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-400">Loading...</p>
        </div>
      ) : (
        <div className="relative w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            {gradePoint !== null ? (
              <PieChart>
                <Pie
                  dataKey="value"
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="85%"
                  startAngle={180}
                  endAngle={0}
                  paddingAngle={5}
                  cornerRadius={10}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index]}
                    />
                  ))}
                </Pie>
              </PieChart>
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </ResponsiveContainer>

          {/* Grade Point Overlay */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            {gradePoint !== null ? (
              <>
                <h1 className="text-5xl font-extrabold text-[#5CE0FF] drop-shadow-md">
                  {gradePoint.toFixed(1)}
                </h1>
                <p className="text-xl text-gray-400">of 10</p>
              </>
            ) : (
              <h1 className="text-xl text-gray-500">Not Available</h1>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Performance;
