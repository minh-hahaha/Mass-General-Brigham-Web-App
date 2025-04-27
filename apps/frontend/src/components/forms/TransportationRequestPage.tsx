import {useEffect, useState} from 'react';
import MGBButton from '../../elements/MGBButton.tsx';
import InputElement from '../../elements/InputElement.tsx';
import ConfirmMessageComponent from '../ConfirmMessageComponent.tsx'; // Import the new component
import { SubmitTransportRequest, transportRequest} from '@/database/forms/transportRequest.ts';
import {
    hospitalTransportType,
    priorityType,
    mgbHospitals,
    hospitalTransportArray,
    mgbHospitalType, priorityArray
} from '@/database/forms/formTypes.ts'
import SelectFormElement from "@/elements/SelectFormElement.tsx";

// Component definition
const TransportRequestPage = () => {
    const loggedIn = sessionStorage.getItem('loggedIn');
    if (!loggedIn) {window.location.href = '/';}

    const [patientId, setPatientId] = useState(0);
    const [patientName, setPatientName] = useState('');
    const [transportType, setTransportType] =
        useState<hospitalTransportType>('Ambulance (BLS)');
    const [priority, setPriority] = useState<priorityType>('Low');
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropOffLocation, setDropOffLocation] = useState('');
    const [pickupDate, setPickupDate] = useState(new Date().toISOString().split('T')[0]);
    const [pickupTime, setPickupTime] = useState('');
    const [notes, setNotes] = useState('');
    const [assignedToId, setAssignedToId] = useState(0);
    const [submittedRequest, setSubmittedRequest] = useState<transportRequest | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newRequest: transportRequest = {
            patientId,
            patientName,
            transportType,
            priority,
            pickupLocation,
            dropOffLocation,
            pickupDate,
            pickupTime,
            notes,
            assignedToId,
        };

        SubmitTransportRequest(newRequest);
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
        setDropOffLocation('');
        setPickupDate(new Date().toISOString().split('T')[0]);
        setPickupTime('');
        setNotes('');
        setAssignedToId(0);
    };

    useEffect(() => {
        if (showConfirmation) {
            alert("Request Submitted");
            handleConfirmationClose(); // close the state after the alert
        }
    }, [showConfirmation]);

    const handleConfirmationClose = () => {
        setShowConfirmation(false);
    };

    return (
        // flex row container
        <div className="flex flex-col justify-center items-center min-h-screen">
            {/* make the form left side */}
            <div className="flex flex-col items-center bg-white rounded-2xl p-8 w-full max-w-[700px] mt-10 mb-10">
                <h1 className="text-[30px] font-bold mb-6">Patient Transportation Request</h1>
                <div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-4">
                                <b>Patient Information</b>
                            </h3>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <InputElement label={"Patient ID"}
                                                  type={"number"}
                                                  id={"patientId"}
                                                  value={patientId}
                                                  onChange={e => setPatientId(Number(e.target.value))}
                                                  required={true}
                                                  placeholder={"Enter Patient ID"}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <InputElement label={"Patient Name"}
                                                  type={"text"}
                                                  id={"patientName"}
                                                  value={patientName}
                                                  onChange={e => setPatientName(e.target.value)}
                                                  required={true}
                                                  placeholder={"Enter Patient Name"}
                                               />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-4">
                                <b>Transport Details</b>
                            </h3>
                            <SelectFormElement
                                label = 'Type'
                                id = 'transportType'
                                value = {transportType}
                                onChange = {(e) =>
                                    setPickupLocation(
                                        e.target.value as hospitalTransportType
                                    )
                                }
                                required
                                options = {hospitalTransportArray}
                            />

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
                                />
                                <div className="flex items-center gap-2">
                                    <label className="w-1/4">Priority</label>
                                    <select
                                        id="priority"
                                        value={priority}
                                        onChange={(e) =>
                                            setPriority(
                                                e.target.value as transportRequest['priority']
                                            )
                                        }
                                        required
                                        className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Emergency">Emergency</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col pt-2">
                                <SelectFormElement
                                    label = 'Pickup'
                                    id = 'pickupLocation'
                                    value = {pickupLocation}
                                    onChange = {(e) =>
                                        setPickupLocation(e.target.value as mgbHospitalType)
                                    }
                                    required
                                    options = {hospitalTransportArray}
                                />
                            </div>


                            <div className="flex flex-col pt-2">

                                <SelectFormElement
                                    label = 'Destination'
                                    id = 'destinationLocation'
                                    value = {dropOffLocation}
                                    onChange = {(e) =>
                                        setDropOffLocation(e.target.value)
                                    }
                                    required
                                    options = {mgbHospitals}
                                />
                            </div>

                            <div className="flex flex-col pt-2">
                                <div className="flex items-center gap-2">
                                    <InputElement label={"Pickup Time"}
                                                  type={"datetime-local"}
                                                  id={"scheduledTime"}
                                                  value={pickupTime} onChange={e => setPickupTime(e.target.value)}
                                                  required={true}
                                    />
                                </div>
                            </div>

                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-4">
                                <b>Additional Information</b>
                            </h3>

                            <div className="flex flex-col pt-2">
                                <div className="flex items-center gap-2">
                                    <label className="w-1/4">Additional Comments</label>
                                    <textarea
                                        id="medicalNotes"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={3}
                                        placeholder="Notes for the transport"
                                        className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    ></textarea>
                                </div>
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

export default TransportRequestPage;
