import { ChangeEvent, JSX, useEffect, useState } from 'react';
import { GetDirectory, DepartmentRequest } from '../database/gettingDirectory';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import CarouselMenu from '@/components/CarouselMenu.tsx';
import ImportExportDirectoryPage from '@/routes/ImportExportDirectoryPage';
import MGBButton from '@/elements/MGBButton.tsx';
import { FaBuilding, FaTools, FaPhoneAlt } from 'react-icons/fa';
import { TbStairsUp } from 'react-icons/tb';
import {ROUTES} from "common/src/constants.ts";
import DirectoryInstructions from "@/components/DirectoryInstructions.tsx";

interface DirectoryTableProps {
    data: DepartmentRequest[];
}

const DirectoryTable: React.FC<DirectoryTableProps> = ({ data }) => {
    return (
        <div className="flex justify-center">
            <div className="w-full max-w-7xl border border-gray-300 rounded-2xl shadow-md overflow-hidden bg-white">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-fountainBlue hover:bg-fountainBlue">
                            <TableHead className="w-20 text-left font-semibold py-3">
                                Department Name
                            </TableHead>
                            <TableHead className="w-20 text-left font-semibold py-3">
                                Department Services
                            </TableHead>
                            <TableHead className="w-20 text-left font-semibold py-3">
                                Building
                            </TableHead>
                            <TableHead className="w-20 text-left font-semibold py-3">
                                Floor
                            </TableHead>
                            <TableHead className="w-20 text-left font-semibold py-3">
                                Phone Number
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((department) => (
                            <TableRow
                                key={department.deptId}
                                className="border-b hover:bg-gray-200 odd:bg-gray-100"
                            >
                                <TableCell className="text-left">{department.deptName}</TableCell>
                                <TableCell className="break-words whitespace-normal max-w-s text-left">
                                    {department.deptServices}
                                </TableCell>
                                <TableCell className="text-left">
                                    {department.building.buildingName}
                                </TableCell>
                                <TableCell className="text-left">
                                    {department.departmentNodes ? department.departmentNodes.floor : 'no node'}
                                </TableCell>
                                <TableCell className="text-left">{department.deptPhone}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

const AllDirectory = ({ onImportClick }: { onImportClick: () => void }) => {
    const [filter, setShowFilters] = useState<boolean>(true);
    const [filters, setFilters] = useState({
        deptName: '',
        deptServices: '',
        building: '',
        floor: '',
        phone: '',
    });
    const [data, setData] = useState<DepartmentRequest[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await GetDirectory('Ascending', 'Descending', '');
                setData(result);
            } catch (error) {
                console.error('Failed to fetch directory data:', error);
            }
        };
        fetchData();
    }, []);

    const filteredData = data.filter((department) => {
        return (
            (!filters.deptName || department.deptName?.toLowerCase().includes(filters.deptName.toLowerCase())) &&
            (!filters.deptServices || department.deptServices?.toLowerCase().includes(filters.deptServices.toLowerCase())) &&
            (!filters.building || department.building?.buildingName?.toLowerCase().includes(filters.building.toLowerCase())) &&
            (!filters.floor || department.departmentNodes?.floor?.toLowerCase().includes(filters.floor.toLowerCase())) &&
            (!filters.phone || department.deptPhone?.toLowerCase().includes(filters.phone.toLowerCase()))
        );
    });

    return (
        <div className="flex">
            {/* Fixed Sidebar */}
            <div className="fixed top-0 left-0 h-screen w-75 bg-white border-r border-gray-300 p-4 flex flex-col gap-4 mt-10">
                <h1 className="mt-10 font-black text-2xl">Filters</h1>
                <div className="flex flex-col gap-3 mt-1">
                    {/* Filter Inputs */}
                    {/* Dept Name Input */}
                    <div>
                        <label className="block text-sm font-medium">Dept Name</label>
                        <FaBuilding className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter department name"
                            value={filters.deptName}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, deptName: e.target.value }))
                            }
                        />
                    </div>

                    {/* Services Input */}
                    <div>
                        <label className="block text-sm font-medium">Services</label>
                        <FaTools className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter services"
                            value={filters.deptServices}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    deptServices: e.target.value,
                                }))
                            }
                        />
                    </div>

                    {/* Floor Input */}
                    <div>
                        <label className="block text-sm font-medium">Floor</label>
                        <TbStairsUp className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter floor"
                            value={filters.floor}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, floor: e.target.value }))
                            }
                        />
                    </div>

                    {/* Phone Input */}
                    <div>
                        <label className="block text-sm font-medium">Phone</label>
                        <FaPhoneAlt className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter phone"
                            value={filters.phone}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, phone: e.target.value }))
                            }
                        />
                    </div>
                </div>

                {/* Clear Filters Button */}
                <div className="justify-start">
                    <MGBButton
                        onClick={() =>
                            setFilters({
                                deptName: '',
                                deptServices: '',
                                building: '',
                                floor: '',
                                phone: '',
                            })
                        }
                        variant={'secondary'}
                        className="py-2 px-4 rounded text-sm"
                    >
                        Clear Filters
                    </MGBButton>
                </div>

                <div className="flex flex-col bg-gray-200 rounded-sm mt-3 pt-2">
                    <h1 className="font-black text-lg ml-2">Import New Directory</h1>
                    <ImportExportDirectoryPage csvRoute={ROUTES.DIRECTORY_CSV} jsonRoute={ROUTES.DIRECTORY_JSON}  />
                </div>
            </div>

            {/* Main Content (Table) */}
            <div className="ml-75 w-full p-6 min-h-screen bg-gray-200">
                <DirectoryTable data={filteredData} />
            </div>
        </div>
    );
};

