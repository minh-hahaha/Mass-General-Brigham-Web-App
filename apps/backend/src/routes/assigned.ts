import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';
import { dataToCSV } from '../CSVImportExport.ts';

const router: Router = express.Router();

router.get('/', async function (req: Request, res: Response) {
    // Attempt to get list of assigned service requests
    try {
        //Attempt to pull from
        const ASSIGNED_LIST = await PrismaClient.serviceRequest.findMany({
            where: {
                assigned_id: {
                    isNot: null,
                },
            },
        });
        // Temporary for testing
        //TODO: move to its own route (probably)
        await dataToCSV(ASSIGNED_LIST);
        console.info('Successfully pulled service requests assigned'); // Log that it was successful
        console.log(ASSIGNED_LIST);
        res.send(ASSIGNED_LIST);
    } catch (error) {
        // Log any failures
        console.error(`NO EMPLOYEES: ${error}`);
        res.sendStatus(204); // Send error
        return; // Don't try to send duplicate statuses
    }
});

export default router;
