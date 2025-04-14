import InputElement from "@/elements/InputElement.tsx";
import MGBButton from "@/elements/MGBButton.tsx";
import ConfirmMessageComponent from "@/components/ConfirmMessageComponent.tsx";
import {useState} from "react";
import {SubmitTransportRequest} from "@/database/transportRequest.ts";

interface  TranslationRequestData{
    employeeName: string;
    employeeId: number;
    priority: 'Low' | 'Medium' | 'High' | 'Emergency';
    location: string;
    language: string;
    time: string;
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
    const[patientLanguage, setPatientLanguage] = useState('');




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
                                            required = {true}
                                            type="text"
                                            value = {employeeName}
                                            onChange={e => setEmployeeName(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <InputElement
                                            id="employeeId"
                                            name="employeeId"
                                            label="Employee Id: "
                                            placeholder="Please enter the Employee ID"
                                            required = {true}
                                            type="text"
                                            value = {employeeId}
                                            onChange={e => setEmployeeId(e.target.value)}
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
                                            required = {true}
                                            type="text"
                                            value = {patientName}
                                            onChange={e => setPatientName(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <InputElement
                                            id="language"
                                            name="language"
                                            label="Patient Language: "
                                            placeholder="Please enter the language: "
                                            required = {true}
                                            type="text"
                                            value = {patientLanguage}
                                            onChange={e => setPatientLanguage(e.target.value)}
                                        />
                                    </div>


                                </div>
                            </div>

                        </form>


                    </div>
                </div>
        </div>
    );

}

export default TranslationServiceRequestPage ;