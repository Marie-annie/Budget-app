"use client"

import * as React from "react"
import { getToken } from "@/lib/tokens"
import { Label, Pie, PieChart, Legend, Cell } from "recharts"
import { fetchDashboardPieChart } from "@/lib/api"
import { useAuth } from "@/lib/useAuth"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ChartData {
    category: string;
    percentage: number;
}

const chartConfig = {
    categories: {
        label: "Categories",
    },
} satisfies ChartConfig

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560', '#775DD0', '#00E396', '#FEB019', '#FF4560'];

export function PieChartComponent() {
    useAuth()

    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadChartData() {
            try {
                const token = getToken();
                if (!token) {
                    throw new Error('Not authenticated');
                }

                const pieChartData = await fetchDashboardPieChart(token);
                const transformedData = pieChartData.map((item: { category: string; percentage: number }) => ({
                    category: item.category,
                    percentage: item.percentage,
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
        <Card >
            <CardHeader>
                <CardTitle>Categories distribution</CardTitle>
                <CardDescription>Frequency of categories used</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[395px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="percentage"
                            nameKey="category"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Categories
                                                </tspan>
                                            </text>
                                        )
                                    }
                                    return null;
                                }}
                            />
                        </Pie>
                        <Legend />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
