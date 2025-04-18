import { useEffect, useState } from 'react';
import { getServiceRequest, incomingServiceRequest } from '@/database/serviceRequest.ts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";

const TableServiceRequests = () => {
    const loggedIn = sessionStorage.getItem('loggedIn');
    if (!loggedIn) {
        window.location.href = '/';
    }

    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<incomingServiceRequest[]>([]);

    useEffect(() => {
        async function fetchReqs() {
            const data = await getServiceRequest();
            console.log(data);
            setRequests(data);
            setLoading(false);
        }

        fetchReqs();
    }, []);

    if (loading) {
        return <p>Loading Requests...</p>;
    }
    if (!requests || requests.length === 0) {
        return <p>No service requests found!</p>;
    }

    return (
        <div className="flex justify-center mt-10">
            <div className="w-full max-w-6xl border border-gray-300 rounded-2xl shadow-md overflow-auto p-4 bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Request ID</TableHead>
                            <TableHead>Employee Name</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Room Number</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Request Date</TableHead>
                            <TableHead>Request Time</TableHead>
                            <TableHead>Service Type</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((req) => (
                            <TableRow key={req.requestId}>
                                <TableCell>{req.requestId}</TableCell>
                                <TableCell>{req.employeeName ?? 'Unassigned'}</TableCell>
                                <TableCell>{req.requesterDepartmentId}</TableCell>
                                <TableCell>{req.requesterRoomNumber}</TableCell>
                                <TableCell>{req.status}</TableCell>
                                <TableCell>{req.priority}</TableCell>
                                <TableCell>{req.requestDate?.split('T')[0]}</TableCell>
                                <TableCell>{req.requestTime?.split('T')[1]?.substring(0, 5)}</TableCell>
                                <TableCell>{req.serviceType}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default TableServiceRequests;
