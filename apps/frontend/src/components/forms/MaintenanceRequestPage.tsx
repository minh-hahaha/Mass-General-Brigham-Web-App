import {useEffect, useState} from 'react';
import MGBButton from '@/elements/MGBButton.tsx';
import ConfirmMessageComponent from '@/components/ConfirmMessageComponent.tsx';
import { SubmitMaintenanceRequest, maintenanceRequest } from '@/database/forms/maintenanceRequest.ts';
import InputElement from '@/elements/InputElement.tsx';
import SelectElement from '@/elements/SelectElement.tsx';
import {DirectoryRequestByBuilding, getDirectory} from "@/database/gettingDirectory.ts";
import {
    maintenanceTypeArray,
    mgbHospitals,
    mgbHospitalType,
    priorityArray,
    priorityType,
    reqMaintenanceType
} from "@/database/forms/formTypes.ts";
import SelectFormElement from "@/elements/SelectFormElement.tsx";
import {employeeNameId, getEmployee, getEmployeeNameIds, getEmployeeNames} from "@/database/getEmployee.ts";

// Component definition
const MaintenanceRequestPage = () => {
   // TODO: CHECK ADMIN AGAIN
    // const loggedIn = sessionStorage.getItem('loggedIn');
    // if (!loggedIn) {
    //     window.location.href = '/';
    // }

    // Maintenance Information
    const [maintenanceType, setMaintenanceType] = useState('');
    const [maintenanceDescription, setMaintenanceDescription] = useState('');

    // Maintenance Details
    const [priority, setPriority] = useState<priorityType>('Low');
    const [maintenanceHospital, setMaintenanceHospital] = useState<mgbHospitalType>('Chestnut Hill')
    const [maintenanceLocation, setMaintenanceLocation] = useState('');
    const [maintenanceTime, setMaintenanceTime] = useState('');

    // Requester Information
    const [requester, setRequester] = useState<string>("");
    const [employeeId, setEmployeeId] = useState(0);
    const [employeeName, setEmployeeName] = useState('');
    const [notes, setNotes] = useState('');
    const [locationId, setLocationId] = useState(1);

    const [showConfirmation, setShowConfirmation] = useState(false);

    const [directoryList, setDirectoryList] = useState<string[]>([""]);
    const [directory, setDirectory] = useState<string>("");
    const [employeeList, setEmployeeList] = useState<employeeNameId[]>([]);


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        //TODO: HANDLE EMPLOYEE HERE
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

        SubmitMaintenanceRequest(newRequest);
        setShowConfirmation(true);

        handleReset();
    };

    const handleReset = () => {
        setMaintenanceType('');
        setMaintenanceDescription('');
        setPriority('Low');
        setMaintenanceHospital('Chestnut Hill');
        setMaintenanceLocation('');
        setMaintenanceTime('');
        setEmployeeId(0);
        setEmployeeName('');
        setNotes('');
        setLocationId(1);
    };

    const handleConfirmationClose = () => {
        setShowConfirmation(false);
    };

    useEffect(() => {
        const fetchDirectoryList = async () => {
            try {
                const data = await getDirectory(mgbHospitals.indexOf(maintenanceHospital) + 1);
                const names = data.map((item: DirectoryRequestByBuilding) => item.deptName);
                setDirectoryList(names);
            } catch (error) {
                console.error('Error fetching building names:', error);
            }
        };
        fetchDirectoryList();
        console.log('Updated Directory list');
    }, [maintenanceHospital, directory]);

    useEffect(() => {
        const fetchEmployeeList = async () => {
            try {
                const data = await getEmployeeNameIds();
                setEmployeeList(data); // list of employee names
            } catch (e) {
                console.error('Error fetching employee list:', e);
            }
        }
        fetchEmployeeList();
        console.log(employeeList);
    }, [])

    useEffect(() => {
        if (showConfirmation) {
            alert("Request Submitted");
            handleConfirmationClose(); // close the state after the alert
        }
    }, [showConfirmation]);



            return (
                // flex row container
                <div className="flex flex-col justify-center items-center min-h-screen">
                    {/* make the form left side */}
                    <div className="flex flex-col items-center rounded-2xl p-8 w-full max-w-[700px] mt-10 mb-10">
                        <h1 className="text-[30px] font-bold mb-6">Maintenance Request</h1>
                        <h2 className="text-[15px] font-semibold mb-6">Max Jeronimo and Haotian Liu</h2>

                        <div>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">
                                        <b>Assign Employee</b>
                                    </h3>
                                    <div className="flex flex-row gap-2">
                                        <div className='flex flex-row gap-2'>
                                            <label className='w=1/4'>Employee: </label>
                                            <select
                                                onChange={(e) => {
                                                    setEmployeeId(Number(e.target.value));
                                                }}
                                                value={employeeId}
                                                className='w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300'
                                            >
                                                {employeeList.map((employee) => (
                                                    <option key={employee.employeeId} value={employee.employeeId}>
                                                        {employee.employeeName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">
                                        <b>Maintenance Information</b>
                                    </h3>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col gap-2">
                                            <SelectFormElement
                                                label = 'Maintenance Type'
                                                id = 'maintenanceType'
                                                value = {maintenanceType}
                                                onChange = {(e) =>
                                                    setMaintenanceType(e.target.value as reqMaintenanceType)
                                                }
                                                required
                                                options = {maintenanceTypeArray}
                                                placeholder = 'Select Maintenance Type'
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="w-1/4">Issue Description</label>
                                            <textarea
                                                id="maintenanceDescription"
                                                placeholder="Describe the issue"
                                                value={maintenanceDescription}
                                                onChange={(e) => setMaintenanceDescription(e.target.value)}
                                                required
                                                rows={3}
                                                className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold mb-4">
                                        <b>Maintenance Details</b>
                                    </h3>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col gap-2">
                                            <SelectFormElement
                                                label = 'Priority'
                                                id = 'priority'
                                                value = {priority}
                                                onChange = {(e) =>
                                                    setPriority(e.target.value as priorityType)
                                                }
                                                required
                                                options = {priorityArray}
                                                placeholder = 'Select Priority'
                                            />
                                        </div>

                                        <div className="flex flex-col pt-2">
                                            <SelectFormElement
                                                label = 'Hospital'
                                                id = 'location'
                                                value = {maintenanceHospital}
                                                onChange = {(e) =>
                                                    setMaintenanceHospital(e.target.value as mgbHospitalType)
                                                }
                                                required
                                                options = {mgbHospitals}
                                                placeholder = 'Select Hospital'
                                            />
                                        </div>

                                        {/*Department Dropdown*/}
                                        <div className="flex flex-col pt-2">
                                            <SelectFormElement
                                                label = 'Department'
                                                id = 'department'
                                                value = {directory}
                                                onChange = {(e) =>
                                                    setDirectory(e.target.value)
                                                }
                                                required
                                                options = {directoryList}
                                                placeholder = 'Select Department'
                                            />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <label className="w-1/4">Maintenance Time</label>
                                            <input
                                                id="maintenanceTime"
                                                name="maintenanceTime"
                                                placeholder="Select date and time"
                                                required
                                                type="datetime-local"
                                                value={maintenanceTime}
                                                onChange={(e) => setMaintenanceTime(e.target.value)}
                                                className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold mb-4">
                                        <b>Additional Information</b>
                                    </h3>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <label className="w-1/4">Additional Notes</label>
                                            <textarea
                                                id="notes"
                                                placeholder="Enter any additional notes"
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                rows={3}
                                                className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                            ></textarea>
                                        </div>

                                        <input
                                            type="hidden"
                                            id="locationId"
                                            value={locationId}
                                            onChange={(e) => setLocationId(Number(e.target.value))}
                                        />
                                    </div>
                                </div>

                                {/* submit button and confirmation message */}
                                <div className="flex items-center justify-center space-x-4">
                                    <MGBButton
                                        onClick={() => handleSubmit}
                                        variant={'primary'}
                                        disabled={false}
                                    >
                                        Submit Request
                                    </MGBButton>
                                    <MGBButton
                                        onClick={() => handleReset()}
                                        variant={'secondary'}
                                        disabled={false}
                                    >
                                        Clear Form
                                    </MGBButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            );
};

export default MaintenanceRequestPage;
