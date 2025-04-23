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

    if (loading) {
        return <p>Loading Requests...</p>;
    }
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
                                    <TableCell className="text-center py-3 truncate">{req.maintenanceRequest.maintenanceType}</TableCell>
                                    <TableCell className="text-center py-3 truncate">{req.maintenanceRequest.maintenanceLocation}</TableCell>
                                    <TableCell className="text-center py-3 truncate">{req.maintenanceRequest.maintenanceHospital}</TableCell>
                                    <TableCell className="text-center py-3 truncate">{req.maintenanceRequest.maintenanceTime?.split('T')[1]?.substring(0, 5)}</TableCell>
                                    <TableCell className="text-center py-3 truncate">{req.employeeName}</TableCell>
                                    <TableCell className="text-center py-3">{req.priority}</TableCell>
                                    <TableCell className="text-center py-3">{req.status}</TableCell>
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