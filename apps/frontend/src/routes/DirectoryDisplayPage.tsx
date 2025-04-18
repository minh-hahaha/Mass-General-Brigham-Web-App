import { ChangeEvent, useEffect, useState } from 'react';
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

const DirectoryDisplayPage = () => {
    const [data, setData] = useState<DepartmentRequest[]>([]);
    const [nameSort, setNameSort] = useState<string>('Ascending');
    const [bldgSort, setBldgSort] = useState<string>('Order By:');
    const [buildingFilter, setBuildingFilter] = useState<string>('Filter By Building');

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const result = await GetDirectory(nameSort, bldgSort, buildingFilter);
                    setData(result);
                } catch (error) {
                    console.error('Failed to fetch directory data:', error);
                }
            };
            fetchData();
        }, [nameSort, bldgSort, buildingFilter]);

    return (
        <div className="flex justify-center mt-10">
            <div className="w-full max-w-6xl border border-gray-300 rounded-2xl shadow-md overflow-auto p-4 bg-white">
                <div className={'py-6'}>
                    Filter By Building
                    <SelectElement
                        label={'Filter By Building'}
                        id={'buildingFilter'}
                        value={buildingFilter}
                        placeholder={'Filter By Building'}
                        onChange={function (e: ChangeEvent<HTMLSelectElement>): void {
                            setBuildingFilter(e.target.value);
                        }}
                        options={['Chestnut Hill', 'Patriot Place', '20 Patriot Place', '22 Patriot Place']}
                    />
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                Department Name
                                <SelectElement
                                    label={'orderDeptName'}
                                    id={'orderDeptName'}
                                    value={nameSort}
                                    placeholder={'Order By:'}
                                    onChange={(e) => setNameSort(e.target.value)}
                                    options={['Ascending', 'Descending']}
                                />
                            </TableHead>
                            <TableHead>Department Services</TableHead>
                            <TableHead>
                                Building
                                <SelectElement
                                    label={'orderBuilding'}
                                    id={'orderBuilding'}
                                    value={bldgSort}
                                    placeholder={'Order By:'}
                                    onChange={(e) => setBldgSort(e.target.value)}
                                    options={['Ascending', 'Descending']}
                                />
                            </TableHead>
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

export default DirectoryDisplayPage;
