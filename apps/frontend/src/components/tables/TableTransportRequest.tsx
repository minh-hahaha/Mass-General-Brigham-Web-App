import { useEffect, useState } from 'react';
import { GetTransportRequest } from '@/database/transportRequest.ts';
import { GetSanitationRequest, incomingSanitationRequest } from '@/database/sanitationRequest.ts';
import { incomingRequest } from '@/database/transportRequest.ts';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table.tsx';

const TableTransportRequest = () => {

    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<incomingRequest[]>([]);

    useEffect(() => {
        async function fetchReqs() {
            const data = await GetTransportRequest();
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
        <div className="flex justify-center mt-10">
            <div className="w-full max-w-6xl border border-gray-300 rounded-2xl shadow-md overflow-auto p-4 bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Request ID</TableHead>
                            <TableHead>Patient ID</TableHead>
                            <TableHead>Patient Name</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Pick Up Location</TableHead>
                            <TableHead>Request Date</TableHead>
                            <TableHead>Service Type</TableHead>
                            <TableHead>Transport Type</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((req) => (
                            <TableRow>
                                <TableCell>{req.requestId}</TableCell>
                                <TableCell>{req.patientTransport.patientId}</TableCell>
                                <TableCell>{req.patientTransport.patientName}</TableCell>
                                <TableCell>{req.priority}</TableCell>
                                <TableCell>{req.status}</TableCell>
                                <TableCell>{req.patientTransport.pickupLocation}</TableCell>
                                <TableCell>{formatDate(req.requestDate)}</TableCell>
                                <TableCell>{req.serviceType}</TableCell>
                                <TableCell>{req.patientTransport.transportType}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default TableTransportRequest;