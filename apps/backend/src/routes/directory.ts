import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';
import { CSVtoData, dataToCSV, readCSV } from '../CSVImportExport.ts';
import * as path from 'node:path';
import fs from 'node:fs';

const router: Router = express.Router();

// GET Send Data
router.get('/', async function (req: Request, res: Response) {
    // Attempt to get directory
    try {
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
