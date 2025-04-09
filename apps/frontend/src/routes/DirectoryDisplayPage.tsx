import { useEffect, useState } from 'react';
import { GetDirectory, DepartmentRequest } from '../database/gettingDirectory';

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
        <div className="table-container">
            <table>
                <thead>
                <tr>
                    <th>
                        Department ID
                    </th>
                    <th>
                        Department Services
                    </th>
                    <th>
                        Department Name
                    </th>
                    <th>
                        Building ID
                    </th>
                    <th>
                        Phone Number
                    </th>
                </tr>
                </thead>
            {data.map((department) => (
                    <tbody>
                        <tr>
                            <td>
                                {department.dep_id}
                            </td>
                            <td>
                                {department.dep_services}
                            </td>
                            <td>
                                {department.dep_name}
                            </td>
                            <td>
                                {department.building_id}
                            </td>
                            <td>
                                {department.dep_phone}
                            </td>
                        </tr>
                    </tbody>

            ))}
            </table>
            {/*<h2>Database Table</h2>*/}
            {/*<table className="data-table">*/}
            {/*    <thead>*/}
            {/*        <tr>*/}
            {/*            {columns.map((column) => (*/}
            {/*                <th key={column}>{column}</th>*/}
            {/*            ))}*/}
            {/*        </tr>*/}
            {/*    </thead>*/}
            {/*    <tbody>*/}
            {/*        {data.map((row: DepartmentRequest, rowIndex) => (*/}
            {/*            <tr key={rowIndex}>*/}
            {/*                {columns.map((column) => (*/}
            {/*                    <td key={`${rowIndex}-${column}`}>{row[column]}</td>*/}
            {/*                ))}*/}
            {/*            </tr>*/}
            {/*        ))}*/}
            {/*    </tbody>*/}
            {/*</table>*/}
        </div>
    );
};

export default DirectoryDisplayPage;
