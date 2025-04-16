import { useEffect, useState } from 'react';
import { GetTransportRequest } from '@/database/transportRequest.ts';
import { GetSanitationRequest,incomingSanitationRequest } from '@/database/sanitationRequest.ts';
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


const TableTransportRequest() {
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



    const renderTable = () => {
        switch (selectedTable) {
            case 'transport':
                return (
                    <CollapsibleTable
                        title="Transport Requests"
                        rows={requests.filter(req => req.patientTransport)}
                        columns={['Request ID', 'Patient ID', 'Patient Name', 'Priority', 'Status', 'Pick Up Location', 'Dropoff Location', 'Transport Type']}
                        renderRow={(req) => (
                            <TableRow key={req.requestId}>
                                <TableCell>{req.requestId}</TableCell>
                                <TableCell>{req.patientTransport.patientId}</TableCell>
                                <TableCell>{req.patientTransport.patientName}</TableCell>
                                <TableCell>{req.priority}</TableCell>
                                <TableCell>{req.status}</TableCell>
                                <TableCell>{req.patientTransport.pickupLocation}</TableCell>
                                <TableCell>{req.patientTransport.dropoffLocation}</TableCell>
                                <TableCell>{req.patientTransport.transportType}</TableCell>
                            </TableRow>
                        )}
                    />
                );
            case 'sanitation':
                return (
                    <CollapsibleTable
                        title="Sanitation Requests"
                        rows={requests.filter(req => req.sanitation)}
                        columns={['Request ID', 'Sanitation Type', 'Hazard Level', 'Recurring', 'Complete By']}
                        renderRow={(req) => (
                            <TableRow key={req.requestId}>
                                <TableCell>{req.requestId}</TableCell>
                                <TableCell>{req.sanitation.sanitationType}</TableCell>
                                <TableCell>{req.sanitation.hazardLevel}</TableCell>
                                <TableCell>{req.sanitation.recurring ? 'Yes' : 'No'}</TableCell>
                                <TableCell>{req.sanitation.completeBy}</TableCell>
                            </TableRow>
                        )}
                    />
                );
            case 'translation':
                return (
                    <CollapsibleTable
                        title="Translation Requests"
                        rows={requests.filter(req => req.translationRequest)}
                        columns={['Request ID', 'Patient Name', 'Language', 'Duration', 'Type', 'Date', 'Meeting Link', 'Location']}
                        renderRow={(req) => (
                            <TableRow key={req.requestId}>
                                <TableCell>{req.requestId}</TableCell>
                                <TableCell>{req.translationRequest.patientName}</TableCell>
                                <TableCell>{req.translationRequest.language}</TableCell>
                                <TableCell>{req.translationRequest.duration}</TableCell>
                                <TableCell>{req.translationRequest.typeMeeting}</TableCell>
                                <TableCell>{req.translationRequest.date}</TableCell>
                                <TableCell>{req.translationRequest.meetingLink}</TableCell>
                                <TableCell>{req.translationRequest.location}</TableCell>
                            </TableRow>
                        )}
                    />
                );
            default:
                return (
                    <CollapsibleTable
                        title="All Service Requests"
                        rows={requests}
                        columns={['Request ID', 'Patient ID', 'Patient Name', 'Priority', 'Status', 'Pick Up Location', 'Request Date', 'Service Type', 'Transport Type']}
                        renderRow={(req) => (
                            <TableRow key={req.requestId}>
                                <TableCell>{req.requestId}</TableCell>
                                <TableCell>{req.patientTransport?.patientId || 'N/A'}</TableCell>
                                <TableCell>{req.patientTransport?.patientName || 'N/A'}</TableCell>
                                <TableCell>{req.priority}</TableCell>
                                <TableCell>{req.status}</TableCell>
                                <TableCell>{req.patientTransport?.pickupLocation || 'N/A'}</TableCell>
                                <TableCell>{req.requestDate}</TableCell>
                                <TableCell>{req.serviceType}</TableCell>
                                <TableCell>{req.patientTransport?.transportType || 'N/A'}</TableCell>
                            </TableRow>
                        )}
                    />
                );
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-center gap-4 mb-4">
                <button onClick={() => setSelectedTable('all')} className="btn">All</button>
                <button onClick={() => setSelectedTable('transport')} className="btn">Transport</button>
                <button onClick={() => setSelectedTable('sanitation')} className="btn">Sanitation</button>
                <button onClick={() => setSelectedTable('translation')} className="btn">Translation</button>
            </div>
            {renderTable()}
        </div>
    );
}


export default TableTransportRequest;