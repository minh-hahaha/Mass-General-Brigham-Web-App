import { useState } from 'react';
import MGBButton from '@/elements/MGBButton.tsx';
import ConfirmMessageComponent from '@/components/ConfirmMessageComponent.tsx';
import { SubmitMaintenanceRequest, maintenanceRequest } from '@/database/maintenanceRequest.ts';
import InputElement from '@/elements/InputElement.tsx';
import SelectElement from '@/elements/SelectElement.tsx';

// Component definition
const MaintenanceRequestPage = () => {
    const loggedIn = sessionStorage.getItem('loggedIn');
    if (!loggedIn) {window.location.href = '/';}

    // Maintenance Information
    const [maintenanceType, setMaintenanceType] = useState('');
    const [maintenanceDescription, setMaintenanceDescription] = useState('');

    // Maintenance Details
    const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Emergency'>('Low');
    const [maintenanceHospital, setMaintenanceHospital] = useState('');
    const [maintenanceLocation, setMaintenanceLocation] = useState('');
    const [maintenanceTime, setMaintenanceTime] = useState('');
    const [status, setStatus] = useState<'Pending' | 'In Progress' | 'Completed' | 'Canceled'>('Pending');

    // Requester Information
    const [employeeId, setEmployeeId] = useState(0);
    const [requestDate, setRequestDate] = useState(new Date().toISOString().split('T')[0]);
    const [employeeName, setEmployeeName] = useState('');
    const [notes, setNotes] = useState('');
    const [locationId, setLocationId] = useState(1);

    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Format the request date properly to avoid "Invalid Date" error
        const formattedRequestDate = new Date(requestDate).toISOString();

        const newRequest: maintenanceRequest = {
            maintenanceType,
            maintenanceDescription,
            priority,
            maintenanceHospital,
            maintenanceLocation,
            maintenanceTime,
            status,
            employeeId,
            requestDate: formattedRequestDate,
            employeeName,
            notes,
            locationId
        };

        SubmitMaintenanceRequest(newRequest);
        setShowConfirmation(true);

        handleReset();
    };

    const handleReset = () => {
        setMaintenanceType('');
        setMaintenanceDescription('');
        setPriority('Low');
        setMaintenanceHospital('');
        setMaintenanceLocation('');
        setMaintenanceTime('');
        setStatus('Pending');
        setEmployeeId(0);
        setRequestDate(new Date().toISOString().split('T')[0]);
        setEmployeeName('');
        setNotes('');
        setLocationId(1);
    };

    const handleConfirmationClose = () => {
        setShowConfirmation(false);
    };

    const hospitalLocations = ['Chestnut Hill', '20 Patriot Place', '22 Patriot Place'];

    return (
        // flex row container
        <div className="flex flex-col justify-center items-center min-h-screen">
            {/* make the form left side */}
            <div className="flex flex-col items-center border border-[#d3d5d7] bg-white rounded-2xl shadow-xl p-8 w-full max-w-[700px] mt-10 mb-10">
                <h1 className="text-[30px] font-bold mb-6">Maintenance Request</h1>
                <div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-4">
                                <b>Maintenance Information</b>
                            </h3>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <InputElement
                                        id="maintenanceType"
                                        name="maintenanceType"
                                        label="Maintenance Type: "
                                        placeholder="Enter maintenance type"
                                        required={true}
                                        type="text"
                                        value={maintenanceType}
                                        onChange={(e) => setMaintenanceType(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="w-1/4" htmlFor="maintenanceDescription">Issue Description</label>
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
                                    <SelectElement
                                        options={['Low', 'Medium', 'High', 'Emergency']}
                                        id="priority"
                                        label="Priority: "
                                        placeholder="Select priority level"
                                        required={true}
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value as maintenanceRequest['priority'])}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <SelectElement
                                        options={hospitalLocations}
                                        id="maintenanceHospital"
                                        label="Hospital: "
                                        placeholder="Select hospital location"
                                        required={true}
                                        value={maintenanceHospital}
                                        onChange={(e) => setMaintenanceHospital(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <InputElement
                                        id="maintenanceLocation"
                                        name="maintenanceLocation"
                                        label="Department: "
                                        placeholder="Enter department/location"
                                        required={true}
                                        type="text"
                                        value={maintenanceLocation}
                                        onChange={(e) => setMaintenanceLocation(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <InputElement
                                        id="maintenanceTime"
                                        name="maintenanceTime"
                                        label="Maintenance Time: "
                                        placeholder="Select date and time"
                                        required={true}
                                        type="datetime-local"
                                        value={maintenanceTime}
                                        onChange={(e) => setMaintenanceTime(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <SelectElement
                                        options={['Pending', 'In Progress', 'Completed', 'Canceled']}
                                        id="status"
                                        label="Status: "
                                        placeholder="Select status"
                                        required={true}
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as 'Pending' | 'In Progress' | 'Completed' | 'Canceled')}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-4">
                                <b>Requester Information</b>
                            </h3>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <InputElement
                                        id="employeeId"
                                        name="employeeId"
                                        label="Employee ID: "
                                        placeholder="Enter employee ID"
                                        required={true}
                                        type="number"
                                        value={employeeId}
                                        onChange={(e) => setEmployeeId(Number(e.target.value))}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <InputElement
                                        id="requestDate"
                                        name="requestDate"
                                        label="Request Date: "
                                        placeholder="Select request date"
                                        required={true}
                                        type="date"
                                        value={requestDate}
                                        onChange={(e) => setRequestDate(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <InputElement
                                        id="employeeName"
                                        name="employeeName"
                                        label="Employee Name: "
                                        placeholder="Enter employee name"
                                        required={true}
                                        type="text"
                                        value={employeeName}
                                        onChange={(e) => setEmployeeName(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="w-1/4" htmlFor="notes">Additional Notes</label>
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

                            {showConfirmation && (
                                <div className="inline-block">
                                    <ConfirmMessageComponent
                                        onClose={handleConfirmationClose}
                                    />
                                </div>
                            )}
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