const ChestnutDirectory = ({ onImportClick }: { onImportClick: () => void }) => {
    const [filter, setShowFilters] = useState<boolean>(false);
    const [filters, setFilters] = useState({
        deptName: '',
        deptServices: '',
        building: '',
        floor: '',
        phone: '',
    });
    const [data, setData] = useState<DepartmentRequest[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await GetDirectory('Ascending', 'Descending', 'Chestnut Hill');
                setData(result);
            } catch (error) {
                console.error('Failed to fetch directory data:', error);
            }
        };
        fetchData();
    }, []);

    const filteredData = data.filter((department) => {
        return (
            (!filters.deptName || department.deptName?.toLowerCase().includes(filters.deptName.toLowerCase())) &&
            (!filters.deptServices || department.deptServices?.toLowerCase().includes(filters.deptServices.toLowerCase())) &&
            (!filters.floor || department.departmentNodes?.floor?.toLowerCase().includes(filters.floor.toLowerCase())) &&
            (!filters.phone || department.deptPhone?.toLowerCase().includes(filters.phone.toLowerCase()))
        );
    });
    return (
        <div className="flex">
            {/* Fixed Sidebar */}
            <div className="fixed top-0 left-0 h-screen w-75 bg-white border-r border-gray-300 p-4 flex flex-col gap-4 mt-10">
                <h1 className="mt-10 font-black text-2xl">Filters</h1>
                <div className="flex flex-col gap-3 mt-1">
                    {/* Filter Inputs */}
                    {/* Dept Name Input */}
                    <div>
                        <label className="block text-sm font-medium">Dept Name</label>
                        <FaBuilding className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter department name"
                            value={filters.deptName}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, deptName: e.target.value }))
                            }
                        />
                    </div>

                    {/* Services Input */}
                    <div>
                        <label className="block text-sm font-medium">Services</label>
                        <FaTools className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter services"
                            value={filters.deptServices}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    deptServices: e.target.value,
                                }))
                            }
                        />
                    </div>

                    {/* Floor Input */}
                    <div>
                        <label className="block text-sm font-medium">Floor</label>
                        <TbStairsUp className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter floor"
                            value={filters.floor}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, floor: e.target.value }))
                            }
                        />
                    </div>

                    {/* Phone Input */}
                    <div>
                        <label className="block text-sm font-medium">Phone</label>
                        <FaPhoneAlt className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter phone"
                            value={filters.phone}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, phone: e.target.value }))
                            }
                        />
                    </div>
                </div>

                {/* Clear Filters Button */}
                <div className="justify-start">
                    <MGBButton
                        onClick={() =>
                            setFilters({
                                deptName: '',
                                deptServices: '',
                                building: '',
                                floor: '',
                                phone: '',
                            })
                        }
                        variant={'secondary'}
                        className="py-2 px-4 rounded text-sm"
                    >
                        Clear Filters
                    </MGBButton>
                </div>

                <div className="flex flex-col bg-gray-200 rounded-sm mt-3 pt-2">
                    <h1 className="font-black text-lg ml-2">Import New Directory</h1>
                    <ImportExportDirectoryPage csvRoute={ROUTES.DIRECTORY_CSV} jsonRoute={ROUTES.DIRECTORY_JSON} />
                </div>
            </div>

            {/* Main Content (Table) */}
            <div className="ml-75 w-full p-6 min-h-screen bg-gray-200">
                <DirectoryTable data={filteredData} />
            </div>
        </div>
    );
};

