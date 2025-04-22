import { useEffect, useState } from 'react';
import { GetMaintenanceRequest, incomingMaintenanceRequest } from '@/database/maintenanceRequest.ts';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table.tsx';

const TableMaintenanceRequest = () => {
    // Check if user is logged in, redirect to home if not
    const loggedIn = sessionStorage.getItem('loggedIn');
    if (!loggedIn) {window.location.href = '/';}

    // State management
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<incomingMaintenanceRequest[]>([]);

    // Fetch maintenance requests on component mount
    useEffect(() => {
        async function fetchReqs() {
            const data = await GetMaintenanceRequest();
            console.log(data);
            setRequests(data);
            setLoading(false);
        }
        fetchReqs();
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl font-medium">Loading Requests...</p>
            </div>
        );
    }

    // Empty state
    // if (requests == null || requests.length === 0) {
    //     return (
    //         <div className="flex justify-center items-center h-screen">
    //             <p className="text-xl font-medium">No requests found!</p>
    //         </div>
    //     );
    // }

    if (requests == null) {
        return <p>No requests found!</p>;
    }

    // Format date for display
    const formatDate = (dateString: string) => {
        return dateString.split('T')[0];
    };

    return (
        <div className="flex justify-center mt-10 px-4">
            <div className="w-full max-w-6xl border border-gray-300 rounded-2xl shadow-md overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <Table className="w-full table-fixed">
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="w-20 text-center font-semibold py-3">Request ID</TableHead>
                                <TableHead className="w-32 text-center font-semibold py-3">Maintenance Type</TableHead>
                                <TableHead className="w-28 text-center font-semibold py-3">Location</TableHead>
                                <TableHead className="w-28 text-center font-semibold py-3">Hospital</TableHead>
                                <TableHead className="w-32 text-center font-semibold py-3">Maintenance Time</TableHead>
                                <TableHead className="w-32 text-center font-semibold py-3">Employee Name</TableHead>
                                <TableHead className="w-24 text-center font-semibold py-3">Priority</TableHead>
                                <TableHead className="w-24 text-center font-semibold py-3">Status</TableHead>
                                <TableHead className="w-28 text-center font-semibold py-3">Request Date</TableHead>
                                <TableHead className="w-28 text-center font-semibold py-3">Service Type</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.map((req) => (
                                <TableRow
                                    key={req.requestId}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <TableCell className="text-center py-3">{req.requestId}</TableCell>
                                    <TableCell className="text-center py-3 truncate">{req.maintenanceRequest.maintenance_type}</TableCell>
                                    <TableCell className="text-center py-3 truncate">{req.maintenanceRequest.maintenance_location}</TableCell>
                                    <TableCell className="text-center py-3 truncate">{req.maintenanceRequest.maintenance_hospital}</TableCell>
                                    <TableCell className="text-center py-3 truncate">{req.maintenanceRequest.maintenance_time}</TableCell>
                                    <TableCell className="text-center py-3 truncate">{req.maintenanceRequest.employee_name}</TableCell>
                                    <TableCell className="text-center py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            req.priority === 'High' ? 'bg-red-100 text-red-800' :
                                                req.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                    req.priority === 'Emergency' ? 'bg-purple-100 text-purple-800' :
                                                        'bg-green-100 text-green-800'
                                        }`}>
                                            {req.priority}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            req.status === 'Pending' ? 'bg-blue-100 text-blue-800' :
                                                req.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                                    req.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                        }`}>
                                            {req.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center py-3">{formatDate(req.requestDate)}</TableCell>
                                    <TableCell className="text-center py-3 truncate">{req.serviceType}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default TableMaintenanceRequest;