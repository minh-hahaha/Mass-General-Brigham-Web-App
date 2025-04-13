import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';
import { CSVtoData, dataToCSV, readCSV } from '../CSVImportExport.ts';
import * as path from 'node:path';
import fs from 'node:fs';
import { buildQuery, QueryOptions } from '../Utility.ts';

const router: Router = express.Router();

export const SORT_OPTIONS = {
    DEP_ID_ASC: { dep_id: 'asc' },
    DEP_ID_DSC: { dep_id: 'desc' },
    DEP_NAME_ASC: { dep_name: 'asc' },
    DEP_NAME_DSC: { dep_name: 'desc' },
    BLDG_ID_ASC: { building_id: 'desc' },
    BLDG_ID_DSC: { building_id: 'desc' },
    FLOOR_ASC: { floor: 'asc' },
    FLOOR_DSC: { floor: 'asc' },
};

export const FILTER_OPTIONS = {
    INCLUDE_DEP_ID: { dep_id: true },
    INCLUDE_SERVICES: { dep_services: true },
    INCLUDE_NAME: { dep_name: true },
    INCLUDE_BLDG_ID: { building_id: true },
    INCLUDE_PHONE: { dep_phone: true },
};

// GET Send Data
router.get('/', async function (req: Request, res: Response) {
    // Attempt to get directory
    try {
        const queryOptions: QueryOptions = {
            sortOptions: SORT_OPTIONS.BLDG_ID_ASC,
            filterOptions: [FILTER_OPTIONS.INCLUDE_DEP_ID, FILTER_OPTIONS.INCLUDE_NAME],
            maxQuery: 2,
        };
        const args = buildQuery(queryOptions);
        args.select = { ...args.select, locations: true };
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
