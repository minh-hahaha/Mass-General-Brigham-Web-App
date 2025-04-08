import {ChangeEvent, useState} from 'react';
import {ImportCSV} from "../database/CSVImportExport.ts";
import MGBButton from "../components/MGBButton.tsx";

const ImportExportDirectoryPage = () => {

    const [file, setFile] = useState<File | null>(null);
    const [upload, setUpload] = useState(false);

    const handleFileChange = (e:ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files){
            const selectedFile = e.target.files[0];
            if (!selectedFile.name.endsWith('.csv') && selectedFile.type !== 'text/csv') {
                console.log('Please select a CSV file');
                setFile(null);
                return;
            }
            setFile(selectedFile);

        }

    }

    async function handleFileUpload(){
        if(!file) return;

        const formData = new FormData();
        formData.append('file', file);

        console.log("Sending file:", file.name, file.type, file.size);


        try{
            await ImportCSV(formData);
            // Clear file after successful upload
            setFile(null);
            if (document.getElementById('fileInput') as HTMLInputElement) {
                (document.getElementById('fileInput') as HTMLInputElement).value = '';
            }
            setUpload(true);
        }catch{
            setFile(null);
            console.error("Upload failed.");
            return;
        }


    }

    return (
        <div className="space-y-2">
            <input
                className="border border-rounded border-r-1px"
                type="file" onChange={handleFileChange} />
            <MGBButton onClick={handleFileUpload} variant={'primary'} disabled={false}> Upload!</MGBButton>
            {upload ? (
                <p>Upload Successfully</p>
            ): (
                <></>
            )}
        </div>

    );
};

export default ImportExportDirectoryPage;

