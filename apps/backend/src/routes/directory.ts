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
DIRECTORY_SORT_OPTIONS.push({ dep_id: 'asc' });
DIRECTORY_SORT_OPTIONS.push({ dep_id: 'desc' });
DIRECTORY_SORT_OPTIONS.push({ dep_name: 'asc' });
DIRECTORY_SORT_OPTIONS.push({ dep_name: 'desc' });
DIRECTORY_SORT_OPTIONS.push({ building_id: 'asc' });
DIRECTORY_SORT_OPTIONS.push({ building_id: 'desc' });
DIRECTORY_SORT_OPTIONS.push({ floor: 'asc' });
DIRECTORY_SORT_OPTIONS.push({ floor: 'desc' });

const DIRECTORY_FILTER_OPTIONS: object[] = [];
DIRECTORY_FILTER_OPTIONS.push({ dep_id: true });
DIRECTORY_FILTER_OPTIONS.push({ dep_services: true });
DIRECTORY_FILTER_OPTIONS.push({ dep_name: true });
DIRECTORY_FILTER_OPTIONS.push({ building_id: true });
DIRECTORY_FILTER_OPTIONS.push({ dep_phone: true });
DIRECTORY_FILTER_OPTIONS.push(Object.assign({}, ...DIRECTORY_FILTER_OPTIONS));

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
                room_num: location.room_num,
                loc_id: location.loc_id,
                loc_type: location.loc_type,
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

router.post('/csv', async function (req: Request, res: Response) {
    const [test, test2] = Object.entries(req.body);
    const csvData = CSVtoData(test[0].toString());
    try {
        for (let data of csvData) {
            const dataToUpsertDirectory = {
                dep_id: data.dep_id,
                dep_services: data.dep_services,
                dep_name: data.dep_name,
                building_id: data.building_id,
                dep_phone: data.dep_phone,
            };
            const dataToUpsertLocation = {
                loc_id: data.loc_id,
                department_id: data.dep_id,
                loc_type: data.loc_type,
                room_num: data.room_num,
                floor: data.floor,
            };
            await PrismaClient.department.upsert({
                where: { dep_id: data.dep_id },
                update: dataToUpsertDirectory,
                create: dataToUpsertDirectory,
            });
            await PrismaClient.location.upsert({
                where: { loc_id: data.loc_id },
                update: dataToUpsertLocation,
                create: dataToUpsertLocation,
            });
        }
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
});

export default router;
