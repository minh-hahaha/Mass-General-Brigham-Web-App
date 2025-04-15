import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';
import { CSVtoData, dataToCSV, readCSV } from '../CSVImportExport.ts';
import * as path from 'node:path';
import fs from 'node:fs';
import { buildQuery, QueryOptions } from '../Utility.ts';

const router: Router = express.Router();

export enum SORT_OPTIONS {
    DEP_ID_ASC,
    DEP_ID_DSC,
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
DIRECTORY_SORT_OPTIONS.push({ deptId: 'asc' });
DIRECTORY_SORT_OPTIONS.push({ deptId: 'desc' });
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

export interface DirectoryRequestName {
    dep_name: string;
}

// GET Send Data
router.get('/', async function (req: Request, res: Response) {
    // Get from url
    // should be in the format: http://localhost:3000/api/directory?sortOptions=[]&filterOptions=[]&maxQuery=anyNumber
    // Attempt to get directory
    try {
        let queryOptions: QueryOptions;
        let sortOptions: number[] = [];
        let filterOptions: number[] = [FILTER_OPTIONS.INCLUDE_ALL];
        let maxQuery: number | undefined = undefined;
        try {
            sortOptions = JSON.parse(req.query.sortOptions as string);
            filterOptions = JSON.parse(req.query.filterOptions as string);
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
        // Create the query args from queryOptions
        const args = buildQuery(queryOptions);
        // Include the locations table
        const locationArgs = {
            locations: {},
        };
        if (
            sortOptions.includes(SORT_OPTIONS.FLOOR_ASC) ||
            sortOptions.includes(SORT_OPTIONS.FLOOR_DSC)
        ) {
            locationArgs.locations = Object.assign(
                {},
                ...sortOptions
                    .filter(
                        (option) =>
                            option === SORT_OPTIONS.FLOOR_ASC || option === SORT_OPTIONS.FLOOR_DSC
                    )
                    .map((option) => DIRECTORY_SORT_OPTIONS[option])
            );
        }
        args.select = { ...args.select, locations: true };
        //Attempt to pull from directory
        const DIRECTORY = await PrismaClient.department.findMany({
            include: {
                locations: true,
            },
        });
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
    } catch (error) {
        console.error(`NO DIRECTORY_NAMES: ${error}`);
        res.sendStatus(404);
        return;
    }
});

// router.get('/nameSearch', async function (req: Request, res: Response) {
//     try {
//         const depName = req.query.dep_name as string;
//
//         const departments = await PrismaClient.department.findMany({
//             where: {
//                 deptName: depName,
//             }
//             include: {
//                 locations: {
//                     include: {
//                         : true,
//                     },
//                 },
//             },
//         });
//
//         res.status(200).json(departments);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// GET Send CSV
router.get('/csv', async function (req: Request, res: Response) {
    // Attempt to get directory
    try {
        //Attempt to pull from directory
        const DIRECTORY = await PrismaClient.department.findMany({
            include: {
                locations: true,
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
            }))
        );
        await dataToCSV(flattenedDirectories);
        console.info('Successfully pulled directory'); // Log that it was successful
        // Uses the first key as the name of the file EX: dep_id.csv
        const fileName = Object.keys(DIRECTORY[0])[0].toString();
        res.sendFile(`${fileName}.csv`, {
            root: path.join(__dirname, '../../'),
        });
    } catch (error) {
        // Log any failures
        console.error(`NO DIRECTORY: ${error}`);
        res.sendStatus(204); // Send error
        return; // Don't try to send duplicate statuses
    }
});

//TODO: JAKE HELP THERE IS NO NODE HERE
// router.post('/csv', async function (req: Request, res: Response) {
//     const [test, test2] = Object.entries(req.body);
//     const csvData = CSVtoData(test[0].toString());
//     try {
//         for (let data of csvData) {
//             const dataToUpsertDirectory = {
//                 deptId: data.deptId,
//                 deptServices: data.deptServices,
//                 deptName: data.deptName,
//                 buildingId: data.buildingId,
//                 deptPhone: data.deptPhone,
//             };
//             const dataToUpsertLocation = {
//                 locId: data.locId,
//                 departmentId: data.deptId,
//                 locType: data.locType,
//                 roomNum: data.roomNum,
//                 floor: data.floor,
//             };
//             await PrismaClient.department.upsert({
//                 where: { deptId: data.deptId },
//                 update: dataToUpsertDirectory,
//                 create: dataToUpsertDirectory,
//             });
//             await PrismaClient.location.upsert({
//                 where: { locId: data.locId },
//                 update: dataToUpsertLocation,
//                 create: dataToUpsertLocation,
//             });
//         }
//         res.sendStatus(200);
//     } catch (err) {
//         console.log(err);
//         res.sendStatus(400);
//     }
// });

export default router;
