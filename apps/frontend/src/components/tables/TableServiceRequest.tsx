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
import { AnimatePresence, motion } from 'framer-motion';
import MGBButton from '@/elements/MGBButton.tsx';
import { splitDateTime } from '@/database/forms/formTypes.ts';
import { employeeNameId, getEmployeeNameIds } from '@/database/getEmployee.ts';
import ImportExportDirectoryPage from '@/routes/ImportExportDirectoryPage.tsx';
import { ROUTES } from 'common/src/constants.ts';
import { FaRegUserCircle, FaBuilding, FaCalendarAlt  } from "react-icons/fa";
import { MdNumbers } from "react-icons/md";
import { FaListCheck } from "react-icons/fa6";
import { MdOutlinePriorityHigh } from "react-icons/md";

import { TbStairsUp } from 'react-icons/tb';

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
    }, []);

    if (loading) {
        return <p>Loading Requests...</p>;
    }

    const requestsUpdated = requests.map((req) => {
        const employeeName = employeeList.find((emp) => emp.employeeId === req.employeeId);
        return {
            ...req,
            employeeName: employeeName?.employeeName,
        };
    });
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
            <div className="fixed top-0 left-0 h-screen w-80 bg-white border-r border-gray-300 p-4 flex flex-col gap-4 mt-7 overflow-auto">
                <div className="flex flex-col bg-gray-200 rounded-sm mt-10 pt-2 pb-2 px-3">
                    <h1 className="font-black text-lg ml-2">Create New Request</h1>
                    <div className="flex flex-col items-center gap-2 mt-1 w-full">
                        <button
                            onClick={handleShowNewRequests}
                            className="bg-mgbblue hover:bg-blue-950 text-white px-4 py-2 rounded text-sm w-full max-w-xs"
                        >
                            New Request +
                        </button>
                        {showNewRequests && (
                            <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 10, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                className="flex flex-col items-center gap-2 w-full max-w-xs"
                            >
                                <button
                                    onClick={() => setActiveForm('transport')}
                                    className="bg-white text-codGray px-4 py-1 rounded-sm border border-mgbblue hover:bg-gray-200 w-full"
                                >
                                    Transportation +
                                </button>
                                <button
                                    onClick={() => setActiveForm('translation')}
                                    className="bg-white text-codGray px-4 py-1 rounded-sm border border-mgbblue hover:bg-gray-200 w-full"
                                >
                                    Translation +
                                </button>
                                <button
                                    onClick={() => setActiveForm('sanitation')}
                                    className="bg-white text-codGray px-4 py-1 rounded-sm border border-mgbblue hover:bg-gray-200 w-full"
                                >
                                    Sanitation +
                                </button>
                                <button
                                    onClick={() => setActiveForm('medical device')}
                                    className="bg-white text-codGray px-4 py-1 rounded-sm border border-mgbblue hover:bg-gray-200 w-full"
                                >
                                    Medical Device +
                                </button>
                                <button
                                    onClick={() => setActiveForm('maintenance')}
                                    className="bg-white text-codGray px-4 py-1 border rounded-sm border-mgbblue hover:bg-gray-200 w-full"
                                >
                                    Maintenance +
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
                <h1 className="font-black text-2xl">Filters</h1>
                <div className="flex flex-col gap-3">
                    {/* Filter Inputs */}
                    {/* employee Name Input */}
                    <div>
                        <label className="block text-sm font-medium">Employee Name</label>
                        <FaRegUserCircle className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter employee name"
                            value={filters.employeeName}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, employeeName: e.target.value }))
                            }
                        />
                    </div>

                    {/* dept Input */}
                    <div>
                        <label className="block text-sm font-medium">Department</label>
                        <FaBuilding className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter department"
                            value={filters.department}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    department: e.target.value,
                                }))
                            }
                        />
                    </div>

                    {/*/!* rmNum Input *!/*/}
                    {/*<div>*/}
                    {/*    <label className="block text-sm font-medium">Room Number</label>*/}
                    {/*    <MdNumbers className="absolute mt-2 ml-1 text-codGray" size={15} />*/}
                    {/*    <input*/}
                    {/*        type="text"*/}
                    {/*        className="border border-mgbblue rounded-sm w-full p-1 px-6"*/}
                    {/*        placeholder="Filter room number"*/}
                    {/*        value={filters.roomNumber}*/}
                    {/*        onChange={(e) =>*/}
                    {/*            setFilters((prev) => ({ ...prev, roomNumber: e.target.value }))*/}
                    {/*        }*/}
                    {/*    />*/}
                    {/*</div>*/}

                    {/* status Input */}
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

                    {/* priority Input */}
                    <div>
                        <label className="block text-sm font-medium">Priority</label>
                        <MdOutlinePriorityHigh className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter priority"
                            value={filters.priority}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, priority: e.target.value }))
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Request Date</label>
                        <FaCalendarAlt className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="datetime-local"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter date"
                            value={filters.requestDateTime}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, requestDateTime: e.target.value }))
                            }
                        />
                    </div>
                </div>

                {/* Clear Filters Button */}
                <div className="justify-start mb-5">
                    <MGBButton
                        onClick={() =>
                            setFilters({
                                employeeName: '',
                                department: '',
                                status: '',
                                priority: '',
                                requestDateTime: '',
                            })
                        }
                        variant={'secondary'}
                        className="py-2 px-4 rounded text-sm"
                    >
                        Clear Filters
                    </MGBButton>
                </div>

            </div>
            <div className="ml-38 w-full p-6 min-h-screen bg-gray-200">
                <div className="flex justify-center">
                    <div className="w-5xl border border-gray-300 rounded-2xl shadow-md overflow-hidden bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-fountainBlue hover:bg-fountainBlue">
                                    <TableHead className="w-20 text-left font-semibold py-3">
                                        Request ID
                                    </TableHead>
                                    <TableHead className="w-20 text-left font-semibold py-3">
                                        Employee Name
                                    </TableHead>
                                    <TableHead className="w-20 text-left font-semibold py-3">
                                        Department
                                    </TableHead>
                                    {/*<TableHead className="w-20 text-left font-semibold py-3">*/}
                                    {/*    Room*/}
                                    {/*</TableHead>*/}
                                    <TableHead className="w-20 text-left font-semibold py-3">
                                        Status
                                    </TableHead>
                                    <TableHead className="w-20 text-left font-semibold py-3">
                                        Priority
                                    </TableHead>
                                    <TableHead className="w-20 text-left font-semibold py-3">
                                        Request Date
                                    </TableHead>
                                    <TableHead className="w-20 text-left font-semibold py-3">
                                        Request Time
                                    </TableHead>
                                    <TableHead className="w-20 text-left font-semibold py-3">
                                        Service Type
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRequests.map((req) => (
                                    <TableRow
                                        key={req.requestId}
                                        className="border-b hover:bg-gray-200 odd:bg-gray-100"
                                    >
                                        <TableCell className="text-left py-3">
                                            {req.requestId}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {req.employeeName ?? 'Unassigned'}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {req.requesterDepartmentId}
                                        </TableCell>
                                        {/*<TableCell className="text-left py-3">*/}
                                        {/*    {req.requesterRoomNumber}*/}
                                        {/*</TableCell>*/}
                                        <TableCell className="text-left py-3">
                                            {req.status}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {req.priority}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {req.requestDateTime?.split('T')[0]}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {req.requestDateTime?.split('T')[1]?.substring(0, 5)}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {req.serviceType}
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

export default TableServiceRequests;
