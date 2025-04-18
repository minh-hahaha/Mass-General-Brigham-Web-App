import { useState } from 'react';
import MGBButton from '../elements/MGBButton.tsx';
import InputElement from '../elements/InputElement.tsx';
import ConfirmMessageComponent from '../components/ConfirmMessageComponent.tsx';
import { SubmitMedicalDeviceRequest } from '@/database/medicalDeviceRequest.ts';

export interface MedicalDeviceRequestData {
    employeeName: string;
    employeeId: number;
    requestDate: string;
    priority: 'Low' | 'Medium' | 'High' | 'Emergency';
    location: 'Chestnut Hill' | '20 Patriot Place' | '22 Patriot Place';
    date: string;
    medicalDevices: 'ECG Monitor' | 'Vital Signs Monitor' | 'Pulse Oximeter' | 'Infusion Pump' | 'Syringe Pump' |
        'Defibrillator' | 'Ventilator' | 'Nebulizer' | 'Anesthesia Machine' |
        'Wheelchair' | 'IV Stand' | 'Suction Machine' | 'Warming Blanket System' |
        'Oxygen Concentrator' | 'Portable Suction Unit' | 'Crash Cart'
    reasoning: string
    status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
    notes: string;
    department: string;
}

// Medical Device Component Definition
const MedicalDeviceServiceRequestPage = () => {
    const [employeeName, setEmployeeName] = useState('');
    const [employeeId, setEmployeeId] = useState<number>(0);
    const [requestDate, setRequestDate] = useState('');
    const [priority, setPriority] = useState<MedicalDeviceRequestData['priority']>('Low');
    const [location, setLocation] =
        useState<MedicalDeviceRequestData['location']>('Chestnut Hill');
    const [date, setDate] = useState(new Date().toISOString());
    const [medicalDevices, setMedicalDevices] = useState<MedicalDeviceRequestData['medicalDevices']>('ECG Monitor');
    const [reasoning, setReasoning] = useState('');
    const [status, setStatus] = useState<MedicalDeviceRequestData['status']>('Pending');
    const [notes, setNotes] = useState('');
    const [department, setDepartment] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formattedRequestDate = new Date(requestDate).toISOString();

        const newRequest: MedicalDeviceRequestData = {
            employeeName: employeeName,
            employeeId: employeeId,
            requestDate: formattedRequestDate,
            priority: priority as 'Low' | 'Medium' | 'High' | 'Emergency',
            location: location as 'Chestnut Hill' | '20 Patriot Place' | '22 Patriot Place',
            date: date,
            medicalDevices: medicalDevices as 'ECG Monitor' | 'Vital Signs Monitor' | 'Pulse Oximeter' |
                'Infusion Pump' | 'Syringe Pump' | 'Defibrillator' |
                'Ventilator' | 'Nebulizer' | 'Anesthesia Machine' |
                'Wheelchair' | 'IV Stand' | 'Suction Machine' |
                'Warming Blanket System' | 'Oxygen Concentrator' | 'Portable Suction Unit' | 'Crash Cart',
            reasoning: reasoning,
            status: status as 'Pending' | 'In Progress' | 'Completed' | 'Cancelled',
            notes: notes,
            department: department,
        }
        // submitMedicalDeviceRequest(newRequest);
        handleReset();
    };

    const handleReset = () => {
        setEmployeeName('');
        setEmployeeId(0);
        setRequestDate('');
        setPriority('Low');
        setLocation('Chestnut Hill');
        setDate(new Date().toISOString().split('T')[0]);
        setMedicalDevices('ECG Monitor');
        setReasoning('');
        setStatus('Pending');
        setNotes('');
        setDepartment('');
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <div className="flex flex-col items-center border border-[#d3d5d7] bg-white rounded-2xl shadow-xl p-8 w-full max-w-[700px] mt-10 mb-10">
                <h1 className="text-[30px] font-bold mb-6">Medical Device Request</h1>
                <p> Vinam Nguyen </p>
                <div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <h3 className="textxl font-semibold mb-4">
                            <b>Requester Information</b>
                        </h3>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <InputElement
                                    label={"Requester Name: "}
                                    type={"text"}
                                  name="employeeName"
                                  id={"employeeName"}
                                  value={employeeName}
                                  required={true}
                                  placeholder={"Please enter your name"}
                                  onChange={(e) => setEmployeeName(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <InputElement label={"Requester ID: "}
                                              type={"text"}
                                              name="employeeId"
                                              id={"employeeId"}
                                              value={employeeId}
                                              required={true}
                                              placeholder={"Please enter your ID"}
                                              onChange={(e) => setEmployeeId(Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <label className="w-1/4">Request Date</label>
                                <input
                                    id="requestDate"
                                    name="requestDate"
                                    placeholder="Select request date"
                                    required
                                    type="date"
                                    value={date}
                                    onChange={(e) => setRequestDate(e.target.value)}
                                    className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                />
                            </div>
                        </div>
                    </div>
                </form>
                </div>
                </div>
        </div>
    );
};

export default MedicalDeviceServiceRequestPage;
