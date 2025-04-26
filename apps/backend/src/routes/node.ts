import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

import multer from 'multer';
import { CSVtoData, dataToCSV } from '../CSVImportExport.ts';

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', async (req: Request, res: Response) => {
    const building = req.query.fromBuilding as string;
    const floor = req.query.fromFloor as string;
    try {
        const NODES = await PrismaClient.node.findMany({
            where: {
                floor: floor,
                buildingId: building,
            },
        });

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

router.get('/json', async function (req: Request, res: Response) {
    try {
        const NODES = await PrismaClient.node.findMany({
            orderBy: {
                buildingId: 'asc',
            },
        });
        const EDGES = await PrismaClient.edge.findMany({
            orderBy: {
                edgeId: 'asc',
            },
        });
        res.status(200).json({
            nodes: NODES,
            edges: EDGES,
        });
    } catch (error) {
        res.sendStatus(500);
    }
});

router.get('/csv', async function (req: Request, res: Response) {
    //TODO: FIX
    try {
        const NODES = await PrismaClient.node.findMany({
            orderBy: {
                buildingId: 'desc',
            },
        });
        const EDGES = await PrismaClient.edge.findMany({
            orderBy: {
                edgeId: 'desc',
            },
        });
        const nodesCSV = await dataToCSV(NODES);
        const edgesCSV = await dataToCSV(EDGES);
        res.status(200).send(nodesCSV);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

router.post('/csv', upload.single('file'), async function (req: Request, res: Response) {
    if (!req.file) {
        res.status(400).send('No file uploaded.');
        return;
    }
    const overwrite = req.query.overwrite as string;
    const csvData = CSVtoData(req.file.buffer.toString('utf-8'));
    try {
        if (overwrite === 'Overwrite') {
            await PrismaClient.edge.deleteMany();
            await PrismaClient.node.deleteMany();
            if (csvData[0].nodeId) {
                for (const data of csvData) {
                    const dataToUpsertNode = {
                        nodeId: data.nodeId,
                        x: data.x,
                        y: data.y,
                        floor: data.floor.toString(),
                        buildingId: data.buildingId.toString(),
                        nodeType: data.nodeType.toString(),
                        name: data.name.toString(),
                        roomNumber: data.roomNumber?.toString() || null,
                    };
                    await PrismaClient.node.create({
                        data: dataToUpsertNode,
                    });
                }
            } else {
                for (const data of csvData) {
                    const dataToUpsertEdge = {
                        edgeId: data.edgeId,
                        to: data.to,
                        from: data.from,
                    };
                    await PrismaClient.edge.create({
                        data: dataToUpsertEdge,
                    });
                }
            }
        } else {
            if (csvData[0].nodeId) {
                for (const data of csvData) {
                    const dataToUpsertNode = {
                        nodeId: data.nodeId,
                        x: data.x,
                        y: data.y,
                        floor: data.floor.toString(),
                        buildingId: data.buildingId.toString(),
                        nodeType: data.nodeType.toString(),
                        name: data.name.toString(),
                        roomNumber: data.roomNumber?.toString() || null,
                    };
                    await PrismaClient.node.upsert({
                        where: { nodeId: data.nodeId },
                        update: dataToUpsertNode,
                        create: dataToUpsertNode,
                    });
                }
            } else {
                for (const data of csvData) {
                    const dataToUpsertEdge = {
                        edgeId: data.edgeId,
                        to: data.to,
                        from: data.from,
                    };
                    await PrismaClient.edge.upsert({
                        where: { edgeId: data.edgeId },
                        update: dataToUpsertEdge,
                        create: dataToUpsertEdge,
                    });
                }
            }
        }
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

router.post('/json', upload.single('file'), async function (req: Request, res: Response) {
    if (!req.file) {
        res.status(400).send('No file uploaded.');
        return;
    }
    const overwrite = req.query.overwrite as string;
    const jsonData = JSON.parse(req.file.buffer.toString('utf-8'));
    try {
        if (overwrite === 'Overwrite') {
            await PrismaClient.edge.deleteMany();
            await PrismaClient.node.deleteMany();
            for (const data of jsonData.nodes) {
                const dataToUpsertNode = {
                    nodeId: data.nodeId,
                    x: data.x,
                    y: data.y,
                    floor: data.floor.toString(),
                    buildingId: data.buildingId.toString(),
                    nodeType: data.nodeType.toString(),
                    name: data.name.toString(),
                    roomNumber: data.roomNumber?.toString() || null,
                };
                await PrismaClient.node.create({
                    data: dataToUpsertNode,
                });
            }
            for (const data of jsonData.edges) {
                const dataToUpsertEdge = {
                    edgeId: data.edgeId,
                    to: data.to,
                    from: data.from,
                };
                await PrismaClient.edge.create({
                    data: dataToUpsertEdge,
                });
            }
        } else {
            for (const data of jsonData.nodes) {
                const dataToUpsertNode = {
                    nodeId: data.nodeId,
                    x: data.x,
                    y: data.y,
                    floor: data.floor.toString(),
                    buildingId: data.buildingId.toString(),
                    nodeType: data.nodeType.toString(),
                    name: data.name.toString(),
                    roomNumber: data.roomNumber?.toString() || null,
                };
                await PrismaClient.node.upsert({
                    where: { nodeId: data.nodeId },
                    update: dataToUpsertNode,
                    create: dataToUpsertNode,
                });
            }
            for (const data of jsonData.edges) {
                const dataToUpsertEdge = {
                    edgeId: data.edgeId,
                    to: data.to,
                    from: data.from,
                };
                await PrismaClient.edge.upsert({
                    where: { edgeId: data.edgeId },
                    update: dataToUpsertEdge,
                    create: dataToUpsertEdge,
                });
            }
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500).send('Could not find department table');
    }
    res.sendStatus(200);
});

export default router;
