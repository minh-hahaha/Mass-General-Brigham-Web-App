import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const email = req.auth?.payload?.email;

        if (!email) {
            res.status(401).json({ error: 'Unauthorized', msg: res.statusMessage });
            return;
        }

        const employee = await PrismaClient.employee.findUnique({
            where: { email: String(email) },
        });

        if (!employee) {
            res.status(404).json({ error: 'Employee not found', msg: res.statusMessage });
            return;
        }

        const [details, statusSummary, prioritySummary] = await Promise.all([
            PrismaClient.employee.findUnique({
                where: { email: String(email) },
            }),
            PrismaClient.serviceRequest.groupBy({
                by: ['status'],
                where: { employeeId: employee?.employeeId },
                _count: { _all: true },
            }),
            PrismaClient.serviceRequest.groupBy({
                by: ['priority'],
                where: { employeeId: employee?.employeeId },
                _count: { _all: true },
            }),
        ]);

        res.json({
            details,
            statusSummary,
            prioritySummary,
        });
    } catch (error) {
        console.error('Error fetching service summary:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
