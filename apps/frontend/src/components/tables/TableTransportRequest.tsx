import { useEffect, useState } from 'react';
import { GetTransportRequest } from '@/database/forms/transportRequest.ts';
import {
    GetSanitationRequest,
    incomingSanitationRequest,
} from '@/database/forms/sanitationRequest.ts';
import { incomingRequest } from '@/database/forms/transportRequest.ts';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table.tsx';
import { motion, AnimatePresence } from 'framer-motion';
import { employeeNameId, getEmployeeNameIds } from '@/database/getEmployee.ts';
import MGBButton from '@/elements/MGBButton.tsx';
import { FaListCheck } from 'react-icons/fa6';
import { FaRegUserCircle, FaMap, FaMapMarkerAlt, FaCalendarAlt, FaAmbulance } from 'react-icons/fa';
import { MdOutlinePriorityHigh } from 'react-icons/md';

interface Props {
    setActiveForm: (
        type: 'transport' | 'translation' | 'maintenance' | 'medical device' | 'sanitation'
    ) => void;
    setEditData: (incomingRequest: incomingRequest) => void;
}

const TableTransportRequest: React.FC<Props> = ({ setActiveForm, setEditData }) => {
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<incomingRequest[]>([]);
    const [filters, setFilters] = useState({
        patientId: '',
        priority: '',
        status: '',
        pickUp: '',
        dropOff: '',
        transportDate: '',
        transportType: '',
    });
    const [filter, setShowFilters] = useState<boolean>(false);
    const [employeeList, setEmployeeList] = useState<employeeNameId[]>([]);

    useEffect(() => {
        async function fetchReqs() {
            const data = await GetTransportRequest();
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

    // Format date for display
    const formatDate = (dateString: string) => {
        return dateString.split('T')[0];
    };

    const filteredRequests = requests.filter((req) => {
        return (
            (!filters.patientId || String(req.patientTransport.patientId) === filters.patientId) &&
            (!filters.priority ||
                req.priority?.toLowerCase().includes(filters.priority.toLowerCase())) &&
            (!filters.status || req.status?.toLowerCase().includes(filters.status.toLowerCase())) &&
            (!filters.dropOff ||
                req.patientTransport.dropoffLocation
                    ?.toLowerCase()
                    .includes(filters.dropOff.toLowerCase())) &&
            (!filters.pickUp ||
                req.patientTransport.pickupLocation
                    ?.toLowerCase()
                    .includes(filters.pickUp.toLowerCase())) &&
            (!filters.transportType ||
                req.patientTransport.transportType
                    ?.toLowerCase()
                    .includes(filters.transportType.toLowerCase())) &&
            (!filters.transportDate ||
                req.patientTransport.transportDate?.startsWith(filters.transportDate))
        );
    });

    return (
        <>
            <div className="fixed top-0 left-0 h-screen w-80 bg-white border-r border-gray-300 p-4 flex flex-col gap-4 mt-7">
                <div className="flex flex-col bg-gray-200 rounded-sm mt-10 pt-2 pb-2 px-3">
                    <h1 className="font-black text-lg ml-2">Create New Request</h1>
                    <div className="flex flex-col items-center gap-2 mt-1 w-full">
                        <button
                            onClick={() => setActiveForm('transport')}
                            className="bg-mgbblue hover:bg-blue-950 text-white px-4 py-2 rounded text-sm w-full max-w-xs"
                        >
                            New Transport Request +
                        </button>
                    </div>
                </div>
                <h1 className="mt-5 font-black text-2xl">Filters</h1>
                <div className="flex flex-col gap-3">
                    {/* Filter Inputs */}
                    <div>
                        <label className="block text-sm font-medium">Patient ID</label>
                        <FaRegUserCircle className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter patient ID"
                            value={filters.patientId}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, patientId: e.target.value }))
                            }
                        />
                    </div>

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
                        <label className="block text-sm font-medium">Pick Up</label>
                        <FaMap className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter pick up"
                            value={filters.pickUp}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, pickUp: e.target.value }))
                            }
                        />
                    </div>

                    {/* priority Input */}
                    <div>
                        <label className="block text-sm font-medium">Drop Off</label>
                        <FaMapMarkerAlt className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter drop off"
                            value={filters.dropOff}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, dropOff: e.target.value }))
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Transport Date</label>
                        <FaCalendarAlt className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="datetime-local"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter transport date"
                            value={filters.transportDate}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, transportDate: e.target.value }))
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Transport Type</label>
                        <FaAmbulance className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter transport type"
                            value={filters.transportType}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, transportType: e.target.value }))
                            }
                        />
                    </div>
                </div>

                {/* Clear Filters Button */}
                <div className="justify-start">
                    <MGBButton
                        onClick={() =>
                            setFilters({
                                patientId: '',
                                priority: '',
                                status: '',
                                pickUp: '',
                                dropOff: '',
                                transportDate: '',
                                transportType: '',
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
                    <div className="w-full max-w-6xl border border-gray-300 rounded-2xl shadow-md overflow-hidden bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-fountainBlue hover:bg-fountainBlue">
                                    <TableHead className="w-20 text-left font-semibold py-3">
                                        Patient ID
                                    </TableHead>
                                    <TableHead className="w-20 text-left font-semibold py-3">
                                        Priority
                                    </TableHead>
                                    <TableHead className="w-20 text-left font-semibold py-3">
                                        Status
                                    </TableHead>
                                    <TableHead className="w-20 text-left font-semibold py-3">
                                        Starting Location
                                    </TableHead>
                                    <TableHead className="w-20 text-left font-semibold py-3">
                                        Destination
                                    </TableHead>
                                    <TableHead className="w-20 text-left font-semibold py-3">
                                        Transport Type
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
                                            {req.patientTransport.patientId}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {req.priority}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {req.status}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {req.patientTransport.pickupLocation}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {req.patientTransport.dropoffLocation}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {req.patientTransport.transportType}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {formatDate(req.patientTransport.transportDate)}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            <MGBButton
                                                onClick={() => {
                                                    setEditData(req);
                                                    setActiveForm('transport');
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

export default TableTransportRequest;