const Patriot20Directory = ({ onImportClick }: { onImportClick: () => void }) => {
    const [filter, setShowFilters] = useState<boolean>(false);
    const [filters, setFilters] = useState({
        deptName: '',
        deptServices: '',
        building: '',
        floor: '',
        phone: '',
    });
    const [data, setData] = useState<DepartmentRequest[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await GetDirectory('Ascending', 'Descending', '20 Patriot Place');
                setData(result);
            } catch (error) {
                console.error('Failed to fetch directory data:', error);
            }
        };
        fetchData();
    }, []);

    const filteredData = data.filter((department) => {
        return (
            (!filters.deptName || department.deptName?.toLowerCase().includes(filters.deptName.toLowerCase())) &&
            (!filters.deptServices || department.deptServices?.toLowerCase().includes(filters.deptServices.toLowerCase())) &&
            (!filters.floor || department.departmentNodes?.floor?.toLowerCase().includes(filters.floor.toLowerCase())) &&
            (!filters.phone || department.deptPhone?.toLowerCase().includes(filters.phone.toLowerCase()))
        );
    });
    return (
        <div className="flex">
            {/* Fixed Sidebar */}
            <div className="fixed top-0 left-0 h-screen w-75 bg-white border-r border-gray-300 p-4 flex flex-col gap-4 mt-10">
                <h1 className="mt-10 font-black text-2xl">Filters</h1>
                <div className="flex flex-col gap-3 mt-1">
                    {/* Filter Inputs */}
                    {/* Dept Name Input */}
                    <div>
                        <label className="block text-sm font-medium">Dept Name</label>
                        <FaBuilding className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter department name"
                            value={filters.deptName}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, deptName: e.target.value }))
                            }
                        />
                    </div>

                    {/* Services Input */}
                    <div>
                        <label className="block text-sm font-medium">Services</label>
                        <FaTools className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter services"
                            value={filters.deptServices}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    deptServices: e.target.value,
                                }))
                            }
                        />
                    </div>

                    {/* Floor Input */}
                    <div>
                        <label className="block text-sm font-medium">Floor</label>
                        <TbStairsUp className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter floor"
                            value={filters.floor}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, floor: e.target.value }))
                            }
                        />
                    </div>

                    {/* Phone Input */}
                    <div>
                        <label className="block text-sm font-medium">Phone</label>
                        <FaPhoneAlt className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter phone"
                            value={filters.phone}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, phone: e.target.value }))
                            }
                        />
                    </div>
                </div>

                {/* Clear Filters Button */}
                <div className="justify-start">
                    <MGBButton
                        onClick={() =>
                            setFilters({
                                deptName: '',
                                deptServices: '',
                                building: '',
                                floor: '',
                                phone: '',
                            })
                        }
                        variant={'secondary'}
                        className="py-2 px-4 rounded text-sm"
                    >
                        Clear Filters
                    </MGBButton>
                </div>

                <div className="flex flex-col bg-gray-200 rounded-sm mt-3 pt-2">
                    <h1 className="font-black text-lg ml-2">Import New Directory</h1>
                    <ImportExportDirectoryPage csvRoute={ROUTES.DIRECTORY_CSV} jsonRoute={ROUTES.DIRECTORY_JSON} />
                </div>
            </div>

            {/* Main Content (Table) */}
            <div className="ml-75 w-full p-6 min-h-screen bg-gray-200">
                <DirectoryTable data={filteredData} />
            </div>
        </div>
    );
};

