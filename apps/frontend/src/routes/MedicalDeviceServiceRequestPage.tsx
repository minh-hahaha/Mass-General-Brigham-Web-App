import { useState } from 'react';
import MGBButton from '../elements/MGBButton.tsx';
import InputElement from '../elements/InputElement.tsx';
import ConfirmMessageComponent from '../components/ConfirmMessageComponent.tsx';
import { SubmitMedicalDeviceRequest } from '@/database/medicalDeviceRequest.ts';

type MedicalDeviceType =
    | 'ECG Monitor'
    | 'Vital Signs Monitor'
    | 'Pulse Oximeter'
    | 'Infusion Pump'
    | 'Syringe Pump'
    | 'Defibrillator'
    | 'Ventilator'
    | 'Nebulizer'
    | 'Anesthesia Machine'
    | 'Wheelchair'
    | 'IV Stand'
    | 'Suction Machine'
    | 'Warming Blanket System'
    | 'Oxygen Concentrator'
    | 'Portable Suction Unit'
    | 'Crash Cart';

type location = 'Chestnut Hill' | '20 Patriot Place' | '22 Patriot Place';

type status = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';


export interface MedicalDeviceRequestData {
    employeeName: string;
    employeeId: number;
    requestDate: string;
    priority: 'Low' | 'Medium' | 'High' | 'Emergency';
    location: location;
    device: string;
    deviceModel?: string;
    deviceSerialNumber?: string;
    deviceReasoning: string;
    quantity: number;
    status: status;
    notes?: string;
    department: string;
}

