import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const requests = await PrismaClient.serviceRequest.findMany({
            where: {
                service_type: 'Patient Transport',
            },
            include: {
                //might flag an error
                patientTransport: true, // includes PatientTransport entry
            },
        });

        res.status(200).json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch patient transport requests' });
    }
});

router.post('/', async (req: Request, res: Response) => {
    //Format for tempDate is  2025-04-04T01:44
    //(maybe on future iterations split the field?)
    const tempDate = new Date(req.body.pickupDate);
    const pickupDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate());

    try {
        const result = await PrismaClient.$transaction(async (prisma) => {
            //creates entry for service request
            const serviceRequest = await prisma.serviceRequest.create({
                data: {
                    transport_type: req.body.transportType,
                    priority: req.body.priority,
                    status: req.body.status,
                    comments: req.body.notes,
                    service_type: 'Patient Transport',

                    //optional fields
                    location_id: req.body.locationId ?? null,
                    employee_id: req.body.employeeId ?? null, // change to user id in the future?
                    request_date: new Date(pickupDate) ?? null,
                    request_time: new Date(req.body.pickupTime) ?? null,
                },
            });

            //create entry for patient transport table
            const patientTransport = await prisma.patientTransport.create({
                data: {
                    servReq_id: serviceRequest.request_id,
                    patient_id: req.body.patientId,
                    patient_name: req.body.patientName,
                    pickup_location: req.body.pickupLocation,
                },
                select: {
                    servReq_id: true,
                    patient_id: true,
                    patient_name: true,
                    pickup_location: true,
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
