import account from "@/assets/icons/account.png";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Pie, PieChart } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

// example chart stuff
// colors are not good i know
const chartData = [
    { browser: "chrome", visitors: 275, fill: "#003A96" },
    { browser: "safari", visitors: 200, fill: "red" },
    { browser: "firefox", visitors: 187, fill: "yellow" },
    { browser: "edge", visitors: 173, fill: "green" },
    { browser: "other", visitors: 90, fill: "orange" },
]

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


const AccountPage = () => {
    return(
        <div className="min-h-[calc(100vh-6rem)] grid grid-cols-1 md:grid-cols-4 gap-4 p-4 overflow-auto">
            {/* Left Panel: Profile Card */}
            <Card className="h-full md:col-span-1 flex flex-col overflow-auto">
                <CardHeader className="flex flex-col space-y-4 items-center">
                    {/* Title at the very top */}
                    <div className="w-full md:w-auto">
                        <CardTitle>Employee Details</CardTitle>
                    </div>

                    {/* Profile Image */}
                    <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                        <img src={account} alt="account icon" className="object-cover w-full h-full" />
                    </div>

                    {/* Name and ID */}
                    <div className="flex flex-col items-center space-y-1">
                        <h1 className="text-xl font-bold text-center">First Name Last Name</h1>
                        <h3 className="text-center">Employee ID: 12345</h3>
                    </div>
                </CardHeader>
                <CardContent className="space-y-25 text-xl">
                    <p><strong>Position:</strong> ------------------</p>
                    <p><strong>Department:</strong> -------------------</p>
                    <p><strong>Email:</strong> ----------------</p>
                </CardContent>
            </Card>
            {/* Right Panel */}
            <div className="md:col-span-3 flex flex-col space-y-4 h-full">
                {/* Top Panel: Status and Priority */}
                <Card className="w-full flex flex-col">
                    <CardHeader className="text-xl flex flex-col md:flex-row md:items-center md:justify-between">
                        <CardTitle>Status and Priority</CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-row gap-0">
                        {/* First Chart with Label */}
                        <div className="flex flex-col items-center flex-1">
                            <ChartContainer
                                config={chartConfig}
                                className="aspect-square max-h-[230px] w-full"
                            >
                                <PieChart>
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Pie data={chartData} dataKey="visitors" nameKey="browser" />
                                </PieChart>
                            </ChartContainer>
                            <div className="text-center mt-2 text-xl">
                                <span><strong>Status</strong></span>
                            </div>
                        </div>

                        {/* Second Chart with Label */}
                        <div className="flex flex-col items-center flex-1">
                            <ChartContainer
                                config={chartConfig}
                                className="aspect-square max-h-[230px] w-full"
                            >
                                <PieChart>
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Pie data={chartData} dataKey="visitors" nameKey="browser" />
                                </PieChart>
                            </ChartContainer>
                            <div className="text-center mt-2 text-xl">
                                <span><strong>Priority</strong></span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* Bottom Panel: Requests */}
                <Card className="w-full flex flex-col">
                    <CardHeader className="text-xl flex flex-col md:flex-row md:items-center md:justify-between">
                        <CardTitle>Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <div className="overflow-x-auto">
                                <div className="w-full max-h-[500px] overflow-y-auto overflow-x-hidden rounded-lg pb-50">

                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AccountPage;