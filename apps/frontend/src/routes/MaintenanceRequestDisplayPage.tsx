import { useEffect, useState } from 'react';
import { GetMaintenanceRequest, incomingMaintenanceRequest } from '@/database/maintenanceRequest.ts';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const MaintenanceRequestDisplayPage = () => {
    const loggedIn = sessionStorage.getItem('loggedIn');
    if (!loggedIn) {window.location.href = '/';}

    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<incomingMaintenanceRequest[]>([]);

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
    if (requests == null || requests.length === 0) {
        return <p>No requests found!</p>;
    }

    return (
        <div className="flex justify-center mt-10">
            <div className="w-full max-w-6xl border border-gray-300 rounded-2xl shadow-md overflow-auto p-4 bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Request ID</TableHead>
                            <TableHead>Maintenance Type</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Hospital</TableHead>
                            <TableHead>Maintenance Time</TableHead>
                            <TableHead>Employee Name</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Request Date</TableHead>
                            <TableHead>Service Type</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((req) => (
                            <TableRow key={req.requestId}>
                                <TableCell>{req.requestId}</TableCell>
                                <TableCell>{req.maintenanceRequest.maintenance_type}</TableCell>
                                <TableCell>{req.maintenanceRequest.maintenance_location}</TableCell>
                                <TableCell>{req.maintenanceRequest.maintenance_hospital}</TableCell>
                                <TableCell>{req.maintenanceRequest.maintenance_time}</TableCell>
                                <TableCell>{req.maintenanceRequest.employee_name}</TableCell>
                                <TableCell>{req.priority}</TableCell>
                                <TableCell>{req.status}</TableCell>
                                <TableCell>{req.requestDate.split('T')[0]}</TableCell>
                                <TableCell>{req.serviceType}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default MaintenanceRequestDisplayPage;