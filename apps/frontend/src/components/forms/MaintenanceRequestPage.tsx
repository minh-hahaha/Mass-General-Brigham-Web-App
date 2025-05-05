import { useEffect, useState } from 'react';
import MGBButton from '@/elements/MGBButton.tsx';
import FormFieldElement from '@/elements/FormFieldElement.tsx';
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
import Confetti from 'react-confetti'

const MaintenanceRequestPage = ({ editData }: RequestPageProps) => {
    const [maintenanceType, setMaintenanceType] = useState('');
    const [maintenanceDescription, setMaintenanceDescription] = useState('');
    const [priority, setPriority] = useState<priorityType>('');
    const [maintenanceHospital, setMaintenanceHospital] = useState<mgbHospitalType>('');
    const [directory, setDirectory] = useState('');
    const [maintenanceTime, setMaintenanceTime] = useState('');
    const [employeeId, setEmployeeId] = useState(0);
    const [notes, setNotes] = useState('');
    const [locationId, setLocationId] = useState(1);

    const [directoryList, setDirectoryList] = useState<string[]>([]);
    const [employeeList, setEmployeeList] = useState<employeeNameId[]>([]);
    const [showConfirmation, setShowConfirmation] = useState(false);

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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
        setShowConfirmation(true);
        handleReset();
    };

    useEffect(() => {
        if (showConfirmation) {
            handleConfirmationClose();
        }
    }, [showConfirmation]);

    const handleConfirmationClose = () => {
        setShowConfirmation(false);
    };


    const handleReset = () => {
        setMaintenanceType('');
        setMaintenanceDescription('');
        setPriority('');
        setMaintenanceHospital('');
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
                    {/*display employee name instead of id*/}
                    <div className="flex flex-col gap-1 w-full">
                        <label htmlFor="employee" className="text-sm font-medium text-gray-700 mb-1">
                            Employee:
                        </label>
                        <select
                            id={"employee"}
                            onChange={(e) => {
                                setEmployeeId(Number(e.target.value));
                            }}
                            value={employeeId}
                            className={`w-full px-4 py-2 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300`}
                        >
                            {employeeList.map((employee) => (
                                <option key={employee.employeeId} value={employee.employeeId}>
                                    {employee.employeeName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <FormFieldElement
                        label="Maintenance Type"
                        id="maintenanceType"
                        type="select"
                        value={maintenanceType}
                        onChange={(e) => setMaintenanceType(e.target.value as reqMaintenanceType)}
                        required
                        options={maintenanceTypeArray}
                        placeholder="Select Maintenance Type"
                    />

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Describe the Issue</label>
                        <textarea
                            id="maintenceDescription"
                            value={maintenanceDescription}
                            onChange={(e) => setMaintenanceDescription(e.target.value)}
                            rows={3}
                            placeholder="Describe the issue here"
                            className="px-4 py-2 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                    </div>

                    <FormFieldElement
                        label="Priority"
                        id="priority"
                        type="select"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as priorityType)}
                        required
                        options={priorityArray}
                        placeholder="Select Priority"
                    />

                    <FormFieldElement
                        label="Hospital"
                        id="hospital"
                        type="select"
                        value={maintenanceHospital}
                        onChange={(e) => setMaintenanceHospital(e.target.value as mgbHospitalType)}
                        required
                        options={mgbHospitals}
                        placeholder="Select Hospital"
                    />

                    <FormFieldElement
                        label="Department"
                        id="department"
                        type="select"
                        value={directory}
                        onChange={(e) => setDirectory(e.target.value)}
                        required
                        options={directoryList}
                        placeholder="Select Department"
                    />

                    <FormFieldElement
                        label="Maintenance Time"
                        id="maintenanceTime"
                        type="datetime-local"
                        value={maintenanceTime}
                        onChange={(e) => setMaintenanceTime(e.target.value)}
                        required
                    />

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Additional Comments</label>
                        <textarea
                            id="medicalNotes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            placeholder="Additional Notes"
                            className="px-4 py-2 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                    </div>

                    <input
                        type="hidden"
                        value={locationId}
                        onChange={(e) => setLocationId(Number(e.target.value))}
                    />

                    <div className="flex flex-col gap-3 mt-4">
                        <MGBButton
                            variant="primary"
                            onClick={() => handleSubmit}
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
                    {showConfirmation &&
                        <Confetti
                            recycle={false}
                            width={900}
                            height={900}
                            initialVelocityY={4}
                            gravity={0.6}
                            numberOfPieces={200}
                            tweenDuration={1000}
                        />
                    }
                </form>
            </div>
        </div>
    );
};

export default MaintenanceRequestPage;
