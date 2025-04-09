import { useState } from 'react';
import MGBButton from '../components/MGBButton.tsx';
import axios from 'axios';
import { ROUTES } from 'common/src/constants';
import ConfirmMesg from '../components/ConfirmMesg.tsx'; // Import the new component
import { SubmitTransportRequest } from '../database/transportRequest.ts';

interface transportRequest {
    patientId: number;
    patientName: string;
    transportType: 'Ambulance' | 'Helicopter' | 'Other';
    priority: 'Low' | 'Medium' | 'High';
    pickupLocation: string;
    dropOffLocation: string;
    pickupDate: string;
    pickupTime: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
    notes: string;
    requesterId: number;
    requestDate: string;
    assignedToId: number;
}

// Component definition
const TransportRequestPage = () => {
    const loggedIn = sessionStorage.getItem('loggedIn');
    if (!loggedIn) {window.location.href = '/';}

    const [patientId, setPatientId] = useState(0);
    const [patientName, setPatientName] = useState('');
    const [transportType, setTransportType] =
        useState<transportRequest['transportType']>('Ambulance');
    const [priority, setPriority] = useState<transportRequest['priority']>('Low');
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropOffLocation, setDropOffLocation] = useState('');
    const [pickupDate, setPickupDate] = useState(new Date().toISOString().split('T')[0]);
    const [pickupTime, setPickupTime] = useState('');
    const [status, setStatus] = useState<transportRequest['status']>('Pending');
    const [notes, setNotes] = useState('');
    const [requesterId, setRequesterId] = useState(0);
    const [requestDate, setRequestDate] = useState(new Date().toISOString().split('T')[0]);
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
            status,
            notes,
            requesterId,
            requestDate,
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
        setTransportType('Ambulance');
        setPriority('Low');
        setPickupLocation('');
        setDropOffLocation('');
        setPickupDate(new Date().toISOString().split('T')[0]);
        setPickupTime('');
        setStatus('Pending');
        setNotes('');
        setRequesterId(0);
        setRequestDate(new Date().toISOString().split('T')[0]);
        setAssignedToId(0);
    };

    // //Data is sent to the backend
    // async function DisplayTransportRequest(request: transportRequest) {
    //     await axios.post(ROUTES.PATIENTTRANSPORT, request);
    // }

    const handleConfirmationClose = () => {
        setShowConfirmation(false);
    };

    const mgbLocations = ['Chestnut Hill'];

    return (
        // flex row container
        <div className="flex flex-col justify-center items-center min-h-screen">
            {/* make the form left side */}
            <div className="flex flex-col items-center border border-[#d3d5d7] bg-white rounded-2xl shadow-xl p-8 w-full max-w-[700px] mt-10 mb-10">
                <h1 className="text-[30px] font-bold mb-6">Patient Transportation Request</h1>
                <div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-4">
                                <b>Patient Information</b>
                            </h3>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <label className="w-1/4">Patient ID</label>
                                    <input
                                        type="number"
                                        id="patientId"
                                        value={patientId}
                                        onChange={(e) => setPatientId(Number(e.target.value))}
                                        required
                                        min="0"
                                        placeholder="Enter patient ID"
                                        className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="w-1/4">Patient Name</label>
                                    <input
                                        type="text"
                                        id="patientName"
                                        value={patientName}
                                        onChange={(e) => setPatientName(e.target.value)}
                                        required
                                        placeholder="Patient Full Name"
                                        className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-4">
                                <b>Transport Details</b>
                            </h3>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <label className="w-1/4">Transport</label>
                                    <select
                                        id="transportType"
                                        value={transportType}
                                        onChange={(e) =>
                                            setTransportType(
                                                e.target.value as transportRequest['transportType']
                                            )
                                        }
                                        required
                                        className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    >
                                        <option value="Ambulance">Ambulance</option>
                                        <option value="Helicopter">Helicopter</option>
                                        <option value="Medical Van">Medical Van</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col pt-2">
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
                                        <option value="Routine">Routine</option>
                                        <option value="Urgent">Urgent</option>
                                        <option value="Emergency">Emergency</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col pt-2">
                                <div className="flex items-center gap-2">
                                    <label className="w-1/4">Location</label>
                                    <select
                                        id="pickupLocation"
                                        value={pickupLocation}
                                        onChange={(e) => setPickupLocation(e.target.value)}
                                        required
                                        className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    >
                                        <option value="">Select pickup location</option>
                                        {mgbLocations.map((location) => (
                                            <option key={`pickup-${location}`} value={location}>
                                                {location}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col pt-2">
                                <div className="flex items-center gap-2">
                                    <label className="w-1/4">Destination</label>
                                    <select
                                        id="destinationLocation"
                                        value={dropOffLocation}
                                        onChange={(e) => setDropOffLocation(e.target.value)}
                                        required
                                        className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    >
                                        <option value="">Select destination</option>
                                        {mgbLocations.map((location) => (
                                            <option key={`dest-${location}`} value={location}>
                                                {location}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/*<div className="flex flex-col pt-2">*/}
                            {/*    <div className="flex items-center gap-2">*/}
                            {/*        <label className="w-1/4">Pickup Date</label>*/}
                            {/*        <input*/}
                            {/*            type="date"*/}
                            {/*            id="scheduledDate"*/}
                            {/*            value={pickupDate}*/}
                            {/*            onChange={(e) => setPickupDate(e.target.value)}*/}
                            {/*            required*/}
                            {/*            className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"*/}
                            {/*        />*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            {/*<div className="flex flex-col pt-2">*/}
                            {/*    <div className="flex items-center gap-2">*/}
                            {/*        <label className="w-1/4">Pickup Time</label>*/}
                            {/*        <input*/}
                            {/*            type="time"*/}
                            {/*            id="scheduledTime"*/}
                            {/*            value={pickupTime}*/}
                            {/*            onChange={(e) => setPickupTime(e.target.value)}*/}
                            {/*            required*/}
                            {/*            className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"*/}
                            {/*        />*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            <div className="flex flex-col pt-2">
                                <div className="flex items-center gap-2">
                                    <label className="w-1/4"> Status</label>
                                    <select
                                        id="status"
                                        value={status}
                                        onChange={(e) =>
                                            setStatus(e.target.value as transportRequest['status'])
                                        }
                                        required
                                        className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-4">
                                <b>Requester Information</b>
                            </h3>
                            <div className="flex flex-col pt-2">
                                <div className="flex items-center gap-2">
                                    <label className="w-1/4">Requester ID</label>
                                    <input
                                        type="number"
                                        id="requesterId"
                                        value={requesterId}
                                        onChange={(e) => setRequesterId(Number(e.target.value))}
                                        required
                                        min="0"
                                        className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col pt-2">
                                <div className="flex items-center gap-2">
                                    <label className="w-1/4">Request Date</label>
                                    <input
                                        type="date"
                                        id="requestDate"
                                        value={requestDate}
                                        onChange={(e) =>
                                            setRequestDate(e.target.value.toString().split('T')[0])
                                        }
                                        required
                                        className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col pt-2">
                                <div className="flex items-center gap-2">
                                    <label className="w-1/4">Employee ID</label>
                                    <input
                                        type="number"
                                        id="assignedToId"
                                        value={assignedToId}
                                        min="0"
                                        onChange={(e) => setAssignedToId(Number(e.target.value))}
                                        className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-4">
                                <b>Medical Information</b>
                            </h3>

                            <div className="flex flex-col pt-2">
                                <div className="flex items-center gap-2">
                                    <label className="w-1/4">Special Instructions</label>
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

                            {showConfirmation && submittedRequest && (
                                <div className="inline-block">
                                    <ConfirmMesg
                                        request={submittedRequest}
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
            <div className="w-1/2 pl-4"></div>
        </div>
    );
};

export default TransportRequestPage;
