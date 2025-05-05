import express, { Router, Request, Response } from 'express';
import PrismaClient from '../../bin/prisma-client.ts';
import { dataToCSV, readCSV } from '../../CSVImportExport.ts';
import * as console from 'node:console';

const router: Router = express.Router();

router.get('/', async function (req: Request, res: Response) {
    // Attempt to get list of service requests
    try {
        //Attempt to pull from service reqs
        const SERVICE_REQS_LIST = await PrismaClient.serviceRequest.findMany({
            orderBy: {
                requestId: 'asc',
            },
        });
        console.info('Successfully pulled service reqs list'); // Log that it was successful
        console.log(SERVICE_REQS_LIST);
        res.send(SERVICE_REQS_LIST); //sends http request
    } catch (error) {
        // Log any failures
        console.error(`No Service Reqs: ${error}`);
        res.sendStatus(204); // Send error
        return; // Don't try to send duplicate statuses
    }
});

//Note: Route not set up yet
router.post('/csv', async function (req: Request, res: Response) {
    const csvData = await readCSV('./data.csv');
    try {
        for (let data of csvData) {
            const dataToUpsert = {
                requestId: data.requestId,
                employeeId: data.employeeId,
                status: data.status,
                comments: data.comments,
                priority: data.priority,
                locationId: data.locationId,
                serviceType: data.serviceType,
                requestTime: data.requestTime,
                hospital: data.hospital,
            };
            await PrismaClient.serviceRequest.upsert({
                where: { requestId: data.requestId },
                update: dataToUpsert,
                create: dataToUpsert,
            });
        }
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
});

export default router;
