import { useEffect, useState } from 'react';
import { GetSanitationRequest,incomingSanitationRequest } from '@/database/sanitationRequest.ts';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table.tsx';

const TableSanitationRequest = () => {
    const loggedIn = sessionStorage.getItem('loggedIn');
    if (!loggedIn) {window.location.href = '/';}

    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<incomingSanitationRequest[]>([]);

    useEffect(() => {
        async function fetchReqs() {
            const data = await GetSanitationRequest();
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

    return (
        <div className="flex justify-center mt-10">
            <div className="w-full max-w-6xl border border-gray-300 rounded-2xl shadow-md overflow-auto p-4 bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>

                            {/*
                            completeBy: number
                            disposalRequired: boolean
                            hazardLevel: string
                            recurring: boolean
                            sanitationType: string*/}
                            <TableHead>Request ID</TableHead>
                            <TableHead>Complete By</TableHead>
                            <TableHead>Disposal Required</TableHead>
                            <TableHead>Hazard level</TableHead>
                            <TableHead>Recurring</TableHead>
                            <TableHead>Sanitation Type</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Request Date</TableHead>
                            <TableHead>Service Type</TableHead>

                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((req) => (
                            <TableRow>
                                <TableCell>{req.requestId}</TableCell>
                                <TableCell>{req.sanitation.completeBy}</TableCell>
                                <TableCell>{JSON.stringify(req.sanitation.disposalRequired)}</TableCell>
                                <TableCell>{req.sanitation.hazardLevel}</TableCell>
                                <TableCell>{JSON.stringify(req.sanitation.recurring)}</TableCell>
                                <TableCell>{req.sanitation.sanitationType}</TableCell>
                                <TableCell>{req.priority}</TableCell>
                                <TableCell>{req.status}</TableCell>
                                <TableCell>{req.requestDate}</TableCell>
                                <TableCell>{req.serviceType}</TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default TableSanitationRequest;
