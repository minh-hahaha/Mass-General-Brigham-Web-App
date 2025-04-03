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
    requesterName: string;
    requesterId: string;
    requestDate: string;
    assignedTo: string;
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
    const [pickupDate, setPickupDate] = useState(new Date());
    const [pickupTime, setPickupTime] = useState('');
    const [status, setStatus] = useState<transportRequest['status']> ('Pending');
    const [notes, setNotes] = useState('');
    const [requesterName, setRequesterName] = useState('');
    const [requesterId, setRequesterId] = useState('');

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
            pickupDate: new Date().toISOString(),
            pickupTime,
            status,
            notes,
            requesterName,
            requesterId,
            requestDate: new Date().toISOString().split('T')[0]
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
            <h2>External Patient Transportation Request</h2>

            <div className="transport-request-container">
                <form onSubmit={handleSubmit} className="transport-request-form">
                    <div className="form-section">
                        <h3>Patient Information</h3>

                        <div className="form-group">
                            <label htmlFor="patientId">Patient ID (MRN)</label>
                            <input
                                type="text"
                                id="patientId"
                                value={patientId}
                                onChange={(e) => setPatientId(e.target.value)}
                                required
                                placeholder="Enter patient MRN"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="patientName">Patient Name</label>
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

                    <div className="form-section">
                        <h3>Transport Details</h3>

                        <div className="form-group">
                            <label htmlFor="transportType">Transport Type</label>
                            <select
                                id="transportType"
                                value={transportType}
                                onChange={(e) => setTransportType(e.target.value as transportRequest['transportType'])}
                                required
                            >
                                <option value="Ambulance">Ambulance</option>
                                <option value="Helicopter">Helicopter</option>
                                <option value="Medical Van">Medical Van</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="priority">Priority</label>
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

                        <div className="form-group">
                            <label htmlFor="pickupLocation">Pickup Location</label>
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

                        <div className="form-group">
                            <label htmlFor="destinationLocation">Destination</label>
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

                        <div className="form-group">
                            <label htmlFor="scheduledTime">Scheduled Pickup Time</label>
                            <input
                                type="datetime-local"
                                id="scheduledTime"
                                value={pickupTime}
                                onChange={(e) => setPickupTime(e.target.value)}
                                required
                            />
                        </div>

                    </div>

                    <div className="form-section">
                        <h3>Requester Information</h3>

                        <div className="form-group">
                            <label htmlFor="requesterName">Requester Name</label>
                            <input
                                type="text"
                                id="requesterName"
                                value={requesterName}
                                onChange={(e) => setRequesterName(e.target.value)}
                                required
                            />
                        </div>


                        <div className="form-group">
                            <label htmlFor="requesterId">Requester ID</label>
                            <input
                                type="number"
                                id="requesterId"
                                value={requesterId}
                                onChange={(e) => setRequesterId(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Medical Information</h3>

                        <div className="form-group">
                            <label htmlFor="medicalNotes">Medical Notes/Special Instructions</label>
                            <textarea
                                id="medicalNotes"
                                value={notes}
                                onChange={(e) => setNotes   (e.target.value)}
                                rows={4}
                                placeholder="Include relevant medical information for the transport team"
                            ></textarea>
                        </div>
                    </div>

                    <button type="submit" className="submit-button">
                        Submit Transport Request
                    </button>
                </form>

                {submittedRequest && (
                    <div className="submitted-request">
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
                            <p><strong>Requested By:</strong> {submittedRequest.requesterName}</p>
                            <p><strong>ID:</strong> {submittedRequest.requesterId}</p>

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
