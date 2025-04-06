import express, { Router, Request, Response } from 'express';
import { Prisma } from 'database';
import PrismaClient from '../bin/prisma-client';
import * as fs from 'node:fs';

const router: Router = express.Router();

router.get('/', async function (req: Request, res: Response) {
    // Attempt to get list of employees
    try {
        //Attempt to pull from employee
        const EMPLOYEE_LIST = await PrismaClient.employee.findMany({
            orderBy: {
                last_name: 'asc',
            },
        });
        // Temporary for testing
        await dataToCSV(EMPLOYEE_LIST).then(async () => await readCSV('./data.csv'));
        console.info('Successfully pulled employees score'); // Log that it was successful
        console.log(EMPLOYEE_LIST);
        res.send(EMPLOYEE_LIST);
    } catch (error) {
        // Log any failures
        console.error(`NO EMPLOYEES: ${error}`);
        res.sendStatus(204); // Send error
        return; // Don't try to send duplicate statuses
    }

    // res.sendStatus(200); // Otherwise say it's fine
});

async function dataToCSV(data: Record<string, any>[]) {
    //TODO: clean data for commas which would throw off CSV

    // Get Field headers
    let headerString = '';
    let headerField = Object.keys(data[0]);
    for (let i = 0; i < headerField.length; i++) {
        headerString += headerField[i] + ',';
    }
    // Remove ending ',' from the for loop and add a new line
    headerString = headerString.substring(0, headerString.length - 1) + '\n';

    // Get table data
    let tableData = '';
    for (let i = 0; i < data.length; i++) {
        let dataString = '';
        for (let [key, value] of Object.entries(data[i])) {
            // Make sure date data is formatted correctly
            if (value instanceof Date) {
                dataString += value.toISOString() + ',';
            } else {
                dataString += value + ',';
            }
        }
        // Remove ending ',' from the for loop and add a new line
        dataString = dataString.substring(0, dataString.length - 1) + '\n';

        tableData += dataString;
    }
    // Write all data to data.csv
    fs.writeFile('data.csv', headerString + tableData, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Successfully created file');
        }
    });
}

async function readCSV(pathToFile: string) {
    fs.readFile(pathToFile, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        CSVtoData(data);
    });
}

async function CSVtoData(data: string) {
    console.log('Data to CSV');

    let splitData = data.split('\n');
    let headerFields = splitData[0].split(',');
    console.log(headerFields);

    // Parse the non-header CSV data
    for (let i = 1; i < splitData.length - 1; i++) {
        let row = splitData[i].split(',');
        console.log(row);
        // Go through all the CSV's data and turn it back into {xx: xx, xx: xx} format
        const obj: Record<string, any> = {};
        for (let j = 0; j < row.length; j++) {
            const value = row[j];

            // Check if the current value is a number
            const num = Number(value);
            if (!isNaN(num) && value.trim() !== '') {
                obj[headerFields[j]] = num;
                continue;
            }

            // Check if the current value is a date
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                obj[headerFields[j]] = date.toISOString();
                continue;
            }

            // Otherwise, add as is
            obj[headerFields[j]] = row[j];
        }
        console.log(obj);
        const dataToUpsert = {
            id: obj.id,
            first_name: obj.first_name,
            middle_name: obj.middle_name,
            last_name: obj.last_name,
            position: obj.position,
            date_hired: obj.date_hired,
        };
        // Update or insert the changed or new values into the table
        await PrismaClient.employee.upsert({
            where: { id: obj.id },
            update: dataToUpsert,
            create: dataToUpsert,
        });
    }
}

export default router;
