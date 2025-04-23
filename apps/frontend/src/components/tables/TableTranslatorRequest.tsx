import { useEffect, useState } from 'react';
import { GetTranslatorRequest, incomingTranslationRequest } from '@/database/translationRequest.ts';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";

const TableTranslatorRequest = () => {

    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<incomingTranslationRequest[]>([]);

    useEffect(() => {
        async function fetchReqs() {
            const data = await GetTranslatorRequest();
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
                            <TableHead>Language Required</TableHead>
                            <TableHead>Meeting Type</TableHead>
                            <TableHead>Meeting Link</TableHead>
                            <TableHead>Patient Name</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Request Date</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Department</TableHead>

                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((req) => (
                            <TableRow>
                                <TableCell>{req.requestId}</TableCell>
                                <TableCell>{req.translationRequest.language}</TableCell>
                                <TableCell>{req.translationRequest.typeMeeting}</TableCell>
                                <TableCell>{req.translationRequest.meetingLink}</TableCell>
                                <TableCell>{req.translationRequest.patientName}</TableCell>
                                <TableCell>{req.priority}</TableCell>
                                <TableCell>{req.status}</TableCell>
                                <TableCell>{req.requestDate.split('T')[0]}</TableCell>
                                <TableCell>{req.translationRequest.location}</TableCell>
                                <TableCell>{req.translationRequest.department}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
};

export default TableTranslatorRequest;
