import React, { useEffect, useState } from 'react';

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
    const [visible, setVisible] = useState(true);

    // set a timer
    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
        }, 2000);

        // clean up the timer
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!visible) return null;

    return (
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg animate-fade-in">
            <div className="flex items-center mb-4">
                <h2 className="text-xl font-bold">Request Submitted Successfully</h2>
            </div>
        </div>
    );
}

export default ConfirmMesg;