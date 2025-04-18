import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';
import { CSVtoData, dataToCSV, readCSV } from '../CSVImportExport.ts';
import * as path from 'node:path';
import fs from 'node:fs';

const router: Router = express.Router();

const DIRECTORY_SORT_OPTIONS: object[] = [];
DIRECTORY_SORT_OPTIONS.push({ deptName: 'asc' });
DIRECTORY_SORT_OPTIONS.push({ deptName: 'desc' });
DIRECTORY_SORT_OPTIONS.push({ buildingId: 'asc' });
DIRECTORY_SORT_OPTIONS.push({ buildingId: 'desc' });
DIRECTORY_SORT_OPTIONS.push({ building: { buildingName: 'asc' } });
DIRECTORY_SORT_OPTIONS.push({ building: { buildingName: 'desc' } });
DIRECTORY_SORT_OPTIONS.push({ locations: { some: { floor: 'asc' } } });
DIRECTORY_SORT_OPTIONS.push({ locations: { some: { floor: 'desc' } } });

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
                locations: { select: { floor: true } },
            },
            where: Object.assign({}, ...filters),
            orderBy: sorts,
        };
        console.log(args);
        //Attempt to pull from directory
        const DIRECTORY = await PrismaClient.department.findMany(args);
        //console.log(DIRECTORY);
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
                id: nodeId,
            },
        });
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
                locations: true,
            },
            orderBy: {
                deptId: 'desc',
            },
        });
        // Take the joined Location fields and flatten them for CSV parsing {xx:xx, yy:yy, zz:{aa:aa, bb:bb}} => {xx:xx, yy:yy, aa:aa, bb:bb}
        const flattenedDirectories = DIRECTORY.flatMap((directory) =>
            directory.locations.map((location) => ({
                ...directory,
                floor: location.floor,
                roomNum: location.roomNum,
                locId: location.locId,
                locType: location.locType,
                nodeId: location.nodeId,
            }))
        );
        await dataToCSV(flattenedDirectories);
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
            await PrismaClient.location.deleteMany();
        }
        for (let data of csvData) {
            const dataToUpsertDirectory = {
                deptId: data.deptId,
                deptServices: data.deptServices,
                deptName: data.deptName,
                buildingId: data.buildingId,
                deptPhone: data.deptPhone,
                nodeId: data.nodeId,
            };
            const dataToUpsertLocation = {
                locId: data.locId,
                departmentId: data.deptId,
                locType: data.locType,
                roomNum: data.roomNum,
                floor: data.floor,
            };
            if (overwrite === 'Overwrite') {
                console.log('Overwriting');
                await PrismaClient.department.createMany({
                    data: dataToUpsertDirectory,
                    skipDuplicates: true, // Will occur when a department is in two locations
                });
                await PrismaClient.location.createMany({
                    data: dataToUpsertLocation,
                    skipDuplicates: true, // This shouldn't happen but just in case
                });
            } else {
                console.log('updating');
                await PrismaClient.department.upsert({
                    where: { deptId: data.deptId },
                    update: dataToUpsertDirectory,
                    create: dataToUpsertDirectory,
                });
                await PrismaClient.location.upsert({
                    where: { locId: data.locId },
                    update: dataToUpsertLocation,
                    create: dataToUpsertLocation,
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
