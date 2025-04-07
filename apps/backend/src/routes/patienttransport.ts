import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    res.json(await PrismaClient.serviceRequest.findMany()); // Get all service requests
});

router.post('/', async (req: Request, res: Response) => {
    await PrismaClient.serviceRequest.create({
        data: {
            ...req.body,
        },
    });

    res.sendStatus(200);
});

export default router;
