import { ChangeEvent, useState } from 'react';
import { ImportCSV, ExportCSV, ExportJSON, ImportJSON } from '../database/csvImportExport.ts';
import MGBButton from '../elements/MGBButton.tsx';
import InputElement from '@/elements/InputElement.tsx';
import SelectElement from '@/elements/SelectElement.tsx';
import { Label } from '@/components/ui/label.tsx';

const ImportExportDirectoryPage = () => {
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
                await ImportCSV(formData, uploadType);
            } else {
                await ImportJSON(formData, uploadType);
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
            let response;
            let blob;
            if (downloadType === 'CSV') {
                response = await ExportCSV(); // has backend data
                // download csv
                blob = new Blob([response], { type: 'text/csv;charset=utf-8;' });
            } else {
                response = await ExportJSON();
                blob = new Blob([JSON.stringify(response, null, 2)], {
                    type: 'application/json;charset=utf-8;',
                });
            }
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.setAttribute('download', 'export.' + (downloadType === 'CSV' ? 'csv' : 'json'));
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url); // Free up memory by revoking the object URL
        } catch (e) {
            console.log('Downloading');
        }
    }

    return (
        <div className="flex flex-col justify-center items-center mt-5">
            <div className="flex flex-col items-center rounded-2xl p-8 w-full max-w-[700px] mt-10">
                <input
                    className="border border-gray-300 rounded-md p-2 w-full"
                    type="file"
                    onChange={handleFileChange}
                    accept=".csv, text/csv, .json, application/json"
                />
                {/* Added margin-top to separate the buttons from the input */}
                <div className="flex justify-between w-full space-x-4">
                    <div className="pt-6 gap-3 flex flex-row">
                        <div>
                            <button
                                onClick={handleFileUpload}
                                disabled={false}
                                className="py-4 px-4 cursor-pointer text-white rounded-sm text-sm tracking-wider bg-mgbblue hover:bg-blue-950"
                            >
                                Upload!
                            </button>
                        </div>
                        <div>
                            <button
                                onClick={handleExport}
                                disabled={false}
                                className="py-4 px-4 cursor-pointer text-white rounded-sm text-sm tracking-wider bg-mgbblue hover:bg-blue-950"
                            >
                                Export!
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 -ml-5">
                        <label className="font-semibold mt-1">Select Upload Method</label>
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                className={`px-4 py-2 rounded-md border ${
                                    uploadType === 'Update'
                                        ? 'bg-mgbblue text-white border-mgbblue'
                                        : 'bg-white text-gray-700 border-gray-300'
                                }`}
                                onClick={() => setUploadType('Update')}
                            >
                                Update
                            </button>
                            <button
                                type="button"
                                className={`px-4 py-2 rounded-md border ${
                                    uploadType === 'Overwrite'
                                        ? 'bg-mgbblue text-white border-mgbblue'
                                        : 'bg-white text-gray-700 border-gray-300'
                                }`}
                                onClick={() => setUploadType('Overwrite')}
                            >
                                Overwrite
                            </button>
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
