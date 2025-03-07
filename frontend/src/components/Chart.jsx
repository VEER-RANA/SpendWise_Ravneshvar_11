import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { category: "Groceries", amount: 4000 },
  { category: "Utilities", amount: 3000 },
  { category: "Rent", amount: 5000 },
  { category: "Entertainment", amount: 2500 },
];

const Chart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="#4A90E2" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Chart;
