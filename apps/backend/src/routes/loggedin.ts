import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

// Protected route to get logged-in employee info
router.get('/', async (req: Request, res: Response) => {
    try {
        // get userEmail from Auth0
        let userEmail = req.auth?.payload?.email;
        if (!userEmail) {
            res.status(401).json({ error: 'Unauthorized' });
        }
        // find employee with same email from table
        const employee = await PrismaClient.employee.findUnique({
            where: { email: String(userEmail) },
        });
        if (!employee) {
            res.status(404).json({ error: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;