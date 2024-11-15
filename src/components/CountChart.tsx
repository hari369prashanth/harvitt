"use client";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

const CountChart = ({ boys, girls }: { boys: number; girls: number }) => {
  const data = [
    { name: "Total", count: boys + girls, fill: "lightgrey" },
    { name: "Girls", count: girls, fill: "#F4C500" },
    { name: "Boys", count: boys, fill: "#75B9E6" },
  ];

  return (
    <div className="relative w-full h-72 bg-transparent">
      <ResponsiveContainer>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="90%"
          barSize={24}
          data={data}
          
        >
          <RadialBar background dataKey="count" />
        </RadialBarChart>
      </ResponsiveContainer>
      <Image
        src="/maleFemale.png"
        alt="Gender Icon"
        width={40}
        height={40}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80"
      />
    </div>
  );
};

export default CountChart;