// Medical Device Component Definition
const MedicalDeviceServiceRequestPage = () => {
    const loggedIn = sessionStorage.getItem('loggedIn');
    if (!loggedIn) {
        window.location.href = '/';
    }

    const [employeeName, setEmployeeName] = useState('');
    const [employeeId, setEmployeeId] = useState<number>(0);
    const [requestDate, setRequestDate] = useState('');
    const [priority, setPriority] = useState<MedicalDeviceRequestData['priority']>('Low');
    const [location, setLocation] =
        useState<MedicalDeviceRequestData['location']>('Chestnut Hill');
    const [device, setMedicalDevice] = useState<MedicalDeviceRequestData['device']>('ECG Monitor');
    const [deviceModel, setDeviceModel] = useState('');
    const [deviceSerialNumber, setDeviceSerialNumber] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [reasoning, setReasoning] = useState('');
    const [status, setStatus] = useState<MedicalDeviceRequestData['status']>('Pending');
    const [notes, setNotes] = useState('');
    const [department, setDepartment] = useState('');

    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newRequest: MedicalDeviceRequestData = {
            employeeName: employeeName,
            employeeId: employeeId,
            requestDate: requestDate,
            priority: priority as 'Low' | 'Medium' | 'High' | 'Emergency',
            location: location as 'Chestnut Hill' | '20 Patriot Place' | '22 Patriot Place',
            device: device as 'ECG Monitor' | 'Vital Signs Monitor' | 'Pulse Oximeter' |
                'Infusion Pump' | 'Syringe Pump' | 'Defibrillator' |
                'Ventilator' | 'Nebulizer' | 'Anesthesia Machine' |
                'Wheelchair' | 'IV Stand' | 'Suction Machine' |
                'Warming Blanket System' | 'Oxygen Concentrator' | 'Portable Suction Unit' | 'Crash Cart',
            deviceModel: deviceModel,
            deviceSerialNumber: deviceSerialNumber,
            quantity: quantity,
            deviceReasoning: reasoning,
            status: status as 'Pending' | 'In Progress' | 'Completed' | 'Cancelled',
            notes: notes,
            department: department,
        }
        SubmitMedicalDeviceRequest(newRequest);
        setShowConfirmation(true);
        handleReset();
    };

    const handleConfirmationClose = () => {
        setShowConfirmation(false);
    };

    const handleReset = () => {
        setEmployeeName('');
        setEmployeeId(0);
        setRequestDate(new Date().toISOString().split('T')[0]);
        setPriority('Low');
        setLocation('Chestnut Hill');
        setMedicalDevice('ECG Monitor');
        setDeviceModel('');
        setDeviceSerialNumber('');
        setQuantity(0);
        setReasoning('');
        setStatus('Pending');
        setNotes('');
        setDepartment('');
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <div className="flex flex-col items-center border border-[#d3d5d7] bg-white rounded-2xl shadow-xl p-8 w-full max-w-[700px] mt-10 mb-10">
                <h1 className="text-[30px] font-bold mb-6">Medical Device Request Form</h1>
                <p> Vinam Nguyen </p>
                <div>
                    <form onSubmit={handleSubmit} className={"space-y-6"}>
                        <div>
                            <h3 className="text-xl font-semibold mb-4">
                                <b>Requester Information</b>
                            </h3>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <InputElement
                                        label={"Requester Name "}
                                        type={"text"}
                                        id={"employeeName"}
                                        placeholder={"Please enter your full name"}
                                        value={employeeName}
                                        onChange={(e) => setEmployeeName(e.target.value)}
                                        required={true}
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <InputElement
                                        label={"Requester ID "}
                                        type={"text"}
                                        id={"employeeID"}
                                        placeholder={"Please enter your ID"}
                                        value={employeeId}
                                        onChange={(e) => setEmployeeId(Number(e.target.value))}
                                        required={true}
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <InputElement
                                        label={"Request Date "}
                                        type={"datetime-local"}
                                        id={"date"}
                                        value={requestDate}
                                        onChange={(e) => setRequestDate(e.target.value)}
                                        required={true}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-4">
                                <b>Medical Device Information</b>
                            </h3>
                            <div className={"flex flex-col gap-2"}>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <label className="w-1/4">Medical Device</label>
                                        <select
                                            id={"device"}
                                            value={device}
                                            onChange={(e) => setMedicalDevice(e.target.value as MedicalDeviceType)}
                                            required={true}
                                            className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        >
                                            <option value="">Select Device</option>
                                            {['ECG Monitor', 'Vital Signs Monitor', 'Pulse Oximeter', 'Infusion Pump', 'Syringe Pump',
                                                'Defibrillator', 'Ventilator', 'Nebulizer', 'Anesthesia Machine',
                                                'Wheelchair', 'IV Stand', 'Suction Machine', 'Warming Blanket System',
                                                'Oxygen Concentrator', 'Portable Suction Unit', 'Crash Cart'].map(
                                                    (medicalDevices) => (
                                                        <option
                                                            key={`medicalDevices-${medicalDevices}`}
                                                            value={medicalDevices}
                                                        >
                                                            {medicalDevices}
                                                        </option>
                                                    )
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <InputElement
                                            id="quantity"
                                            name="quantity"
                                            label="Quantity "
                                            required={true}
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Number(e.target.value))}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <InputElement
                                            id="deviceModel"
                                            name="deviceModel"
                                            label="Device Model"
                                            type="text"
                                            value={deviceModel}
                                            onChange={(e) => setDeviceModel(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <InputElement
                                            id="deviceSerialNumber"
                                            name="deviceSerialNumber"
                                            label="Serial Number"
                                            type="text"
                                            value={deviceSerialNumber}
                                            onChange={(e) => setDeviceSerialNumber(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <label className="w-1/4" htmlFor={'reasoning'}>
                                            Explanation
                                        </label>
                                        <textarea
                                            id={"reasoning"}
                                            value={reasoning}
                                            onChange={(e) => setReasoning(e.target.value)}
                                            cols={3}
                                            required
                                            className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                                <h3 className="text-xl font-semibold mb-4 mt-3">
                                    <b>Request Details</b>
                                </h3>
                                <div className="flex items-center gap-2">
                                    <label className="w-1/4">Location</label>
                                    <select
                                        id="location"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value as location)}
                                        required
                                        className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    >
                                        <option value="">Select Location</option>
                                        {['Chestnut Hill', '20 Patriot Place', '22 Patriot Place'].map(
                                            (location) => (
                                                <option
                                                    key={`location-${location}`}
                                                    value={location}
                                                >
                                                    {location}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                            <div className="flex flex-col pt-2">
                                <div className="flex items-center gap-2">
                                    <InputElement
                                        id="department"
                                        name="department"
                                        label="Department: "
                                        placeholder="Please enter the department"
                                        required={true}
                                        type="text"
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col pt-2">
                                <div className="flex items-center gap-2">
                                    <label className="w-1/4">Status</label>
                                    <select
                                        id="status"
                                        value={priority}
                                        onChange={(e) => setStatus(e.target.value as status)}
                                        required
                                        className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    >
                                        <option value="">Select Status</option>
                                        {['Pending', 'In Progress', 'Completed', 'Cancelled'].map(
                                            (status) => (
                                                <option
                                                    key={`status-${status}`}
                                                    value={status}
                                                >
                                                    {status}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold mb-4 mt-3">
                            <b>Additional Information</b>
                        </h3>
                        <div className="flex items-center gap-2">
                            <label className="w-1/4" htmlFor={'notes'}>
                                Additional Notes
                            </label>
                            <textarea
                                id="notes"
                                placeholder="Additional Notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                cols={3}
                                className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
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
                                    <ConfirmMessageComponent onClose={handleConfirmationClose} />
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

export default MedicalDeviceServiceRequestPage;
