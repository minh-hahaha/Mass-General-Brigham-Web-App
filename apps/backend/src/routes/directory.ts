import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';
import { CSVtoData, dataToCSV, readCSV } from '../CSVImportExport.ts';
import * as path from 'node:path';
import multer from 'multer';

const router: Router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const DIRECTORY_SORT_OPTIONS: object[] = [];
DIRECTORY_SORT_OPTIONS.push({ deptName: 'asc' });
DIRECTORY_SORT_OPTIONS.push({ deptName: 'desc' });
DIRECTORY_SORT_OPTIONS.push({ buildingId: 'asc' });
DIRECTORY_SORT_OPTIONS.push({ buildingId: 'desc' });
DIRECTORY_SORT_OPTIONS.push({ building: { buildingName: 'asc' } });
DIRECTORY_SORT_OPTIONS.push({ building: { buildingName: 'desc' } });

const DIRECTORY_FILTER_OPTIONS: object[] = [];
DIRECTORY_FILTER_OPTIONS.push({ building: { buildingName: 'Chestnut Hill' } });
DIRECTORY_FILTER_OPTIONS.push({ building: { buildingName: '20 Patriot Place' } });
DIRECTORY_FILTER_OPTIONS.push({ building: { buildingName: '22 Patriot Place' } });
DIRECTORY_FILTER_OPTIONS.push({
    OR: [
        { building: { buildingName: '20 Patriot Place' } },
        { building: { buildingName: '22 Patriot Place' } },
    ],
});
DIRECTORY_FILTER_OPTIONS.push({ building: { buildingName: 'Faulkner Hospital' } });

// GET Send Data
router.get('/', async function (req: Request, res: Response) {
    // Get from url
    // should be in the format: http://localhost:3000/api/directory?sortOptions=[]&filterOptions=[]&maxQuery=anyNumber
    // Attempt to get directory
    try {
        // Convert the array from the request query to an array of numbers
        const sortOptions = Array.isArray(req.query.sortOptions)
            ? req.query.sortOptions.map(Number)
            : [];
        // Convert the array from the request query to an array of numbers
        const filterOptions = Array.isArray(req.query.filterOptions)
            ? req.query.filterOptions.map(Number)
            : [];

        // Convert the array of nums to the array of sorting options to use in the query
        const sorts = sortOptions.map((sortOption) => DIRECTORY_SORT_OPTIONS[sortOption]);
        // Convert the array of nums to the array of filtering options to use in the query
        const filters = filterOptions.map((filterOption) => DIRECTORY_FILTER_OPTIONS[filterOption]);
        const args = {
            include: {
                building: { select: { buildingName: true } },
                departmentNodes: { select: { floor: true } },
            },
            where: Object.assign({}, ...filters),
            orderBy: sorts,
        };
        //Attempt to pull from directory
        const DIRECTORY = await PrismaClient.department.findMany(args);
        res.send(DIRECTORY);
    } catch (error) {
        // Log any failures
        console.error(`NO DIRECTORY: ${error}`);
        res.sendStatus(204); // Send error
        return; // Don't try to send duplicate statuses
    }
});

router.get('/names', async function (req: Request, res: Response) {
    try {
        const DIRECTORY_NAMES = await PrismaClient.department.findMany({
            select: {
                deptName: true,
            },
        });
        res.json(DIRECTORY_NAMES);
    } catch (error) {
        console.error(`NO DIRECTORY_NAMES: ${error}`);
        res.sendStatus(404);
        return;
    }
});

router.get('/byBuilding', async function (req: Request, res: Response) {
    try {
        console.log(req.query.buildingFilter);
        let buildingFilter: number = Number(req.query.buildingFilter as string);

        console.log(buildingFilter);

        const DIRECTORY_NAMES = await PrismaClient.department.findMany({
            where: {
                buildingId: {
                    equals: buildingFilter,
                },
            },
        });
        res.json(DIRECTORY_NAMES);
    } catch (error) {
        console.error(`NO DIRECTORIES IN THIS BUILDING: ${error}`);
        res.sendStatus(404);
        return;
    }
});

router.get('/node', async function (req: Request, res: Response) {
    try {
        let nodeId: string = req.query.nodeId as string;

        const NODE_DATA = await PrismaClient.node.findFirst({
            where: {
                nodeId: nodeId,
            },
        });
        console.log(NODE_DATA);
        res.send(NODE_DATA);
    } catch (error) {
        console.error(`NO NODES FOR THIS LOCATION: ${error}`);
        res.sendStatus(404);
        return;
    }
});

