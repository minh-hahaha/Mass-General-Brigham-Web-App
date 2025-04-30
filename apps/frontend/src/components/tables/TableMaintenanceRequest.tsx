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
import MGBButton from '@/elements/MGBButton.tsx';
import { incomingRequest } from '@/database/forms/transportRequest.ts';
import { MdOutlinePriorityHigh } from 'react-icons/md';
import { FaListCheck } from 'react-icons/fa6';
import { FaCalendarAlt, FaHammer, FaHospital } from 'react-icons/fa';

interface Props {
    setActiveForm: (
        type: 'transport' | 'translation' | 'maintenance' | 'medical device' | 'sanitation'
    ) => void;
    setEditData: (incomingRequest: incomingRequest) => void;
}

const TableMaintenanceRequest: React.FC<Props> = ({ setActiveForm, setEditData }) => {
    // State management
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<incomingRequest[]>([]);
    const [filter, setShowFilters] = useState<boolean>(false);
    const [filters, setFilters] = useState({
        priority: '',
        status: '',
        type: '',
        hospital: '',
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
            (!filters.priority ||
                req.priority?.toLowerCase().includes(filters.priority.toLowerCase())) &&
            (!filters.status || req.status?.toLowerCase().includes(filters.status.toLowerCase())) &&
            (!filters.type ||
                req.maintenanceRequest.maintenanceType
                    ?.toLowerCase()
                    .includes(filters.type.toLowerCase())) &&
            (!filters.hospital ||
                req.maintenanceRequest.maintenanceHospital
                    ?.toLowerCase()
                    .includes(filters.hospital.toLowerCase())) &&
            (!filters.completeBy ||
                req.maintenanceRequest.maintenanceTime?.startsWith(filters.completeBy))
        );
    });

    // Format date for display
    const formatDate = (dateString: string) => {
        return dateString.split('T')[0];
    };

    return (
        <>
            <div className="fixed top-0 left-0 h-screen w-75 bg-white border-r border-gray-300 p-4 flex flex-col gap-4 mt-7">
                <h1 className="mt-10 font-black text-2xl">Filters</h1>
                <div className="flex flex-col gap-3">
                    {/* Filter Inputs */}
                    <div>
                        <label className="block text-sm font-medium">Priority</label>
                        <MdOutlinePriorityHigh
                            className="absolute mt-2 ml-1 text-codGray"
                            size={15}
                        />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter priority"
                            value={filters.priority}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    priority: e.target.value,
                                }))
                            }
                        />
                    </div>

                    {/* rmNum Input */}
                    <div>
                        <label className="block text-sm font-medium">Status</label>
                        <FaListCheck className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter status"
                            value={filters.status}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, status: e.target.value }))
                            }
                        />
                    </div>

                    {/* status Input */}
                    <div>
                        <label className="block text-sm font-medium">Maintenance Type</label>
                        <FaHammer className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter maintenance type"
                            value={filters.type}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, type: e.target.value }))
                            }
                        />
                    </div>

                    {/* priority Input */}
                    <div>
                        <label className="block text-sm font-medium">Hospital</label>
                        <FaHospital className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter hospital"
                            value={filters.hospital}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, hospital: e.target.value }))
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Complete By</label>
                        <FaCalendarAlt className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="datetime-local"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter deliver date"
                            value={filters.completeBy}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, completeBy: e.target.value }))
                            }
                        />
                    </div>
                </div>

                {/* Clear Filters Button */}
                <div className="justify-start">
                    <MGBButton
                        onClick={() =>
                            setFilters({
                                priority: '',
                                status: '',
                                type: '',
                                hospital: '',
                                completeBy: '',
                            })
                        }
                        variant={'secondary'}
                        className="py-2 px-4 rounded text-sm"
                    >
                        Clear Filters
                    </MGBButton>
                </div>

                <div className="flex flex-col bg-gray-200 rounded-sm pt-2 pb-5 px-3 mt-4">
                    <h1 className="font-black text-lg ml-2">Create New Request</h1>
                    <div className="flex flex-col items-center gap-2 mt-1 w-full">
                        <button
                            onClick={() => setActiveForm('maintenance')}
                            className="bg-mgbblue hover:bg-blue-950 text-white px-4 py-4 mt-2 rounded text-sm w-full max-w-xs"
                        >
                            New Maintenance Request +
                        </button>
                    </div>
                </div>
            </div>
            <div className="ml-38 w-full p-6 min-h-screen bg-gray-200">
                <div className="flex justify-center">
                    <div className="w-full max-w-6xl border border-gray-300 rounded-2xl shadow-md overflow-hidden bg-white">
                        <Table className="w-full table-fixed">
                            <TableHeader>
                                <TableRow className="bg-fountainBlue hover:bg-fountainBlue">
                                    <TableHead className="w-24 text-left font-semibold py-3">
                                        Priority
                                    </TableHead>
                                    <TableHead className="w-24 text-left font-semibold py-3">
                                        Status
                                    </TableHead>
                                    <TableHead className="w-32 text-left font-semibold py-3">
                                        Maintenance Type
                                    </TableHead>
                                    <TableHead className="w-28 text-left font-semibold py-3">
                                        Hospital
                                    </TableHead>
                                    <TableHead className="w-32 text-left font-semibold py-3">
                                        Complete By Date
                                    </TableHead>
                                    <TableHead className="w-28 text-left font-semibold py-3"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRequests.map((req) => (
                                    <TableRow
                                        key={req.requestId}
                                        className="border-b hover:bg-gray-200 odd:bg-gray-100"
                                    >
                                        <TableCell className="text-left py-3">
                                            {req.priority}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {req.status}
                                        </TableCell>
                                        <TableCell className="text-left py-3 truncate">
                                            {req.maintenanceRequest.maintenanceType}
                                        </TableCell>
                                        <TableCell className="text-left py-3 truncate">
                                            {req.maintenanceRequest.maintenanceHospital}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {formatDate(req.maintenanceRequest.maintenanceTime)}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            <MGBButton
                                                onClick={() => {
                                                    setEditData(req);
                                                    setActiveForm('maintenance');
                                                }}
                                                variant={'secondary'}
                                                children={'Edit'}
                                            />
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
