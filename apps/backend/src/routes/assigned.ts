import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';
import { dataToCSV } from '../CSVImportExport.ts';

const router: Router = express.Router();

router.get('/', async function (req: Request, res: Response) {
    const { employeeId } = req.query;

    if (!employeeId) {
        res.status(400).json({ error: 'Missing employeeId' });
        return;
    }

    try {
        const ASSIGNED_LIST = await PrismaClient.serviceRequest.findMany({
            where: {
                employeeId: Number(employeeId),
            },
            include: {
                assignedId: true,
            },
        });
        res.send(ASSIGNED_LIST);
    } catch (error) {
        console.error(`Error fetching assigned requests: ${error}`);
        res.sendStatus(500);
    }
});

export default router;
