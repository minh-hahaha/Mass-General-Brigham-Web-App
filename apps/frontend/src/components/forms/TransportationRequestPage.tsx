import { useEffect, useState } from 'react';
import MGBButton from '../../elements/MGBButton.tsx';
import ConfirmMessageComponent from '../ConfirmMessageComponent.tsx';
import FormFieldElement from '../../elements/FormFieldElement.tsx';
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
    mgbHospitalType,
    priorityArray,
    formatDateForEdit
} from '@/database/forms/formTypes.ts';
import { employeeNameId, getEmployeeNameIds } from '@/database/getEmployee.ts';
import { RequestPageProps } from '@/routes/ServiceRequestDisplayPage.tsx';
import HelpButton from '@/components/ServiceRequestHelp.tsx';
import Confetti from 'react-confetti'


const TransportRequestPage = ({ editData }: RequestPageProps) => {
    const [patientId, setPatientId] = useState(0);
    const [patientName, setPatientName] = useState('');
    const [transportType, setTransportType] = useState<hospitalTransportType>('');
    const [priority, setPriority] = useState('');
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [employeeId, setEmployeeId] = useState(0);
    const [transportDate, setTransportDate] = useState('');
    const [notes, setNotes] = useState('');
    const [assignedToId, setAssignedToId] = useState(0);
    const [submittedRequest, setSubmittedRequest] = useState<transportRequest | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [employeeList, setEmployeeList] = useState<employeeNameId[]>([]);
    const [isEditing, setIsEditing] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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

        if (editData && isEditing) {
            const editRequest: editTransportRequest = {
                transportRequest: newRequest,
                requestId: editData.requestId
            };
            EditTransportRequest(editRequest);
        } else {
            SubmitTransportRequest(newRequest);
        }

        setSubmittedRequest(newRequest);
        setShowConfirmation(true);
        setIsEditing(false);
        handleReset();
    };

    const handleReset = () => {
        setPatientId(0);
        setPatientName('');
        setTransportType("");
        setPriority('');
        setPickupLocation('');
        setDropoffLocation('');
        setNotes('');
        setAssignedToId(0);
        setTransportDate('');
        setEmployeeId(0);
        setTimeout(() => {
            setShowConfirmation(false);
        }, 3000)
    };

    useEffect(() => {
        const fetchEmployeeList = async () => {
            try {
                const data = await getEmployeeNameIds();
                setEmployeeList(data);
            } catch (e) {
                console.error('Error fetching employee list:', e);
            }
        };
        fetchEmployeeList();
    }, []);

    useEffect(() => {
        if (editData) {
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
            setIsEditing(true);
        }
    }, []);

    return (
        <>
            <div className="flex justify-center items-start pt-16 pb-16 min-h-screen bg-[#f5faff] px-4">
                <div className="bg-white border border-[#d0ebff] rounded-2xl shadow-lg px-10 py-10 w-full max-w-[500px]">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-mgbblue">Patient Transport Request</h1>
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
                            label="Patient ID"
                            id="patientId"
                            type="number"
                            value={patientId}
                            onChange={(e) => setPatientId(Number(e.target.value))}
                            required
                            placeholder="Enter Patient ID"
                        />

                        <FormFieldElement
                            label='Type'
                            id='transportType'
                            type="select"
                            value={transportType}
                            onChange={(e) => setTransportType(e.target.value as hospitalTransportType)}
                            required
                            options={hospitalTransportArray}
                            placeholder='Select Transport Type'
                        />

                        <FormFieldElement
                            label='Priority'
                            id='priority'
                            type="select"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as priorityType)}
                            required
                            options={priorityArray}
                            placeholder='Select Priority'
                        />

                        <FormFieldElement
                            label='Pickup'
                            id='pickupLocation'
                            type="select"
                            value={pickupLocation}
                            onChange={(e) => setPickupLocation(e.target.value as mgbHospitalType)}
                            required
                            options={mgbHospitals}
                            placeholder='Select Pickup Location'
                        />

                        <FormFieldElement
                            label='Destination'
                            id='destinationLocation'
                            type="select"
                            value={dropoffLocation}
                            onChange={(e) => setDropoffLocation(e.target.value as mgbHospitalType)}
                            required
                            options={mgbHospitals}
                            placeholder='Select Destination Location'
                        />

                        <FormFieldElement
                            label="Transport Date"
                            id="transportDate"
                            type="datetime-local"
                            value={transportDate}
                            onChange={(e) => setTransportDate(e.target.value)}
                            required
                        />

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">Additional Comments:</label>
                            <textarea
                                id="transportationNotes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                placeholder="Notes for transportation"
                                className="px-4 py-2 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>

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
        </>

    );
};

export default TransportRequestPage;
