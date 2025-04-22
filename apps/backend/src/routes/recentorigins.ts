import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';
import { errors } from 'jose';

const router: Router = express.Router();

router.get('/', async function (req: Request, res: Response) {
    try {
        const recentOrigins = await PrismaClient.recentOrigins.findMany({
            orderBy: {
                id: 'desc',
            },
        });
        console.info('Successfully pulled recent origins'); // Log that it was successful
        console.log(recentOrigins);
        res.send(recentOrigins);
    } catch (error) {
        console.error(error);
        res.sendStatus(204); // Send error
        return; // Don't try to send duplicate statuses
    }
});

router.post('/', async (req: Request, res: Response) => {
    const { id, location } = req.body;

    try {
        const existing = await PrismaClient.recentOrigins.findFirst({
            where: {
                location: {
                    equals: location,
                    mode: 'insensitive',
                },
            },
        });

        if (existing) {
            res.status(409).json({ message: 'Location already exists' }); // ANDREW WHAT THE HELL MAN
            return;
        }

        const newOrigin = await PrismaClient.recentOrigins.create({
            data: { id, location },
        });

        res.status(201).json(newOrigin);
    } catch (error) {
        console.error('Error in POST /api/recentorigins:', error);
        res.status(500).json({ error: 'Something went wrong' });
        return;
    }
});

export default router;
