import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const building = req.query.fromBuilding as string;
    const floor = req.query.fromFloor as string;
    try {
        const EDGES = await PrismaClient.edge.findMany({
            include: {
                nodeTo: true,
                nodeFrom: true,
            },
            where: {
                nodeTo: {
                    is: {
                        floor: floor,
                        buildingId: building,
                    },
                },
            },
        });
        res.status(200).json(EDGES);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch edges' });
    }
});

router.post('/', async (req: Request, res: Response) => {
    const tempEdge = {
        edgeId: req.body.edgeId,
        from: req.body.from,
        to: req.body.to,
    };

    try {
        let edgeUpdate;
        if (tempEdge.edgeId) {
            edgeUpdate = await PrismaClient.edge.upsert({
                where: {
                    edgeId: tempEdge.edgeId,
                },
                update: tempEdge,
                create: tempEdge,
            });
        } else {
            edgeUpdate = await PrismaClient.edge.create({
                data: {
                    from: tempEdge.from,
                    to: tempEdge.to,
                },
            });
        }
        res.status(200).json(edgeUpdate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upsert edge' });
    }
});

router.delete('/', async (req: Request, res: Response) => {
    const edgeId = Number(req.query.edgeId);
    try {
        await PrismaClient.edge.delete({
            where: {
                edgeId: edgeId,
            },
        });
        res.status(200).json({ message: `Edge ${edgeId} deleted successfully.` });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: `Failed to delete edge ${edgeId}` });
    }
});
export default router;
