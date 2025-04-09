
import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import {ROUTES} from 'common/src/constants.ts';

const ImportExportCSV = ({ tableName: string}) => {
    const [status, setStatus] = useState('');

    // Export data from PostgreSQL to CSV
    const exportCSV = async () => {
        try {
            setStatus('Exporting...');

            // ask data from the server
            const response = await axios.get(ROUTES.DIRECTORY_CSV);

            if (!response.data || !response.data.length) {
                throw new Error('No file received');
            }

            // convert to CSV
            const csv = Papa.unparse(response.data);

            // download csv
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.setAttribute('download', '');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setStatus('Export complete');
        } catch (error) {
            console.error('Export error:', error);
            setStatus(`Export failed: ${error.message}`);
        }
    };

    // Import to Postgres
    const importCSV = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            setStatus('Importing...');

            // Parse CSV
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: async (results) => {
                    try {
                        if (!results.data || !results.data.length) {
                            throw new Error('No data found in CSV file');
                        }

                        // Send data to server
                        await axios.post(`${ROUTES.DIRECTORY_CSV}/import`, {
                            data: results.data
                        });

                        setStatus(`Imported ${results.data.length} rows successfully`);
                    } catch (error) {
                        console.error('Import error:', error);
                        setStatus(`Import failed: ${error.message}`);
                    }
                },
                error: (error) => {
                    console.error('CSV parsing error:', error);
                    setStatus(`CSV parsing failed: ${error.message}`);
                }
            });
        } catch (error) {
            console.error('Import error:', error);
            setStatus(`Import failed: ${error.message}`);
        }
    };

    return (
        <div>
            <div>
                <button onClick={exportCSV}>
                    Export from Database
                </button>
            </div>

            <div>
                <label>
                    Import to Database:
                    <input
                        type="file"
                        accept=".csv"
                        onChange={importCSV}
                    />
                </label>
            </div>

            {status && <div>{status}</div>}
        </div>
    );
};

export default ImportExportCSV;