import express, { Router, Request, Response } from 'express';
import { Prisma } from 'database';
import PrismaClient from '../bin/prisma-client';
import { dataToCSV, readCSV } from '../CSVImportExport.ts';

const router: Router = express.Router();

router.get('/', async function (req: Request, res: Response) {
    // Attempt to get list of service requests
    try {
        //Attempt to pull from
        const SERVICE_REQS_LIST = await PrismaClient.serviceRequest.findMany({
            orderBy: {
                urgency: 'asc',
            },
        });
        // Temporary for testing
        //TODO: move to its own route (probably)
        await dataToCSV(SERVICE_REQS_LIST);
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

//TODO: move to its own route (probably)
router.post('/', async function (req: Request, res: Response) {
    const csvData = await readCSV('./data.csv');
    try {
        for (let data of csvData) {
            const dataToUpsert = {
                request_id: data.request_id,
                employee_id: data.employee_id,
                request_date: data.request_date,
                status: data.status,
                comments: data.comments,
                urgency: data.urgency,
                location: data.location,
                service: data.service,
            };
            await PrismaClient.serviceRequest.upsert({
                where: { request_id: data.request_id },
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
