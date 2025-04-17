import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';
import { CSVtoData, dataToCSV, readCSV } from '../CSVImportExport.ts';
import * as path from 'node:path';
import fs from 'node:fs';
import { buildQuery, QueryBuilder } from '../Utility.ts';

const router: Router = express.Router();

export enum SORT_OPTIONS {
    DEP_NAME_ASC,
    DEP_NAME_DSC,
    BLDG_ID_ASC,
    BLDG_ID_DSC,
    FLOOR_ASC,
    FLOOR_DSC,
}

export enum FILTER_OPTIONS {
    INCLUDE_DEP_ID,
    INCLUDE_SERVICES,
    INCLUDE_NAME,
    INCLUDE_BLDG_ID,
    INCLUDE_PHONE,
    INCLUDE_ALL,
}

const DIRECTORY_SORT_OPTIONS: object[] = [];
DIRECTORY_SORT_OPTIONS.push({ deptName: 'asc' });
DIRECTORY_SORT_OPTIONS.push({ deptName: 'desc' });
DIRECTORY_SORT_OPTIONS.push({ buildingId: 'asc' });
DIRECTORY_SORT_OPTIONS.push({ buildingId: 'desc' });
DIRECTORY_SORT_OPTIONS.push({ floor: 'asc' });
DIRECTORY_SORT_OPTIONS.push({ floor: 'desc' });

const DIRECTORY_FILTER_OPTIONS: object[] = [];
DIRECTORY_FILTER_OPTIONS.push({ deptId: true });
DIRECTORY_FILTER_OPTIONS.push({ deptServices: true });
DIRECTORY_FILTER_OPTIONS.push({ deptName: true });
DIRECTORY_FILTER_OPTIONS.push({ buildingId: true });
DIRECTORY_FILTER_OPTIONS.push({ deptPhone: true });
DIRECTORY_FILTER_OPTIONS.push(Object.assign({}, ...DIRECTORY_FILTER_OPTIONS));

// GET Send Data
router.get('/', async function (req: Request, res: Response) {
    // Get from url
    // should be in the format: http://localhost:3000/api/directory?sortOptions=[]&filterOptions=[]&maxQuery=anyNumber
    // Attempt to get directory
    try {
        let queryOptions: QueryBuilder;
        let sortOptions: number[] = [];
        let filterOptions: number[] = [FILTER_OPTIONS.INCLUDE_ALL];
        let maxQuery: number | undefined = undefined;
        try {
            sortOptions = Array.isArray(req.query.sortOptions)
                ? req.query.sortOptions.map(Number)
                : [];
            filterOptions = Array.isArray(req.query.filterOptions)
                ? req.query.filterOptions.map(Number)
                : [];
            maxQuery = Number(req.query.maxQuery as string);
            // Try to create query options from url data
            queryOptions = {
                sortOptions: sortOptions
                    .filter(
                        (option) =>
                            option !== SORT_OPTIONS.FLOOR_ASC && option !== SORT_OPTIONS.FLOOR_DSC
                    )
                    .map((option) => DIRECTORY_SORT_OPTIONS[option]),
                filterOptions: filterOptions.map((option) => DIRECTORY_FILTER_OPTIONS[option]),
                maxQuery: Number.isNaN(maxQuery) ? undefined : maxQuery,
            };
        } catch (error) {
            // If that fails, use default queryOptions set above
            queryOptions = {
                sortOptions: sortOptions.map((option) => DIRECTORY_SORT_OPTIONS[option]),
                filterOptions: filterOptions.map((option) => DIRECTORY_FILTER_OPTIONS[option]),
                maxQuery: maxQuery,
            };
        }
        console.log(queryOptions);
        // Create the query args from queryOptions
        const args = buildQuery(queryOptions);
        // Include the locations table
        args.select = {
            locations: {
                orderBy: { floor: 'asc' },
                select: { floor: true },
            },
            building: {
                select: { buildingName: true },
            },
            ...args.select,
        };
        console.log(args);
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
