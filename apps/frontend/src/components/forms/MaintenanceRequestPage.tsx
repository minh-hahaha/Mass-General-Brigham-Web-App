import {useEffect, useState} from 'react';
import MGBButton from '@/elements/MGBButton.tsx';
import ConfirmMessageComponent from '@/components/ConfirmMessageComponent.tsx';
import { SubmitMaintenanceRequest, maintenanceRequest } from '@/database/forms/maintenanceRequest.ts';
import InputElement from '@/elements/InputElement.tsx';
import SelectElement from '@/elements/SelectElement.tsx';
import {DirectoryRequestByBuilding, getDirectory} from "@/database/gettingDirectory.ts";


type mbgHospitals =  'Chestnut Hill' | '20 Patriot Place' | '22 Patriot Place' | 'Faulkner Hospital';
const hospitals = ['Chestnut Hill', '20 Patriot Place', '22 Patriot Place', 'Faulkner Hospital'];

// Component definition
const MaintenanceRequestPage = () => {
    const loggedIn = sessionStorage.getItem('loggedIn');
    if (!loggedIn) {
        window.location.href = '/';
    }

    // Maintenance Information
    const [maintenanceType, setMaintenanceType] = useState('');
    const [maintenanceDescription, setMaintenanceDescription] = useState('');

    // Maintenance Details
    const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Emergency'>('Low');
    const [maintenanceHospital, setMaintenanceHospital] = useState<mbgHospitals>('Chestnut Hill')
    const [maintenanceLocation, setMaintenanceLocation] = useState('');
    const [maintenanceTime, setMaintenanceTime] = useState('');

    // Requester Information
    const [employeeId, setEmployeeId] = useState(0);
    const [employeeName, setEmployeeName] = useState('');
    const [notes, setNotes] = useState('');
    const [locationId, setLocationId] = useState(1);

    const [showConfirmation, setShowConfirmation] = useState(false);

    const [directoryList, setDirectoryList] = useState<string[]>([""]);
    const [directory, setDirectory] = useState<string>("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newRequest: maintenanceRequest = {
            maintenanceType,
            maintenanceDescription,
            priority,
            maintenanceHospital,
            maintenanceLocation,
            maintenanceTime,
            employeeId,
            employeeName,
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
                const data = await getDirectory(hospitals.indexOf(maintenanceHospital) + 1);
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
        if (showConfirmation) {
            alert("Request Submitted");
            handleConfirmationClose(); // close the state after the alert
        }
    }, [showConfirmation]);

    const hospitalLocations = ['Chestnut Hill', '20 Patriot Place', '22 Patriot Place', 'Faulkner Hospital'];

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
                                <b>Maintenance Information</b>
                            </h3>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <label className="w-1/4">Maintenance Type</label>
                                    <input
                                        id="maintenanceType"
                                        name="maintenanceType"
                                        placeholder="Enter maintenance type"
                                        required
                                        type="text"
                                        value={maintenanceType}
                                        onChange={(e) => setMaintenanceType(e.target.value)}
                                        className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                                <div className="flex items-center gap-2">
                                    <label className="w-1/4">Priority</label>
                                    <select
                                        id="priority"
                                        value={priority}
                                        onChange={(e) =>
                                            setPriority(
                                                e.target.value as
                                                    | 'Low'
                                                    | 'Medium'
                                                    | 'High'
                                                    | 'Emergency'
                                            )
                                        }
                                        required
                                        className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    >
                                        <option value="">Select priority level</option>
                                        {['Low', 'Medium', 'High', 'Emergency'].map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <label className="w-1/4">Hospital</label>
                                    <select
                                        id="maintenanceHospital"
                                        value={maintenanceHospital}
                                        onChange={(e) => setMaintenanceHospital(e.target.value as maintenanceRequest['maintenanceHospital'])}
                                        required
                                        className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    >
                                        <option value="">Select hospital location</option>
                                        {hospitalLocations.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/*Department Dropdown*/}
                                <div className="flex flex-col pt-2">
                                    <div className="flex items-center gap-2">
                                        <label className="w-1/4"> Department </label>
                                        <SelectElement
                                            label=""
                                            id="departmentId"
                                            value={directory}
                                            onChange={(e) => setDirectory(e.target.value)}
                                            required
                                            options={directoryList}
                                            placeholder="Select a Department"
                                            // className="py-3 px-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                            className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                    </div>
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
