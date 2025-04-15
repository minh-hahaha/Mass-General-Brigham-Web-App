import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';
import { CSVtoData, dataToCSV, readCSV } from '../CSVImportExport.ts';
import * as path from 'node:path';
import fs from 'node:fs';

const router: Router = express.Router();

export interface DirectoryRequestName {
    dep_name: string;
}

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


router.get('/name', async function (req: Request, res: Response) {
    try {
        const DIRECTORY_NAMES = await PrismaClient.department.findMany({
            select:{
                dep_name:true
            }
        })
    } catch (error){
        console.error(`NO DIRECTORY_NAMES: ${error}`);
        res.sendStatus(404);
        return;
    }
})

router.get('/nameSearch', async function (req: Request, res: Response) {
    try {
        const depName = req.query.dep_name as string;

        const departments = await PrismaClient.department.findMany({
            where: {
                dep_name: depName,
            },
            include: {
                locations: {
                    include: {
                        : true,
                    },
                },
            },
        });

        res.status(200).json(departments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
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
