import {useEffect, useState} from 'react';
import MGBButton from '../../elements/MGBButton.tsx';
import InputElement from '../../elements/InputElement.tsx';
import ConfirmMessageComponent from '../ConfirmMessageComponent.tsx';
import { SubmitMedicalDeviceRequest } from '@/database/forms/medicalDeviceRequest.ts';
import {DirectoryRequestByBuilding, getDirectory} from "@/database/gettingDirectory.ts";
import SelectElement from "@/elements/SelectElement.tsx";
import {
    medicalDevices,
    medicalDeviceType, meetingType, meetingTypeArray,
    mgbHospitals,
    mgbHospitalType, priorityArray,
    priorityType,
} from '@/database/forms/formTypes.ts';
import SelectFormElement from "@/elements/SelectFormElement.tsx";


export interface MedicalDeviceRequestData {
    employeeId: number;
    requestDate: string;
    priority: priorityType;
    location: mgbHospitalType;
    device: string;
    deviceModel?: string;
    deviceSerialNumber?: string;
    deviceReasoning: string;
    quantity: number;
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
        useState<mgbHospitalType>('Chestnut Hill');
    const [device, setMedicalDevice] = useState<MedicalDeviceRequestData['device']>('ECG Monitor');
    const [deviceModel, setDeviceModel] = useState('');
    const [deviceSerialNumber, setDeviceSerialNumber] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [reasoning, setReasoning] = useState('');
    const [notes, setNotes] = useState('');
    const [department, setDepartment] = useState('');

    const [showConfirmation, setShowConfirmation] = useState(false);

    const [directoryList, setDirectoryList] = useState<string[]>([""]);
    const [directory, setDirectory] = useState<string>("");


    useEffect(() => {
        const fetchDirectoryList = async () => {
            try {
                const data = await getDirectory(mgbHospitals.indexOf(location) + 1);
                const names = data.map((item: DirectoryRequestByBuilding) => item.deptName);
                setDirectoryList(names);
            } catch (error) {
                console.error('Error fetching building names:', error);
            }
        };
        fetchDirectoryList();
        console.log('Updated Directory list');
    }, [location, directory]);

    useEffect(() => {
        if (showConfirmation) {
            alert("Request Submitted");
            handleConfirmationClose(); // close the state after the alert
        }
    }, [showConfirmation]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newRequest: MedicalDeviceRequestData = {
            employeeId: employeeId,
            requestDate: requestDate,
            priority: priority as priorityType,
            location: location as mgbHospitalType,
            device: device as medicalDeviceType,
            deviceModel: deviceModel,
            deviceSerialNumber: deviceSerialNumber,
            quantity: quantity,
            deviceReasoning: reasoning,
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
        setNotes('');
        setDepartment('');
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <div className="flex flex-col items-center rounded-2xl p-8 w-full max-w-[700px] mt-10 mb-10">
                <h1 className="text-[30px] font-bold mb-6">Medical Device Request Form</h1>
                <p> Vinam Nguyen </p>
                <div>
                    <form onSubmit={handleSubmit} className={"space-y-6"}>

                        <div>
                            <h3 className="text-xl font-semibold mb-4">
                                <b>Medical Device Information</b>
                            </h3>
                            <div className={"flex flex-col gap-2"}>
                                <div className="flex flex-col gap-2">
                                    <SelectFormElement
                                        label = 'MedicalDevice'
                                        id = 'medicalDevice'
                                        value = {device}
                                        onChange = {(e) =>
                                            setMedicalDevice(e.target.value as medicalDeviceType)
                                        }
                                        required
                                        options = {medicalDevices}
                                        placeholder = 'Select Medical Device'
                                    />
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
                                            placeholder="Enter device model (optional)"
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
                                            placeholder="Enter device serial number (optional)"
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
                                            placeholder="Reasoning for device needed"
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
                            <div className="flex flex-col pt-2">
                                <div className="flex flex-col pt-2">
                                    <SelectFormElement
                                        label = 'Hospital'
                                        id = 'location'
                                        value = {location}
                                        onChange = {(e) =>
                                            setLocation(e.target.value as mgbHospitalType)
                                        }
                                        required
                                        options = {mgbHospitals}
                                        placeholder = 'Select Hospital'
                                    />
                                </div>
                            </div>

                            {/*Department Dropdown*/}
                            <div className="flex flex-col pt-2">
                                <SelectFormElement
                                    label = 'Department'
                                    id = 'department'
                                    value = {department}
                                    onChange = {(e) =>
                                        setDepartment(e.target.value)
                                    }
                                    required
                                    options = {directoryList}
                                    placeholder = 'Select Department'
                                />
                            </div>

                            <div className="flex flex-col pt-2">
                                <div className="flex flex-col pt-2">
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
