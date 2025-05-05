import MGBButton from '@/elements/MGBButton.tsx';
import FormFieldElement from '@/elements/FormFieldElement.tsx';
import {useEffect, useState} from 'react';
import SelectElement from '@/elements/SelectElement.tsx';
import { SubmitTranslatorRequest, outgoingTranslationRequest } from '@/database/forms/translationRequest.ts';
import {
    formatDateForEdit,
    meetingType,
    meetingTypeArray, mgbHospitals,
    mgbHospitalType,
    priorityArray,
    priorityType, translateLangugeArray
} from "@/database/forms/formTypes.ts";
import {DirectoryRequestByBuilding, getDirectory} from "@/database/gettingDirectory.ts";
import SelectFormElement from "@/elements/SelectFormElement.tsx";
import {employeeNameId, getEmployeeNameIds} from "@/database/getEmployee.ts";
import {RequestPageProps} from "@/routes/ServiceRequestDisplayPage.tsx";
import {editMedicalDeviceRequest} from "@/database/forms/medicalDeviceRequest.ts";
import {EditTranslatorRequest, editTranslatorRequest} from "@/database/translationRequest.ts";
import HelpButton from '@/components/ServiceRequestHelp.tsx'; // adjust path if needed
import Confetti from 'react-confetti'

const TranslationServiceRequestPage = ({editData}: RequestPageProps) => {
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
        if(editData){
            const editRequest: editTranslatorRequest = {
                translatorRequest: newRequest,
                requestId: editData.requestId
            }
            EditTranslatorRequest(editRequest);
        }else{
            SubmitTranslatorRequest(newRequest);
        }
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
        fetchEmployeeList();
        console.log(employeeList);
    }, [])

    const handleReset = () => {
        setEmployeeName('');
        setEmployeeId(0);
        setPatientId(0);
        setPatientName('');
        setPatientLanguage('');
        setPriority('');
        setLocation('');
        setDate(new Date().toISOString());
        setDuration(0);
        setTypeMeeting('');
        setMeetingLink('');
        setStatus('');
        setNotes('');
        setDepartment('');
        setTimeout(() => {
            setShowConfirmation(false);
        }, 3000)
    };

    useEffect(() => {
        if(editData){
            const employee = employeeList.find(e => e.employeeId === editData.employeeId);
            setEmployeeName(employee ? employee.employeeName : "");
            setEmployeeId(editData.employeeId);
            setPatientId(editData.translationRequest.patientId);
            setPatientName(editData.translationRequest.patientName);
            setPatientLanguage(editData.translationRequest.language);
            setPriority(editData.priority);
            setLocation(editData.translationRequest.location);
            setDate(formatDateForEdit(editData.requestDateTime));
            setDuration(editData.translationRequest.duration);
            setTypeMeeting(editData.translationRequest.typeMeeting);
            setMeetingLink(editData.translationRequest.meetingLink);
            setStatus(editData.status);
            setNotes(editData.comments);
            setDepartment(editData.translationRequest.department);
        }
    }, []);

    return (
        <div className="flex justify-center items-start pt-16 pb-16 min-h-screen bg-[#f5faff] px-4">
            <div className="bg-white border border-[#d0ebff] rounded-2xl shadow-lg px-10 py-10 w-full max-w-[500px]">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-mgbblue">Translation Request</h1>
                    <HelpButton />
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/*display employee name instead of id*/}
                    <div className="flex flex-col gap-1 w-full">
                        <label htmlFor="employee" className="text-sm font-medium text-gray-700 mb-1">
                            Employee:
                        </label>
                        <select
                            id={"employee"}
                            onChange={(e) => {
                                setEmployeeId(Number(e.target.value));
                            }}
                            value={employeeId}
                            className={`w-full px-4 py-2 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300`}
                        >
                            {employeeList.map((employee) => (
                                <option key={employee.employeeId} value={employee.employeeId}>
                                    {employee.employeeName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <FormFieldElement
                        label="Patient ID"
                        id="patientId"
                        type="number"
                        value={patientId}
                        onChange={(e) => setPatientId(Number(e.target.value))}
                        required
                        placeholder="Enter patient ID"
                    />

                    <FormFieldElement
                        label="Language"
                        id="language"
                        type="select"
                        value={patientLanguage}
                        onChange={(e) => setPatientLanguage(e.target.value)}
                        options={translateLangugeArray}
                        placeholder="Select Language"
                    />

                    <FormFieldElement
                        label="Priority"
                        id="priority"
                        type="select"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as priorityType)}
                        required
                        options={priorityArray}
                        placeholder="Select Priority"
                    />

                    <FormFieldElement
                        label="Appointment Time"
                        id="date"
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />

                    <FormFieldElement
                        label="Duration (hours)"
                        id="duration"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        required
                    />

                    <FormFieldElement
                        label="Meeting Type"
                        id="meetingType"
                        type="select"
                        value={typeMeeting}
                        onChange={(e) => setTypeMeeting(e.target.value as meetingType)}
                        options={meetingTypeArray}
                        placeholder="Select Meeting Type"
                        required
                    />

                    {typeMeeting === 'Remote (Online)' && (
                        <FormFieldElement
                            label="Meeting Link"
                            id="meetingLink"
                            type="text"
                            value={meetingLink}
                            onChange={(e) => setMeetingLink(e.target.value)}
                            placeholder="Enter meeting link"
                        />
                    )}

                    <FormFieldElement
                        label="Hospital"
                        id="location"
                        type="select"
                        value={location}
                        onChange={(e) => setLocation(e.target.value as mgbHospitalType)}
                        options={mgbHospitals}
                        placeholder="Select Hospital"
                        required
                    />

                    <FormFieldElement
                        label="Department"
                        id="department"
                        type="select"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        options={directoryList}
                        placeholder="Select Department"
                        required
                    />

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Additional Comments:</label>
                        <textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            placeholder="Additional Notes:"
                            className="px-4 py-2 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                    </div>

                    <div className="flex flex-col gap-3 mt-4">
                        <MGBButton
                            variant="primary"
                            onClick={() => handleSubmit}
                            className="rounded-full w-full py-2"
                        >
                            Submit Request
                        </MGBButton>
                        <MGBButton
                            variant="secondary"
                            onClick={handleReset}
                            className="rounded-full w-full py-2"
                        >
                            Clear Form
                        </MGBButton>
                    </div>
                    {showConfirmation &&
                        <Confetti
                            recycle={false}
                            width={900}
                            height={900}
                            initialVelocityY={4}
                            gravity={0.6}
                            numberOfPieces={200}
                            tweenDuration={1000}
                        />
                    }
                </form>
            </div>
        </div>
    );
};

export default TranslationServiceRequestPage;

