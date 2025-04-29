import { ChangeEvent, useState } from 'react';
import { ImportCSV, ExportCSV } from '../database/csvImportExport.ts';
import MGBButton from '../elements/MGBButton.tsx';
import InputElement from '@/elements/InputElement.tsx';
import SelectElement from '@/elements/SelectElement.tsx';
import { Label } from '@/components/ui/label.tsx';
import { FaPlus } from 'react-icons/fa';

const ImportExportDirectoryPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadType, setUploadType] = useState<'Overwrite' | 'Update'>('Update');
    const [upload, setUpload] = useState(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFile = e.target.files[0];
            if (!selectedFile.name.endsWith('.csv') && selectedFile.type !== 'text/csv') {
                console.log('Please select a CSV file');
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
            await ImportCSV(formData, uploadType);
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
            const response = await ExportCSV(); // has backend data
            // download csv
            const blob = new Blob([response], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.setAttribute('download', 'export.csv');
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
                        accept=".csv, text/csv"
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
