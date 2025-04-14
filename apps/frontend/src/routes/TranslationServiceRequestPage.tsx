import InputElement from '@/elements/InputElement.tsx';
import MGBButton from '@/elements/MGBButton.tsx';
import ConfirmMessageComponent from '@/components/ConfirmMessageComponent.tsx';
import { useState } from 'react';
import { SubmitTransportRequest } from '@/database/transportRequest.ts';
import SelectElement from '@/elements/SelectElement.tsx';

interface TranslationRequestData {
    employeeName: string;
    employeeId: number;
    priority: 'Low' | 'Medium' | 'High' | 'Emergency';
    location: 'Chestnut Hill' | '20 Patriot Place' | '22 Patriot Place';
    language: string;
    patientName: string;
    duration: number;
    typeMeeting: 'Remote (Online)' | 'On-site (In-Person)';
    date: string;
    meetingLink: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
}

const TranslationServiceRequestPage = () => {
    const [employeeName, setEmployeeName] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [patientName, setPatientName] = useState('');
    const [patientLanguage, setPatientLanguage] = useState('');
    const [priority, setPriority] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [duration, setDuration] = useState('');
    const[typeMeeting, setTypeMeeting] = useState('');
    const[meetingLink, setMeetingLink] = useState('');
    const[status, setStatus] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        // e.preventDefault();
        //
        // const newRequest: translatorRequest = {
        //     employeeName,
        //     employeeId,
        //
        // };
        //
        // SubmitTranslatorRequest(newRequest);
    };

    const handleReset = () => {
        setEmployeeName('');
        setEmployeeId('');
        setPatientName('');
        setPatientLanguage('');
        setPriority('');
        setLocation('');
        setDate('');
        setDuration('');
        setTypeMeeting('');
        setMeetingLink('');
        setStatus('');
    };

    return (
        // flex row container
        <div className="flex flex-col justify-center items-center min-h-screen">
            {/* make the form left side */}
            <div className="flex flex-col items-center border border-[#d3d5d7] bg-white rounded-2xl shadow-xl p-8 w-full max-w-[700px] mt-10 mb-10">
                <h1 className="text-[30px] font-bold mb-6">Translation Service Request </h1>
                <p> Krish Patel and Jake Lariviere </p>
                <div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-4">
                                <b>Employee Information</b>
                            </h3>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <InputElement
                                        id="employeeName"
                                        name="employeeName"
                                        label="Employee Name: "
                                        placeholder="Please enter an Employee Name"
                                        required={true}
                                        type="text"
                                        value={employeeName}
                                        onChange={(e) => setEmployeeName(e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <InputElement
                                        id="employeeId"
                                        name="employeeId"
                                        label="Employee ID: "
                                        placeholder="Please enter the Employee ID"
                                        required={true}
                                        type="text"
                                        value={employeeId}
                                        onChange={(e) => setEmployeeId(e.target.value)}
                                    />
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
                                        id="patientName"
                                        name="patientName"
                                        label="Patient Name: "
                                        placeholder="Please enter the Patient Name"
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
                                <div className="flex items-center gap-2">
                                    <SelectElement
                                        options={['Low', 'Medium', 'High', 'Emergency']}
                                        id="priority"
                                        label="Priority:  "
                                        placeholder="Please select the Priority level"
                                        required={true}
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
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
                                        onChange={(e) => setDuration(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-4">
                                <b>Meeting Information</b>
                            </h3>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <SelectElement
                                        options={['Remote (Online)','On-site (In-Person)']}
                                        id="typeMeeting"
                                        label="Meeting Type:  "
                                        placeholder="Please select the Meeting Type"
                                        required={true}
                                        value={typeMeeting}
                                        onChange={(e) => setTypeMeeting(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <SelectElement
                                        options={['Chestnut Hill', '20 Patriot Place', '22 Patriot Place']}
                                        id="location"
                                        label="Location:  "
                                        placeholder="Please select the Location"
                                        required={true}
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
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
                                <div className="flex items-center gap-2">
                                    <SelectElement
                                        options={['Pending', 'In Progress', 'Completed', 'Cancelled']}
                                        id="status"
                                        label="Status:  "
                                        placeholder="Please select the Status of the Request"
                                        required={true}
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    />
                                </div>

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



                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TranslationServiceRequestPage;
