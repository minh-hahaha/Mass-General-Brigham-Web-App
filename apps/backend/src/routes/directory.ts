import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';
import { CSVtoData, dataToCSV, readCSV } from '../CSVImportExport.ts';
import * as path from 'node:path';

const router: Router = express.Router();

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
        //console.log(args);
        //Attempt to pull from directory
        const DIRECTORY = await PrismaClient.department.findMany(args);
        console.log(DIRECTORY);
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
            include: {
                departmentNodes: true,
            },
            orderBy: {
                deptId: 'desc',
            },
        });
        // Take the joined Node fields and flatten them for CSV parsing {xx:xx, yy:yy, zz:{aa:aa, bb:bb}} => {xx:xx, yy:yy, aa:aa, bb:bb}
        // const flattenedDirectories = DIRECTORY.flatMap(() => {} );
        // directory.departmentNodes.map((node) => ({
        //     ...directory,
        //     nodeId: node.nodeId,
        //     x: node.x,
        //     y: node.y,
        //     floor: node.floor,
        //     buildingId: node.buildingId,
        //     nodeType: node.nodeType,
        //     name: node.name,
        //     roomNumber: node.roomNumber,
        //     departmentId: node.departmentId,
        // }))

        await dataToCSV(DIRECTORY); //the big boy
        // Uses the first key as the name of the file EX: dep_id.csv
        const fileName = Object.keys(DIRECTORY[0])[0].toString();
        res.sendFile('data.csv', {
            root: path.join(__dirname, '../../'),
        });
        console.info('Successfully sent directory csv');
    } catch (error) {
        // Log any failures
        console.error(`NO DIRECTORY: ${error}`);
        res.sendStatus(204); // Send error
        return; // Don't try to send duplicate statuses
    }
});

router.post('/csv', async function (req: Request, res: Response) {
    const overwrite = req.query.overwrite as string;
    const [data, empty] = Object.entries(req.body);
    const csvData = CSVtoData(data[0].toString());
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
                nodeId: data.nodeId,
            };

            const dataToUpsertNode = {
                nodeId: data.nodeId,
                x: data.x,
                y: data.y,
                floor: data.floor,
                buildingId: data.buildingId,
                nodeType: data.nodeType,
                name: data.name,
                roomNumber: data.roomNumber,
                departments: data.deptId ?? null,
            };
            if (overwrite === 'Overwrite') {
                console.log('Overwriting');
                await PrismaClient.department.createMany({
                    data: dataToUpsertDirectory,
                    skipDuplicates: true, // Will occur when a department is in two locations
                });

                await PrismaClient.node.createMany({
                    data: dataToUpsertNode,
                    skipDuplicates: true,
                });
            } else {
                console.log('updating');
                await PrismaClient.department.upsert({
                    where: { deptId: data.deptId },
                    update: dataToUpsertDirectory,
                    create: dataToUpsertDirectory,
                });
                await PrismaClient.node.upsert({
                    where: { nodeId: data.nodeId },
                    update: dataToUpsertNode,
                    create: dataToUpsertNode,
                });
            }
        }
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
});

export default router;
