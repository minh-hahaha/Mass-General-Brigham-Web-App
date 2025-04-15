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
        <div className="inline-block bg-mgbblue text-white py-2 px-4 rounded shadow-md animate-fade-in" style={{ height: '38px', lineHeight: '1.5' }}>
            <span className="font-medium">Request Submitted</span>
        </div>
    );
}

export default ConfirmMesg;