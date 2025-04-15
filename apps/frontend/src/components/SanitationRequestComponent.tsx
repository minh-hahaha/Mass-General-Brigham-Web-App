import { useState } from 'react';
import MGBButton from '../components/MGBButton.tsx';
import axios from 'axios';
import { ROUTES } from 'common/src/constants';
import ConfirmMesg from '../components/ConfirmMesg.tsx'; // Import the new component
import { SubmitSanitationRequest, sanitationRequest } from '../database/sanitationRequest.ts';

// Component definition
const SanitationRequestPage = () => {
    const loggedIn = sessionStorage.getItem('loggedIn');
    if (!loggedIn) {window.location.href = '/';}

    //Service request fields
    const [status, setStatus] = useState<sanitationRequest ['status']>('Unassigned');
    const [priority, setPriority] = useState<sanitationRequest['priority']>('Unassigned');
    const [request_time, setRequest_time] = useState('');

    //Optional fields
    const [location_id, setLocation_id] = useState('');
    const [comments, setComments] = useState('');
    const [request_date, setRequest_date] = useState(new Date().toISOString().split('T')[0]);
    const [employee_id, setEmployee_id] = useState(0);

    //Sanitation fields
    const [sanitationType, setSanitationType] = useState('');
    const [recurring, setRecurring] = useState(false);
    const [hazardLevel, setHazardLevel] = useState<sanitationRequest['hazardLevel']>('None');
    const [disposalRequired, setDisposalRequired] = useState(false);
    const [completeBy, setCompleteBy] = useState(new Date().toISOString().split('T')[0]);

    const [submittedRequest, setSubmittedRequest] = useState<sanitationRequest | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newRequest: sanitationRequest = {

            status,
            priority,
            request_time,
            location_id,
            comments,
            request_date,
            employee_id,
            sanitationType,
            recurring,
            hazardLevel,
            disposalRequired,
            completeBy,

        } //for Jack: I stopped here. There seems to be something off with the type declarations here

        SubmitSanitationRequest(newRequest);
        setSubmittedRequest(newRequest);
        setShowConfirmation(true);

        handleReset();
    };

    const handleReset = () => {
        setStatus('Unassigned');//done
        setPriority('Low');//done
        setRequest_time('');//done
        setLocation_id('');//done
        setComments('');//done
        setRequest_date(new Date().toISOString().split('T')[0]);//done
        setEmployee_id(0);//done
        setSanitationType('');//done
        setRecurring(false);
        setHazardLevel('None');//done
        setDisposalRequired(false);
        setCompleteBy('');//
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
                <h1 className="text-[30px] font-bold mb-6">Sanitation Request</h1>
                <div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-4">
                                <b>Request Information</b>
                            </h3>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <label className="w-1/4">Employee ID</label>
                                    <input
                                        type="number"
                                        id="employee_id"
                                        value={employee_id}
                                        onChange={(e) => setEmployee_id(Number(e.target.value))}
                                        required
                                        min="0"
                                        placeholder="Enter Employee ID"
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
                                    <label className="w-1/4">Status</label>
                                    <select
                                        id="status"
                                        value={status}
                                        onChange={(e) =>
                                            setStatus(
                                                e.target.value as sanitationRequest['status']
                                            )
                                        }
                                        required
                                        className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    >
                                        <option value="Unassigned">Unassigned</option>
                                        <option value="Assigned">Assigned</option>
                                        <option value="Working">Working</option>
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
                                                e.target.value as sanitationRequest['priority']
                                            )
                                        }
                                        required
                                        className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    >
                                        <option value="Unassigned">Unassigned</option>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Emergency">Emergency</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col pt-2">
                                <div className="flex items-center gap-2">
                                    <label className="w-1/4">Location</label>
                                    <select
                                        id="pickupLocation"
                                        value={location_id}
                                        onChange={(e) => setLocation_id(e.target.value)}
                                        required
                                        className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    >
                                        <option value="">Select Location For Sanitation</option>
                                        {mgbLocations.map((location) => (
                                            <option key={`pickup-${location}`} value={location}>
                                                {location}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/*<div className="flex flex-col pt-2">
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
                            </div>*/}

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

                            <div className="flex flex-col pt-2">
                                <div className="flex items-center gap-2">
                                    <label className="w-1/4">Complete By</label>
                                    <input
                                        type="datetime-local"
                                        id="completeBy"
                                        value={completeBy}
                                        onChange={(e) => setCompleteBy(e.target.value)}
                                        required
                                        className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col pt-2">
                                <div className="flex items-center gap-2">
                                    <label className="w-1/4"> Hazard Level</label>
                                    <select
                                        id="hazardLevel"
                                        value={hazardLevel}
                                        onChange={(e) =>
                                            setHazardLevel(e.target.value as sanitationRequest['hazardLevel'])
                                        }
                                        required
                                        className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    >
                                        <option value="None">None</option>
                                        <option value="Sharp">Sharp</option>
                                        <option value="Biohazard">Biohazard</option>

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
                                    <label className="w-1/4">Sanitation Type</label>
                                    <input
                                        type="text"
                                        id="sanitationType"
                                        value={sanitationType}
                                        onChange={(e) => setSanitationType(e.target.value)}
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
                                        value={request_date}
                                        onChange={(e) =>
                                            setRequest_date(e.target.value.toString().split('T')[0])
                                        }
                                        required
                                        className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    />
                                </div>
                            </div>
                            {/*<div className="flex flex-col pt-2">
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
                            </div>*/}
                        </div>
                        <div>
                            <label>
                                Recurring:
                                <input type="checkbox" id="recurring" checked={recurring} onChange={(e) => setRecurring(Boolean(e.target.value))} />
                                Disposal Required:
                                <input type="checkbox" id="disposalRequired" checked={disposalRequired} onChange={(e) => setDisposalRequired(Boolean(e.target.value))} />
                            </label>

                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-4">
                                <b>Medical Information</b>
                            </h3>

                            <div className="flex flex-col pt-2">
                                <div className="flex items-center gap-2">
                                    <label className="w-1/4">Special Instructions</label>
                                    <textarea
                                        id="comments"
                                        value={comments}
                                        onChange={(e) => setComments(e.target.value)}
                                        rows={3}
                                        placeholder="Comments for Sanitation"
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
                                        request={ submittedRequest }
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

export default SanitationRequestPage;
