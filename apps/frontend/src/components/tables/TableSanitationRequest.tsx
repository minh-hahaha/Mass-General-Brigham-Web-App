import { useEffect, useState } from 'react';
import { GetSanitationRequest, incomingSanitationRequest } from '@/database/sanitationRequest.ts';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table.tsx';
import {motion} from 'framer-motion';

interface Props {
    setActiveForm: (
        type: 'transport' | 'translation' | 'maintenance' | 'medical device' | 'sanitation'
    ) => void;
}

const TableSanitationRequest: React.FC<Props> = ({ setActiveForm }) => {
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<incomingSanitationRequest[]>([]);
    const [filter, setShowFilters] = useState<boolean>(false);
    const [filters, setFilters] = useState({
        disposal: '',
        hazard: '',
        recurring: '',
        sanType: '',
        priority: '',
        status: '',
        reqDate: '',
    });

    useEffect(() => {
        async function fetchReqs() {
            const data = await GetSanitationRequest();
            console.log(data);
            setRequests(data);
            setLoading(false);
        }
        fetchReqs();
    }, []);

    if (loading) {
        return <p>Loading Requests...</p>;
    }

    const filteredRequests = requests.filter((req) => {
        const disposalText = req.sanitation.disposalRequired ? 'yes' : 'no';
        const recurringText = req.sanitation.recurring ? 'yes' : 'no';

        return (
            (!filters.disposal || disposalText.includes(filters.disposal.toLowerCase())) &&
            (!filters.hazard || req.sanitation.hazardLevel?.toLowerCase().includes(filters.hazard.toLowerCase())) &&
            (!filters.recurring || recurringText.includes(filters.recurring.toLowerCase())) &&
            (!filters.sanType || req.sanitation.sanitationType?.toLowerCase().includes(filters.sanType.toLowerCase())) &&
            (!filters.priority || req.priority?.toLowerCase().includes(filters.priority.toLowerCase())) &&
            (!filters.status || req.status?.toLowerCase().includes(filters.status.toLowerCase())) &&
            (!filters.reqDate || req.requestDate?.startsWith(filters.reqDate))
        );
    });

    return (
        <>
            <div className={`w-full flex flex-row justify-between px-10`}>
                <div className="flex flex-row items-center gap-2 mt-2">
                    <button
                        onClick={() => setShowFilters((prev) => !prev)}
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
                                <label className="block text-sm font-medium">Disposal?</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-15 p-1"
                                    value={filters.disposal}
                                    onChange={(e) =>
                                        setFilters({ ...filters, disposal: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Hazard Level</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-30 p-1"
                                    value={filters.hazard}
                                    onChange={(e) =>
                                        setFilters({ ...filters, hazard: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Recurring?</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-20 p-1"
                                    value={filters.recurring}
                                    onChange={(e) =>
                                        setFilters({ ...filters, recurring: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Sanitation</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-30 p-1"
                                    value={filters.sanType}
                                    onChange={(e) =>
                                        setFilters({ ...filters, sanType: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Priority</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-20 p-1"
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
                                        setFilters({
                                            ...filters,
                                            status: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Request Date</label>
                                <input
                                    type="datetime-local"
                                    className="border border-mgbblue rounded-sm w-35 p-1"
                                    value={filters.reqDate}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            reqDate: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </motion.div>
                    )}
                </div>
                <div className="flex flex-row items-center gap-2 mt-2">
                    <button
                        onClick={() => setActiveForm('sanitation')}
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
                                {/*
                            completeBy: number
                            disposalRequired: boolean
                            hazardLevel: string
                            recurring: boolean
                            sanitationType: string*/}
                                <TableHead className="w-20 text-center font-semibold py-3">Request ID</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Disposal Required</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Hazard Level</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Recurring</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Sanitation Type</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Priority</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Status</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Request Date</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Service Type</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRequests.map((req) => (
                                <TableRow
                                    key={req.requestId}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <TableCell className="text-center py-3">{req.requestId}</TableCell>
                                    <TableCell className="text-center py-3">
                                        {req.sanitation.disposalRequired ? 'Yes' : 'No'}
                                    </TableCell>
                                    <TableCell className="text-center py-3">{req.sanitation.hazardLevel}</TableCell>
                                    <TableCell className="text-center py-3">{req.sanitation.recurring ? 'Yes' : 'No'}</TableCell>
                                    <TableCell className="text-center py-3">{req.sanitation.sanitationType}</TableCell>
                                    <TableCell className="text-center py-3">{req.priority}</TableCell>
                                    <TableCell className="text-center py-3">{req.status}</TableCell>
                                    <TableCell className="text-center py-3">{req.requestDate.split('T')[0]}</TableCell>
                                    <TableCell className="text-center py-3">{req.serviceType}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
};

export default TableSanitationRequest;