// GET Send CSV
router.get('/csv', async function (req: Request, res: Response) {
    // Attempt to get directory
    try {
        //Attempt to pull from directory
        const DIRECTORY = await PrismaClient.department.findMany({
            include: { departmentNodes: true },
            orderBy: {
                deptId: 'desc',
            },
        });
        // Take the joined Node fields and flatten them for CSV parsing {xx:xx, yy:yy, zz:{aa:aa, bb:bb}} => {xx:xx, yy:yy, aa:aa, bb:bb}
        const flattenedDirectories = DIRECTORY.flatMap((dir) => [
            {
                deptId: dir.deptId,
                deptServices: dir.deptServices,
                deptName: dir.deptName,
                buildingId: dir.buildingId,
                deptPhone: dir.deptPhone,
                nodeId: dir.nodeId,
                floor: dir.departmentNodes ? dir.departmentNodes.floor : null,
                nodeType: dir.departmentNodes ? dir.departmentNodes.nodeType : null,
                name: dir.departmentNodes ? dir.departmentNodes.name : null,
                roomNumber: dir.departmentNodes ? dir.departmentNodes.roomNumber : null,
                x: dir.departmentNodes ? dir.departmentNodes.x : null,
                y: dir.departmentNodes ? dir.departmentNodes.y : null,
            },
        ]);
        const csvData = await dataToCSV(flattenedDirectories); //the big boy
        res.status(200).send(csvData);
        console.info('Successfully sent directory csv');
    } catch (error) {
        // Log any failures
        console.error(`NO DIRECTORY: ${error}`);
        res.sendStatus(204); // Send error
        return; // Don't try to send duplicate statuses
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
            await PrismaClient.department.deleteMany();
        }
        for (let data of csvData) {
            const dataToUpsertDirectory = {
                deptId: data.deptId,
                deptServices: data.deptServices || null,
                deptName: data.deptName,
                buildingId: data.buildingId,
                deptPhone: data.deptPhone || null,
                nodeId: data.nodeId || null,
            };
            const dataToUpsertNode = {
                nodeId: data.nodeId,
                x: data.x,
                y: data.y,
                floor: data.floor?.toString() || null,
                buildingId: data.buildingId.toString(),
                nodeType: data.nodeType,
                name: data.name,
                roomNumber: data.roomNumber?.toString() || null,
            };
            if (overwrite === 'Overwrite') {
                console.log('Overwriting');
                await PrismaClient.department.createMany({
                    data: dataToUpsertDirectory,
                    skipDuplicates: true, // Will occur when a department is in two locations
                });
                if (dataToUpsertNode.nodeId) {
                    await PrismaClient.node.createMany({
                        data: dataToUpsertNode,
                        skipDuplicates: true,
                    });
                }
            } else {
                console.log('updating');
                await PrismaClient.department.upsert({
                    where: { deptId: data.deptId },
                    update: dataToUpsertDirectory,
                    create: dataToUpsertDirectory,
                });
                if (dataToUpsertDirectory.nodeId) {
                    await PrismaClient.node.upsert({
                        where: { nodeId: data.nodeId },
                        update: dataToUpsertNode,
                        create: dataToUpsertNode,
                    });
                }
            }
        }
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
});

router.get('/json', async function (req: Request, res: Response) {
    try {
        const DIRECTORY = await PrismaClient.department.findMany({
            include: { departmentNodes: true },
            orderBy: {
                deptId: 'asc',
            },
        });
        res.status(200).json({ directories: DIRECTORY });
    } catch (error) {
        res.sendStatus(500);
    }
});

router.post('/json', upload.single('file'), async function (req: Request, res: Response) {
    if (!req.file) {
        res.status(400).send('No file uploaded.');
        return;
    }
    const overwrite = req.query.overwrite as string;
    const jsonData = JSON.parse(req.file.buffer.toString('utf-8')).directories;
    try {
        if (overwrite === 'Overwrite') {
            await PrismaClient.department.deleteMany();
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500).send('Could not find department table');
    }
    for (const data of jsonData) {
        const dataToUpsertDirectory = {
            deptId: data.deptId,
            deptServices: data.deptServices || null,
            deptName: data.deptName,
            buildingId: data.buildingId,
            deptPhone: data.deptPhone || null,
            nodeId: data.nodeId || null,
        };
        const dataToUpsertNode = {
            nodeId: data.nodeId,
            x: data.departmentNodes?.x,
            y: data.departmentNodes?.y,
            floor: data.departmentNodes?.floor?.toString() || null,
            buildingId: data.departmentNodes?.buildingId.toString(),
            nodeType: data.departmentNodes?.nodeType,
            name: data.departmentNodes?.name,
            roomNumber: data.departmentNodes?.roomNumber?.toString() || null,
        };
        try {
            if (overwrite === 'Overwrite') {
                console.log('Overwriting');
                await PrismaClient.department.createMany({
                    data: dataToUpsertDirectory,
                    skipDuplicates: true, // Will occur when a department is in two locations
                });
                if (dataToUpsertNode.nodeId) {
                    await PrismaClient.node.createMany({
                        data: dataToUpsertNode,
                        skipDuplicates: true,
                    });
                }
            } else {
                console.log('updating');
                await PrismaClient.department.upsert({
                    where: { deptId: data.deptId },
                    update: dataToUpsertDirectory,
                    create: dataToUpsertDirectory,
                });
                if (dataToUpsertDirectory.nodeId) {
                    await PrismaClient.node.upsert({
                        where: { nodeId: data.nodeId },
                        update: dataToUpsertNode,
                        create: dataToUpsertNode,
                    });
                }
            }
        } catch (err) {
            console.log(err);
            res.sendStatus(400);
        }
    }
    res.sendStatus(200);
});

export default router;
