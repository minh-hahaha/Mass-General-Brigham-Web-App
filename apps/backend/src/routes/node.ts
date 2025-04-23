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
    const data = req.body;
    const overwrite = req.query.overwrite as string;
    const overwriteFloor = req.query.overwriteFloor as string;
    const overwriteBuilding = req.query.overwriteBuilding as string;

    if (overwrite == 'true') {
        await PrismaClient.edge.deleteMany({
            where: {
                nodeTo: {
                    is: {
                        floor: overwriteFloor,
                        buildingId: overwriteBuilding,
                    },
                },
            },
        });
        await PrismaClient.node.deleteMany({
            where: {
                floor: overwriteFloor,
                buildingId: overwriteBuilding,
            },
        });
    }
    for (const node of data) {
        const tempNode = {
            nodeId: node.nodeId,
            x: node.x,
            y: node.y,
            floor: node.floor,
            buildingId: node.buildingId,
            nodeType: node.nodeType,
            name: node.name,
            roomNumber: node.roomNumber,
            departments: node.departments,
        };

        try {
            const NODES_UPDATE = await PrismaClient.node.create({
                data: tempNode,
            });
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: 'Failed to update nodes' });
            return;
        }
    }
    res.sendStatus(200);
});

router.delete('/', async (req: Request, res: Response) => {
    const nodeId = req.query.nodeId;
    try {
        await PrismaClient.node.delete({
            where: {
                nodeId: nodeId as string,
            },
        });
        res.status(200).json({ message: `Node ${nodeId} deleted successfully.` });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: `Failed to delete node ${nodeId}` });
    }
});

export default router;
