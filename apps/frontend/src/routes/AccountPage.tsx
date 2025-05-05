import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
    Pie,
    PieChart,
    Cell,
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    XAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

import TableAssignedRequest from '@/components/tables/TableAssignedRequest.tsx'
import {useEffect, useState} from "react";
import {getSummary, SummaryItem, incomingAccount} from "@/database/serviceSummary.ts"
import { useAuth0 } from "@auth0/auth0-react";

interface ChartDataItem {
    key: string;
    label: string;
    requests: number;
}

const statusChartConfig = {
    pending: { label: "Pending", color: "#20499C" },
    inprogress: { label: "In Progress", color: "#4D74B7" },
    completed: { label: "Completed", color: "#809BCC" },
    canceled: { label: "Canceled", color: "#99AFD7" },
} satisfies ChartConfig;

const priorityChartConfig = {
    low: { label: "Low", color: "#99AFD7" },
    medium: { label: "Medium", color: "#809BCC" },
    high: { label: "High", color: "#4D74B7" },
    emergency: { label: "Emergency", color: "#20499C" },
} satisfies ChartConfig;

const serviceTypeChartConfig = {
    patienttransportation: { label: "Patient Transporation", color: "#20499C" },
    translation: { label: "Translation", color: "#20499C" },
    sanitation: { label: "Sanitation", color: "#20499C" },
    medicaldevice: { label: "Medical Device", color: "#20499C" },
    maintenancerequest: { label: "Maintenance", color: "#20499C" },
} satisfies ChartConfig;

function mapToChartData(summary: SummaryItem[]) {
    return summary.map((item) => ({
        key: item.label.toLowerCase().replace(/\s/g, ""), // matches config keys
        label: item.label,
        requests: item.count,
    }));
}

interface UserInfo {
    email: string;
    picture: string;
}

