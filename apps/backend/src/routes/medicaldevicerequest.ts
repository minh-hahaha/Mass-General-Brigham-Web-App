import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const requests = await PrismaClient.serviceRequest.findMany({
            where: {
                serviceType: 'Medical Device',
            },
            include: {
                medicalDeviceRequest: true,
            },
        });

        res.status(200).json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch medical device requests' });
    }
});

router.post('/', async (req: Request, res: Response) => {
    console.log(req.body);
    const tempDate = new Date(req.body.date);

    try {
        const result = await PrismaClient.$transaction(async (prisma) => {
            //creates entry for service request
            const serviceRequest = await prisma.serviceRequest.create({
                data: {
                    employeeId: req.body.employeeId,
                    requestDate: tempDate,
                    status: req.body.status,
                    comments: req.body.notes,
                    priority: req.body.priority,
                    locationId: 1,
                    serviceType: 'Medical Device',
                },
            });

            //create entry for patient transport table
            const medicalDeviceRequest = await prisma.medicalDeviceRequest.create({
                data: {
                    servReqId: serviceRequest.requestId,
                    device: req.body.device,
                    deviceReasoning: req.body.deviceReasoning ?? '', // fallback to empty string if undefined
                    deviceSerialNumber: req.body.deviceSerialNumber,
                    deviceModel: req.body.model,
                    date: new Date(req.body.requestDate),
                    location: req.body.location,
                    department: req.body.department,
                },
            });
            return { serviceRequest, medicalDeviceRequest };
        });
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

export default router;
