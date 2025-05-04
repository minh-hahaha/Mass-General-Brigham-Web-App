import {useEffect, useState} from 'react';
import {DirectoryRequestByBuilding, getDirectory} from "@/database/gettingDirectory.ts";
import FormFieldElement from "@/elements/FormFieldElement.tsx"
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
                    <FormFieldElement
                        label="Employee"
                        id="employee"
                        type="select"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(Number(e.target.value))}
                        options={["", ...employeeList.map((emp) => emp.employeeId.toString())]}
                        placeholder="Select Employee"
                    />

                    <FormFieldElement
                        label="Medical Device"
                        id="device"
                        type="select"
                        value={device}
                        onChange={(e) => setMedicalDevice(e.target.value as medicalDeviceType)}
                        required
                        options={medicalDevices}
                        placeholder="Select Device"
                    />

                    <FormFieldElement
                        label="Quantity"
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        required
                    />

                    <FormFieldElement
                        label="Device Model"
                        id="deviceModel"
                        type="text"
                        value={deviceModel}
                        onChange={(e) => setDeviceModel(e.target.value)}
                        placeholder="Enter device model (optional)"
                    />

                    <FormFieldElement
                        label="Serial Number"
                        id="deviceSerialNumber"
                        type="text"
                        value={deviceSerialNumber}
                        onChange={(e) => setDeviceSerialNumber(e.target.value)}
                        placeholder="Enter serial number (optional)"
                    />

                    <FormFieldElement
                        label="Reasoning for device needed"
                        id="deviceReasoning"
                        type="text"
                        value={reasoning}
                        onChange={(e) => setReasoning(e.target.value)}
                        required
                    />

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
                        id="location"
                        type="select"
                        value={location}
                        onChange={(e) => setLocation(e.target.value as mgbHospitalType)}
                        required
                        options={mgbHospitals}
                        placeholder="Select Hospital"
                    />

                    <FormFieldElement
                        label="Department"
                        id="department"
                        type="select"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                        options={directoryList}
                        placeholder="Select Department"
                    />

                    <FormFieldElement
                        label="Delivery Date"
                        id="deliverDate"
                        type="datetime-local"
                        value={deliverDate}
                        onChange={(e) => setDeliverDate(e.target.value)}
                        required
                    />

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Additional Comments:</label>
                        <textarea
                            id="medicalNotes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            placeholder="Notes for the transport"
                            className="px-4 py-2 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                    </div>

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

