import account from "@/assets/icons/account.png";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const AccountPage = () => {
    return(
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
            {/* Left Panel: Profile Card */}
            <Card className="md:col-span-1">
                <CardHeader>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-24 h-24 bg-gray-200 rounded-full" />
                        <h2 className="text-xl font-bold">First Name Last Name</h2>
                        <p>Employee ID: 12345</p>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p><strong>Position:</strong> Technician</p>
                    <p><strong>Department:</strong> IT Services</p>
                    <p><strong>Email:</strong> user@example.com</p>
                </CardContent>
            </Card>

        </div>
    )
}

export default AccountPage;