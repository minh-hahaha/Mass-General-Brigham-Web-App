import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis,
    LineChart, Line, Legend,
    Tooltip as RechartsTooltip,
    ResponsiveContainer
} from "recharts";
import { getAllServiceRequests, ServiceRequest } from '@/database/serviceSummary.ts';

// Priority, status, and service type chart configs remain unchanged
const priorityChartConfig = {
    low: { color: "#82ca9d", label: "Low" },
    medium: { color: "#ffc658", label: "Medium" },
    high: { color: "#ff7f7f", label: "High" },
};

const statusChartConfig = {
    unassigned: { color: "#8884d8", label: "Unassigned" },
    assigned: { color: "#8dd1e1", label: "Assigned" },
    inProgress: { color: "#82ca9d", label: "In Progress" },
    completed: { color: "#ffc658", label: "Completed" },
};

const serviceTypeChartConfig = {
    maintenance: { color: "#8884d8", label: "Maintenance" },
    security: { color: "#8dd1e1", label: "Security" },
    transportation: { color: "#82ca9d", label: "Transportation" },
    sanitation: { color: "#ffc658", label: "Sanitation" },
    other: { color: "#d0ed57", label: "Other" },
};

// Utility function to summarize data by a given key
const summarizeByKey = <T extends keyof ServiceRequest>(data: ServiceRequest[], key: T) => {
    const summary: Record<string, number> = {};
    for (const item of data) {
        const value = item[key] ?? "unknown"; // nullish coalescing to handle undefined values
        summary[value as string] = (summary[value as string] || 0) + 1; // Cast to string
    }
    return Object.entries(summary).map(([key, value]) => ({ name: key, value }));
};

const ServiceRequestsChartsPage = () => {
    const [typeSummary, setTypeSummary] = useState<any[]>([]);
    const [requestsByBuilding, setRequestsByBuilding] = useState<any[]>([]);
    const [statusOverTime, setStatusOverTime] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllServiceRequests();

                // Pie chart: Service Type
                setTypeSummary(summarizeByKey(data, "serviceType"));

                // Stacked bar chart: Requests by Building and Priority
                const buildingMap: Record<string, Record<string, number>> = {};
                data.forEach(({ hospital, priority }) => {
                    const b = hospital ?? "Unknown"; // Using nullish coalescing
                    const p = priority ?? "low"; // Same for priority
                    buildingMap[b] ??= {};
                    buildingMap[b][p] = (buildingMap[b][p] || 0) + 1;
                });
                setRequestsByBuilding(Object.entries(buildingMap).map(([building, priorities]) => ({
                    building,
                    ...priorities,
                })));

                // Line chart: Status Over Time (by Month)
                const statusTimeline: Record<string, Record<string, number>> = {};
                data.forEach(({ status, requestDate }) => {
                    // const date = new Date(dateRequested);
                    // const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
                    statusTimeline[requestDate] ??= {};
                    statusTimeline[requestDate][status] = (statusTimeline[requestDate][status] || 0) + 1;
                });
                setStatusOverTime(Object.entries(statusTimeline).map(([month, statuses]) => ({
                    month,
                    ...statuses,
                })));
            } catch (err) {
                console.error("Failed to fetch request data", err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-4">
            {/* Pie chart: Request Types */}
            <Card>
                <CardHeader>
                    <CardTitle>Request Types</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={typeSummary}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={({ name }) => serviceTypeChartConfig[name as keyof typeof serviceTypeChartConfig]?.label || name}
                            >
                                {typeSummary.map((entry, idx) => (
                                    <Cell
                                        key={`cell-${idx}`}
                                        fill={
                                            serviceTypeChartConfig[entry.name as keyof typeof serviceTypeChartConfig]?.color || "#ccc"
                                        }
                                    />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Stacked Bar chart: Requests by Building and Priority */}
            <Card>
                <CardHeader>
                    <CardTitle>Requests by Building and Priority</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={requestsByBuilding}>
                            <XAxis dataKey="building" />
                            <YAxis />
                            <RechartsTooltip />
                            {Object.keys(priorityChartConfig).map((priority) => (
                                <Bar
                                    key={priority}
                                    dataKey={priority}
                                    stackId="a"
                                    fill={priorityChartConfig[priority as keyof typeof priorityChartConfig].color}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Line chart: Status Over Time */}
            <Card>
                <CardHeader>
                    <CardTitle>Status Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={statusOverTime}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Legend />
                            <RechartsTooltip />
                            {Object.keys(statusChartConfig).map((status) => (
                                <Line
                                    key={status}
                                    type="monotone"
                                    dataKey={status}
                                    stroke={statusChartConfig[status as keyof typeof statusChartConfig].color}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default ServiceRequestsChartsPage;
