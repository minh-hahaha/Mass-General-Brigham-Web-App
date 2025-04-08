import React from 'react';

interface TransportRequest {
    id: number;
    patientId: string;
    patientName: string;
    transportType: 'Ambulance' | 'Helicopter' | 'Other';
    priority: 'Low' | 'Medium' | 'High';
    pickupLocation: string;
    dropOffLocation: string;
    pickupDate: string;
    pickupTime: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
    notes: string;
    requesterId: string;
    requestDate: string;
    assignedToId: string;
}

interface ConfirmationMessageProps {
    request: TransportRequest;
    onClose?: () => void;
}

function ConfirmMesg({ request, onClose }: ConfirmationMessageProps) {
    return (
        <div className="bg-blue-600 text-white">
            <h2 className="text-[20px] font-bold">Request Submitted Successfully</h2>
            <p className="text-[20px] font-bold">Request ID: #{request.id}</p>
            <p>Status: {request.status}</p>
            <p>Date Submitted: {request.requestDate}</p>

            <div className="text-center text-[20px] font-bold">
                Transport request has been submitted to the system
            </div>
        </div>
    );
}

export default ConfirmMesg;
