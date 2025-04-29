import { useEffect, useState } from 'react';
import { GetSanitationRequest, incomingSanitationRequest } from '@/database/forms/sanitationRequest.ts';
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
import MGBButton from "@/elements/MGBButton.tsx";
import {incomingRequest} from "@/database/forms/transportRequest.ts";

interface Props {
    setActiveForm: (
        type: 'transport' | 'translation' | 'maintenance' | 'medical device' | 'sanitation'
    ) => void;
    setEditData: (incomingRequest: incomingRequest) => void;
}

const TableSanitationRequest: React.FC<Props> = ({ setActiveForm, setEditData }) => {
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<incomingRequest[]>([]);
    const [filter, setShowFilters] = useState<boolean>(false);
    const [filters, setFilters] = useState({
        priority: '',
        status: '',
        sanType: '',
        hazard: '',
        completeBy: '',
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
            (!filters.priority || req.priority?.toLowerCase().includes(filters.priority.toLowerCase())) &&
            (!filters.status || req.status?.toLowerCase().includes(filters.status.toLowerCase())) &&
            (!filters.sanType || req.sanitation.sanitationType?.toLowerCase().includes(filters.sanType.toLowerCase())) &&
            (!filters.hazard || req.sanitation.hazardLevel?.toLowerCase().includes(filters.hazard.toLowerCase())) &&
            (!filters.completeBy || req.sanitation.completeBy?.startsWith(filters.completeBy))
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
                                <label className="block text-sm font-medium">Request Date</label>
                                <input
                                    type="datetime-local"
                                    className="border border-mgbblue rounded-sm w-35 p-1"
                                    value={filters.completeBy}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            completeBy: e.target.value,
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
                                {/*
                            completeBy: number
                            disposalRequired: boolean
                            hazardLevel: string
                            recurring: boolean
                            sanitationType: string*/}
                                <TableHead className="w-20 text-center font-semibold py-3">Priority</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Status</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Sanitation Type</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Hazard Level</TableHead>
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
                                    <TableCell className="text-center py-3">{req.priority}</TableCell>
                                    <TableCell className="text-center py-3">{req.status}</TableCell>
                                    <TableCell className="text-center py-3">{req.sanitation.sanitationType}</TableCell>
                                    <TableCell className="text-center py-3">{req.sanitation.hazardLevel}</TableCell>
                                    <TableCell className="text-center py-3">{req.sanitation.completeBy.split('T')[0]}</TableCell>
                                    <TableCell className="text-center py-3"><MGBButton onClick={() => {setEditData(req); setActiveForm("sanitation")}} variant={'secondary'} children={'Edit'}/></TableCell>
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
