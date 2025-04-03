import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ROUTES } from 'common/src/constants.ts';

interface transportRequest {
    id: number;
    patientId: string;
    patientName: string;
    transportType: 'Ambulance' | 'Helicopter' | 'Other';
    priority: 'Low' | 'Medium' | 'High';
    pickupLocation: string;
    dropOffLocation: string;
    pickupDate: string;
    pickupTime: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
    notes: string;
    requesterId: string;
    requestDate: string;
    assignedToId: string;
}

// Component definition
const TransportRequestPage = () => {
    const [patientId, setPatientId] = useState('');
    const [patientName, setPatientName] = useState('');
    const [transportType, setTransportType] = useState<transportRequest['transportType']> ('Ambulance');
    const [priority, setPriority] = useState<transportRequest['priority']> ('Low');
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropOffLocation, setDropOffLocation] = useState('');
    const [pickupDate, setPickupDate] = useState(new Date().toISOString().split('T')[0]);
    const [pickupTime, setPickupTime] = useState('');
    const [status, setStatus] = useState<transportRequest['status']> ('Pending');
    const [notes, setNotes] = useState('');
    const [requesterId, setRequesterId] = useState('');
    const [requestDate, setRequestDate] = useState(new Date().toISOString().split('T')[0]);
    const [assignedToId, setAssignedToId] = useState('');

    const [submittedRequest, setSubmittedRequest] = useState<transportRequest | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newRequest: transportRequest = {
            id: Date.now(),
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
            assignedToId
        }
        setSubmittedRequest(newRequest);

        // clear out form here.....
        // .........
    }

    const mgbLocations = ["Chestnut Hill"]


    // // React useEffect hook — read more here: https://react.dev/reference/react/useEffect
    // // This will run on page load
    // useEffect(() => {
    //     fetchScore();
    // }, []);
    //
    // // Fetches the current score from the backend and updates the corresponding useStates
    // async function fetchScore() {
    //     try {
    //         // Send a GET request to the backend at API_ROUTES.SCORE
    //         const res = await axios.get(API_ROUTES.SCORE);
    //
    //         // HTTP 200 = OK (the request was successful)
    //         if (res.status === 200) {
    //             setLoading(false);
    //
    //             // res.data holds a JSON object with a property called score
    //             // This object is created in the backend route (score.ts)
    //             // It's a good idea to define the property keys in a common constants file
    //             // To avoid potential runtime errors due to typos or missing properties
    //             // You can then use bracket notation to access these properties dynamically
    //             // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors#bracket_notation
    //             setScore(res.data.score);
    //         }
    //         // HTTP 204 = No data (sent by the backend when the DB is empty)
    //         else if (res.status === 204) {
    //             // Set loading to false and use default value of score
    //             setLoading(false);
    //         }
    //     } catch (error) {
    //         console.log('Error fetching score, retrying:', error);
    //
    //         // Retry the request after a short delay
    //         // During development, if the frontend loads before the backend, the request will fail
    //         setTimeout(() => fetchScore(), 1500);
    //     }
    // }
    //
    // // Sends a post request to update the score
    // async function submitScore() {
    //     try {
    //         // Build data JSON
    //         const data = JSON.stringify({
    //             time: new Date(),
    //             score: score,
    //         });
    //
    //         const res = await axios.post(API_ROUTES.SCORE, data, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });
    //
    //         // This will output in your browser console
    //         if (res.status == 200) {
    //             console.log('Added score');
    //         }
    //     } catch (error) {
    //         console.log('Error submitting score:', error);
    //     }
    // }

    return (
        <div className="patient-transport-page">
            <h2> Patient Transportation Request</h2>

            <div className="transport-request-container">
                <form onSubmit={handleSubmit} className="transport-request-form">
                    <div className="form-section">
                        <h3>Patient Information</h3>

                        <div>
                            <label>Patient ID (MRN)</label>
                            <input
                                type="text"
                                id="patientId"
                                value={patientId}
                                onChange={(e) => setPatientId(e.target.value)}
                                required
                                placeholder="Enter patient MRN"
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
                                placeholder="Full patient name"
                            />
                        </div>
                    </div>

                    <div>
                        <h3>Transport Details</h3>

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
                        <h3>Requester Information</h3>


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

                    <div >
                        <h3>Medical Information</h3>

                        <div>
                            <label>Medical Notes/Special Instructions</label>
                            <textarea
                                id="medicalNotes"
                                value={notes}
                                onChange={(e) => setNotes   (e.target.value)}
                                rows={3}
                                placeholder="Notes for the transport"
                            ></textarea>
                        </div>
                    </div>

                    <button type="submit">
                        Submit Transport Request
                    </button>
                </form>

                {submittedRequest && (
                    <div>
                        <h3>Submitted Transport Request</h3>
                        <div className="transport-confirmation">
                            <p className="confirmation-id">Request ID: #{submittedRequest.id}</p>
                            <p className="confirmation-status">Status: {submittedRequest.status}</p>
                            <p className="confirmation-date">Date Submitted: {submittedRequest.requestDate}</p>
                        </div>

                        <div className="request-details">
                            <h4>Patient Details</h4>
                            <p><strong>Patient ID:</strong> {submittedRequest.patientId}</p>
                            <p><strong>Patient Name:</strong> {submittedRequest.patientName}</p>

                            <h4>Transport Details</h4>
                            <p><strong>Transport Type:</strong> {submittedRequest.transportType}</p>
                            <p><strong>Priority:</strong> {submittedRequest.priority}</p>
                            <p><strong>From:</strong> {submittedRequest.pickupLocation}</p>
                            <p><strong>To:</strong> {submittedRequest.dropOffLocation}</p>
                            <p><strong>Scheduled Time:</strong> {new Date(submittedRequest.pickupTime).toLocaleString()}</p>


                            <h4>Requester Information</h4>
                            <p><strong>Requester ID:</strong> {submittedRequest.requesterId}</p>
                            <p><strong>Request Date:</strong> {submittedRequest.requestDate}</p>
                            <p><strong>Employee Assigned ID:</strong> {submittedRequest.assignedToId}</p>

                            {submittedRequest.notes && (
                                <>
                                    <h4>Medical Notes</h4>
                                    <p>{submittedRequest.notes}</p>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
};

export default TransportRequestPage;
