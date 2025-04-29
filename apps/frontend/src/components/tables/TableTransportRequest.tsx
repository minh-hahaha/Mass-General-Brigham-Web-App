import { useEffect, useState } from 'react';
import { GetTransportRequest } from '@/database/forms/transportRequest.ts';
import { GetSanitationRequest, incomingSanitationRequest } from '@/database/forms/sanitationRequest.ts';
import { incomingRequest } from '@/database/forms/transportRequest.ts';
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
import MGBButton from "@/elements/MGBButton.tsx";

interface Props {
    setActiveForm: (
        type: 'transport' | 'translation' | 'maintenance' | 'medical device' | 'sanitation'
    ) => void;
    setEditData: (incomingRequest: incomingRequest) => void;
}

const TableTransportRequest: React.FC<Props> = ({ setActiveForm, setEditData }) => {
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<incomingRequest[]>([]);
    const [filters, setFilters] = useState({
        patientId: '',
        priority: '',
        status: '',
        pickUp: '',
        dropOff: '',
        transportDate: '',
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
            (!filters.priority ||
                req.priority?.toLowerCase().includes(filters.priority.toLowerCase())) &&
            (!filters.status || req.status?.toLowerCase().includes(filters.status.toLowerCase())) &&
            (!filters.dropOff ||
                req.patientTransport.dropoffLocation
                    ?.toLowerCase()
                    .includes(filters.dropOff.toLowerCase())) &&
            (!filters.pickUp ||
                req.patientTransport.pickupLocation
                    ?.toLowerCase()
                    .includes(filters.pickUp.toLowerCase())) &&
            (!filters.transportType ||
                req.patientTransport.transportType
                    ?.toLowerCase()
                    .includes(filters.transportType.toLowerCase())) &&
            (!filters.transportDate || req.patientTransport.transportDate?.startsWith(filters.transportDate))
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
                                <label className="block text-sm font-medium">Pick Up</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-25 p-1"
                                    value={filters.dropOff}
                                    onChange={(e) =>
                                        setFilters({ ...filters, dropOff: e.target.value })
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
                            <div>
                                <label className="block text-sm font-medium">Complete Date</label>
                                <input
                                    type="datetime-local"
                                    className="border border-mgbblue rounded-sm w-35 p-1"
                                    value={filters.transportDate}
                                    onChange={(e) =>
                                        setFilters({ ...filters, transportDate: e.target.value })
                                    }
                                />
                            </div>
                        </motion.div>
                    )}
                </div>
                <div className="flex flex-row items-center gap-2 mt-2">
                    <button
                        onClick={() => setActiveForm('transport')}
                        className="bg-mgbyellow hover:bg-yellow-600 text-codGray px-9 py-3 rounded text-sm relative top-1"
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
                                <TableHead className="w-20 text-center font-semibold py-3">Patient ID</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Priority</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Status</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Starting Location</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Destination</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Transport Type</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Complete By Date</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRequests.map((req) => (
                                <TableRow
                                    key={req.requestId}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <TableCell className="text-center py-3">{req.patientTransport.patientId}</TableCell>
                                    <TableCell className="text-center py-3">{req.priority}</TableCell>
                                    <TableCell className="text-center py-3">{req.status}</TableCell>
                                    <TableCell className="text-center py-3">{req.patientTransport.pickupLocation}</TableCell>
                                    <TableCell className="text-center py-3">{req.patientTransport.dropoffLocation}</TableCell>
                                    <TableCell className="text-center py-3">{req.patientTransport.transportType}</TableCell>
                                    <TableCell className="text-center py-3">{formatDate(req.patientTransport.transportDate)}</TableCell>
                                    <TableCell className="text-center py-3"><MGBButton onClick={() => {setEditData(req); setActiveForm("transport")}} variant={'secondary'} children={'Edit'}/></TableCell>
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
