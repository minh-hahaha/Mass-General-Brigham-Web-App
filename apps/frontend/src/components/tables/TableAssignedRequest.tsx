import { useEffect, useState } from 'react';
import { getAssignedRequests, incomingAssignedRequest } from '@/database/assignedRequest.ts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import { useAuth0 } from "@auth0/auth0-react";

interface UserInfo {
    name: string;
    email: string;
    picture: string;
}

const TableAssignedRequest = () => {
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<incomingAssignedRequest[]>([]);
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const fetchReqs = async () => {
            try {
                const token = await getAccessTokenSilently();

                const res = await fetch(`https://${import.meta.env.VITE_AUTH0_DOMAIN}/userinfo`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error('Failed to fetch user info');

                const userInfo: UserInfo = await res.json();
                const email = userInfo.email;

                if (!email) throw new Error('Email not found');

                const data = await getAssignedRequests(email);
                setRequests(data);
            } catch (err) {
                console.error('Error fetching assigned requests:', err);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchReqs();
        }
    }, [getAccessTokenSilently, isAuthenticated]);

    if (loading) {
        return <p>Loading Requests...</p>;
    }

    return (
        <Table className="w-full">
            <TableHeader>
                <TableRow className="bg-fountainBlue hover:bg-fountainBlue">
                    <TableHead className="text-left font-semibold py-3">Request ID</TableHead>
                    <TableHead className="text-left font-semibold py-3">Department</TableHead>
                    <TableHead className="text-left font-semibold py-3">Room</TableHead>
                    <TableHead className="text-left font-semibold py-3">Status</TableHead>
                    <TableHead className="text-left font-semibold py-3">Priority</TableHead>
                    <TableHead className="text-left font-semibold py-3">Request Date</TableHead>
                    <TableHead className="text-left font-semibold py-3">Request Time</TableHead>
                    <TableHead className="text-left font-semibold py-3">Service Type</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {requests.map((req) => (
                    <TableRow key={req.requestId} className="border-b hover:bg-gray-200 odd:bg-gray-100">
                        <TableCell className="text-left py-3">{req.requestId}</TableCell>
                        <TableCell className="text-left py-3">{req.requesterDepartmentId}</TableCell>
                        <TableCell className="text-left py-3">{req.requesterRoomNumber}</TableCell>
                        <TableCell className="text-left py-3">{req.status}</TableCell>
                        <TableCell className="text-left py-3">{req.priority}</TableCell>
                        <TableCell className="text-left py-3">{req.requestDateTime?.split('T')[0]}</TableCell>
                        <TableCell className="text-left py-3">{req.requestDateTime?.split('T')[1]?.substring(0, 5)}</TableCell>
                        <TableCell className="text-left py-3">{req.serviceType}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default TableAssignedRequest;
