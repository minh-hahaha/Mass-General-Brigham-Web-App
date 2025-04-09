import { useEffect, useState } from 'react';
import { GetDirectory, DepartmentRequest } from '../database/gettingDirectory';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const DirectoryDisplayPage = () => {
    const [data, setData] = useState<DepartmentRequest[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await GetDirectory();
                setData(result);
            } catch (error) {
                console.error('Failed to fetch directory data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flex justify-center mt-10">
            <div className="w-full max-w-6xl border border-gray-300 rounded-2xl shadow-md overflow-auto p-4 bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Department ID</TableHead>
                            <TableHead>Department Services</TableHead>
                            <TableHead>Department Name</TableHead>
                            <TableHead>Building ID</TableHead>
                            <TableHead>Phone Number</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((department) => (
                            <TableRow>
                                <TableCell>{department.dep_id}</TableCell>
                                <TableCell className="break-words whitespace-normal max-w-s">{department.dep_services}</TableCell>
                                <TableCell>{department.dep_name}</TableCell>
                                <TableCell>{department.building_id}</TableCell>
                                <TableCell>{department.dep_phone}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default DirectoryDisplayPage;
