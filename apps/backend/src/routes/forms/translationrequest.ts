import express, { Router, Request, Response } from 'express';
import PrismaClient from '../../bin/prisma-client.ts';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const requests = await PrismaClient.serviceRequest.findMany({
            where: {
                serviceType: 'Translation',
            },
            include: {
                //might flag an error
                translationRequest: true, // includes Translation entry
            },
        });
        res.status(200).json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch translation requests' });
    }
});

router.post('/', async (req: Request, res: Response) => {
    //Format for tempDate is  2025-04-04T01:44
    //(maybe on future iterations split the field?)
    console.log(req.body);
    const tempDate = new Date(req.body.date);

    try {
        const result = await PrismaClient.$transaction(async (prisma) => {
            //creates entry for service request
            const serviceRequest = await prisma.serviceRequest.create({
                data: {
                    status: 'Pending',
                    comments: req.body.notes,
                    priority: req.body.priority,
                    serviceType: 'Translation',
                    employeeId: req.body.employeeId,
                    requestDateTime: req.body.date,
                },
            });

            //create entry for patient transport table
            const translationRequest = await prisma.translationRequest.create({
                data: {
                    serviceReqId: serviceRequest.requestId,
                    patientId: req.body.patientId,
                    language: req.body.language,
                    typeMeeting: req.body.typeMeeting,
                    date: new Date(req.body.date),
                    meetingLink: req.body.meetingLink,
                    location: req.body.location,
                    department: req.body.department,
                    duration: req.body.duration,
                },
            });

            return { serviceRequest, translationRequest };
        });

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

router.post('/edit', async (req: Request, res: Response) => {
    //Format for tempDate is  2025-04-04T01:44
    //(maybe on future iterations split the field?)
    console.log(req.body);
    const tempDate = new Date(req.body.translatorRequest.date);

    try {
        const result = await PrismaClient.$transaction(async (prisma) => {
            //creates entry for service request
            const serviceRequest = await prisma.serviceRequest.update({
                where: { requestId: req.body.requestId },
                data: {
                    employeeId: req.body.translatorRequest.employeeId,
                    requestDateTime: tempDate,
                    status: req.body.translatorRequest.status,
                    comments: req.body.translatorRequest.notes,
                    priority: req.body.translatorRequest.priority,
                    serviceType: 'Translation',
                },
            });
            //create entry for patient transport table
            const translationRequest = await prisma.translationRequest.update({
                where: { serviceReqId: req.body.requestId },
                data: {
                    //patientName: req.body.translatorRequest.patientName,
                    language: req.body.translatorRequest.language,
                    duration: req.body.translatorRequest.duration,
                    typeMeeting: req.body.translatorRequest.typeMeeting,
                    date: new Date(req.body.translatorRequest.date),
                    meetingLink: req.body.translatorRequest.meetingLink,
                    location: req.body.translatorRequest.location,
                    department: req.body.translatorRequest.department,
                    duration: req.body.duration,
                },
            });

            return { serviceRequest, translationRequest };
        });

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

export default router;
