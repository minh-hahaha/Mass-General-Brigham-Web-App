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
import SelectElement from '@/elements/SelectElement.tsx';
import TableAllRequest from '@/components/tables/TableServiceRequest.tsx';
import TableMaintenanceRequest from '@/components/tables/TableMaintenanceRequest.tsx';
import TableSanitationRequest from '@/components/tables/TableSanitationRequest.tsx';
import TableTransportRequest from '@/components/tables/TableTransportRequest.tsx';
import TableTranslationRequest from '@/components/tables/TableTranslatorRequest.tsx';
import CarouselMenu from '@/components/CarouselMenu.tsx';
import ImportExportDirectoryPage from '@/routes/ImportExportDirectoryPage';
import {motion} from 'framer-motion';
import {ExportCSV, ExportJSON, ImportCSV, ImportJSON} from "@/database/csvImportExport.ts";
import {ROUTES} from "common/src/constants.ts";

interface DirectoryTableProps {
    data: DepartmentRequest[];
}

const DirectoryTable: React.FC<DirectoryTableProps> = ({ data }) => {
    return (
        <div className="flex justify-center mt-3">
            <div className="w-350 border border-gray-300 rounded-2xl shadow-md overflow-hidden bg-white">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
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
                            <TableRow key={department.deptId} className="border-b hover:bg-gray-50">
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
                                <TableCell className="text-left">
                                    {department.deptPhone}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

const AllDirectory = ({ onImportClick }: { onImportClick: () => void }) => {
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
                                <label className="block text-sm font-medium">Dept Name</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-40 p-1"
                                    value={filters.deptName}
                                    onChange={(e) =>
                                        setFilters({ ...filters, deptName: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Services</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-40 p-1"
                                    value={filters.deptServices}
                                    onChange={(e) =>
                                        setFilters({ ...filters, deptServices: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Building</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-25 p-1"
                                    value={filters.building}
                                    onChange={(e) =>
                                        setFilters({ ...filters, building: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Floor</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-20 p-1"
                                    value={filters.floor}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            floor: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Phone</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-40 p-1"
                                    value={filters.phone}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            phone: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </motion.div>
                    )}
                </div>
                <div className="flex flex-row items-center gap-2 mt-2">
                    <button
                        onClick={onImportClick}
                        className="bg-gray-500 hover:bg-gray-700 text-white px-9 py-3 rounded text-sm relative top-1"
                    >
                        Import New Directory +
                    </button>
                </div>
            </div>
            <DirectoryTable data={filteredData} />
        </>
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
                                <label className="block text-sm font-medium">Dept Name</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-47 p-1"
                                    value={filters.deptName}
                                    onChange={(e) =>
                                        setFilters({ ...filters, deptName: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Services</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-47 p-1"
                                    value={filters.deptServices}
                                    onChange={(e) =>
                                        setFilters({ ...filters, deptServices: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Floor</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-30 p-1"
                                    value={filters.floor}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            floor: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Phone</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-47 p-1"
                                    value={filters.phone}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            phone: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </motion.div>
                    )}
                </div>
                <div className="flex flex-row items-center gap-2 mt-2">
                    <button
                        onClick={onImportClick}
                        className="bg-gray-500 hover:bg-gray-700 text-white px-9 py-3 rounded text-sm relative top-1"
                    >
                        Import New Directory +
                    </button>
                </div>
            </div>
            <DirectoryTable data={filteredData} />
        </>
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
                                <label className="block text-sm font-medium">Dept Name</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-47 p-1"
                                    value={filters.deptName}
                                    onChange={(e) =>
                                        setFilters({ ...filters, deptName: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Services</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-47 p-1"
                                    value={filters.deptServices}
                                    onChange={(e) =>
                                        setFilters({ ...filters, deptServices: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Floor</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-30 p-1"
                                    value={filters.floor}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            floor: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Phone</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-47 p-1"
                                    value={filters.phone}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            phone: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </motion.div>
                    )}
                </div>
                <div className="flex flex-row items-center gap-2 mt-2">
                    <button
                        onClick={onImportClick}
                        className="bg-gray-500 hover:bg-gray-700 text-white px-9 py-3 rounded text-sm relative top-1"
                    >
                        Import New Directory +
                    </button>
                </div>
            </div>
            <DirectoryTable data={filteredData} />
        </>
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
                                <label className="block text-sm font-medium">Dept Name</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-47 p-1"
                                    value={filters.deptName}
                                    onChange={(e) =>
                                        setFilters({ ...filters, deptName: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Services</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-47 p-1"
                                    value={filters.deptServices}
                                    onChange={(e) =>
                                        setFilters({ ...filters, deptServices: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Floor</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-30 p-1"
                                    value={filters.floor}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            floor: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Phone</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-47 p-1"
                                    value={filters.phone}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            phone: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </motion.div>
                    )}
                </div>
                <div className="flex flex-row items-center gap-2 mt-2">
                    <button
                        onClick={onImportClick}
                        className="bg-gray-500 hover:bg-gray-700 text-white px-9 py-3 rounded text-sm relative top-1"
                    >
                        Import New Directory +
                    </button>
                </div>
            </div>
            <DirectoryTable data={filteredData} />
        </>
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
                                <label className="block text-sm font-medium">Dept Name</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-47 p-1"
                                    value={filters.deptName}
                                    onChange={(e) =>
                                        setFilters({ ...filters, deptName: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Services</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-47 p-1"
                                    value={filters.deptServices}
                                    onChange={(e) =>
                                        setFilters({ ...filters, deptServices: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Floor</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-30 p-1"
                                    value={filters.floor}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            floor: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Phone</label>
                                <input
                                    type="text"
                                    className="border border-mgbblue rounded-sm w-47 p-1"
                                    value={filters.phone}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            phone: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </motion.div>
                    )}
                </div>
                <div className="flex flex-row items-center gap-2 mt-2">
                    <button
                        onClick={onImportClick}
                        className="bg-gray-500 hover:bg-gray-700 text-white px-9 py-3 rounded text-sm relative top-1"
                    >
                        Import New Directory +
                    </button>
                </div>
            </div>
            <DirectoryTable data={filteredData} />
        </>
    );
};

const DirectoryDisplayPage = () => {
    const [showImportModal, setShowImportModal] = useState(false);
    const searchParams = new URLSearchParams(window.location.search);
    const location = searchParams.get('location');

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
        const foundIndex = tableTabs.findIndex(tab =>
            tab.label.toLowerCase().includes(location.toLowerCase())
        );
        return foundIndex !== -1 ? foundIndex : 0;
    })();

    return (
        <>
            <div className="mb-10">
                <CarouselMenu tableTabs={tableTabs} initialIndex={initialTabIndex} />
            </div>

            {showImportModal && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
                    onClick={handleCloseImport}
                >
                    <div
                        className="absolute top-20 bg-white rounded-lg shadow-xl w-150 max-w-4xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleCloseImport}
                            className="absolute top-2 right-3 text-gray-600 hover:text-black text-2xl"
                        >
                            &times;
                        </button>
                        <div className="mt-4">
                            <h1 className="text-center font-black">Import/Export New Directory</h1>
                        </div>
                        <div className="h-full overflow-y-auto p-6 -mt-22">
                            <ImportExportDirectoryPage jsonRoute={ROUTES.DIRECTORY_JSON} csvRoute={ROUTES.DIRECTORY_CSV} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DirectoryDisplayPage;
