import axios from "axios";
import {ROUTES} from "common/src/constants.ts";
import {useEffect, useState} from "react";

const ServiceRequestDisplayPage = () => {

    type ServiceRequest = {
        request_id: number;
        employee_id: number | null;
        request_date: Date | null;
        status: string;
        comments: string | null;
        priority: string;
        location_id: number | null;
        service_type: string;
        transport_type: string;
        request_time: Date | null;
    }

    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<ServiceRequest[] | null>(null);

    useEffect(() => {
        //function here
    }, []);

    if (loading) {return <p>Loading Requests...</p>}
    if (requests == null) {return <p>No requests found!</p>}

    return (
        <table>
            <thead>
            <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Type</th>
                <th>Status</th>
                <th>Created</th>
            </tr>
            </thead>
            <tbody>
            {requests.map((req) => (
                <tr key={req.request_id}>
                    <td>{req.priority}</td>
                    <td>{req.request_id}</td>
                    <td>{req.employee_id}</td>
                    <td>{req.request_date?.toLocaleDateString()}</td>
                    <td>{req.status}</td>
                    <td>{req.comments}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default ServiceRequestDisplayPage;

