import {useEffect, useState} from 'react';
import MGBButton from '../../elements/MGBButton.tsx';
import FormFieldElement from '../../elements/FormFieldElement.tsx';
import InputElement from "@/elements/InputElement.tsx";
import {DirectoryRequestByBuilding, getDirectory} from '@/database/gettingDirectory.ts';
import {
    formatDateForEdit,
    hazardLevelArray,
    hazardLevelType,
    mgbHospitals,
    priorityType,
    reqSanitationArray
} from '@/database/forms/formTypes.ts'
import SelectFormElement from "@/elements/SelectFormElement.tsx";
import {employeeNameId, getEmployeeNameIds} from "@/database/getEmployee.ts";
import {editTranslatorRequest} from "@/database/translationRequest.ts";
import {RequestPageProps} from "@/routes/ServiceRequestDisplayPage.tsx";
import {
    EditSanitationRequest,
    editSanitationRequest,
    sanitationRequest,
    SubmitSanitationRequest
} from "@/database/forms/sanitationRequest.ts";
import HelpButton from "@/components/ServiceRequestHelp.tsx";

// Component definition
const SanitationRequestPage = ({editData}: RequestPageProps) => {

    //Service request fields
    const [priority, setPriority] = useState<priorityType>('Low');
    const [requestTime, setRequest_time] = useState('');

    //Optional fields
    const [locationId, setLocation_id] = useState('');
    const [comments, setComments] = useState('');
    const [requestDate, setRequest_date] = useState(new Date().toISOString());
    const [employeeId, setEmployeeId] = useState(0);

    //Sanitation fields
    const [sanitationType, setSanitationType] = useState('');
    const [hazardLevel, setHazardLevel] = useState<sanitationRequest['hazardLevel']>('Low');
    const [completeBy, setCompleteBy] = useState('');
    const [sanitationLocationId, setSanitation_location_id] = useState('');
    const [sanitationDepartmentId, setSanitation_department_id] = useState('');
    const [sanitationRoomNumber, setSanitation_roomNumber ] = useState(0);
    const [employeeName, setEmployee_name]=useState('');

    //until we get locations working as a singular dropdown
    const[requesterDepartmentId, setRequester_department] = useState('');
    const[requesterRoomNumber, setRequester_roomnum] = useState('');

    const [directoryList, setDirectoryList] = useState<string[]>([""]);
    const [directory, setDirectory] = useState<string>("");

    const [submittedRequest, setSubmittedRequest] = useState<sanitationRequest | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);


    const [employeeList, setEmployeeList] = useState<employeeNameId[]>([]);


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

        if(editData){
            const editRequest: editSanitationRequest = {
                sanitationRequest: newRequest,
                requestId: editData.requestId
            }
            EditSanitationRequest(editRequest);
        }else {
            SubmitSanitationRequest(newRequest);
        }
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
                const data = await getDirectory(mgbHospitals.indexOf(locationId) + 1);
                const names = data.map((item: DirectoryRequestByBuilding) => item.deptName);
                setDirectoryList(names);
            } catch (error) {
                console.error('Error fetching building names:', error);
            }
        };
        fetchDirectoryList();
        console.log('Updated Directory list');
    }, [locationId, directory]);


    useEffect(() => {
        const fetchEmployeeList = async () => {
            try {
                const data = await getEmployeeNameIds();
                setEmployeeList(data); // list of employee names
            } catch (e) {
                console.error('Error fetching employee list:', e);
            }
        }
        fetchEmployeeList();
        console.log(employeeList);
    }, [])


    const handleReset = () => {
        setPriority('Low');//done
        setRequest_time('');//done
        setLocation_id('');//done
        setComments('');//done
        setEmployeeId(0);//done
        setSanitationType('');//done
        setHazardLevel('Low');//done
        setCompleteBy(new Date().toISOString());//
        setSanitation_location_id ('');
        setSanitation_department_id('');
        setSanitation_roomNumber(0);
        setEmployee_name('');
        setRequester_department('');
        setRequester_roomnum('');
    };

    useEffect(() => {
        if(editData){
            setPriority(editData.priority);
            setRequest_time('');
            setLocation_id(editData.locationId ? editData.locationId.toString() : '');
            setComments(editData.comments);
            setSanitationType(editData.sanitation.sanitationType);
            setHazardLevel(editData.sanitation.hazardLevel as hazardLevelType);
            setCompleteBy(formatDateForEdit(editData.sanitation.completeBy));
            setSanitation_location_id(editData.sanitation.sanitationLocationId ? editData.sanitation.sanitationLocationId.toString() : '');
            setSanitation_roomNumber(editData.sanitation.sanitationRoomNumber ? editData.sanitation.sanitationRoomNumber : 0);
            setEmployee_name(editData.locationId ? editData.locationId.toString() : '');
            setRequester_department(editData.sanitation.sanitationDepartmentId ? editData.sanitation.sanitationDepartmentId.toString() : '');
            setRequester_roomnum('');
            setDirectory(editData.sanitation.sanitationDepartmentId ? editData.sanitation.sanitationDepartmentId.toString() : '');
        }
    }, []);

    // //Data is sent to the backend
    // async function DisplayTransportRequest(request: transportRequest) {
    //     await axios.post(ROUTES.PATIENTTRANSPORT, request);
    // }

    const handleConfirmationClose = () => {
        setShowConfirmation(false);
    };


    return (
        <div className="flex justify-center items-start pt-16 pb-16 min-h-screen bg-[#f5faff] px-4">
            <div className="bg-white border border-[#d0ebff] rounded-2xl shadow-lg px-10 py-10 w-full max-w-[500px]">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-mgbblue">Sanitation Request</h1>
                    <HelpButton />
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <FormFieldElement
                        label="Employee"
                        id="employee"
                        type="select"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(Number(e.target.value))}
                        options={["", ...employeeList.map((emp) => emp.employeeId.toString())]}
                        placeholder="Select Employee"
                    />
                    <FormFieldElement
                        label="Location"
                        id="location"
                        type="select"
                        value={locationId}
                        onChange={(e) => setLocation_id(e.target.value)}
                        required
                        options={mgbHospitals}
                        placeholder="Select a Location"
                    />
                    <FormFieldElement
                        label="Department"
                        id="department"
                        type="select"
                        value={directory}
                        onChange={(e) => setDirectory(e.target.value)}
                        required
                        options={directoryList}
                        placeholder="Select a Department"
                    />
                    <FormFieldElement
                        label="Room Number"
                        id="roomNumber"
                        type="number"
                        value={requesterRoomNumber}
                        onChange={(e) => setRequester_roomnum(e.target.value)}
                        required
                    />
                    <FormFieldElement
                        label="Priority"
                        id="priority"
                        type="select"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as priorityType)}
                        required
                        options={["Low", "Medium", "High", "Emergency"]}
                        placeholder="Select Priority"
                    />
                    <FormFieldElement
                        label="Complete By"
                        id="completeBy"
                        type="datetime-local"
                        value={completeBy}
                        onChange={(e) => setCompleteBy(e.target.value)}
                        required
                    />
                    <FormFieldElement
                        label="Hazard Level"
                        id="hazardLevel"
                        type="select"
                        value={hazardLevel}
                        onChange={(e) => setHazardLevel(e.target.value as hazardLevelType)}
                        required
                        options={hazardLevelArray}
                        placeholder="Select a Hazard Level"
                    />
                    <FormFieldElement
                        label="Sanitation Type"
                        id="sanitationType"
                        type="select"
                        value={sanitationType}
                        onChange={(e) => setSanitationType(e.target.value)}
                        required
                        options={reqSanitationArray}
                        placeholder="Select a Sanitation Type"
                    />
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Additional Comments</label>
                        <textarea
                            id="comments"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            rows={3}
                            placeholder="Additional Notes:"
                            className="px-4 py-2 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                    </div>

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
    );
};

export default SanitationRequestPage;
