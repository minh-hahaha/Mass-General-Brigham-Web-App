import { useEffect, useState } from 'react';
import { GetTranslatorRequest, incomingTranslationRequest } from '@/database/translationRequest.ts';
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

const TableTranslatorRequest: React.FC<Props> = ({ setActiveForm }) => {
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<incomingTranslationRequest[]>([]);
    const [filter, setShowFilters] = useState<boolean>(false);
    const [filters, setFilters] = useState({
        languageReq: '',
        patientName: '',
        priority: '',
        status: '',
        requestDate: '',
        location: '',
        department: '',
    });

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

    const filteredRequests = requests.filter((req) => {
        return (
            (!filters.languageReq || req.translationRequest.language?.toLowerCase().includes(filters.languageReq.toLowerCase())) &&
            (!filters.patientName || req.translationRequest.patientName?.toLowerCase().includes(filters.patientName.toLowerCase())) &&
            (!filters.priority || req.priority?.toLowerCase().includes(filters.priority.toLowerCase())) &&
            (!filters.status || req.status?.toLowerCase().includes(filters.status.toLowerCase())) &&
            (!filters.requestDate || req.requestDate?.startsWith(filters.requestDate)) &&
            (!filters.location || req.translationRequest.location?.toLowerCase().includes(filters.location.toLowerCase())) &&
            (!filters.department || req.translationRequest.department?.toLowerCase().includes(filters.department.toLowerCase()))
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
                                <label className="block text-sm font-medium">Language</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-30 p-1"
                                    value={filters.languageReq}
                                    onChange={(e) =>
                                        setFilters({ ...filters, languageReq: e.target.value })
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
                                    className="border border-mgbblue rounded-sm w-15 p-1"
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
                                    value={filters.requestDate}
                                    onChange={(e) =>
                                        setFilters({ ...filters, requestDate: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Location</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-25 p-1"
                                    value={filters.location}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            location: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Department</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-25 p-1"
                                    value={filters.department}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            department: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </motion.div>
                    )}
                </div>
                <div className="flex flex-row items-center gap-2 mt-2">
                    <button
                        onClick={() => setActiveForm('translation')}
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
                                <TableHead className="w-20 text-center font-semibold py-3">Language Required</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Meeting Type</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Meeting Link</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Patient Name</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Priority</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Status</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Request Date</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Location</TableHead>
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
                                    <TableCell className="text-center py-3">{req.translationRequest.language}</TableCell>
                                    <TableCell className="text-center py-3">{req.translationRequest.typeMeeting}</TableCell>
                                    <TableCell className="text-center py-3">{req.translationRequest.meetingLink}</TableCell>
                                    <TableCell className="text-center py-3">{req.translationRequest.patientName}</TableCell>
                                    <TableCell className="text-center py-3">{req.priority}</TableCell>
                                    <TableCell className="text-center py-3">{req.status}</TableCell>
                                    <TableCell className="text-center py-3">{req.requestDate.split('T')[0]}</TableCell>
                                    <TableCell className="text-center py-3">{req.translationRequest.location}</TableCell>
                                    <TableCell className="text-center py-3">{req.translationRequest.department}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
};

export default TableTranslatorRequest;
