import { useState } from 'react';
import MGBButton from '../elements/MGBButton.tsx';
import axios from 'axios';
import { ROUTES } from 'common/src/constants.ts';
import ConfirmMesg from '../components/ConfirmMessageComponent.tsx'; // Import the new component
import { SubmitSanitationRequest, sanitationRequest } from '../database/sanitationRequest.ts';
import InputElement from "@/elements/InputElement.tsx";

// Component definition
const SanitationRequestPage = () => {
    const loggedIn = sessionStorage.getItem('loggedIn');
    if (!loggedIn) {window.location.href = '/';}

    //Service request fields
    const [status, setStatus] = useState<sanitationRequest ['status']>('Pending');
    const [priority, setPriority] = useState<sanitationRequest['priority']>('Low');
    const [requestTime, setRequest_time] = useState('');

    //Optional fields
    const [locationId, setLocation_id] = useState('');
    const [comments, setComments] = useState('');
    const [requestDate, setRequest_date] = useState(new Date().toISOString());
    const [employeeId, setEmployee_id] = useState(0);

    //Sanitation fields
    const [sanitationType, setSanitationType] = useState('');
    const [recurring, setRecurring] = useState(false);
    const [hazardLevel, setHazardLevel] = useState<sanitationRequest['hazardLevel']>('None');
    const [disposalRequired, setDisposalRequired] = useState(false);
    const [completeBy, setCompleteBy] = useState('');
    const [sanitationLocationId, setSanitation_location_id] = useState('');
    const [sanitationDepartmentId, setSanitation_department_id] = useState('');
    const [sanitationRoomNumber, setSanitation_roomNumber ] = useState(0);
    const [employeeName, setEmployee_name]=useState('');

    //until we get locations working as a singular dropdown
    const [requesterDepartmentId, setRequester_department] = useState('');
    const[requesterRoomNumber, setRequester_roomnum] = useState('');

    const [submittedRequest, setSubmittedRequest] = useState<sanitationRequest | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newRequest: sanitationRequest = {
            status,
            priority,
            requestTime,
            locationId,
            comments,
            requestDate,
            employeeId,
            sanitationType,
            recurring,
            hazardLevel,
            disposalRequired,
            completeBy,
            sanitationLocationId,
            sanitationDepartmentId,
            sanitationRoomNumber,
            employeeName,
            requesterDepartmentId,
            requesterRoomNumber,
        } //for Jack: I stopped here. There seems to be something off with the type declarations here

        SubmitSanitationRequest(newRequest);
        setSubmittedRequest(newRequest);
        setShowConfirmation(true);

        // handleReset();
    };

    const handleReset = () => {
        setStatus('Pending');//done
        setPriority('Low');//done
        setRequest_time('');//done
        setLocation_id('');//done
        setComments('');//done
        setRequest_date(new Date().toISOString());//done
        setEmployee_id(0);//done
        setSanitationType('');//done
        setRecurring(false);
        setHazardLevel('None');//done
        setDisposalRequired(false);
        setCompleteBy(new Date().toISOString());//
        setSanitation_location_id('');
        setSanitation_department_id('');
        setSanitation_roomNumber(0);
        setEmployee_name('');
        setRequester_department('');
        setRequester_roomnum('');
    };

    // //Data is sent to the backend
    // async function DisplayTransportRequest(request: transportRequest) {
    //     await axios.post(ROUTES.PATIENTTRANSPORT, request);
    // }

    const handleConfirmationClose = () => {
        setShowConfirmation(false);
    };

    const mgbLocations = ['Chestnut Hill', '20 Patriot Place', '22 Patriot Place, Faulkner Hospital'];

    return (
        // flex row container
        <div className="flex flex-col justify-center items-center min-h-screen">
            <div className="flex flex-col items-center rounded-2xl p-8 w-full max-w-[700px] mt-10 mb-10">
                <h1 className="text-[30px] font-bold mb-6">Sanitation Request</h1>
                <p>Yael Whitson and Jack Morris</p>
                <div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-4 ">
                                <b>Requester Information</b>
                            </h3>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <InputElement
                                        label="Requester Name"
                                        type="text"
                                        id="employee_name"
                                        placeholder="Enter your name"
                                        value={employeeName}
                                        onChange={(e) => setEmployee_name(e.target.value)}
                                        required={true}
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <InputElement
                                        label="Requester ID"
                                        type="number"
                                        id="employee_id"
                                        placeholder="Enter Employee ID"
                                        value={employeeId}
                                        onChange={(e) => setEmployee_id(Number(e.target.value))}
                                        required={true}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h3 className="text-xl font-semibold mb-4">
                                <b>Requester Location</b>
                            </h3>
                            <div className="flex items-center gap-2">
                                <label className="w-1/4">Location</label>
                                <select
                                    id="pickupLocation"
                                    value={locationId}
                                    onChange={(e) => setLocation_id(e.target.value)}
                                    required
                                    className="w-70 px-3 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                >
                                    <option value="">Select Location</option>
                                    {mgbLocations.map((location) => (
                                        <option key={`pickup-${location}`} value={location}>
                                            {location}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <InputElement
                                    label="Department"
                                    type="text"
                                    id="departmentId"
                                    placeholder="Enter Department name"
                                    value={requesterDepartmentId}
                                    onChange={(e) => setRequester_department(e.target.value)}
                                    required={true}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <InputElement
                                    label="Room Number"
                                    type="number"
                                    id="roomNumber"
                                    placeholder="Enter room number"
                                    value={requesterRoomNumber}
                                    onChange={(e) => setRequester_roomnum(e.target.value)}
                                    required={true}
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-4">
                                <b>Sanitation Details</b>
                            </h3>
                            <div className="flex flex-col gap-2">

                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <label className="w-1/4">Status</label>
                                        <select
                                            id="status"
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value as sanitationRequest['status'])}
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

                                <div className="flex items-center gap-2">
                                    <label className="w-1/4">Priority</label>
                                    <select
                                        id="priority"
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value as sanitationRequest['priority'])}
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

                                <div className="flex items-center gap-2">
                                    <InputElement
                                        label="Complete By"
                                        type="datetime-local"
                                        id="completeBy"
                                        value={completeBy}
                                        onChange={(e) => setCompleteBy(e.target.value)}
                                        required={true}
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <label className="w-1/4">Hazard Level</label>
                                    <select
                                        id="hazardLevel"
                                        value={hazardLevel}
                                        onChange={(e) => setHazardLevel(e.target.value as sanitationRequest['hazardLevel'])}
                                        required
                                        className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    >
                                        <option value="None">None</option>
                                        <option value="Sharp">Sharp</option>
                                        <option value="Biohazard">Biohazard</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <InputElement
                                        label="Sanitation Type"
                                        type="text"
                                        id="sanitationType"
                                        value={sanitationType}
                                        onChange={(e) => setSanitationType(e.target.value)}
                                        required={true}
                                    />
                                </div>

                                <div className="flex flex-col items-center gap-4">
                                    <div className="flex gap-6">
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" id="recurring" onChange={(e) => setRecurring(e.target.checked)} />
                                            <span>Recurring</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" id="disposalRequired" onChange={(e) => setDisposalRequired(e.target.checked)} />
                                            <span>Disposal Required</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-4">
                                <b>Additional Information</b>
                            </h3>
                            <div className="flex items-center gap-2">
                                <label className="w-1/4" htmlFor="comments">
                                    Additional Instructions
                                </label>
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
        </div>
    );
};

export default SanitationRequestPage;
