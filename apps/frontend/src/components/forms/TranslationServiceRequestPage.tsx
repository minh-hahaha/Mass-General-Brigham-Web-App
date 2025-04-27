import InputElement from '@/elements/InputElement.tsx';
import MGBButton from '@/elements/MGBButton.tsx';
import {useEffect, useState} from 'react';
import SelectElement from '@/elements/SelectElement.tsx';
import { SubmitTranslatorRequest, outgoingTranslationRequest } from '@/database/forms/translationRequest.ts';
import {
    meetingType,
    meetingTypeArray, mgbHospitals,
    mgbHospitalType,
    priorityArray,
    priorityType
} from "@/database/forms/formTypes.ts";
import {DirectoryRequestByBuilding, getDirectory} from "@/database/gettingDirectory.ts";

const TranslationServiceRequestPage = () => {
    const [employeeName, setEmployeeName] = useState('');
    const [employeeId, setEmployeeId] = useState<number>(0);
    const [patientName, setPatientName] = useState('');
    const [patientLanguage, setPatientLanguage] = useState('');
    const [priority, setPriority] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState(new Date().toISOString());
    const [duration, setDuration] = useState(0);
    const [typeMeeting, setTypeMeeting] = useState('');
    const [meetingLink, setMeetingLink] = useState('');
    const [status, setStatus] = useState('');
    const [notes, setNotes] = useState('');
    const [department, setDepartment] = useState('');
    const [comment, setComment] = useState('');

    const [showConfirmation, setShowConfirmation] = useState(false);

    const [directoryList, setDirectoryList] = useState<string[]>([""]);
    const [directory, setDirectory] = useState<string>("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const requestDate = "";
        const requestTime = "";


        //TODO: add LOCATION
        const newRequest: outgoingTranslationRequest = {
            employeeName: employeeName,
            employeeId: employeeId,
            priority: priority as priorityType,
            location: location as mgbHospitalType,
            language: patientLanguage,
            patientName: patientName,
            duration: duration,
            typeMeeting: typeMeeting as meetingType,
            date: date,
            meetingLink: meetingLink,
            notes: notes,
            department: department,
            comments: comment,
            requestDate: requestDate,
            requestTime: requestTime

        };

        SubmitTranslatorRequest(newRequest);
        setShowConfirmation(true);
        handleReset();
    };


    useEffect(() => {
        const fetchDirectoryList = async () => {
            try {
                const data = await getDirectory(mgbHospitals.indexOf(location) + 1);
                const names = data.map((item: DirectoryRequestByBuilding) => item.deptName);
                setDirectoryList(names);
            } catch (error) {
                console.error('Error fetching building names:', error);
            }
        };
        fetchDirectoryList();
        console.log('Updated Directory list');
    }, [location, directory]);


    useEffect(() => {
        if (showConfirmation) {
            alert("Request Submitted");
            handleConfirmationClose(); // close the state after the alert
        }
    }, [showConfirmation]);

    const handleReset = () => {
        setEmployeeName('');
        setEmployeeId(0);
        setPatientName('');
        setPatientLanguage('');
        setPriority('');
        setLocation('');
        setDate(new Date().toISOString().split('T')[0]);
        setDuration(0);
        setTypeMeeting('');
        setMeetingLink('');
        setStatus('');
        setNotes('');
        setDepartment('');
    };

    const handleConfirmationClose = () => {
        setShowConfirmation(false);
    };

    return (
        // flex row container
        <div className="flex flex-col justify-center items-center min-h-screen">
            {/* make the form left side */}
            <div className="flex flex-col items-center rounded-2xl p-8 w-full max-w-[700px] mt-10 mb-10">
                <h1 className="text-[30px] font-bold mb-6">Translation Service Request </h1>
                <p> Krish Patel and Jake Lariviere </p>
                <div>
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div>
                            <h3 className="text-xl font-semibold mb-4">
                                <b>Patient Information</b>
                            </h3>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <InputElement
                                        id="patientName"
                                        name="patientName"
                                        label="Patient Name: "
                                        placeholder="Please enter the patient name"
                                        required={true}
                                        type="text"
                                        value={patientName}
                                        onChange={(e) => setPatientName(e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <InputElement
                                        id="language"
                                        name="language"
                                        label="Patient Language: "
                                        placeholder="Please enter the language "
                                        required={true}
                                        type="text"
                                        value={patientLanguage}
                                        onChange={(e) => setPatientLanguage(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-4">
                                <b>Translator Information</b>
                            </h3>
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col pt-2">
                                    <div className="flex items-center gap-2">
                                        <label className="w-1/4">Priority</label>
                                        <select
                                            id="priority"
                                            value={priority}
                                            onChange={(e) => setPriority(e.target.value)}
                                            required
                                            className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        >
                                            <option value="">Select Priority</option>
                                            {priorityArray.map(
                                                (priority) => (
                                                    <option
                                                        key={`pri-${priority}`}
                                                        value={priority}
                                                    >
                                                        {priority}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <InputElement
                                        id="date"
                                        name="date"
                                        label="Date and Time of Appointment: "
                                        placeholder="Please choose the date and time of Appointment: "
                                        required={true}
                                        type="datetime-local"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <InputElement
                                        id="duration"
                                        name="duration"
                                        label="Duration: (Number of hour) "
                                        placeholder="Please enter the duration of the Appointment: "
                                        required={true}
                                        type="number"
                                        value={duration}
                                        onChange={(e) => setDuration(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-4">
                                <b>Meeting Information</b>
                            </h3>
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col pt-2">
                                    <div className="flex items-center gap-2">
                                        <label className="w-1/4">Meeting Type</label>
                                        <select
                                            id="typeMeeting"
                                            value={typeMeeting}
                                            onChange={(e) => setTypeMeeting(e.target.value)}
                                            required
                                            className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        >
                                            <option value="">Select Type Meeting</option>
                                            {meetingTypeArray.map(
                                                (type) => (
                                                    <option
                                                        key={`type-${type}`}
                                                        value={type}
                                                    >
                                                        {type}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div
                                    className="flex items-center gap-2"
                                    hidden={typeMeeting !== 'Remote (Online)'}
                                >
                                    <InputElement
                                        id="meetingLink"
                                        name="meetingLink"
                                        label="Meeting Link (If Remote): "
                                        placeholder="Please enter the Meeting Link (if Online): "
                                        required={false}
                                        type="text"
                                        value={meetingLink}
                                        onChange={(e) => setMeetingLink(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col pt-2">
                                    <div className="flex items-center gap-2">
                                        <label className="w-1/4">Location</label>
                                        <select
                                            id="location"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            required
                                            className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        >
                                            <option value="">Select Location</option>
                                            {['Chestnut Hill', '20 Patriot Place', '22 Patriot Place'].map(
                                                (location) => (
                                                    <option
                                                        key={`location-${location}`}
                                                        value={location}
                                                    >
                                                        {location}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <InputElement
                                        id="department"
                                        name="department"
                                        label="Department: "
                                        placeholder="Please enter the department"
                                        required={true}
                                        type="text"
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                    />
                                </div>
                                <h3 className="text-xl font-semibold mb-4 mt-3">
                                    <b>Additional Information</b>
                                </h3>
                                <div className="flex items-center gap-2">
                                    <label className="w-1/4" htmlFor={'notes'}>
                                        Additional Notes
                                    </label>
                                    <textarea
                                        id="notes"
                                        placeholder="Additional Notes"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        cols={3}
                                        className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    />
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

export default TranslationServiceRequestPage;
