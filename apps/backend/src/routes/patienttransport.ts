import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        //Attempt to pull from
        const SERVICE_REQS_LIST = await PrismaClient.serviceRequest.findMany({});
        console.info('Successfully pulled service reqs list'); // Log that it was successful
        console.log(SERVICE_REQS_LIST);
        res.send(SERVICE_REQS_LIST); //sends http request
    } catch (error) {
        // Log any failures
        console.error(`NO Service Reqs: ${error}`);
        res.sendStatus(204); // Send error
        return; // Don't try to send duplicate statuses
    }
});

router.post('/', async (req: Request, res: Response) => {
    console.log(req.body.requestDate);
    try {
        const result = await PrismaClient.$transaction(async (prisma) => {
            const serviceRequest = await prisma.serviceRequest.create({
                data: {
                    transport_type: req.body.transportType,
                    priority: req.body.priority,
                    status: req.body.status,
                    comments: req.body.notes,
                    service_type: 'Patient Transport',
                    location_id: req.body.locationId ?? null, // optional
                    employee_id: req.body.employeeId ?? null, // optional
                    request_date: req.body.requestDate ?? null,
                },
            });

            const patientTransport = await prisma.patientTransport.create({
                data: {
                    servReq_id: serviceRequest.request_id,
                    patient_id: req.body.patientId,
                    patient_name: req.body.patientName,
                    pickup_location: req.body.pickupLocation,
                },
            });

            return { serviceRequest, patientTransport };
        });

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

export default router;
