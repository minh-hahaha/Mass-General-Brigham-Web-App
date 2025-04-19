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

interface DirectoryTableProps {
    data: DepartmentRequest[];
}

const DirectoryTable: React.FC<DirectoryTableProps> = ({data}) => {
    return (
        <div className="flex justify-center mt-10">
            <div className="w-full max-w-6xl border border-gray-300 rounded-2xl shadow-md overflow-auto p-4 bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Department Name</TableHead>
                            <TableHead>Department Services</TableHead>
                            <TableHead>Building</TableHead>
                            <TableHead>Floor</TableHead>
                            <TableHead>Phone Number</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((department) => (
                            <TableRow>
                                <TableCell>{department.deptName}</TableCell>
                                <TableCell className="break-words whitespace-normal max-w-s">
                                    {department.deptServices}
                                </TableCell>
                                <TableCell>{department.building.buildingName}</TableCell>
                                <TableCell>
                                    {department.locations.map((loc) => loc.floor).toString()}
                                </TableCell>
                                <TableCell>{department.deptPhone}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

const AllDirectory = () => {
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
    return <DirectoryTable data={data} />;
};

const ChestnutDirectory = () => {
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
    return <DirectoryTable data={data} />;
};

const Patriot20Directory = () => {
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
    return <DirectoryTable data={data} />;
};

const Patriot22Directory = () => {
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
    return <DirectoryTable data={data} />;
};

const tableTabs = [
    { label: 'All', component: AllDirectory },
    { label: 'Chestnut Hill', component: ChestnutDirectory },
    { label: '20 Patriot Place', component: Patriot20Directory },
    { label: '22 Patriot Place', component: Patriot22Directory },
];

const DirectoryDisplayPage = () => {
    return <CarouselMenu tableTabs={tableTabs}></CarouselMenu>;
};

export default DirectoryDisplayPage;
