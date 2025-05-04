import { ChangeEvent, useState } from 'react';
import { ImportCSV, ExportCSV, ExportJSON, ImportJSON } from '../database/csvImportExport.ts';
import MGBButton from '../elements/MGBButton.tsx';
import SelectElement from '@/elements/SelectElement.tsx';
import JSZip from 'jszip';

type ImportExportProps = {
    jsonRoute: string;
    csvRoute: string;
};

const ImportExportDirectoryPage = ({ jsonRoute, csvRoute }: ImportExportProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadType, setUploadType] = useState<'Overwrite' | 'Update'>('Update');
    const [downloadType, setDownloadType] = useState<'CSV' | 'JSON'>('CSV');
    const [upload, setUpload] = useState(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFile = e.target.files[0];
            console.log(selectedFile.type);
            if (
                !selectedFile.name.endsWith('.csv') &&
                selectedFile.type !== 'text/csv' &&
                !selectedFile.name.endsWith('.json') &&
                selectedFile.type !== 'application/json'
            ) {
                console.log('Please select a CSV or JSON file');
                setFile(null);
                return;
            }
            setFile(selectedFile);
        }
    };

    async function handleFileUpload() {
        console.log('hi');
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        console.log('Sending file:', file.name, file.type, file.size);

        try {
            if (file.type === 'text/csv') {
                await ImportCSV(csvRoute, formData, uploadType);
            } else {
                await ImportJSON(jsonRoute, formData, uploadType);
            }
            // Clear file after successful upload
            setFile(null);
            if (document.getElementById('fileInput') as HTMLInputElement) {
                (document.getElementById('fileInput') as HTMLInputElement).value = '';
            }
            setUpload(true);
        } catch {
            setFile(null);
            console.error('Upload failed.');
            return;
        }
    }

    async function handleExport() {
        try {
            let blob;
            const zip = new JSZip();
            if (downloadType === 'CSV') {
                const response = await ExportCSV(csvRoute); // has backend data
                if (Array.isArray(response)) {
                    for (let i = 0; i < response.length; i++) {
                        //blobs.push(new Blob([r], {type: 'text/csv;charset=utf-8;'}));
                        zip.file(`export_${i + 1}.csv`, response[i]);
                    }
                } else {
                    // download csv
                    blob = new Blob([response], { type: 'text/csv;charset=utf-8;' });
                }
            } else {
                const response = await ExportJSON(jsonRoute);
                if (Array.isArray(response)) {
                    for (let i = 0; i < response.length; i++) {
                        zip.file(`export_${i + 1}.json`, JSON.stringify(response[i], null, 2));
                        // blobs.push(new Blob([JSON.stringify(r, null, 2)], {
                        //     type: 'application/json;charset=utf-8;',
                        // }));
                    }
                } else {
                    // download csv
                    blob = new Blob([JSON.stringify(response, null, 2)], {
                        type: 'application/json;charset=utf-8;',
                    });
                }
            }

            if (!blob) {
                blob = await zip.generateAsync({ type: 'blob' });
            }
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            if (zip.files['export_1.csv'] || zip.files['export_1.json']) {
                link.setAttribute('download', 'export.zip');
            } else {
                link.setAttribute(
                    'download',
                    'export.' + (downloadType === 'CSV' ? 'csv' : 'json')
                );
            }
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url); // Free up memory by revoking the object URL
        } catch (e) {
            console.log('Downloading');
        }
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col rounded-2xl p-4 w-full">
                <div>
                    <label className="block text-sm font-medium">Choose directory file</label>
                    <input
                        className="border border-mgbblue rounded-md p-2 w-full cursor-pointer"
                        type="file"
                        onChange={handleFileChange}
                        accept=".csv, text/csv, .json, application/json"
                    />
                </div>

                <div className="mt-3">
                    <label className="block text-sm font-medium">Choose upload type</label>
                    <SelectElement
                        className="border border-mgbblue"
                        placeholder={'Select an upload type'}
                        options={['Update', 'Overwrite']}
                        label={''}
                        id={'upload-type'}
                        value={uploadType}
                        onChange={(e) => setUploadType(e.target.value as 'Overwrite' | 'Update')}
                    />
                    <label className="block text-sm font-medium">Choose export format</label>
                    <SelectElement
                        className="border border-mgbblue"
                        placeholder={'Select an upload type'}
                        options={['CSV', 'JSON']}
                        label={''}
                        id={'export-type'}
                        value={downloadType}
                        onChange={(e) => setDownloadType(e.target.value as 'CSV' | 'JSON')}
                    />
                </div>
                {/* Added margin-top to separate the buttons from the input */}
                <div className="flex justify-between w-full space-x-4">
                    <div className="pt-6 gap-3 flex flex-row">
                        <div>
                            <MGBButton
                                onClick={handleFileUpload}
                                disabled={false}
                                variant={'primary'}
                                className="py-3 px-6 cursor-pointer text-white rounded-sm text-sm tracking-wider bg-mgbblue hover:bg-blue-950"
                            >
                                Upload!
                            </MGBButton>
                        </div>
                        <div>
                            <MGBButton
                                onClick={handleExport}
                                disabled={false}
                                variant={'secondary'}
                                className="py-3 px-8 cursor-pointer rounded-sm text-sm tracking-wider bg-mgbblue hover:bg-blue-950"
                            >
                                Export!
                            </MGBButton>
                        </div>
                    </div>
                </div>
                <div hidden={!upload}>
                    <div className="bg-mgbblue text-white px-4 py-2 rounded-md mt-2 text-sm font-semibold text-center shadow">
                        Uploaded Successfully!
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImportExportDirectoryPage;
