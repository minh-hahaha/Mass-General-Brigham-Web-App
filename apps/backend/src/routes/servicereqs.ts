import express, { Router, Request, Response } from 'express';
import { Prisma } from 'database';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

router.get('/', async function (req: Request, res: Response) {
    // Attempt to get list of service requests
    try {
        //Attempt to pull from
        const SERVICE_REQS_LIST = await PrismaClient.serviceRequest.findMany({
            orderBy: {
                priority: 'asc',
            },
        });
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

export default router;
