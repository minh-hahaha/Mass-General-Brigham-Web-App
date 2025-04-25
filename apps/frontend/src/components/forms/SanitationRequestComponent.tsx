import {useEffect, useState} from 'react';
import MGBButton from '../../elements/MGBButton.tsx';
import axios from 'axios';
import { ROUTES } from 'common/src/constants.ts';
import ConfirmMesg from '../ConfirmMessageComponent.tsx'; // Import the new component
import { SubmitSanitationRequest, sanitationRequest } from '../../database/forms/sanitationRequest.ts';
import InputElement from "@/elements/InputElement.tsx";
import SelectElement from '@/elements/SelectElement.tsx';
import {DirectoryRequestByBuilding, getDirectory} from '@/database/gettingDirectory.ts';

// Component definition
const SanitationRequestPage = () => {
    const loggedIn = sessionStorage.getItem('loggedIn');
    if (!loggedIn) {window.location.href = '/';}

    //Service request fields
    const [priority, setPriority] = useState<sanitationRequest['priority']>('Low');
    const [requestTime, setRequest_time] = useState('');

    //Optional fields
    const [locationId, setLocation_id] = useState('');
    const [comments, setComments] = useState('');
    const [requestDate, setRequest_date] = useState(new Date().toISOString());
    const [employeeId, setEmployee_id] = useState(0);

    //Sanitation fields
    const [sanitationType, setSanitationType] = useState('');
    const [hazardLevel, setHazardLevel] = useState<sanitationRequest['hazardLevel']>('Low');
    const [completeBy, setCompleteBy] = useState('');
    const [sanitationLocationId, setSanitation_location_id] = useState('');
    const [sanitationDepartmentId, setSanitation_department_id] = useState('');
    const [sanitationRoomNumber, setSanitation_roomNumber ] = useState(0);
    const [employeeName, setEmployee_name]=useState('');

    //until we get locations working as a singular dropdown
    const [requesterDepartmentId, setRequester_department] = useState('');
    const[requesterRoomNumber, setRequester_roomnum] = useState('');

    const [directoryList, setDirectoryList] = useState<string[]>([""]);
    const [directory, setDirectory] = useState<string>("");

    const [submittedRequest, setSubmittedRequest] = useState<sanitationRequest | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newRequest: sanitationRequest = {
            priority,
            requestTime,
            locationId,
            comments,
            requestDate,
            employeeId,
            sanitationType,
            hazardLevel,
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

    useEffect(() => {
        if (showConfirmation) {
            alert("Request Submitted");
            handleConfirmationClose(); // close the state after the alert
        }
    }, [showConfirmation]);

    useEffect(() => {
        const fetchDirectoryList = async () => {
            try {
                const data = await getDirectory(mgbLocations.indexOf(locationId));
                const names = data.map((item: DirectoryRequestByBuilding) => item.deptName);
                setDirectoryList(names);
            } catch (error) {
                console.error('Error fetching building names:', error);
            }
        };
        fetchDirectoryList();
        console.log('Updated Directory list');
    }, [locationId, directory]);

    const handleReset = () => {
        setPriority('Low');//done
        setRequest_time('');//done
        setLocation_id('');//done
        setComments('');//done
        setRequest_date(new Date().toISOString());//done
        setEmployee_id(0);//done
        setSanitationType('');//done
        setHazardLevel('Low');//done
        setCompleteBy(new Date().toISOString());//
        setSanitation_location_id('');
        setSanitation_department_id('');
        setSanitation_roomNumber(0);
        setEmployee_name('');
        setRequester_department('');
        setRequester_roomnum('');
    };

    const handleConfirmationClose = () => {
        setShowConfirmation(false);
    };

    const mgbLocations = ['Chestnut Hill', '20 Patriot Place', '22 Patriot Place', 'Faulkner Hospital'];

    return (
        // flex row container
        <div className="flex flex-col justify-center items-center min-h-screen">
            <div className="flex flex-col items-center rounded-2xl p-8 w-full max-w-[700px] mt-10 mb-10">
                <h1 className="text-[30px] font-bold mb-6">Sanitation Request</h1>
                <p>Yael Whitson and Jack Morris</p>
                <div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-xl font-semibold mb-4">
                                <b>Request Location</b>
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

                            {/*Department Dropdown*/}
                            <div className="flex items-center gap-2">

                                <label className="w-1/4"> Department </label>
                                <SelectElement
                                    label="Department"
                                    id="departmentId"
                                    value={directory}
                                    onChange={(e) => setDirectory(e.target.value)}
                                    required
                                    options={directoryList}
                                    placeholder="Select a Department"
                                    // className="py-3 px-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                                <div className="flex items-center gap-2">
                                    <label className="w-1/4">Priority</label>
                                    <select
                                        id="priority"
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value as sanitationRequest['priority'])}
                                        required
                                        className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    >

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
                                        <option value="Low">Low</option>
                                        <option value="Moderate">Moderate</option>
                                        <option value="High">High</option>
                                        <option value="Extreme">Extremee</option>
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

                                {/*<div className="flex flex-col items-center gap-4">*/}
                                {/*    <div className="flex gap-6">*/}
                                {/*        <label className="flex items-center gap-2">*/}
                                {/*            <input type="checkbox" id="recurring" onChange={(e) => setRecurring(e.target.checked)} />*/}
                                {/*            <span>Recurring</span>*/}
                                {/*        </label>*/}
                                {/*        <label className="flex items-center gap-2">*/}
                                {/*            <input type="checkbox" id="disposalRequired" onChange={(e) => setDisposalRequired(e.target.checked)} />*/}
                                {/*            <span>Disposal Required</span>*/}
                                {/*        </label>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
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
