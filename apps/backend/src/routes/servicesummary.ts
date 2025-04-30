import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const email = req.auth?.payload?.email;
    console.log(req.auth?.payload);

    if (!email) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const employee = await PrismaClient.employee.findUnique({
        where: { email: String(email) },
    });
    if (!employee) {
        res.status(404).json({ error: 'Employee not found' });
        return;
    }

    const [statusSummary, prioritySummary] = await Promise.all([
        PrismaClient.serviceRequest.groupBy({
            by: ['status'],
            where: { employeeId: employee.employeeId },
            _count: { _all: true },
        }),
        PrismaClient.serviceRequest.groupBy({
            by: ['priority'],
            where: { employeeId: employee.employeeId },
            _count: { _all: true },
        }),
    ]);

    res.json({
        statusSummary,
        prioritySummary,
    });
});

export default router;
