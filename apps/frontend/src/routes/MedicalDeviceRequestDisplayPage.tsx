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
                        <TableHead>Location</TableHead>
                        <TableHead>Hospital</TableHead>
                        <TableHead>Time Needed</TableHead>
                        <TableHead>Employee Name</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Request Date</TableHead>
                        <TableHead>Department</TableHead>
                    </TableRow>
                </TableHeader>
                // TODO: put data in table cells
                {/*<TableBody>*/}
                {/*                    /!*{requests.map((req) (*!/*/}
                {/*                        <TableRow>*/}
                {/*                        <TableCell>{req.requestId}</TableCell>*/}
                {/*                        <TableCell>{req.medicalDeviceRequest.medicalDevice</TableCell>*/}
                {/*                        <TableCell></TableCell>*/}
                {/*                        <TableCell></TableCell>*/}
                {/*                        <TableCell></TableCell>*/}
                {/*                        <TableCell></TableCell>*/}
                {/*                        <TableCell></TableCell>*/}
                {/*                        <TableCell></TableCell>*/}
                {/*                        <TableCell></TableCell>*/}
                {/*                        <TableCell></TableCell>*/}
                {/*                        </TableRow>*/}
                {/*                        ))}*/}
                {/*                </TableBody>*/}
            </Table>
        </div>
    )
}
export default MedicalDeviceRequestDisplayPage;