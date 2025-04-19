import { useEffect, useState } from 'react';
import { GetMedicalDeviceRequest, incomingMedicalDeviceRequest } from '@/database/medicalDeviceRequest.ts';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";

const MedicalDeviceRequestDisplayPage = () => {
    const loggedIn = sessionStorage.getItem("loggedIn");
    if (!loggedIn) {
        window.location.href = '/';
    }

    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<incomingMedicalDeviceRequest[]>([]);

    useEffect(() => {
        async function fetchReqs() {
            const data = await GetMedicalDeviceRequest();
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
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Request ID</TableHead>
                        <TableHead>Medical Device</TableHead>
                        <TableHead>Medical Device Serial Number</TableHead>
                        <TableHead>Reasoning</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Employee Name</TableHead>
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
                            <TableCell>{req.medicalRequest.device}</TableCell>
                            <TableCell>{req.medicalRequest.deviceSerialNumber}</TableCell>
                            <TableCell>{req.medicalRequest.deviceReasoning}</TableCell>
                            <TableCell>{req.medicalRequest.location}</TableCell>
                            <TableCell>{req.medicalRequest.department}</TableCell>
                            <TableCell>{req.employeeName}</TableCell>
                            <TableCell>{req.priority}</TableCell>
                            <TableCell>{req.medicalRequest.date}</TableCell>
                            <TableCell>{req.status}</TableCell>
                            <TableCell>{req.requestDate}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
export default MedicalDeviceRequestDisplayPage;