const Patriot22Directory = ({ onImportClick }: { onImportClick: () => void }) => {
    const [filter, setShowFilters] = useState<boolean>(false);
    const [filters, setFilters] = useState({
        deptName: '',
        deptServices: '',
        building: '',
        floor: '',
        phone: '',
    });
    const [data, setData] = useState<DepartmentRequest[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await GetDirectory('Ascending', 'Descending', '22 Patriot Place');
                setData(result);
            } catch (error) {
                console.error('Failed to fetch directory data:', error);
            }
        };
        fetchData();
    }, []);

    const filteredData = data.filter((department) => {
        return (
            (!filters.deptName || department.deptName?.toLowerCase().includes(filters.deptName.toLowerCase())) &&
            (!filters.deptServices || department.deptServices?.toLowerCase().includes(filters.deptServices.toLowerCase())) &&
            (!filters.floor || department.departmentNodes?.floor?.toLowerCase().includes(filters.floor.toLowerCase())) &&
            (!filters.phone || department.deptPhone?.toLowerCase().includes(filters.phone.toLowerCase()))
        );
    });
    return (
        <div className="flex">
            {/* Fixed Sidebar */}
            <div className="fixed top-0 left-0 h-screen w-75 bg-white border-r border-gray-300 p-4 flex flex-col gap-4 mt-10">
                <h1 className="mt-10 font-black text-2xl">Filters</h1>
                <div className="flex flex-col gap-3 mt-1">
                    {/* Filter Inputs */}
                    {/* Dept Name Input */}
                    <div>
                        <label className="block text-sm font-medium">Dept Name</label>
                        <FaBuilding className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter department name"
                            value={filters.deptName}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, deptName: e.target.value }))
                            }
                        />
                    </div>

                    {/* Services Input */}
                    <div>
                        <label className="block text-sm font-medium">Services</label>
                        <FaTools className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter services"
                            value={filters.deptServices}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    deptServices: e.target.value,
                                }))
                            }
                        />
                    </div>

                    {/* Floor Input */}
                    <div>
                        <label className="block text-sm font-medium">Floor</label>
                        <TbStairsUp className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter floor"
                            value={filters.floor}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, floor: e.target.value }))
                            }
                        />
                    </div>

                    {/* Phone Input */}
                    <div>
                        <label className="block text-sm font-medium">Phone</label>
                        <FaPhoneAlt className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter phone"
                            value={filters.phone}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, phone: e.target.value }))
                            }
                        />
                    </div>
                </div>

                {/* Clear Filters Button */}
                <div className="justify-start">
                    <MGBButton
                        onClick={() =>
                            setFilters({
                                deptName: '',
                                deptServices: '',
                                building: '',
                                floor: '',
                                phone: '',
                            })
                        }
                        variant={'secondary'}
                        className="py-2 px-4 rounded text-sm"
                    >
                        Clear Filters
                    </MGBButton>
                </div>

                <div className="flex flex-col bg-gray-200 rounded-sm mt-3 pt-2">
                    <h1 className="font-black text-lg ml-2">Import New Directory</h1>
                    <ImportExportDirectoryPage csvRoute={ROUTES.DIRECTORY_CSV} jsonRoute={ROUTES.DIRECTORY_JSON} />
                </div>
            </div>

            {/* Main Content (Table) */}
            <div className="ml-75 w-full p-6 min-h-screen bg-gray-200">
                <DirectoryTable data={filteredData} />
            </div>
        </div>
    );
};

