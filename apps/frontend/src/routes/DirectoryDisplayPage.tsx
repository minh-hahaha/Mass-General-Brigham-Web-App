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
    const [bldgSort, setBldgSort] = useState<string>('None');
    const [floorSort, setFloorSort] = useState<string>('None');

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const result = await GetDirectory(nameSort, bldgSort, floorSort);
                    setData(result);
                } catch (error) {
                    console.error('Failed to fetch directory data:', error);
                }
            };
            fetchData();
        }, [nameSort, bldgSort, floorSort]);

    return (
        <div className="flex justify-center mt-10">
            <div className="w-full max-w-6xl border border-gray-300 rounded-2xl shadow-md overflow-auto p-4 bg-white">
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
                                    options={['None', 'Ascending', 'Descending']}
                                />
                            </TableHead>
                            <TableHead>Department Services</TableHead>
                            <TableHead>Building
                                <SelectElement
                                    label={'orderBuilding'}
                                    id={'orderBuilding'}
                                    value={bldgSort}
                                    placeholder={'Order By:'}
                                    onChange={(e) => setBldgSort(e.target.value)}
                                    options={['None', 'Ascending', 'Descending']}
                                />
                            </TableHead>
                            <TableHead>Floor
                                <SelectElement
                                    label={'orderFloor'}
                                    id={'orderFloor'}
                                    value={floorSort}
                                    placeholder={'Order By:'}
                                    onChange={(e) => setFloorSort(e.target.value)}
                                    options={['None', 'Ascending', 'Descending']}
                                />
                            </TableHead>
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
                                <TableCell>{
                                    department.locations.map(loc => loc.floor).toString()
                                }
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
