import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis,
    ResponsiveContainer, Tooltip as RechartsTooltip,
    LabelList
} from "recharts";
import { getAllServiceRequests, ServiceRequest } from '@/database/serviceSummary.ts';

// Color shades for the priorities
const colorShades = [
    "#254692",  // MGB Blue (Low Priority)
    "#3b64a4",  // Medium Priority
    "#4f7ab5",  // High Priority
    "#6a8cbf",  // Emergency Priority
];

// Utility function to summarize data by a given key
const summarizeByKey = <T extends keyof ServiceRequest>(data: ServiceRequest[], key: T) => {
    const summary: Record<string, number> = {};
    for (const item of data) {
        const value = item[key] ?? "unknown"; // Handle undefined or null values
        summary[value as string] = (summary[value as string] || 0) + 1;
    }
    return Object.entries(summary).map(([key, value]) => ({ name: key, value }));
};

const ServiceRequestsChartsPage = () => {
    const [typeSummary, setTypeSummary] = useState<{ name: string; value: number }[]>([]);
    const [requestsByBuilding, setRequestsByBuilding] = useState<{ building: string; count: number }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllServiceRequests();
                console.log(data)

                // Debugging: Log fetched data
                console.log("Fetched Data:", data);

                setTypeSummary(summarizeByKey(data, "serviceType"));

                // Structure data by building and count total requests
                const buildingMap: Record<string, number> = {};
                data.forEach(({ hospital }) => {
                    const b = hospital ?? "Unknown";
                    console.log(b)
                    buildingMap[b] = (buildingMap[b] || 0) + 1;
                });

                // Convert buildingMap to an array of objects for the chart
                const formattedRequestsByBuilding = Object.entries(buildingMap).map(([building, count]) => ({
                    building,
                    count,
                }));

                // Debugging: Log the processed building map
                console.log("Processed Requests by Building:", formattedRequestsByBuilding);

                setRequestsByBuilding(formattedRequestsByBuilding);
            } catch (err) {
                console.error("Failed to fetch request data", err);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-semibold text-center text-white py-4 bg-[#254692] rounded-md mb-4">
                Service Request Charts
            </h1>

            {/* Flex container with responsive layout */}
            <div className="flex flex-wrap justify-center gap-4">

                {/* Pie Chart for Service Types */}
                <Card className="w-[800px] h-[300px]">
                    <CardHeader>
                        <CardTitle>Request Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={210}>
                            <PieChart>
                                <Pie
                                    data={typeSummary}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label={({ name }) => name}
                                >
                                    {typeSummary.map((entry, idx) => (
                                        <Cell
                                            key={`cell-${idx}`}
                                            fill={colorShades[idx % colorShades.length]}
                                        />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Bar Chart: Requests by Building */}
                <Card className="w-[800px] h-[300px]">
                    <CardHeader>
                        <CardTitle>Requests by Building</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={requestsByBuilding} margin={{ top: 20 }}>
                                <XAxis dataKey="building" />
                                <YAxis
                                    tickFormatter={(value) => `${value}`}
                                    domain={[0, 'dataMax']}
                                    allowDecimals={false}
                                />
                                <RechartsTooltip />
                                {/* Bar for the count of requests */}
                                <Bar
                                    dataKey="count"
                                    stackId="a"
                                    fill={colorShades[0]} // Just one color since we're showing total count
                                >
                                    <LabelList dataKey="count" position="top" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>

    );
};

export default ServiceRequestsCharts;
