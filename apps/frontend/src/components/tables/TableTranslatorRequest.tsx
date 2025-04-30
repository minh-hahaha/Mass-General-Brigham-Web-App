import { useEffect, useState } from 'react';
import { GetTranslatorRequest, incomingTranslationRequest } from '@/database/forms/translationRequest.ts';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table.tsx';
import { motion } from 'framer-motion';
import {incomingRequest} from "@/database/forms/transportRequest.ts";
import MGBButton from "@/elements/MGBButton.tsx";
import { employeeNameId, getEmployeeNameIds } from '@/database/getEmployee.ts';

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
    }, [])

    if (loading) {
        return <p>Loading Requests...</p>;
    }



    const filteredRequests = requests.filter((req) => {
        return (
            (!filters.patientId || String(req.translationRequest.patientId) === filters.patientId) &&
            (!filters.priority || req.priority?.toLowerCase().includes(filters.priority.toLowerCase())) &&
            (!filters.status || req.status?.toLowerCase().includes(filters.status.toLowerCase())) &&
            (!filters.meetingType || req.translationRequest.typeMeeting?.toLowerCase().includes(filters.meetingType.toLowerCase())) &&
            (!filters.languageReq || req.translationRequest.language?.toLowerCase().includes(filters.languageReq.toLowerCase())) &&
            (!filters.location || req.translationRequest.location?.toLowerCase().includes(filters.location.toLowerCase()))
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
                                <label className="block text-sm font-medium">Patient ID</label>
                                <input
                                    type="number"
                                    className="border border-mgbblue rounded-sm w-15 p-1"
                                    value={filters.patientId}
                                    onChange={(e) =>
                                        setFilters({ ...filters, patientId: e.target.value })
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
                                <label className="block text-sm font-medium">Meeting Type</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-15 p-1"
                                    value={filters.meetingType}
                                    onChange={(e) =>
                                        setFilters({ ...filters, meetingType: e.target.value })
                                    }
                                />
                            </div>
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
                        </motion.div>
                    )}
                </div>
                <div className="flex flex-row items-center gap-2 mt-2">
                    <button
                        onClick={() => setActiveForm('translation')}
                        className="bg-mgbyellow hover:bg-yellow-600 text-codGray px-9 py-3 rounded text-sm relative top-1"
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
                                <TableHead className="w-20 text-center font-semibold py-3">Patient ID</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Priority</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Status</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Meeting Type</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Language Required</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3">Location</TableHead>
                                <TableHead className="w-20 text-center font-semibold py-3"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRequests.map((req) => (
                                <TableRow
                                    key={req.requestId}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <TableCell className="text-center py-3">{req.translationRequest.patientId}</TableCell>
                                    <TableCell className="text-center py-3">{req.priority}</TableCell>
                                    <TableCell className="text-center py-3">{req.status}</TableCell>
                                    <TableCell className="text-center py-3">{req.translationRequest.typeMeeting}</TableCell>
                                    <TableCell className="text-center py-3">{req.translationRequest.language}</TableCell>
                                    <TableCell className="text-center py-3">{req.translationRequest.location}</TableCell>
                                    <TableCell className="text-center py-3"><MGBButton onClick={() => {setEditData(req); setActiveForm("translation")}} variant={'secondary'} children={'Edit'}/></TableCell>
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
