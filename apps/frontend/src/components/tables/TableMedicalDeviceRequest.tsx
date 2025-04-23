import { useEffect, useState } from 'react';
import { GetMedicalDeviceRequest, incomingMedicalDeviceRequest } from '@/database/medicalDeviceRequest.ts';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";

const MedicalDeviceRequestDisplayPage = () => {
    const loggedIn = sessionStorage.getItem('loggedIn');
    if (!loggedIn) {window.location.href = '/';}

    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<incomingMedicalDeviceRequest[]>([]);

    useEffect(() => {
        async function fetchReqs() {
            const data = await GetMedicalDeviceRequest();
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
                            <TableHead>Medical Device</TableHead>
                            <TableHead>Medical Device Serial Number</TableHead>
                            <TableHead>Explanation</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Request Date</TableHead>
                            <TableHead>Department</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((req) => (
                            <TableRow>
                                <TableCell>{req.requestId}</TableCell>
                                <TableCell>{req.medicalDeviceRequest.device}</TableCell>
                                <TableCell>{req.medicalDeviceRequest.deviceSerialNumber}</TableCell>
                                <TableCell>
                                    {req.medicalDeviceRequest.deviceReasoning
                                        ?.match(/.{1,30}/g)
                                        ?.map((chunk, i) => (
                                            <span key={i}>
                                                {chunk}
                                                <br />
                                            </span>
                                        ))}
                                </TableCell>
                                <TableCell>{req.medicalDeviceRequest.location}</TableCell>
                                <TableCell>{req.priority}</TableCell>
                                <TableCell>{req.status}</TableCell>
                                <TableCell>{formatDate(req.requestDate)}</TableCell>
                                <TableCell>{req.medicalDeviceRequest.department}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
export default MedicalDeviceRequestDisplayPage;