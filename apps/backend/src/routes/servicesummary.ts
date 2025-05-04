import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const email = req.query.email as string;

    if (!email) {
        res.status(401).json({ error: 'Unauthorized', msg: res.statusMessage });
        return;
    }

    try {
        const employee = await PrismaClient.employee.findUnique({
            where: { email: String(email) },
            include: {
                department: true,
            },
        });

        if (!employee) {
            res.status(404).json({ error: 'Employee not found' });
            return;
        }

        const statusSummaryRaw = await PrismaClient.serviceRequest.groupBy({
            by: ['status'],
            where: { employeeId: employee.employeeId },
            _count: { _all: true },
        });

        const prioritySummaryRaw = await PrismaClient.serviceRequest.groupBy({
            by: ['priority'],
            where: { employeeId: employee.employeeId },
            _count: { _all: true },
        });

        const serviceTypeSummaryRaw = await PrismaClient.serviceRequest.groupBy({
            by: ['serviceType'],
            where: { employeeId: employee.employeeId },
            _count: { _all: true },
        });

        const statusSummary = statusSummaryRaw.map((item) => ({
            label: item.status,
            count: item._count._all,
        }));

        const prioritySummary = prioritySummaryRaw.map((item) => ({
            label: item.priority,
            count: item._count._all,
        }));

        const serviceTypeSummary = serviceTypeSummaryRaw.map((item) => ({
            label: item.serviceType,
            count: item._count._all,
        }));

        console.log(serviceTypeSummary);
        res.json({
            employee,
            statusSummary,
            prioritySummary,
            serviceTypeSummary,
        });
    } catch (error) {
        console.error('Error fetching service summary:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
