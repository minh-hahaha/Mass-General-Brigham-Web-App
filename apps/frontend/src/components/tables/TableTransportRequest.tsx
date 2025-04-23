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
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    setActiveForm: (
        type: 'transport' | 'translation' | 'maintenance' | 'medical device' | 'sanitation'
    ) => void;
}

const TableTransportRequest: React.FC<Props> = ({ setActiveForm }) => {
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<incomingRequest[]>([]);
    const [filters, setFilters] = useState({
        patientId: '',
        patientName: '',
        priority: '',
        status: '',
        pickUp: '',
        requestDate: '',
        transportType: '',
    });
    const [filter, setShowFilters] = useState<boolean>(false);

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

    // Format date for display
    const formatDate = (dateString: string) => {
        return dateString.split('T')[0];
    };


    const filteredRequests = requests.filter((req) => {
        return (
            (!filters.patientId || String(req.patientTransport.patientId) === filters.patientId) &&
            (!filters.patientName ||
                req.patientTransport.patientName
                    ?.toLowerCase()
                    .includes(filters.patientName.toLowerCase())) &&
            (!filters.priority ||
                req.priority?.toLowerCase().includes(filters.priority.toLowerCase())) &&
            (!filters.status || req.status?.toLowerCase().includes(filters.status.toLowerCase())) &&
            (!filters.pickUp ||
                req.patientTransport.pickupLocation
                    ?.toLowerCase()
                    .includes(filters.pickUp.toLowerCase())) &&
            (!filters.requestDate || req.requestDate?.startsWith(filters.requestDate)) &&
            (!filters.transportType ||
                req.patientTransport.transportType
                    ?.toLowerCase()
                    .includes(filters.transportType.toLowerCase()))
        );
    });

    return (
        <>
            <div className={`w-full flex flex-row justify-between px-10`}>
                <div className="flex flex-row items-center gap-2 mt-2">
                    <button
                        onClick={() => setShowFilters(prev => !prev)}
                        className="bg-mgbblue hover:bg-blue-950 text-white px-9 py-3 rounded text-sm relative top-1"
                    >
                        Filters
                    </button>
                    {filter && (
                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -30, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            className="relative left-[10px] rounded flex flex-row gap-5"
                        >
                            <div>
                                <label className="block text-sm font-medium">Patient ID</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-15 p-1"
                                    value={filters.patientId}
                                    onChange={(e) =>
                                        setFilters({ ...filters, patientId: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Patient Name</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-30 p-1"
                                    value={filters.patientName}
                                    onChange={(e) =>
                                        setFilters({ ...filters, patientName: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Priority</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-15 p-1"
                                    value={filters.priority}
                                    onChange={(e) =>
                                        setFilters({ ...filters, priority: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Status</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-20 p-1"
                                    value={filters.status}
                                    onChange={(e) =>
                                        setFilters({ ...filters, status: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Pick Up</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-25 p-1"
                                    value={filters.pickUp}
                                    onChange={(e) =>
                                        setFilters({ ...filters, pickUp: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Request Date</label>
                                <input
                                    type="datetime-local"
                                    className="border border-mgbblue rounded-sm w-35 p-1"
                                    value={filters.requestDate}
                                    onChange={(e) =>
                                        setFilters({ ...filters, requestDate: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Transport Type</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-35 p-1"
                                    value={filters.transportType}
                                    onChange={(e) =>
                                        setFilters({ ...filters, transportType: e.target.value })
                                    }
                                />
                            </div>
                        </motion.div>
                    )}
                </div>
                <div className="flex flex-row items-center gap-2 mt-2">
                    <button
                        onClick={() => setActiveForm('transport')}
                        className="bg-gray-500 hover:bg-gray-700 text-white px-9 py-3 rounded text-sm relative top-1"
                    >
                        New Request +
                    </button>
                </div>
            </div>
            <div className="flex justify-center mt-3 px-4">
                <div className="w-350 border border-gray-300 rounded-2xl shadow-md overflow-hidden bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="w-20 text-center font-semibold py-3">Request ID</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Patient ID</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Patient Name</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Priority</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Status</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Pick Up Location</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Request Date</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Service Type</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Transport Type</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRequests.map((req) => (
                                <TableRow
                                    key={req.requestId}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <TableCell className="text-center py-3">{req.requestId}</TableCell>
                                    <TableCell className="text-center py-3">{req.patientTransport.patientId}</TableCell>
                                    <TableCell className="text-center py-3">{req.patientTransport.patientName}</TableCell>
                                    <TableCell className="text-center py-3">{req.priority}</TableCell>
                                    <TableCell className="text-center py-3">{req.status}</TableCell>
                                    <TableCell className="text-center py-3">{req.patientTransport.pickupLocation}</TableCell>
                                    <TableCell className="text-center py-3">{formatDate(req.requestDate)}</TableCell>
                                    <TableCell className="text-center py-3">{req.serviceType}</TableCell>
                                    <TableCell className="text-center py-3">{req.patientTransport.transportType}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
};

export default TableTransportRequest;
