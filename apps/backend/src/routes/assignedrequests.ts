import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const email = req.query.email as string;

    if (!email) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const employee = await PrismaClient.employee.findUnique({
            where: { email: String(email) },
        });

        if (!employee) {
            res.status(404).json({ error: 'Employee not found' });
            return;
        }

        const requests = await PrismaClient.serviceRequest.findMany({
            where: { employeeId: employee.employeeId },
            include: { assignedId: true },
        });

        res.json(requests);
    } catch (error) {
        console.error('Error fetching assigned requests:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
