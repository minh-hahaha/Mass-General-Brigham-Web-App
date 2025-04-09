import { useEffect, useState } from 'react';
import { GetDirectory } from '../database/gettingDirectory';

const DirectoryDisplayPage = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                return await GetDirectory();
            } catch (error) {
                console.log('Error getting directory');
            }
        };
    });

    const columns = Object.keys(data[0]);

    return (
        <div className="table-container">
            <h2>Database Table</h2>
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column}>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((column) => (
                                <td key={`${rowIndex}-${column}`}>{row[column]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DirectoryDisplayPage;
