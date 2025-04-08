import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';
import { dataToCSV, readCSV } from '../CSVImportExport.ts';

const router: Router = express.Router();

// GET Send Data
router.get('/', async function (req: Request, res: Response) {
    // Attempt to get directory
    try {
        //Attempt to pull from directory
        const DIRECTORY = await PrismaClient.directory.findMany({
            include: {
                location: true,
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
        const DIRECTORY = await PrismaClient.directory.findMany({
            include: {
                location: true,
            },
        });
        // Take the joined Location fields and flatten them for CSV parsing {xx:xx, yy:yy, zz:{aa:aa, bb:bb}} => {xx:xx, yy:yy, aa:aa, bb:bb}
        const flattenedDirectories = DIRECTORY.flatMap((directory) =>
            directory.location.map((location) => ({
                ...directory,
                floor: location.floor,
                suite: location.suite,
            }))
        );

        await dataToCSV(flattenedDirectories);
        console.info('Successfully pulled directory'); // Log that it was successful
        //TODO: actually send the file
        //res.sendFile(DIRECTORY);
    } catch (error) {
        // Log any failures
        console.error(`NO DIRECTORY: ${error}`);
        res.sendStatus(204); // Send error
        return; // Don't try to send duplicate statuses
    }
});

router.post('/csv', async function (req: Request, res: Response) {
    const csvData = await readCSV('./data.csv');
    try {
        for (let data of csvData) {
            const dataToUpsertDirectory = {
                directory_id: data.directory_id,
                service: data.service,
                specialty: data.specialty,
                telephone: data.telephone,
            };
            const dataToUpsertLocation = {
                directory_id: data.directory_id,
                floor: data.floor,
                suite: data.suite.toString(),
            };
            await PrismaClient.directory.upsert({
                where: { directory_id: data.directory_id },
                update: dataToUpsertDirectory,
                create: dataToUpsertDirectory,
            });
            await PrismaClient.location.upsert({
                where: {
                    floor_suite: {
                        floor: data.floor,
                        suite: data.suite.toString(),
                    },
                },
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
