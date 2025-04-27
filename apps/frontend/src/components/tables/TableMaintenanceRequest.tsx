import { useEffect, useState } from 'react';
import {
    GetMaintenanceRequest,
    incomingMaintenanceRequest,
} from '@/database/forms/maintenanceRequest.ts';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table.tsx';
import { motion } from 'framer-motion';

interface Props {
    setActiveForm: (
        type: 'transport' | 'translation' | 'maintenance' | 'medical device' | 'sanitation'
    ) => void;
}

const TableMaintenanceRequest: React.FC<Props> = ({ setActiveForm }) => {
    // State management
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<incomingMaintenanceRequest[]>([]);
    const [filter, setShowFilters] = useState<boolean>(false);
    const [filters, setFilters] = useState({
        type: '',
        location: '',
        hospital: '',
        employeeName: '',
        priority: '',
        status: '',
        completeBy: '',
    });

    // Fetch maintenance requests on component mount
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

    const filteredRequests = requests.filter((req) => {
        return (
            (!filters.priority || req.priority?.toLowerCase().includes(filters.priority.toLowerCase())) &&
            (!filters.status || req.status?.toLowerCase().includes(filters.status.toLowerCase())) &&
            (!filters.type || req.maintenanceRequest.maintenanceType?.toLowerCase().includes(filters.type.toLowerCase())) &&
            (!filters.hospital || req.maintenanceRequest.maintenanceHospital?.toLowerCase().includes(filters.hospital.toLowerCase())) &&
            (!filters.completeBy || req.maintenanceRequest.maintenanceTime?.startsWith(filters.completeBy))
        );
    });

    // Format date for display
    const formatDate = (dateString: string) => {
        return dateString.split('T')[0];
    };

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
                                    className="border border-mgbblue rounded-sm w-15 p-1"
                                    value={filters.priority}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            priority: e.target.value,
                                        })
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
                                <label className="block text-sm font-medium">Type</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-25 p-1"
                                    value={filters.type}
                                    onChange={(e) =>
                                        setFilters({ ...filters, type: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Hospital</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-20 p-1"
                                    value={filters.hospital}
                                    onChange={(e) =>
                                        setFilters({ ...filters, hospital: e.target.value })
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
                                        setFilters({ ...filters, completeBy: e.target.value })
                                    }
                                />
                            </div>
                        </motion.div>
                    )}
                </div>
                <div className="flex flex-row items-center gap-2 mt-2">
                    <button
                        onClick={() => setActiveForm('maintenance')}
                        className="bg-gray-500 hover:bg-gray-700 text-white px-9 py-3 rounded text-sm relative top-1"
                    >
                        New Request +
                    </button>
                </div>
            </div>
            <div className="flex justify-center mt-3 px-4">
                <div className="w-350 border border-gray-300 rounded-2xl shadow-md overflow-hidden bg-white">
                    <div className="overflow-x-auto">
                        <Table className="w-full table-fixed">
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="w-24 text-center font-semibold py-3">
                                        Priority
                                    </TableHead>
                                    <TableHead className="w-24 text-center font-semibold py-3">
                                        Status
                                    </TableHead>
                                    <TableHead className="w-32 text-center font-semibold py-3">
                                        Maintenance Type
                                    </TableHead>
                                    <TableHead className="w-28 text-center font-semibold py-3">
                                        Hospital
                                    </TableHead>
                                    <TableHead className="w-32 text-center font-semibold py-3">
                                        Complete By Date
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRequests.map((req) => (
                                    <TableRow
                                        key={req.requestId}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <TableCell className="text-center py-3">
                                            {req.priority}
                                        </TableCell>
                                        <TableCell className="text-center py-3">
                                            {req.status}
                                        </TableCell>
                                        <TableCell className="text-center py-3 truncate">
                                            {req.maintenanceRequest.maintenanceType}
                                        </TableCell>
                                        <TableCell className="text-center py-3 truncate">
                                            {req.maintenanceRequest.maintenanceHospital}
                                        </TableCell>
                                        <TableCell className="text-center py-3">
                                            {formatDate(req.maintenanceRequest.maintenanceTime)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TableMaintenanceRequest;
