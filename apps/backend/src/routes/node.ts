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

router.post('/', async (req: Request, res: Response) => {
    const tempNode = {
        nodeId: req.body.nodeId,
        x: req.body.x,
        y: req.body.y,
        floor: req.body.floor,
        buildingId: req.body.buildingId,
        nodeType: req.body.nodeType,
        name: req.body.name,
        roomNumber: req.body.roomNumber,
        departments: req.body.departments,
    };

    try {
        const NODES_UPDATE = await PrismaClient.node.upsert({
            where: {
                nodeId: tempNode.nodeId,
            },
            update: tempNode,
            create: tempNode,
        });
        res.status(200).json(NODES_UPDATE);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed to update nodes' });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    const nodeId = req.params.nodeId;

    try {
        await PrismaClient.node.delete({
            where: {
                nodeId: nodeId,
            },
        });
        res.status(200).json({ message: `Node ${nodeId} deleted successfully.` });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: `Failed to delete node ${nodeId}` });
    }
});

export default router;
