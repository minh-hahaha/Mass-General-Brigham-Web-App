import { useEffect, useState } from 'react';
import { GetTransportRequest } from '@/database/transportRequest.ts';
import { incomingRequest } from '@/database/transportRequest.ts';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const ServiceRequestDisplayPage = () => {
    const loggedIn = sessionStorage.getItem('loggedIn');
    if (!loggedIn) {window.location.href = '/';}

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
                            <TableHead>Request Time</TableHead>
                            <TableHead>Service Type</TableHead>
                            <TableHead>Transport Type</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((req) => (
                            <TableRow>
                                <TableCell>{req.request_id}</TableCell>
                                <TableCell>{req.patientTransport.patient_id}</TableCell>
                                <TableCell>{req.patientTransport.patient_name}</TableCell>
                                <TableCell>{req.priority}</TableCell>
                                <TableCell>{req.status}</TableCell>
                                <TableCell>{req.patientTransport.pickup_location}</TableCell>
                                <TableCell>{req.request_date}</TableCell>
                                <TableCell>{req.request_time}</TableCell>
                                <TableCell>{req.service_type}</TableCell>
                                <TableCell>{req.transport_type}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ServiceRequestDisplayPage;
