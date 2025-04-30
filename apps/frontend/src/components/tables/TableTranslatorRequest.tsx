import { useEffect, useState } from 'react';
import {
    GetTranslatorRequest,
    incomingTranslationRequest,
} from '@/database/forms/translationRequest.ts';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table.tsx';
import { motion } from 'framer-motion';
import { incomingRequest } from '@/database/forms/transportRequest.ts';
import MGBButton from '@/elements/MGBButton.tsx';
import { employeeNameId, getEmployeeNameIds } from '@/database/getEmployee.ts';
import { FaRegUserCircle, FaLaptop, FaMapMarkerAlt } from 'react-icons/fa';
import { MdOutlinePriorityHigh } from 'react-icons/md';
import { FaListCheck } from 'react-icons/fa6';
import { IoLanguage } from 'react-icons/io5';

interface Props {
    setActiveForm: (
        type: 'transport' | 'translation' | 'maintenance' | 'medical device' | 'sanitation'
    ) => void;
    setEditData: (incomingRequest: incomingRequest) => void;
}

const TableTranslatorRequest: React.FC<Props> = ({ setActiveForm, setEditData }) => {
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<incomingRequest[]>([]);
    const [filter, setShowFilters] = useState<boolean>(false);
    const [filters, setFilters] = useState({
        patientId: '',
        priority: '',
        status: '',
        meetingType: '',
        languageReq: '',
        location: '',
    });
    const [employeeList, setEmployeeList] = useState<employeeNameId[]>([]);

    useEffect(() => {
        async function fetchReqs() {
            const data = await GetTranslatorRequest();
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
        return (
            (!filters.patientId ||
                String(req.translationRequest.patientId) === filters.patientId) &&
            (!filters.priority ||
                req.priority?.toLowerCase().includes(filters.priority.toLowerCase())) &&
            (!filters.status || req.status?.toLowerCase().includes(filters.status.toLowerCase())) &&
            (!filters.meetingType ||
                req.translationRequest.typeMeeting
                    ?.toLowerCase()
                    .includes(filters.meetingType.toLowerCase())) &&
            (!filters.languageReq ||
                req.translationRequest.language
                    ?.toLowerCase()
                    .includes(filters.languageReq.toLowerCase())) &&
            (!filters.location ||
                req.translationRequest.location
                    ?.toLowerCase()
                    .includes(filters.location.toLowerCase()))
        );
    });
    return (
        <>
            <div className="fixed top-0 left-0 h-screen w-75 bg-white border-r border-gray-300 p-4 flex flex-col gap-4 mt-7">
                <h1 className="mt-10 font-black text-2xl">Filters</h1>
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
                        <label className="block text-sm font-medium">Meeting Type</label>
                        <FaLaptop className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter meeting type"
                            value={filters.meetingType}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, meetingType: e.target.value }))
                            }
                        />
                    </div>

                    {/* priority Input */}
                    <div>
                        <label className="block text-sm font-medium">Language Requirement</label>
                        <IoLanguage className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter language"
                            value={filters.languageReq}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, languageReq: e.target.value }))
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Location</label>
                        <FaMapMarkerAlt className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="datetime-local"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter location"
                            value={filters.location}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, location: e.target.value }))
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
                                meetingType: '',
                                languageReq: '',
                                location: '',
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
                            onClick={() => setActiveForm('translation')}
                            className="bg-mgbblue hover:bg-blue-950 text-white px-4 py-4 mt-2 rounded text-sm w-full max-w-xs"
                        >
                            New Translator Request +
                        </button>
                    </div>
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
                                        Meeting Type
                                    </TableHead>
                                    <TableHead className="w-20 text-left font-semibold py-3">
                                        Language Required
                                    </TableHead>
                                    <TableHead className="w-20 text-left font-semibold py-3">
                                        Location
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
                                            {req.translationRequest.patientId}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {req.priority}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {req.status}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {req.translationRequest.typeMeeting}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {req.translationRequest.language}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            {req.translationRequest.location}
                                        </TableCell>
                                        <TableCell className="text-left py-3">
                                            <MGBButton
                                                onClick={() => {
                                                    setEditData(req);
                                                    setActiveForm('translation');
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

export default TableTranslatorRequest;