const FaulknerDirectory = ({ onImportClick }: { onImportClick: () => void }) => {
    const [filter, setShowFilters] = useState<boolean>(false);
    const [filters, setFilters] = useState({
        deptName: '',
        deptServices: '',
        building: '',
        floor: '',
        phone: '',
    });
    const [data, setData] = useState<DepartmentRequest[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await GetDirectory('Ascending', 'Descending', 'Faulkner Hospital');
                setData(result);
            } catch (error) {
                console.error('Failed to fetch directory data:', error);
            }
        };
        fetchData();
    }, []);

    const filteredData = data.filter((department) => {
        return (
            (!filters.deptName || department.deptName?.toLowerCase().includes(filters.deptName.toLowerCase())) &&
            (!filters.deptServices || department.deptServices?.toLowerCase().includes(filters.deptServices.toLowerCase())) &&
            (!filters.floor || department.departmentNodes?.floor?.toLowerCase().includes(filters.floor.toLowerCase())) &&
            (!filters.phone || department.deptPhone?.toLowerCase().includes(filters.phone.toLowerCase()))
        );
    });
    return (
        <div className="flex">
            {/* Fixed Sidebar */}
            <div className="fixed top-0 left-0 h-screen w-75 bg-white border-r border-gray-300 p-4 flex flex-col gap-4 mt-10">
                <h1 className="mt-10 font-black text-2xl">Filters</h1>
                <div className="flex flex-col gap-3 mt-1">
                    {/* Filter Inputs */}
                    {/* Dept Name Input */}
                    <div>
                        <label className="block text-sm font-medium">Dept Name</label>
                        <FaBuilding className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter department name"
                            value={filters.deptName}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, deptName: e.target.value }))
                            }
                        />
                    </div>

                    {/* Services Input */}
                    <div>
                        <label className="block text-sm font-medium">Services</label>
                        <FaTools className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter services"
                            value={filters.deptServices}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    deptServices: e.target.value,
                                }))
                            }
                        />
                    </div>

                    {/* Floor Input */}
                    <div>
                        <label className="block text-sm font-medium">Floor</label>
                        <TbStairsUp className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter floor"
                            value={filters.floor}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, floor: e.target.value }))
                            }
                        />
                    </div>

                    {/* Phone Input */}
                    <div>
                        <label className="block text-sm font-medium">Phone</label>
                        <FaPhoneAlt className="absolute mt-2 ml-1 text-codGray" size={15} />
                        <input
                            type="text"
                            className="border border-mgbblue rounded-sm w-full p-1 px-6"
                            placeholder="Filter phone"
                            value={filters.phone}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, phone: e.target.value }))
                            }
                        />
                    </div>
                </div>

                {/* Clear Filters Button */}
                <div className="justify-start">
                    <MGBButton
                        onClick={() =>
                            setFilters({
                                deptName: '',
                                deptServices: '',
                                building: '',
                                floor: '',
                                phone: '',
                            })
                        }
                        variant={'secondary'}
                        className="py-2 px-4 rounded text-sm"
                    >
                        Clear Filters
                    </MGBButton>
                </div>

                <div className="flex flex-col bg-gray-200 rounded-sm mt-3 pt-2">
                    <h1 className="font-black text-lg ml-2">Import New Directory</h1>
                    <ImportExportDirectoryPage csvRoute={ROUTES.DIRECTORY_CSV} jsonRoute={ROUTES.DIRECTORY_JSON} />
                </div>
            </div>

            {/* Main Content (Table) */}
            <div className="ml-75 w-full p-6 min-h-screen bg-gray-200">
                <DirectoryTable data={filteredData} />
            </div>
        </div>
    );
};

const DirectoryDisplayPage = () => {
    const [showImportModal, setShowImportModal] = useState(false);
    const [instructionVisible, setInstructionVisible] = useState(false);
    const searchParams = new URLSearchParams(window.location.search);
    const location = searchParams.get('location');

    // Add useEffect for instructions timing
    useEffect(() => {
        const timer = setTimeout(() => {
            setInstructionVisible(true);
        }, 2000); // 2 seconds delay

        return () => clearTimeout(timer); // Clean up
    }, []);

    const handleOpenImport = () => setShowImportModal(true);
    const handleCloseImport = () => setShowImportModal(false);

    const tableTabs = [
        { label: 'All', component: () => <AllDirectory onImportClick={handleOpenImport} /> },
        {
            label: 'Chestnut Hill',
            component: () => <ChestnutDirectory onImportClick={handleOpenImport} />,
        },
        {
            label: '20 Patriot Place',
            component: () => <Patriot20Directory onImportClick={handleOpenImport} />,
        },
        {
            label: '22 Patriot Place',
            component: () => <Patriot22Directory onImportClick={handleOpenImport} />,
        },
        {
            label: 'Faulkner',
            component: () => <FaulknerDirectory onImportClick={handleOpenImport} />,
        }
    ];

    const initialTabIndex = (() => {
        if (!location) return 0;
        const foundIndex = tableTabs.findIndex((tab) =>
            tab.label.toLowerCase().includes(location.toLowerCase())
        );
        return foundIndex !== -1 ? foundIndex : 0;
    })();

    return (
        <>
            <div className="bg-gray-200">
                <div className="">
                    <CarouselMenu tableTabs={tableTabs} initialIndex={initialTabIndex} />
                </div>
            </div>
            {instructionVisible && (
                <div className="fixed inset-0 z-50">
                    <DirectoryInstructions onClose={() => setInstructionVisible(false)} />
                </div>
            )}
        </>
    );
};

export default DirectoryDisplayPage;