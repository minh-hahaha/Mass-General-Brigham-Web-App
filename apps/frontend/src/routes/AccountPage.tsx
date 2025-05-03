import account from "@/assets/icons/account.png";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Pie, PieChart } from "recharts"
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
    label: string;
    visitors: number;
    fill: string;
}

// example chart stuff
// colors are not good i know

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    chrome: {
        label: "Chrome",
        color: "hsl(var(--chart-1))",
    },
    safari: {
        label: "Safari",
        color: "hsl(var(--chart-2))",
    },
    firefox: {
        label: "Firefox",
        color: "hsl(var(--chart-3))",
    },
    edge: {
        label: "Edge",
        color: "hsl(var(--chart-4))",
    },
    other: {
        label: "Other",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig

function mapToChartData(summary: SummaryItem[]) {
    const colorMap = ['#003A96', 'red', 'yellow', 'green', 'orange', '#8884d8'];
    return summary.map((item, idx) => ({
        label: item.label,
        visitors: item.count,
        fill: colorMap[idx % colorMap.length],
    }));
}

interface UserInfo {
    sub: string;
    name: string;
    email: string;
    picture: string;
}

const AccountPage = () => {

    const [details, setDetails] = useState<incomingAccount | null>(null);
    const [statusChartData, setStatusChartData] = useState<ChartDataItem[]>([]);
    const [priorityChartData, setPriorityChartData] = useState<ChartDataItem[]>([]);
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

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

                const data: UserInfo = await res.json();
                console.log(data)
                setUserInfo(data);
            } catch (err) {
                console.error('Error fetching user info:', err);
            }
        };

        if (isAuthenticated) {
            fetchUserInfo();
        }
    }, [getAccessTokenSilently, isAuthenticated]);

    // useEffect(() => {
    //     async function fetchDetails() {
    //         try {
    //             const accessToken = await getAccessTokenSilently();
    //             const res = await fetch('https://YOUR_DOMAIN/userinfo', {
    //                 headers: {
    //                     Authorization: `Bearer ${accessToken}`,
    //                 },
    //             });
    //
    //             const data = await getSummary(getAccessTokenSilently);
    //             setDetails(data.account);
    //             setStatusChartData(mapToChartData(data.statusSummary))
    //             setPriorityChartData(mapToChartData(data.prioritySummary))
    //         } catch (err) {
    //             console.error('Error fetching user info:', err);
    //         }
    //     }
    //
    //     if (isAuthenticated) {
    //         fetchDetails();
    //     }
    // }, [getAccessTokenSilently, isAuthenticated]);

    return(
        <div className="min-h-[calc(100vh-6rem)] grid grid-cols-1 md:grid-cols-4 gap-4 p-4 overflow-auto">
            {/* Left Panel: Profile Card */}
            <Card className="h-full md:col-span-1 flex flex-col overflow-auto">
                <CardHeader className="flex flex-col space-y-4 items-center">
                    {/* Profile Image */}
                    <div className="w-30 h-30 bg-gray-200 rounded-full overflow-hidden">
                        <img src={account} alt="account icon" className="object-cover w-full h-full" />
                    </div>

                    {/* Name and ID */}
                    <div className="flex flex-col items-center space-y-1">
                        <h1 className="text-xl font-bold text-center">
                            {details ? `${details.firstName} ${details.lastName}` : "Loading..."}
                        </h1>
                        <h3 className="text-center">
                            Employee ID: {details ? details.employeeId : "Loading..."}
                        </h3>
                    </div>
                </CardHeader>
                <CardContent className="space-y-25 text-xl">
                    <p><strong>Position:</strong> {details?.position ?? "Loading..."}</p>
                    <p><strong>Department:</strong> {details?.department?.deptName ?? "Loading..."}</p>
                    <p><strong>Email:</strong> {details?.email ?? "Loading..."}</p>
                </CardContent>
            </Card>
            {/* Right Panel */}
            <div className="md:col-span-3 flex flex-col space-y-4 h-full">
                {/* Top Panel: Status and Priority */}
                {/* Right Panel (takes up 3/4 of the grid) */}
                <div className="md:col-span-3 flex flex-col gap-4 h-full">
                    {/* Container to split vertical space equally */}
                    <div className="flex flex-col gap-4 h-full">
                        {/* Top Panel: Status and Priority */}
                        <Card className="flex flex-col flex-1">
                            <CardHeader className="text-xl flex flex-col md:flex-row md:items-center md:justify-between">
                                <CardTitle>Status and Priority</CardTitle>
                            </CardHeader>

                            <CardContent className="flex flex-row justify-between gap-1">
                                {/* First Chart with Label */}
                                <div className="flex flex-col items-center w-1/2">
                                    <ChartContainer
                                        config={chartConfig}
                                        className="aspect-square max-h-[190px] w-full"
                                    >
                                        <PieChart>
                                            <ChartTooltip
                                                cursor={false}
                                                content={<ChartTooltipContent hideLabel />}
                                            />
                                            <Pie data={statusChartData} dataKey="visitors" nameKey="status" />
                                        </PieChart>
                                    </ChartContainer>
                                    <div className="text-center mt-2 text-xl">
                                        <span><strong>Status</strong></span>
                                    </div>
                                </div>

                                {/* Second Chart with Label */}
                                <div className="flex flex-col items-center w-1/2">
                                    <ChartContainer
                                        config={chartConfig}
                                        className="aspect-square max-h-[190px] w-full"
                                    >
                                        <PieChart>
                                            <ChartTooltip
                                                cursor={false}
                                                content={<ChartTooltipContent hideLabel />}
                                            />
                                            <Pie data={priorityChartData} dataKey="visitors" nameKey="priority" />
                                        </PieChart>
                                    </ChartContainer>
                                    <div className="text-center mt-2 text-xl">
                                        <span><strong>Priority</strong></span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bottom Panel: Requests */}
                        <Card className="flex flex-col flex-1">
                            <CardHeader className="text-xl flex flex-col md:flex-row md:items-center md:justify-between">
                                <CardTitle>Requests</CardTitle>
                            </CardHeader>
                            <CardContent className="overflow-auto">
                                <div className="w-full max-h-full overflow-y-auto rounded-lg">
                                    {/* Table or request content goes here */}
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