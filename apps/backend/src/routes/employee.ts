import express, { Router, Request, Response } from 'express';
import { Prisma } from 'database';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

router.get('/', async function (req: Request, res: Response) {
    console.log('sup');
    // Attempt to get list of employees
    try {
        //Attempt to pull from employee
        const EMPLOYEE_LIST = await PrismaClient.employee.findMany({
            orderBy: {
                last_name: 'desc',
            },
        });
        console.info('Successfully pulled employees score'); // Log that it was successful
        console.log(EMPLOYEE_LIST);
        res.send(EMPLOYEE_LIST);
    } catch (error) {
        // Log any failures
        console.error(`NO EMPLOYEES: ${error}`);
        res.sendStatus(204); // Send error
        return; // Don't try to send duplicate statuses
    }

    // res.sendStatus(200); // Otherwise say it's fine
});

export default router;
