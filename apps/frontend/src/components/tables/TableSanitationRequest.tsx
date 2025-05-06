import { useEffect, useState } from 'react';
import {
    GetSanitationRequest,
    incomingSanitationRequest,
} from '@/database/forms/sanitationRequest.ts';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table.tsx';
import { motion } from 'framer-motion';
import { employeeNameId, getEmployeeNameIds } from '@/database/getEmployee.ts';
import MGBButton from '@/elements/MGBButton.tsx';
import { incomingRequest } from '@/database/forms/transportRequest.ts';
import { MdOutlinePriorityHigh } from 'react-icons/md';
import { FaListCheck } from 'react-icons/fa6';
import { FaSprayCan, FaBiohazard, FaCalendarAlt } from 'react-icons/fa';

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
    const [employeeList, setEmployeeList] = useState<employeeNameId[]>([]);

    useEffect(() => {
        async function fetchReqs() {
            const data = await GetSanitationRequest();
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

    const filteredRequests = requests.filter((req) => {
        const disposalText = req.sanitation.disposalRequired ? 'yes' : 'no';
        const recurringText = req.sanitation.recurring ? 'yes' : 'no';

        return (
            (!filters.priority ||
                req.priority?.toLowerCase().includes(filters.priority.toLowerCase())) &&
            (!filters.status || req.status?.toLowerCase().includes(filters.status.toLowerCase())) &&
            (!filters.sanType ||
                req.sanitation.sanitationType
                    ?.toLowerCase()
                    .includes(filters.sanType.toLowerCase())) &&
            (!filters.hazard ||
                req.sanitation.hazardLevel?.toLowerCase().includes(filters.hazard.toLowerCase())) &&
            (!filters.completeBy || req.sanitation.completeBy?.startsWith(filters.completeBy))
        );
    });

    return (
        <>
            <div className="fixed top-0 left-0 h-screen w-80 bg-white border-r border-gray-300 p-4 flex flex-col gap-4 mt-7">
                <div className="flex flex-col bg-gray-200 rounded-sm mt-10 pt-2 pb-2 px-3">
                    <h1 className="font-black text-lg ml-2">Create New Request</h1>
                    <div className="flex flex-col items-center gap-2 mt-1 w-full">
                        <button
                            onClick={() => setActiveForm('sanitation')}
                            className="bg-mgbblue hover:bg-blue-950 text-white px-4 py-2 rounded text-sm w-full max-w-xs"
                        >
                            New Sanitation Request +
                        </button>
                    </div>
                </div>
                <h1 className="mt-5 font-black text-2xl">Filters</h1>
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
                        <label className="block text-sm font-medium">Sanitation Type</label>
                        <FaSprayCan className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter sanitation type"
                            value={filters.sanType}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, sanType: e.target.value }))
                            }
                        />
                    </div>

                    {/* priority Input */}
                    <div>
                        <label className="block text-sm font-medium">Hazard</label>
                        <FaBiohazard className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter hazard"
                            value={filters.hazard}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, hazard: e.target.value }))
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Complete By</label>
                        <FaCalendarAlt className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="datetime-local"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter complete by"
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
                                sanType: '',
                                hazard: '',
                                completeBy: '',
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
                                    {/*
                            completeBy: number
                            disposalRequired: boolean
                            hazardLevel: string
                            recurring: boolean
                            sanitationType: string*/}
                                    <TableHead className="w-20 text-left font-semibold py-3">
                                        Priority
                                    </TableHead>
                                    <TableHead className="w-20 text-left font-semibold py-3">
                                        Status
                                    </TableHead>
                                    <TableHead className="w-20 text-left font-semibold py-3">
                                        Sanitation Type
                                    </TableHead>
                                    <TableHead className="w-20 text-left font-semibold py-3">
                                        Hazard Level
                                    </TableHead>
                                    <TableHead className="w-20 text-left font-semibold py-3">
                                        Complete By Date
                                    </TableHead>
                                    <TableHead className="w-20 text-left font-semibold py-3"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRequests.map((req) => (
                                    <TableRow
                                        key={req.requestId}
                                        className="border-b hover:bg-gray-200 odd:bg-gray-100"
                                    >
                                        <TableCell className="text-left py-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold
            ${
                req.priority === 'Emergency'
                    ? 'bg-red-600 text-white'
                    : req.priority === 'High'
                      ? 'bg-red-200 text-red-800'
                      : req.priority === 'Medium'
                        ? 'bg-yellow-200 text-yellow-800'
                        : req.priority === 'Low'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-gray-200 text-gray-800'
            }`}
                                            >
                                                {req.priority}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {req.status}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {req.sanitation.sanitationType}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {req.sanitation.hazardLevel}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {req.sanitation.completeBy.split('T')[0]}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            <MGBButton
                                                onClick={() => {
                                                    setEditData(req);
                                                    setActiveForm('sanitation');
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

export default TableSanitationRequest;
