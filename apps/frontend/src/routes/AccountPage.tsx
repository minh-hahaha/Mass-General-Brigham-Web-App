import account from "@/assets/icons/account.png";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const AccountPage = () => {
    return(
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-4 gap-4 p-4 overflow-auto">
            {/* Left Panel: Profile Card */}
            <Card className="h-full md:col-span-1 flex flex-col overflow-auto">
                <CardHeader>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-35 h-35 bg-gray-200 rounded-full">
                            <img src={account} alt="account icon"></img>
                        </div>
                        <h1 className="text-xl font-bold">First Name Last Name</h1>
                        <h3>Employee ID: 12345</h3>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p><strong>Position:</strong> ------------------</p>
                    <p><strong>Department:</strong> -------------------</p>
                    <p><strong>Email:</strong> ----------------</p>
                </CardContent>
            </Card>
            {/* Right Panel */}
            <div className="md:col-span-2 flex flex-col space-y-6">
                {/* Top Panel: Requests */}
                <Card className="w-full">
                    <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <CardTitle>Requests</CardTitle>
                        <Tabs defaultValue="all">
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="open">Open</TabsTrigger>
                                <TabsTrigger value="closed">Closed</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </CardHeader>
                    <CardContent>
                        {/* Replace with your actual Table component */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                <tr className="border-b">
                                </tr>
                                </thead>
                                <tbody>
                                {/* Map over request data */}
                                <tr className="border-b">
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AccountPage;