const AccountPage = () => {

    const [employee, setEmployee] = useState<incomingAccount | null>(null);
    const [statusChartData, setStatusChartData] = useState<ChartDataItem[]>([]);
    const [priorityChartData, setPriorityChartData] = useState<ChartDataItem[]>([]);
    const [serviceTypeChartData, setServiceTypeChartData] = useState<ChartDataItem[]>([]);
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
    const [ profilePicture, setProfilePicture ] = useState<string>();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const accessToken = await getAccessTokenSilently();
                const res = await fetch(`https://${import.meta.env.VITE_AUTH0_DOMAIN}/userinfo`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch user info');
                }

                const userInfo: UserInfo = await res.json();
                const email = userInfo.email;
                setProfilePicture(userInfo.picture);

                if (!email) {
                    throw new Error('Email not found in user info');
                }

                const summary = await getSummary(email);

                setEmployee(summary.employee)
                setStatusChartData(
                    mapToChartData(summary.statusSummary).sort(
                        (a, b) => b.requests - a.requests))
                setPriorityChartData(
                    mapToChartData(summary.prioritySummary).sort(
                        (a, b) => b.requests - a.requests))
                setServiceTypeChartData(
                    mapToChartData(summary.serviceTypeSummary).sort(
                        (a, b) => b.requests - a.requests))
            } catch (err) {
                console.error('Error fetching user info:', err);
            }
        };

        if (isAuthenticated) {
            fetchUserInfo();
        }
    }, [getAccessTokenSilently, isAuthenticated]);

    return(
        <div className="bg-gray-200 min-h-[calc(100vh-4rem)] grid grid-cols-1 md:grid-cols-4 gap-4 p-4 overflow-auto">
            {/* Left Panel: Profile Card */}
            <Card className="h-full md:col-span-1 flex flex-col overflow-auto p-0">
                {/* Top section with background color */}
                <div className="bg-[#20499C] text-white">
                    <CardHeader className="flex flex-col space-y-4 items-center pt-6 pb-4">
                        {/* Profile Image with padding above */}
                        <div className="w-30 h-30 rounded-full overflow-hidden mt-2">
                            <img
                                src={profilePicture}
                                alt="account icon"
                                className="object-cover w-full h-full"
                            />
                        </div>

                        {/* Name and ID */}
                        <div className="flex flex-col items-center space-y-1 mb-2">
                            <h1 className="text-3xl font-bold text-center">
                                {employee ? `${employee.firstName} ${employee.lastName}` : "Loading..."}
                            </h1>
                            <h3 className="text-center">
                                Employee ID: {employee ? employee.employeeId : "Loading..."}
                            </h3>
                        </div>
                    </CardHeader>
                </div>

                {/* Bottom section (white by default) */}
                <CardContent className="space-y-6 text-xl">
                    <p>
                        <strong>Position:</strong><br />
                        {employee?.position ?? "Loading..."}
                    </p>
                    <p>
                        <strong>Department:</strong><br />
                        {employee?.department.deptName ?? "Loading..."}
                    </p>
                    <p>
                        <strong>Email:</strong><br />
                        {employee?.email ?? "Loading..."}
                    </p>
                    <p>
                        <strong>Employee Since:</strong><br />
                        {employee?.dateHired
                            ? new Date(employee.dateHired).toISOString().slice(0, 10)
                            : "Loading..."}
                    </p>
                </CardContent>
            </Card>
            {/* Right Panel */}
            <div className="md:col-span-3 flex flex-col space-y-4 h-full">
                <div className="md:col-span-3 flex flex-col gap-4 h-full">
                    <div className="flex flex-col gap-4 h-full">
                        {/* Top Panel: Status and Priority */}
                        <Card className="flex flex-col flex-1">
                            <CardHeader className="text-xl flex flex-col md:flex-row md:items-center md:justify-between">
                                <CardTitle>Request Breakdown</CardTitle>
                            </CardHeader>

                            <CardContent className="flex flex-row justify-between gap-1 mt-1">
                                {/*  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"> */}
                                {/* Status */}
                                <div className="flex flex-col items-center w-full">
                                    <ChartContainer
                                        config={statusChartConfig}
                                        className="aspect-square max-h-[220px] w-full"
                                    >
                                        <PieChart>
                                            <ChartTooltip
                                                cursor={false}
                                                content={<ChartTooltipContent hideLabel />}
                                            />
                                            <Pie
                                                data={statusChartData}
                                                dataKey="requests"
                                                nameKey="label"
                                            >
                                                {statusChartData.map((entry) => (
                                                    <Cell key={entry.key} fill={statusChartConfig[entry.key as keyof typeof statusChartConfig]?.color || "#ccc"} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ChartContainer>
                                    <div className="text-center mt-2 text-xl">
                                        <span><strong>Status</strong></span>
                                    </div>
                                </div>

                                {/* Priority */}
                                <div className="flex flex-col items-center w-full">
                                    <ChartContainer
                                        config={priorityChartConfig}
                                        className="aspect-square max-h-[220px] w-full"
                                    >
                                        <PieChart>
                                            <ChartTooltip
                                                cursor={false}
                                                content={<ChartTooltipContent hideLabel />}
                                            />
                                            <Pie
                                                data={priorityChartData}
                                                dataKey="requests"
                                                nameKey="label"
                                            >
                                                {priorityChartData.map((entry) => (
                                                    <Cell key={entry.key} fill={priorityChartConfig[entry.key as keyof typeof priorityChartConfig]?.color || "#ccc"} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ChartContainer>
                                    <div className="text-center mt-2 text-xl">
                                        <span><strong>Priority</strong></span>
                                    </div>
                                </div>

                                {/* Service Type */}
                                <div className="flex flex-col items-center w-full">
                                    <ChartContainer
                                        config={serviceTypeChartConfig}
                                        className="aspect-square max-h-[220px] w-full"
                                    >
                                        <BarChart
                                            data={serviceTypeChartData}
                                            margin={{ top: 30, right: 10, left: 10, bottom: 10 }}
                                        >
                                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="label"
                                                tickLine={false}
                                                tickMargin={8}
                                                axisLine={false}
                                            />
                                            <ChartTooltip
                                                cursor={false}
                                                content={<ChartTooltipContent hideLabel />}
                                            />
                                            <Bar dataKey="requests" radius={6} barSize={80}>
                                                {serviceTypeChartData.map((entry) => (
                                                    <Cell
                                                        key={entry.key}
                                                        fill={
                                                            serviceTypeChartConfig[entry.key as keyof typeof serviceTypeChartConfig]?.color ||
                                                            "#ccc"
                                                        }
                                                    />
                                                ))}
                                                <LabelList
                                                    dataKey="requests"
                                                    position="top"
                                                    offset={8}
                                                    className="fill-foreground"
                                                    fontSize={12}
                                                />
                                            </Bar>
                                        </BarChart>
                                    </ChartContainer>

                                    <div className="text-center mt-2 text-xl">
                                        <span><strong>Service Type</strong></span>
                                    </div>
                                </div>

                            </CardContent>
                        </Card>

                        {/* Bottom Panel: Requests */}
                        <Card className="flex flex-col flex-1">
                            <CardHeader className="text-xl flex flex-col md:flex-row md:items-center md:justify-between">
                                <CardTitle>Assigned Requests</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 min-h-0">
                                <div className="h-full w-full overflow-y-auto rounded-lg">
                                    <TableAssignedRequest />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountPage;