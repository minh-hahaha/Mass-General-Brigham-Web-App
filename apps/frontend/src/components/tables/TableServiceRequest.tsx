import { useEffect, useState } from 'react';
import { getServiceRequest, incomingServiceRequest } from '@/database/serviceRequest.ts';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table.tsx';
import { motion } from 'framer-motion';
import { splitDateTime } from '@/database/forms/formTypes.ts';
import { employeeNameId, getEmployeeNameIds } from '@/database/getEmployee.ts';

interface Props {
    setActiveForm: (
        type: 'transport' | 'translation' | 'maintenance' | 'medical device' | 'sanitation'
    ) => void;
}

const TableServiceRequests: React.FC<Props> = ({ setActiveForm }) => {
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<incomingServiceRequest[]>([]);
    const [filter, setShowFilters] = useState<boolean>(false);
    const [filters, setFilters] = useState({
        employeeName: '',
        department: '',
        roomNumber: '',
        status: '',
        priority: '',
        requestDateTime: '',
    });
    const [showNewRequests, setShowNewRequests] = useState<boolean>(false);

    const [employeeList, setEmployeeList] = useState<employeeNameId[]>([]);
    // const [receivedRequests, setReceivedRequests] = useState<incomingServiceRequest[]>([]);

    useEffect(() => {
        async function fetchReqs() {
            const data = await getServiceRequest();
            console.log(data);
            setRequests(data);
            setLoading(false);
        }

        fetchReqs();
    }, []);

    useEffect(() => {
        async function fetchEmployeeList() {
            const data = await getEmployeeNameIds();
            setEmployeeList(data);
        }
        fetchEmployeeList();
    }, [])

    if (loading) {
        return <p>Loading Requests...</p>;
    }



    const requestsUpdated = requests.map((req) => {
        const employeeName = employeeList.find((emp) => emp.employeeId === req.employeeId);
        return {
            ...req,
            employeeName: employeeName?.employeeName,
        };
    })
    const filteredRequests = requestsUpdated.filter((req) => {
        return (
            (!filters.employeeName ||
                (req.employeeName
                    ? req.employeeName.toLowerCase().includes(filters.employeeName.toLowerCase())
                    : 'unassigned'.includes(filters.employeeName.toLowerCase()))) &&
            (!filters.department ||
                req.requesterDepartmentId
                    ?.toLowerCase()
                    .includes(filters.department.toLowerCase())) &&
            (!filters.roomNumber ||
                req.requesterRoomNumber
                    ?.toLowerCase()
                    .includes(filters.roomNumber.toLowerCase())) &&
            (!filters.status || req.status?.toLowerCase().includes(filters.status.toLowerCase())) &&
            (!filters.priority ||
                req.priority?.toLowerCase().includes(filters.priority.toLowerCase())) &&
            (!filters.requestDateTime || req.requestDateTime?.startsWith(filters.requestDateTime))
        );
    });

    const handleShowNewRequests = () => {
        setShowNewRequests(!showNewRequests);
        setShowFilters(false);
    };

    const handleShowFilters = () => {
        setShowFilters(!filter);
        setShowNewRequests(false);
    };

    // const [requestDate, requestTime] = splitDateTime(filters.requestDateTime);
    return (
        <>
            <div className={`w-full flex flex-row justify-between px-10`}>
                <div className="flex flex-row items-center gap-2 mt-2">
                    <button
                        onClick={handleShowFilters}
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
                                <label className="block text-sm font-medium">Employee Name</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-37 p-1"
                                    value={filters.employeeName}
                                    onChange={(e) =>
                                        setFilters({ ...filters, employeeName: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Department</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-37 p-1"
                                    value={filters.department}
                                    onChange={(e) =>
                                        setFilters({ ...filters, department: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Room</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-15 p-1"
                                    value={filters.roomNumber}
                                    onChange={(e) =>
                                        setFilters({ ...filters, roomNumber: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Status</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-25 p-1"
                                    value={filters.status}
                                    onChange={(e) =>
                                        setFilters({ ...filters, status: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Priority</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-25 p-1"
                                    value={filters.priority}
                                    onChange={(e) =>
                                        setFilters({ ...filters, priority: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">
                                    Request Date (ISO)
                                </label>
                                <input
                                    type="datetime-local"
                                    className="border border-mgbblue rounded-sm w-40 p-1"
                                    value={filters.requestDateTime}
                                    onChange={(e) =>
                                        setFilters({ ...filters, requestDateTime: e.target.value })
                                    }
                                />
                            </div>
                        </motion.div>
                    )}
                </div>
                <div className="flex flex-row items-center gap-2 mt-2">
                    <button
                        onClick={handleShowNewRequests}
                        className="bg-mgbyellow hover:bg-yellow-600 text-codGray px-9 py-3 rounded text-sm relative top-1"
                    >
                        New Request +
                    </button>
                    {showNewRequests && (
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            className="absolute right-[220px] rounded flex flex-row gap-1"
                        >
                            <button
                                onClick={() => setActiveForm('transport')}
                                className="bg-white text-codGray px-3 py-2 rounded-sm border border-mgbblue hover:bg-gray-200 mt-2"
                            >
                                Transportation +
                            </button>
                            <button
                                onClick={() => setActiveForm('translation')}
                                className="bg-white text-codGray px-3 py-2 rounded-sm border border-mgbblue hover:bg-gray-200 mt-2"
                            >
                                Translation +
                            </button>
                            <button
                                onClick={() => setActiveForm('sanitation')}
                                className="bg-white text-codGray px-3 py-2 rounded-sm border border-mgbblue hover:bg-gray-200 mt-2"
                            >
                                Sanitation +
                            </button>
                            <button
                                onClick={() => setActiveForm('medical device')}
                                className="bg-white text-codGray px-3 py-2 rounded-sm border border-mgbblue hover:bg-gray-200 mt-2"
                            >
                                Medical Device +
                            </button>
                            <button
                                onClick={() => setActiveForm('maintenance')}
                                className="bg-white text-codGray px-3 py-2 border rounded-sm border-mgbblue hover:bg-gray-200 mt-2"
                            >
                                Maintenance +
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
            <div className="flex justify-center mt-3 px-4">
                <div className="w-350 border border-gray-300 rounded-2xl shadow-md overflow-hidden bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="w-20 text-center font-semibold py-3">Request ID</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Employee Name</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Department</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Room</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Status</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Priority</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Request Date</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Request Time</TableHead>
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
                                    <TableCell className="text-center py-3">{req.employeeName ?? 'Unassigned'}</TableCell>
                                    <TableCell className="text-center py-3">{req.requesterDepartmentId}</TableCell>
                                    <TableCell className="text-center py-3">{req.requesterRoomNumber}</TableCell>
                                    <TableCell className="text-center py-3">{req.status}</TableCell>
                                    <TableCell className="text-center py-3">{req.priority}</TableCell>
                                    <TableCell className="text-center py-3">{req.requestDateTime?.split('T')[0]}</TableCell>
                                    <TableCell className="text-center py-3">
                                        {req.requestDateTime?.split('T')[1]?.substring(0, 5)}
                                    </TableCell>
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

export default TableServiceRequests;
