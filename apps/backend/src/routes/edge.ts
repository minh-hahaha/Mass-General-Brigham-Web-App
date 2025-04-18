import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const EDGES = await PrismaClient.edge.findMany({
            include: {
                nodeTo: true,
                nodeFrom: true,
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
        from: req.body.to,
        to: req.body.to,
    }

    try {
        const EDGE_UPDATE = await PrismaClient.edge.upsert({
            where:{
                edgeId: tempEdge.edgeId
            },
            update: tempEdge,
            create: tempEdge
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upsert edge' });
    }
})

router.delete('/:id', async (req: Request, res: Response) => {
    const edgeId = Number(req.params.id);

    try {
        await PrismaClient.edge.delete({
            where: {
                edgeId: edgeId
            }
        });
        res.status(200).json({ message: `Edge ${edgeId} deleted successfully.` });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: `Failed to delete edge ${edgeId}` });
    }
});
export default router;
