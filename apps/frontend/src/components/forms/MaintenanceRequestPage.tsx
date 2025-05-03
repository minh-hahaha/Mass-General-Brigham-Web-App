import { useEffect, useState } from 'react';
import MGBButton from '@/elements/MGBButton.tsx';
import {
    SubmitMaintenanceRequest,
    EditMaintenanceRequest,
    maintenanceRequest,
    editMaintenanceRequest,
} from '@/database/forms/maintenanceRequest.ts';
import SelectFormElement from '@/elements/SelectFormElement.tsx';
import HelpButton from '@/components/ServiceRequestHelp.tsx';
import {
    formatDateForEdit,
    maintenanceTypeArray,
    mgbHospitals,
    mgbHospitalType,
    priorityArray,
    priorityType,
    reqMaintenanceType,
} from '@/database/forms/formTypes.ts';
import {
    DirectoryRequestByBuilding,
    getDirectory,
} from '@/database/gettingDirectory.ts';
import {
    getEmployeeNameIds,
    employeeNameId,
} from '@/database/getEmployee.ts';
import { RequestPageProps } from '@/routes/ServiceRequestDisplayPage.tsx';

const MaintenanceRequestPage = ({ editData }: RequestPageProps) => {
    const [maintenanceType, setMaintenanceType] = useState('');
    const [maintenanceDescription, setMaintenanceDescription] = useState('');
    const [priority, setPriority] = useState<priorityType>('Low');
    const [maintenanceHospital, setMaintenanceHospital] = useState<mgbHospitalType>('Chestnut Hill');
    const [directory, setDirectory] = useState('');
    const [maintenanceTime, setMaintenanceTime] = useState('');
    const [employeeId, setEmployeeId] = useState(0);
    const [notes, setNotes] = useState('');
    const [locationId, setLocationId] = useState(1);

    const [directoryList, setDirectoryList] = useState<string[]>([]);
    const [employeeList, setEmployeeList] = useState<employeeNameId[]>([]);

    useEffect(() => {
        const fetchDirectoryList = async () => {
            try {
                const data = await getDirectory(mgbHospitals.indexOf(maintenanceHospital) + 1);
                setDirectoryList(data.map((d: DirectoryRequestByBuilding) => d.deptName));
            } catch (error) {
                console.error('Error fetching directory list:', error);
            }
        };
        fetchDirectoryList();
    }, [maintenanceHospital]);

    useEffect(() => {
        const fetchEmployeeList = async () => {
            try {
                const data = await getEmployeeNameIds();
                setEmployeeList(data);
            } catch (error) {
                console.error('Error fetching employee list:', error);
            }
        };
        fetchEmployeeList();
    }, []);

    useEffect(() => {
        if (editData) {
            const req = editData.maintenanceRequest;
            setMaintenanceType(req.maintenanceType);
            setMaintenanceDescription(req.maintenanceDescription);
            setPriority(editData.priority);
            setMaintenanceHospital(req.maintenanceHospital);
            setDirectory(req.maintenanceLocation);
            setMaintenanceTime(formatDateForEdit(req.maintenanceTime));
            setEmployeeId(editData.employeeId);
            setNotes(editData.comments);
            setLocationId(editData.locationId);
        }
    }, []);

    const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();
        const newRequest: maintenanceRequest = {
            employeeId,
            maintenanceType,
            maintenanceDescription,
            priority,
            maintenanceHospital,
            maintenanceTime,
            notes,
            locationId,
        };

        if (editData) {
            EditMaintenanceRequest({ maintenanceRequest: newRequest, requestId: editData.requestId });
        } else {
            SubmitMaintenanceRequest(newRequest);
        }

        alert('Request Submitted');
        handleReset();
    };

    const handleReset = () => {
        setMaintenanceType('');
        setMaintenanceDescription('');
        setPriority('Low');
        setMaintenanceHospital('Chestnut Hill');
        setDirectory('');
        setMaintenanceTime('');
        setEmployeeId(0);
        setNotes('');
        setLocationId(1);
    };

    return (
        <div className="flex justify-center items-start pt-16 pb-16 min-h-screen bg-[#f5faff] px-4">
            <div className="bg-white border border-[#d0ebff] rounded-2xl shadow-lg px-10 py-10 w-full max-w-[500px]">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-mgbblue">Maintenance Request</h1>
                    <HelpButton />
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <SelectFormElement
                        label="Employee"
                        id="employee"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(Number(e.target.value))}
                        options={["", ...employeeList.map((emp) => emp.employeeId.toString())]}
                        placeholder="Select Employee"
                    />

                    <SelectFormElement
                        label="Maintenance Type"
                        id="maintenanceType"
                        value={maintenanceType}
                        onChange={(e) => setMaintenanceType(e.target.value as reqMaintenanceType)}
                        required
                        options={maintenanceTypeArray}
                        placeholder="Select Maintenance Type"
                    />

                    <textarea
                        className="border-b-2 border-mgbblue focus:outline-none focus:border-mgbblue px-2 py-1 placeholder:text-sm resize-none"
                        placeholder="Describe the issue"
                        rows={3}
                        required
                        value={maintenanceDescription}
                        onChange={(e) => setMaintenanceDescription(e.target.value)}
                    />

                    <SelectFormElement
                        label="Priority"
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as priorityType)}
                        required
                        options={priorityArray}
                        placeholder="Select Priority"
                    />

                    <SelectFormElement
                        label="Hospital"
                        id="hospital"
                        value={maintenanceHospital}
                        onChange={(e) => setMaintenanceHospital(e.target.value as mgbHospitalType)}
                        required
                        options={mgbHospitals}
                        placeholder="Select Hospital"
                    />

                    <SelectFormElement
                        label="Department"
                        id="department"
                        value={directory}
                        onChange={(e) => setDirectory(e.target.value)}
                        required
                        options={directoryList}
                        placeholder="Select Department"
                    />

                    <input
                        type="datetime-local"
                        className="border-b-2 border-mgbblue focus:outline-none focus:border-mgbblue px-2 py-1 text-sm"
                        value={maintenanceTime}
                        onChange={(e) => setMaintenanceTime(e.target.value)}
                        required
                    />

                    <textarea
                        className="border-b-2 border-mgbblue focus:outline-none focus:border-mgbblue px-2 py-1 placeholder:text-sm resize-none"
                        placeholder="Additional Notes"
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />

                    <input
                        type="hidden"
                        value={locationId}
                        onChange={(e) => setLocationId(Number(e.target.value))}
                    />

                    <div className="flex flex-col gap-3 mt-4">
                        <MGBButton
                            variant="primary"
                            onClick={() => handleSubmit()}
                            className="rounded-full w-full py-2"
                        >
                            Submit Request
                        </MGBButton>
                        <MGBButton
                            variant="secondary"
                            onClick={handleReset}
                            className="rounded-full w-full py-2"
                        >
                            Clear Form
                        </MGBButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MaintenanceRequestPage;
