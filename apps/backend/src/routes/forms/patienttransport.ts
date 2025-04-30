import express, { Router, Request, Response } from 'express';
import PrismaClient from '../../bin/prisma-client.ts';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const requests = await PrismaClient.serviceRequest.findMany({
            where: {
                serviceType: 'Patient Transportation',
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
    console.log('posting patient transport request');
    try {
        console.log(req.body.dropOffDate);
        const result = await PrismaClient.$transaction(async (prisma) => {
            //creates entry for service request
            const serviceRequest = await prisma.serviceRequest.create({
                data: {
                    priority: req.body.priority,
                    status: 'Pending',
                    comments: req.body.notes,
                    serviceType: 'Patient Transportation',

                    //optional field
                    employeeId: req.body.employeeId ?? null, // change to user id in the future?
                },
            });

            //create entry for patient transport table
            const patientTransport = await prisma.patientTransport.create({
                data: {
                    servReqId: serviceRequest.requestId,
                    patientId: req.body.patientId,
                    pickupLocation: req.body.pickupLocation,
                    transportType: req.body.transportType,
                    dropoffLocation: req.body.dropoffLocation,
                    transportDate: req.body.formattedDate,
                },
                select: {
                    servReqId: true,
                    patientId: true,
                    dropoffLocation: true,
                    pickupLocation: true,
                },
            });

            console.log(serviceRequest);
            return { serviceRequest, patientTransport };
        });

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

router.post('/edit', async (req: Request, res: Response) => {
    try {
        const result = await PrismaClient.$transaction(async (prisma) => {
            //creates entry for service request
            const serviceRequest = await prisma.serviceRequest.update({
                where: { requestId: req.body.requestId },
                data: {
                    priority: req.body.transportRequest.priority,
                    status: req.body.transportRequest.status,
                    comments: req.body.transportRequest.notes,
                    serviceType: 'Patient Transportation',

                    //optional field
                    employeeId: req.body.transportRequest.employeeId ?? null, // change to user id in the future?
                    requestDateTime: req.body.transportRequest.requestDate
                        ? new Date(req.body.transportRequest.requestDate).toISOString()
                        : new Date(),
                    //requestTime: new Date(req.body.transportRequest.pickupTime) ?? null,
                },
            });

            //create entry for patient transport table
            const patientTransport = await prisma.patientTransport.update({
                where: { servReqId: req.body.requestId },
                data: {
                    patientId: req.body.transportRequest.patientId,
                    //patientName: req.body.transportRequest.patientName,
                    pickupLocation: req.body.transportRequest.pickupLocation,
                    transportType: req.body.transportRequest.transportType,
                    dropoffLocation: req.body.transportRequest.dropoffLocation,
                    transportDate: req.body.transportRequest.transportDate,
                },
                select: {
                    servReqId: true,
                    patientId: true,
                    //patientName: true,
                    pickupLocation: true,
                },
            });

            console.log(serviceRequest);
            return { serviceRequest, patientTransport };
        });

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

export default router;
