"use client"

import React from "react"
import { getToken } from "@/lib/tokens"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { fetchDashboardBarChart } from "@/lib/api"
import { useAuth } from "@/lib/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import { useState, useEffect } from "react"

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-1))",
  },
  expense: {
    label: "Expense",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function BarChartComponent() {
    useAuth()

    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadChartData(){
            try {
                const token = getToken();
                if (!token) {
                    throw new Error('Not authenticated');
                }

                const barChartData = await fetchDashboardBarChart(token);
                const transformedData = barChartData.map((item: any) => ({
                    month: item.month.toLocaleString("default", { month: "long" }),
                    income: item.income,
                    expense: item.expense,
                }));
                console.log(transformedData);
                setChartData(transformedData);
                setLoading(false);  
            } catch (error) {
                console.error('Error loading bar chart data:', error);
                setLoading(false);
            }
        }
        loadChartData();
    })
 
    if (loading) {
        return <div>Loading...</div>;
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Annual budget</CardTitle>
        <CardDescription>Yearly Income and Expense</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" />
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

