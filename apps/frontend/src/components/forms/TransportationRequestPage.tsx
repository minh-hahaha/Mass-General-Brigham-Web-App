import {useEffect, useState} from 'react';
import MGBButton from '../../elements/MGBButton.tsx';
import InputElement from '../../elements/InputElement.tsx';
import ConfirmMessageComponent from '../ConfirmMessageComponent.tsx';
import {
    EditTransportRequest,
    editTransportRequest,
    SubmitTransportRequest,
    transportRequest
} from '@/database/forms/transportRequest.ts';
import {
    hospitalTransportType,
    priorityType,
    mgbHospitals,
    hospitalTransportArray,
    mgbHospitalType, priorityArray, formatDateForEdit
} from '@/database/forms/formTypes.ts'
import SelectFormElement from "@/elements/SelectFormElement.tsx";
import { employeeNameId, getEmployeeNameIds } from '@/database/getEmployee.ts';
import {RequestPageProps} from "@/routes/ServiceRequestDisplayPage.tsx";
import HelpButton from "@/components/ServiceRequestHelp.tsx";

const TransportRequestPage = ({editData}: RequestPageProps) => {
    const [patientId, setPatientId] = useState(0);
    const [patientName, setPatientName] = useState('');
    const [transportType, setTransportType] = useState<hospitalTransportType>('Ambulance (BLS)');
    const [priority, setPriority] = useState('Select Priority');
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [employeeId, setEmployeeId] = useState(0);
    const [transportDate, setTransportDate] = useState('');
    const [notes, setNotes] = useState('');
    const [assignedToId, setAssignedToId] = useState(0);
    const [submittedRequest, setSubmittedRequest] = useState<transportRequest | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [employeeList, setEmployeeList] = useState<employeeNameId[]>([]);

    const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();
        const formattedDate = new Date(transportDate).toISOString();
        const newRequest: transportRequest = {
            employeeId,
            patientId,
            patientName,
            transportType,
            priority,
            pickupLocation,
            dropoffLocation,
            transportDate: formattedDate,
            notes,
            assignedToId,
        };

        if(editData) {
            const editRequest: editTransportRequest = {
                transportRequest: newRequest,
                requestId: editData.requestId
            }
            EditTransportRequest(editRequest);
        } else {
            SubmitTransportRequest(newRequest);
        }

        setSubmittedRequest(newRequest);
        setShowConfirmation(true);
        handleReset();
    };

    const handleReset = () => {
        setPatientId(0);
        setPatientName('');
        setTransportType('Ambulance (BLS)');
        setPriority('Low');
        setPickupLocation('');
        setDropoffLocation('');
        setNotes('');
        setAssignedToId(0);
        setTransportDate('');
        setEmployeeId(0);
    };

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
    }, []);

    useEffect(() => {
        if (showConfirmation) {
            alert("Request Submitted");
            handleConfirmationClose();
        }
    }, [showConfirmation]);

    const handleConfirmationClose = () => {
        setShowConfirmation(false);
    };

    useEffect(() => {
        if(editData){
            setPatientId(editData.patientTransport.patientId);
            setPatientName('');
            setTransportType(editData.patientTransport.transportType);
            setPriority(editData.priority);
            setPickupLocation(editData.patientTransport.pickupLocation);
            setDropoffLocation(editData.patientTransport.dropoffLocation);
            setNotes(editData.comments);
            setAssignedToId(0);
            setTransportDate(formatDateForEdit(editData.patientTransport.transportDate));
            setEmployeeId(editData.employeeId);
        }
    }, []);

    return (
        <div className="flex justify-center items-start pt-16 pb-16 min-h-screen bg-[#f5faff] px-4">
            <div className="bg-white border border-[#d0ebff] rounded-2xl shadow-lg px-10 py-10 w-full max-w-[500px]">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-mgbblue">Patient Transport Request</h1>
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

                    <InputElement
                        label="Patient ID"
                        type="number"
                        id="patientId"
                        value={patientId}
                        onChange={(e) => setPatientId(Number(e.target.value))}
                        required={true}
                        placeholder="Enter Patient ID"
                    />

                    <SelectFormElement
                        label="Type"
                        id="transportType"
                        value={transportType}
                        onChange={(e) => setTransportType(e.target.value as hospitalTransportType)}
                        required
                        options={hospitalTransportArray}
                        placeholder="Select Transport Type"
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
                        label="Pickup"
                        id="pickupLocation"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value as mgbHospitalType)}
                        required
                        options={mgbHospitals}
                        placeholder="Select Pickup Location"
                    />

                    <SelectFormElement
                        label="Destination"
                        id="destinationLocation"
                        value={dropoffLocation}
                        onChange={(e) => setDropoffLocation(e.target.value as mgbHospitalType)}
                        required
                        options={mgbHospitals}
                        placeholder="Select Destination Location"
                    />

                    <input
                        type="datetime-local"
                        className="border-b-2 border-mgbblue focus:outline-none focus:border-mgbblue px-2 py-1 text-sm"
                        value={transportDate}
                        onChange={(e) => setTransportDate(e.target.value)}
                        required
                    />

                    <textarea
                        className="border-b-2 border-mgbblue focus:outline-none focus:border-mgbblue px-2 py-1 placeholder:text-sm resize-none"
                        placeholder="Additional Notes"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />

                    <div className="flex flex-col gap-3 mt-4">
                        <MGBButton
                            variant="primary"
                            onClick={() => handleSubmit()}
                            className="rounded-full w-full"
                        >
                            Submit Request
                        </MGBButton>
                        <MGBButton
                            variant="secondary"
                            onClick={handleReset}
                            className="rounded-full w-full"
                        >
                            Clear Form
                        </MGBButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransportRequestPage;
