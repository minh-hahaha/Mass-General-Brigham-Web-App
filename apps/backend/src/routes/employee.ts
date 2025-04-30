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
                lastName: 'asc',
            },
        });
        console.info('Successfully pulled employees'); // Log that it was successful
        console.log(EMPLOYEE_LIST);
        res.send(EMPLOYEE_LIST);
    } catch (error) {
        // Log any failures
        console.error(`NO EMPLOYEES: ${error}`);
        res.sendStatus(204); // Send error
        return; // Don't try to send duplicate statuses
    }
});

router.get('/names', async function (req, res) {
    console.log("what's up danger");
    try {
        const EMPLOYEE_NAMES = await PrismaClient.employee.findMany({
            select: {
                firstName: true,
                lastName: true,
            },
        });
        res.json(EMPLOYEE_NAMES);
    } catch (error) {
        console.log(error);
        res.sendStatus(204);
        return;
    }
});

router.get('/email', async function (req, res) {
    try {
        let emailFilter: string = req.query.emailFilter as string;

        const EMPLOYEE = await PrismaClient.employee.findMany({
            where: {
                email: emailFilter,
            },
        });
        res.json(EMPLOYEE);
    } catch (error) {
        console.log(error);
        res.sendStatus(204);
        return;
    }
});

router.get('/name=id', async function (req, res) {
    try {
        const EMPLOYEE_LIST = await PrismaClient.employee.findMany({
            select: {
                employeeId: true,
                firstName: true,
                lastName: true,
            },
        });

        const EMPLOYEE_LIST_SEND = EMPLOYEE_LIST.map((employee) => {
            return {
                employeeId: employee.employeeId,
                employeeName: employee.firstName + ' ' + employee.lastName,
            };
        });

        console.log('THIS IS THE LIST OF EMPLOYEES AND THEIR NAMES');
        console.log(EMPLOYEE_LIST_SEND);
        res.json(EMPLOYEE_LIST_SEND);
    } catch (error) {
        console.log(error);
        res.sendStatus(204);
        return;
    }
});

//Note: Route not set up yet
router.post('/csv', async function (req: Request, res: Response) {
    const csvData = await readCSV('./id.csv');
    try {
        for (let data of csvData) {
            const dataToUpsert = {
                id: data.id,
                firstName: data.firstName,
                middleName: data.middleName,
                lastName: data.lastName,
                position: data.position,
                dateHired: data.dateHired,
                serviceRequest: data.serviceRequest,
                email: data.email,
                password: data.password,
                departmentId: data.departmentId,
            };
            await PrismaClient.employee.upsert({
                where: { employeeId: data.employeeId },
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
