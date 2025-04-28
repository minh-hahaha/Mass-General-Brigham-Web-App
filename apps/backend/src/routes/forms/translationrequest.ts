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
