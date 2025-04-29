import { useEffect, useState } from 'react';
import {
    GetMaintenanceRequest,
    incomingMaintenanceRequest,
} from '@/database/maintenanceRequest.ts';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table.tsx';
import { motion } from 'framer-motion';
import MGBButton from "@/elements/MGBButton.tsx";

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
        reqDate: '',
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
            (!filters.type || req.maintenanceRequest.maintenanceType?.toLowerCase().includes(filters.type.toLowerCase())) &&
            (!filters.location || req.maintenanceRequest.maintenanceLocation?.toLowerCase().includes(filters.location.toLowerCase())) &&
            (!filters.hospital || req.maintenanceRequest.maintenanceHospital?.toLowerCase().includes(filters.hospital.toLowerCase())) &&
            (!filters.employeeName || req.employeeName?.toLowerCase().includes(filters.employeeName.toLowerCase())) &&
            (!filters.priority || req.priority?.toLowerCase().includes(filters.priority.toLowerCase())) &&
            (!filters.status || req.status?.toLowerCase().includes(filters.status.toLowerCase())) &&
            (!filters.reqDate || req.requestDate?.startsWith(filters.reqDate))
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
                                <label className="block text-sm font-medium">Location</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-30 p-1"
                                    value={filters.location}
                                    onChange={(e) =>
                                        setFilters({ ...filters, location: e.target.value })
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
                                <label className="block text-sm font-medium">Employee Name</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-30 p-1"
                                    value={filters.employeeName}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            employeeName: e.target.value,
                                        })
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
                                <label className="block text-sm font-medium">Request Date</label>
                                <input
                                    type="datetime-local"
                                    className="border border-mgbblue rounded-sm w-35 p-1"
                                    value={filters.reqDate}
                                    onChange={(e) =>
                                        setFilters({ ...filters, reqDate: e.target.value })
                                    }
                                />
                            </div>
                        </motion.div>
                    )}
                </div>
                <div className="flex flex-row items-center gap-2 mt-2">
                    <button
                        onClick={() => setActiveForm('maintenance')}
                        className="bg-mgbyellow hover:bg-yellow-600 text-codGray px-9 py-3 rounded text-sm relative top-1"
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
                                    <TableHead className="w-20 text-left font-semibold py-3">
                                        Request ID
                                    </TableHead>
                                    <TableHead className="w-32 text-left font-semibold py-3">
                                        Maintenance Type
                                    </TableHead>
                                    <TableHead className="w-28 text-left font-semibold py-3">
                                        Location
                                    </TableHead>
                                    <TableHead className="w-28 text-left font-semibold py-3">
                                        Hospital
                                    </TableHead>
                                    <TableHead className="w-32 text-left font-semibold py-3">
                                        Maintenance Time
                                    </TableHead>
                                    <TableHead className="w-32 text-left font-semibold py-3">
                                        Employee Name
                                    </TableHead>
                                    <TableHead className="w-24 text-left font-semibold py-3">
                                        Priority
                                    </TableHead>
                                    <TableHead className="w-24 text-left font-semibold py-3">
                                        Status
                                    </TableHead>
                                    <TableHead className="w-28 text-left font-semibold py-3">
                                        Request Date
                                    </TableHead>
                                    <TableHead className="w-28 text-left font-semibold py-3">
                                        Service Type
                                    </TableHead>
                                    <TableHead className="w-28 text-left font-semibold py-3">
                                    </TableHead>

                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRequests.map((req) => (
                                    <TableRow
                                        key={req.requestId}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <TableCell className="text-left py-3">
                                            {req.requestId}
                                        </TableCell>
                                        <TableCell className="text-left py-3 truncate">
                                            {req.maintenanceRequest.maintenanceType}
                                        </TableCell>
                                        <TableCell className="text-left py-3 truncate">
                                            {req.maintenanceRequest.maintenanceLocation}
                                        </TableCell>
                                        <TableCell className="text-left py-3 truncate">
                                            {req.maintenanceRequest.maintenanceHospital}
                                        </TableCell>
                                        <TableCell className="text-left py-3 truncate">
                                            {req.maintenanceRequest.maintenanceTime
                                                ?.split('T')[1]
                                                ?.substring(0, 5)}
                                        </TableCell>
                                        <TableCell className="text-left py-3 truncate">
                                            {req.employeeName}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                req.priority === 'High'
                                                    ? 'bg-orange-100 text-orange-800'
                                                    : req.priority === 'Medium'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : req.priority === 'Emergency'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-green-100 text-green-800'
                                            }`}
                                        >
                                            {req.priority}
                                        </span>
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {req.status}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {formatDate(req.requestDate)}
                                        </TableCell>
                                        <TableCell className="text-left py-3 truncate">
                                            {req.serviceType}
                                        </TableCell>
                                        <TableCell className="text-left py-3"><MGBButton onClick={() => {}} variant={'primary'} children={'Edit'}/></TableCell>
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
