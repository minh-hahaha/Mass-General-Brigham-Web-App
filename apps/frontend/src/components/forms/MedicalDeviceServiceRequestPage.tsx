import {useEffect, useState} from 'react';
import {DirectoryRequestByBuilding, getDirectory} from "@/database/gettingDirectory.ts";
import {
    formatDateForEdit,
    medicalDevices,
    medicalDeviceType, meetingType, meetingTypeArray,
    mgbHospitals,
    mgbHospitalType, priorityArray,
    priorityType,
} from '@/database/forms/formTypes.ts';
import SelectFormElement from "@/elements/SelectFormElement.tsx";
import {employeeNameId, getEmployeeNameIds} from "@/database/getEmployee.ts";
import {incomingRequest} from "@/database/forms/transportRequest.ts";
import {RequestPageProps} from "@/routes/ServiceRequestDisplayPage.tsx";
import {
    EditMedicalDeviceRequest,
    editMedicalDeviceRequest,
    SubmitMedicalDeviceRequest
} from "@/database/forms/medicalDeviceRequest.ts";
import InputElement from "@/elements/InputElement.tsx";
import MGBButton from "@/elements/MGBButton.tsx";
import HelpButton from "@/components/ServiceRequestHelp.tsx";

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
    deliverDate: string;
}

const MedicalDeviceServiceRequestPage = ({editData}: RequestPageProps) => {
    const [employeeId, setEmployeeId] = useState<number>(0);
    const [priority, setPriority] = useState<priorityType>('Low');
    const [location, setLocation] = useState<mgbHospitalType>('Chestnut Hill');
    const [device, setMedicalDevice] = useState<MedicalDeviceRequestData['device']>('ECG Monitor');
    const [deviceModel, setDeviceModel] = useState('');
    const [deviceSerialNumber, setDeviceSerialNumber] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [reasoning, setReasoning] = useState('');
    const [notes, setNotes] = useState('');
    const [department, setDepartment] = useState('');
    const [deliverDate, setDeliverDate] = useState('');

    const [directoryList, setDirectoryList] = useState<string[]>([]);
    const [employeeList, setEmployeeList] = useState<employeeNameId[]>([]);

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
    }, [location]);

    useEffect(() => {
        const fetchEmployeeList = async () => {
            try {
                const data = await getEmployeeNameIds();
                setEmployeeList(data);
            } catch (e) {
                console.error('Error fetching employee list:', e);
            }
        }
        fetchEmployeeList();
    }, [])

    useEffect(() => {
        if(editData){
            setEmployeeId(editData.employeeId);
            setPriority(editData.priority);
            setLocation(editData.medicalDeviceRequest.location as mgbHospitalType);
            setMedicalDevice(editData.medicalDeviceRequest.device);
            setDeviceModel(editData.medicalDeviceRequest.deviceModel);
            setDeviceSerialNumber(editData.medicalDeviceRequest.deviceSerialNumber);
            setQuantity(0);
            setReasoning(editData.medicalDeviceRequest.deviceReasoning);
            setNotes(editData.comments);
            setDepartment(editData.medicalDeviceRequest.department);
            setDeliverDate(formatDateForEdit(editData.medicalDeviceRequest.deliverDate));
        }
    }, []);

    const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();
        const formattedDate = new Date(deliverDate).toISOString();
        const newRequest: MedicalDeviceRequestData = {
            employeeId,
            requestDate: new Date().toISOString(),
            priority,
            location,
            device,
            deviceModel,
            deviceSerialNumber,
            quantity,
            deviceReasoning: reasoning,
            notes,
            department,
            deliverDate: formattedDate,
        }
        if(editData) {
            const editRequest: editMedicalDeviceRequest = {
                medicalDeviceRequest: newRequest,
                requestId: editData.requestId
            }
            EditMedicalDeviceRequest(editRequest);
        } else {
            SubmitMedicalDeviceRequest(newRequest);
        }
        alert('Request Submitted');
        handleReset();
    };

    const handleReset = () => {
        setEmployeeId(0);
        setPriority('Low');
        setLocation('Chestnut Hill');
        setMedicalDevice('ECG Monitor');
        setDeviceModel('');
        setDeviceSerialNumber('');
        setQuantity(1);
        setReasoning('');
        setNotes('');
        setDepartment('');
        setDeliverDate('');
    };

    return (
        <div className="flex justify-center items-start pt-16 pb-16 min-h-screen bg-[#f5faff] px-4">
            <div className="bg-white border border-[#d0ebff] rounded-2xl shadow-lg px-10 py-10 w-full max-w-[500px]">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-mgbblue">Medical Device Request</h1>
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
                        label="Medical Device"
                        id="device"
                        value={device}
                        onChange={(e) => setMedicalDevice(e.target.value as medicalDeviceType)}
                        required
                        options={medicalDevices}
                        placeholder="Select Device"
                    />

                    <InputElement
                        id="quantity"
                        name="quantity"
                        label="Quantity"
                        required
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    />

                    <InputElement
                        id="deviceModel"
                        name="deviceModel"
                        label="Device Model"
                        type="text"
                        placeholder="Enter device model (optional)"
                        value={deviceModel}
                        onChange={(e) => setDeviceModel(e.target.value)}
                    />

                    <InputElement
                        id="deviceSerialNumber"
                        name="deviceSerialNumber"
                        label="Serial Number"
                        placeholder="Enter serial number (optional)"
                        type="text"
                        value={deviceSerialNumber}
                        onChange={(e) => setDeviceSerialNumber(e.target.value)}
                    />

                    <textarea
                        className="w-full border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 px-2 py-1 text-sm placeholder:text-sm resize-none"
                        placeholder="Reasoning for device needed"
                        required
                        value={reasoning}
                        onChange={(e) => setReasoning(e.target.value)}
                        rows={3}
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
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value as mgbHospitalType)}
                        required
                        options={mgbHospitals}
                        placeholder="Select Hospital"
                    />

                    <SelectFormElement
                        label="Department"
                        id="department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                        options={directoryList}
                        placeholder="Select Department"
                    />

                    <input
                        type="datetime-local"
                        className="border-b-2 border-mgbblue focus:outline-none focus:border-mgbblue px-2 py-1 text-sm"
                        value={deliverDate}
                        onChange={(e) => setDeliverDate(e.target.value)}
                        required
                    />

                    <textarea
                        className="w-full border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 px-2 py-1 text-sm placeholder:text-sm resize-none"
                        placeholder="Additional Notes"
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
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

export default MedicalDeviceServiceRequestPage;
