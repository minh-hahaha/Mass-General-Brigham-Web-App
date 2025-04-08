import {useState } from 'react';
import MGBButton from "../components/MGBButton.tsx";
import axios from "axios";
import { ROUTES } from 'common/src/constants';
import ConfirmMesg from "../components/ConfirmMesg.tsx"; // Import the new component


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
    const [patientId, setPatientId] = useState(0);
    const [patientName, setPatientName] = useState('');
    const [transportType, setTransportType] = useState<transportRequest['transportType']> ('Ambulance');
    const [priority, setPriority] = useState<transportRequest['priority']> ('Low');
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropOffLocation, setDropOffLocation] = useState('');
    const [pickupDate, setPickupDate] = useState(new Date().toISOString().split('T')[0]);
    const [pickupTime, setPickupTime] = useState('');
    const [status, setStatus] = useState<transportRequest['status']> ('Pending');
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
        }

        DisplayTransportRequest(newRequest); //sends new data to backend
        setSubmittedRequest(newRequest);
        setShowConfirmation(true);

        handleReset();
    }

    const handleReset=()=>{
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
    }

    //Data is sent to the backend
    async function DisplayTransportRequest(request: transportRequest) {
        await axios.post(ROUTES.PATIENTTRANSPORT, request);
    }

    const handleConfirmationClose = () => {
        setShowConfirmation(false);
    };

    const mgbLocations = ["Chestnut Hill"];

    return (
        // flex row container
        <div className="flex flex-row">
            {/* make the form left side */}
            <div className="w-1/2 pr-4">
                <h1 className="text-[20px] font-bold">Patient Transportation Request</h1>
                <div>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <h3><b>Patient Information</b></h3>

                            <div>
                                <label>Patient ID</label>
                                <input
                                    type="text"
                                    id="patientId"
                                    value={patientId}
                                    onChange={(e) => setPatientId(e.target.value)}
                                    required
                                    placeholder="Enter patient ID"
                                />
                            </div>

                            <div>
                                <label>Patient Name</label>
                                <input
                                    type="text"
                                    id="patientName"
                                    value={patientName}
                                    onChange={(e) => setPatientName(e.target.value)}
                                    required
                                    placeholder="Patient Full Name"
                                />
                            </div>
                        </div>

                        <div>
                            <h3><b>Transport Details</b></h3>
                            <div>
                                <label>Transport Type</label>
                                <select
                                    id="transportType"
                                    value={transportType}
                                    onChange={(e) => setTransportType(e.target.value as transportRequest['transportType'])}
                                    required>
                                    <option value="Ambulance">Ambulance</option>
                                    <option value="Helicopter">Helicopter</option>
                                    <option value="Medical Van">Medical Van</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label>Priority</label>
                                <select
                                    id="priority"
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as transportRequest['priority'])}
                                    required
                                >
                                    <option value="Routine">Routine</option>
                                    <option value="Urgent">Urgent</option>
                                    <option value="Emergency">Emergency</option>
                                </select>
                            </div>

                            <div>
                                <label>Pickup Location</label>
                                <select
                                    id="pickupLocation"
                                    value={pickupLocation}
                                    onChange={(e) => setPickupLocation(e.target.value)}
                                    required
                                >
                                    <option value="">Select pickup location</option>
                                    {mgbLocations.map(location => (
                                        <option key={`pickup-${location}`} value={location}>
                                            {location}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label>Destination</label>
                                <select
                                    id="destinationLocation"
                                    value={dropOffLocation}
                                    onChange={(e) => setDropOffLocation(e.target.value)}
                                    required
                                >
                                    <option value="">Select destination</option>
                                    {mgbLocations.map(location => (
                                        <option key={`dest-${location}`} value={location}>
                                            {location}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label>Scheduled Pickup Date</label>
                                <input
                                    type="date"
                                    id="scheduledDate"
                                    value={pickupDate}
                                    onChange={(e) => setPickupDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Scheduled Pickup Time</label>
                                <input
                                    type="datetime-local"
                                    id="scheduledTime"
                                    value={pickupTime}
                                    onChange={(e) => setPickupTime(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label> Status</label>
                                <select
                                    id="status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as transportRequest['status'])}
                                    required>
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                        </div>

                        <div>
                            <h3><b>Requester Information</b></h3>
                            <div>
                                <label>Requester ID</label>
                                <input
                                    type="number"
                                    id="requesterId"
                                    value={requesterId}
                                    onChange={(e) => setRequesterId(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Request Date</label>
                                <input
                                    type="date"
                                    id="requestDate"
                                    value={requestDate}
                                    onChange={(e) => setRequestDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Employee assigned ID</label>
                                <input
                                    type="number"
                                    id="assignedToId"
                                    value={assignedToId}
                                    onChange={(e) => setAssignedToId(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <h3>Medical Information</h3>

                            <div>
                                <label>Medical Notes/Special Instructions</label>
                                <textarea
                                    id="medicalNotes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    placeholder="Notes for the transport"
                                ></textarea>
                            </div>
                        </div>

                        {/* submit button and confirmation message */}
                        <div className="flex items-center space-x-4">
                            <MGBButton onClick={()=>handleSubmit} variant={'primary'} disabled={false}>
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
                        </div>

                        <br/>
                        <MGBButton onClick={()=>handleReset()} variant={'primary'} disabled={false}>Clear Form</MGBButton>
                    </form>
                </div>
            </div>
            <div className="w-1/2 pl-4">
            </div>
        </div>
    )
};

export default TransportRequestPage;
