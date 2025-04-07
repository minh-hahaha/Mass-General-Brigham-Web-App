import express, { Router, Request, Response } from 'express';
import { Prisma } from 'database';
import PrismaClient from '../bin/prisma-client';
import { dataToCSV, readCSV } from '../CSVImportExport.ts';

const router: Router = express.Router();

router.get('/', async function (req: Request, res: Response) {
    // Attempt to get list of employees
    try {
        //Attempt to pull from employee
        const EMPLOYEE_LIST = await PrismaClient.employee.findMany({
            orderBy: {
                last_name: 'asc',
            },
        });
        // Temporary for testing
        //TODO: move to its own route (probably)
        await dataToCSV(EMPLOYEE_LIST);
        console.info('Successfully pulled employees score'); // Log that it was successful
        console.log(EMPLOYEE_LIST);
        res.send(EMPLOYEE_LIST);
    } catch (error) {
        // Log any failures
        console.error(`NO EMPLOYEES: ${error}`);
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
                id: data.id,
                first_name: data.first_name,
                middle_name: data.middle_name,
                last_name: data.last_name,
                position: data.position,
                date_hired: data.date_hired,
            };
            await PrismaClient.employee.upsert({
                where: { id: data.id },
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
