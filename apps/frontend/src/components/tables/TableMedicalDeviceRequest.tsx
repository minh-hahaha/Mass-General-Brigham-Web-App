import { useEffect, useState } from 'react';
import {
    GetMedicalDeviceRequest,
    incomingMedicalDeviceRequest,
} from '@/database/forms/medicalDeviceRequest.ts';
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
import { employeeNameId, getEmployeeNameIds } from '@/database/getEmployee.ts';
import { MdOutlinePriorityHigh } from 'react-icons/md';
import { FaListCheck } from 'react-icons/fa6';
import { MdDeviceUnknown } from 'react-icons/md';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

interface Props {
    setActiveForm: (
        type: 'transport' | 'translation' | 'maintenance' | 'medical device' | 'sanitation'
    ) => void;
    setEditData: (incomingRequest: incomingRequest) => void;
}

const MedicalDeviceRequestDisplayPage: React.FC<Props> = ({ setActiveForm, setEditData }) => {
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<incomingRequest[]>([]);
    const [filter, setShowFilters] = useState<boolean>(false);
    const [filters, setFilters] = useState({
        priority: '',
        status: '',
        device: '',
        location: '',
        deliverDate: '',
    });
    const [employeeList, setEmployeeList] = useState<employeeNameId[]>([]);

    useEffect(() => {
        async function fetchReqs() {
            const data = await GetMedicalDeviceRequest();
            setRequests(data);
            console.log(data);
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
        return (
            (!filters.priority ||
                req.priority?.toLowerCase().includes(filters.priority.toLowerCase())) &&
            (!filters.status || req.status?.toLowerCase().includes(filters.status.toLowerCase())) &&
            (!filters.device ||
                req.medicalDeviceRequest.device
                    ?.toLowerCase()
                    .includes(filters.device.toLowerCase())) &&
            (!filters.location ||
                req.medicalDeviceRequest.location
                    ?.toLowerCase()
                    .includes(filters.location.toLowerCase())) &&
            (!filters.status || req.status?.toLowerCase().includes(filters.status.toLowerCase()))
        );
    });
    // // Format date for display
    const formatDate = (dateString: string) => {
        return dateString.split('T')[0];
    };

    return (
        <>
            <div className="fixed top-0 left-0 h-screen w-80 bg-white border-r border-gray-300 p-4 flex flex-col gap-4 mt-7">
                <div className="flex flex-col bg-gray-200 rounded-sm mt-10 pt-2 pb-2 px-3">
                    <h1 className="font-black text-lg ml-2">Create New Request</h1>
                    <div className="flex flex-col items-center gap-2 mt-1 w-full">
                        <button
                            onClick={() => setActiveForm('medical device')}
                            className="bg-mgbblue hover:bg-blue-950 text-white px-4 py-2 rounded text-sm w-full max-w-xs"
                        >
                            New Medical Device Request +
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
                        <label className="block text-sm font-medium">Device</label>
                        <MdDeviceUnknown className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter device"
                            value={filters.device}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, device: e.target.value }))
                            }
                        />
                    </div>

                    {/* priority Input */}
                    <div>
                        <label className="block text-sm font-medium">Location</label>
                        <FaMapMarkerAlt className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter location"
                            value={filters.location}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, location: e.target.value }))
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Deliver Date</label>
                        <FaCalendarAlt className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="datetime-local"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter deliver date"
                            value={filters.deliverDate}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, deliverDate: e.target.value }))
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
                                device: '',
                                location: '',
                                deliverDate: '',
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
                                        Priority
                                    </TableHead>
                                    <TableHead className="w-20 text-left font-semibold py-3">
                                        Status
                                    </TableHead>
                                    <TableHead className="w-20 text-left font-semibold py-3">
                                        Medical Device
                                    </TableHead>
                                    <TableHead className="w-20 text-left font-semibold py-3">
                                        Location
                                    </TableHead>
                                    <TableHead className="w-20 text-left font-semibold py-3">
                                        Deliver By Date
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
                                            {req.priority}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {req.status}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {req.medicalDeviceRequest.device}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {req.medicalDeviceRequest.location}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {req.medicalDeviceRequest.deliverDate.split('T')[0]}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            <MGBButton
                                                onClick={() => {
                                                    setEditData(req);
                                                    setActiveForm('medical device');
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
export default MedicalDeviceRequestDisplayPage;
