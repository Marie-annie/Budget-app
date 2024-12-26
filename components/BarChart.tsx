"use client"

import React from "react"
import { getToken } from "@/lib/tokens"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { fetchDashboardBarChart } from "@/lib/api"
import { useAuth } from "@/lib/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import { ChartConfig, ChartContainer} from "@/components/ui/chart"
import { useState, useEffect } from "react"

interface ChartData {
  date: string;
  income: number;
  expense: number;
  transactions:[];
}


const chartConfig = {
  income: {
    label: "Income",
    color: "#0088FE", 
  },
  expense: {
    label: "Expense",
    color: "#00C49F",
  },
} satisfies ChartConfig

export function BarChartComponent() {
    useAuth()

    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadChartData(){
            try {
                const token = getToken();
                if (!token) {
                    throw new Error('Not authenticated');
                }

                const barChartData = await fetchDashboardBarChart(token);
                const transformedData = barChartData.map((item: { date: string; income: number; expense: number; transactions:[]}) => ({
                    date: new Date(item.date).toLocaleDateString('en-GB', {weekday: 'long'}),
                    income: item.income,
                    expense: item.expense,
                    transactions: item.transactions,
                }));
                setChartData(transformedData);
                setLoading(false);  
            } catch {
               setError('Failed to load chart data');
                setLoading(false);
            }
        }
        loadChartData();
    })

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }
 
    if (loading) {
        return <div>Loading...</div>;
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Scores</CardTitle>
        <CardDescription>Weekly Income and Expense</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill={chartConfig.income.color} />
            <Bar dataKey="expense" fill={chartConfig.expense.color} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

