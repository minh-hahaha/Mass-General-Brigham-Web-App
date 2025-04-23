import { useEffect, useState } from 'react';
import {
    GetMedicalDeviceRequest,
    incomingMedicalDeviceRequest,
} from '@/database/medicalDeviceRequest.ts';
import {
    Table,
    TableBody,
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

const MedicalDeviceRequestDisplayPage: React.FC<Props> = ({ setActiveForm }) => {
    const loggedIn = sessionStorage.getItem('loggedIn');
    if (!loggedIn) {
        window.location.href = '/';
    }

    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<incomingMedicalDeviceRequest[]>([]);
    const [filter, setShowFilters] = useState<boolean>(false);
    const [filters, setFilters] = useState({
        device: '',
        serNum: '',
        location: '',
        priority: '',
        status: '',
        reqDate: '',
        department: '',
    });

    useEffect(() => {
        async function fetchReqs() {
            const data = await GetMedicalDeviceRequest();
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

    const filteredRequests = requests.filter((req) => {
        return (
            (!filters.device || req.medicalDeviceRequest.device?.toLowerCase().includes(filters.device.toLowerCase())) &&
            (!filters.serNum || req.medicalDeviceRequest.deviceSerialNumber?.toLowerCase().includes(filters.serNum.toLowerCase())) &&
            (!filters.location || req.medicalDeviceRequest.location?.toLowerCase().includes(filters.location.toLowerCase())) &&
            (!filters.priority || req.priority?.toLowerCase().includes(filters.priority.toLowerCase())) &&
            (!filters.status || req.status?.toLowerCase().includes(filters.status.toLowerCase())) &&
            (!filters.reqDate || req.medicalDeviceRequest.date?.startsWith(filters.reqDate)) &&
            (!filters.department || req.medicalDeviceRequest.department?.toLowerCase().includes(filters.department.toLowerCase()))
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
                                <label className="block text-sm font-medium">Device</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-30 p-1"
                                    value={filters.device}
                                    onChange={(e) =>
                                        setFilters({ ...filters, device: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Serial Num</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-25 p-1"
                                    value={filters.serNum}
                                    onChange={(e) =>
                                        setFilters({ ...filters, serNum: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Location</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-25 p-1"
                                    value={filters.reqDate}
                                    onChange={(e) =>
                                        setFilters({ ...filters, reqDate: e.target.value })
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
                                    className="border border-mgbblue rounded-sm w-15 p-1"
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
                            <div>
                                <label className="block text-sm font-medium">Department</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-30 p-1"
                                    value={filters.department}
                                    onChange={(e) =>
                                        setFilters({ ...filters, department: e.target.value })
                                    }
                                />
                            </div>
                        </motion.div>
                    )}
                </div>
                <div className="flex flex-row items-center gap-2 mt-2">
                    <button
                        onClick={() => setActiveForm('medical device')}
                        className="bg-mgbblue hover:bg-blue-950 text-white px-9 py-3 rounded text-sm relative top-1"
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
                                <TableHead className="w-20 text-center font-semibold py-3">Medical Device</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Medical Device Serial Number</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Explanation</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Location</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Priority</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Status</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Request Date</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Department</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRequests.map((req) => (
                                <TableRow
                                    key={req.requestId}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <TableCell className="text-center py-3">{req.requestId}</TableCell>
                                    <TableCell className="text-center py-3">{req.medicalDeviceRequest.device}</TableCell>
                                    <TableCell className="text-center py-3">
                                        {req.medicalDeviceRequest.deviceSerialNumber}
                                    </TableCell>
                                    <TableCell className="text-center py-3">
                                        {req.medicalDeviceRequest.deviceReasoning
                                            ?.match(/.{1,30}/g)
                                            ?.map((chunk, i) => (
                                                <span key={i}>
                                                    {chunk}
                                                    <br />
                                                </span>
                                            ))}
                                    </TableCell>
                                    <TableCell className="text-center py-3">{req.medicalDeviceRequest.location}</TableCell>
                                    <TableCell className="text-center py-3">{req.priority}</TableCell>
                                    <TableCell className="text-center py-3">{req.status}</TableCell>
                                    <TableCell className="text-center py-3">{formatDate(req.requestDate)}</TableCell>
                                    <TableCell className="text-center py-3">{req.medicalDeviceRequest.department}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
};
export default MedicalDeviceRequestDisplayPage;
