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
    // res.sendStatus(200);
    await PrismaClient.serviceRequest.create({
        data: {
            request_id: req.body.id,
            transport_type: req.body.transportType,
            priority: req.body.priority,
            status: req.body.status,
            comments: req.body.notes,
            service_type: 'Patient Transport',
        },
    });
    //
    // await PrismaClient.patientTransport.create({
    //     data: {
    //         patient_id: req.body.patientId,
    //         patient_name: req.body.patientName,
    //         pickup_location: req.body.pickupLocation,
    //         servReq_id: req.body.requesterId,
    //     },
    // });

    console.log('CREATED ENTRIES !!');

    res.sendStatus(200);
});

export default router;
