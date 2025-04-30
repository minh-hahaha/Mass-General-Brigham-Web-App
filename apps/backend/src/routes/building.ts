import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

router.get('/', async function (req: Request, res: Response) {
    try {
        const buildings = await PrismaClient.building.findMany({
            orderBy: {
                buildingId: 'asc',
            },
        });
        res.status(200).json(buildings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch buildings' });
    }
});

router.get('/not', async function (req: Request, res: Response) {
    try {
        const buildingFilter = Number(req.query.building as string);
        const buildings = await PrismaClient.building.findMany({
            where: {
                buildingId: {
                    notIn: [buildingFilter],
                },
            },
        });

        res.status(200).json(buildings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch buildings' });
    }
});

export default router;
