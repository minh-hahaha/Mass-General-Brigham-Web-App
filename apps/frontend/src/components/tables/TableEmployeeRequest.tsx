import { useEffect, useState } from 'react';
import { getAssignedRequests, incomingAssignedRequest } from '@/database/assignedRequest.ts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import { incomingAccount, getAccount } from "@/database/loggedIn.ts";

const TableEmployeeRequest = () => {
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<incomingAssignedRequest[]>([]);

    useEffect(() => {
        async function fetchReqs() {
            const details = await getAccount();
            const employeeId = details.employeeId;
            const data = await getAssignedRequests(employeeId);
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
                            <TableCell>Request ID</TableCell>
                            <TableCell>Department ID</TableCell>
                            <TableCell>Room Number</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Request Date</TableCell>
                            <TableCell>Request Time</TableCell>
                            <TableCell>Service Type</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((req) => (
                            <TableRow key={req.requestId}>
                                <TableCell>{req.requestId}</TableCell>
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
    )
}

export default TableEmployeeRequest;
