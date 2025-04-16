import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const NODES = await PrismaClient.node.findMany({});

        res.status(200).json(NODES);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch nodes' });
    }
});

export default router;
