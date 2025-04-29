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
    priorityType, translateLangugeArray
} from "@/database/forms/formTypes.ts";
import {DirectoryRequestByBuilding, getDirectory} from "@/database/gettingDirectory.ts";
import SelectFormElement from "@/elements/SelectFormElement.tsx";
import {employeeNameId, getEmployeeNameIds} from "@/database/getEmployee.ts";

const TranslationServiceRequestPage = () => {
    const [employeeName, setEmployeeName] = useState('');
    const [employeeId, setEmployeeId] = useState<number>(0);
    const [patientId, setPatientId] = useState<number>(0);
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
    const [employeeList, setEmployeeList] = useState<employeeNameId[]>([]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        const formattedDate = new Date(date).toISOString();

        //TODO: add LOCATION
        const newRequest: outgoingTranslationRequest = {
            patientId: patientId,
            employeeName: employeeName,
            employeeId: employeeId,
            priority: priority as priorityType,
            location: location as mgbHospitalType,
            language: patientLanguage,
            duration: duration,
            typeMeeting: typeMeeting as meetingType,
            meetingLink: meetingLink,
            notes: notes,
            department: department,
            comments: comment,
            date: formattedDate

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
        const fetchEmployeeList = async () => {
            try {
                const data = await getEmployeeNameIds();
                setEmployeeList(data); // list of employee names
            } catch (e) {
                console.error('Error fetching employee list:', e);
            }
        }
    })

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
        setDate('');
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
                                <b>Assign Employee</b>
                            </h3>
                            <div className="flex flex-col gap-2">
                                <div>
                                    <label className='w=1/4'>Employee: </label>
                                    <select
                                        onChange={(e) => {
                                            setEmployeeId(Number(e.target.value));
                                        }}
                                        value={employeeId}
                                        className='w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300'
                                    >
                                        <option value="" disabled>Select an employee</option>
                                        {employeeList.map((employee) => (
                                            <option key={employee.employeeId} value={employee.employeeId}>
                                                {employee.employeeName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4">
                                <b>Patient Information</b>
                            </h3>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <InputElement
                                        id="patientId"
                                        name="patientId"
                                        label="Patient Id: "
                                        placeholder="Please enter the patient id"
                                        required={true}
                                        type="number"
                                        value={patientId}
                                        onChange={(e) => setPatientId(Number(e.target.value as string))}
                                    />
                                </div>
                                <SelectFormElement
                                    label="Language"
                                    id="language"
                                    value= {patientLanguage}
                                    onChange={(e) => setPatientLanguage(e.target.value)}
                                    options={translateLangugeArray}
                                    placeholder="Select Language"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-4">
                                <b>Translator Information</b>
                            </h3>
                            <div className="flex flex-col gap-2">
                                <SelectFormElement
                                    label = 'Priority'
                                    id = 'priority'
                                    value = {priority}
                                    onChange = {(e) =>
                                        setPriority(e.target.value as priorityType)
                                    }
                                    required
                                    options = {priorityArray}
                                    placeholder = 'Select Priority'
                                />
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

                        <div>
                            <h3 className="text-xl font-semibold mb-4">
                                <b>Meeting Information</b>
                            </h3>
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col pt-2">
                                    <SelectFormElement
                                        label = 'Meeting Type'
                                        id = 'meetingType'
                                        value = {typeMeeting}
                                        onChange = {(e) =>
                                            setTypeMeeting(e.target.value as meetingType)
                                        }
                                        required
                                        options = {meetingTypeArray}
                                        placeholder = 'Select Meeting Type'
                                    />
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
                                    <div className="flex flex-col pt-2">
                                        <SelectFormElement
                                            label = 'Hospital'
                                            id = 'location'
                                            value = {location}
                                            onChange = {(e) =>
                                                setLocation(e.target.value as mgbHospitalType)
                                            }
                                            required
                                            options = {mgbHospitals}
                                            placeholder = 'Select Hospital'
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col pt-2">
                                    {/*Department Dropdown*/}

                                        <SelectFormElement
                                            label = 'Department'
                                            id = 'department'
                                            value = {department}
                                            onChange = {(e) =>
                                                setDepartment(e.target.value)
                                            }
                                            required
                                            options = {directoryList}
                                            placeholder = 'Select Department'
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
