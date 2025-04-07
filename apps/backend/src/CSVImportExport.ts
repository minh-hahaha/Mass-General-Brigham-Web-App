import fs from 'node:fs';
import PrismaClient from './bin/prisma-client';

export async function dataToCSV(data: Record<string, any>[]) {
    const headers: string[] = [];
    const dataHeaders = data.pop();
    if (dataHeaders !== undefined) {
        Object.entries(dataHeaders).forEach(([k, v]) => {
            if (!Array.isArray(v)) {
                headers.push(k);
            }
        });
    }

    let dataToWrite = '';
    let row = data.pop();
    while (row !== undefined) {
        const csvData: any[] = [];
        for (let [key, value] of Object.entries(row)) {
            if (Array.isArray(value) && value.length > 0) {
                continue;
            }
            if (!headers.includes(key)) {
                headers.push(key);
            }
            if (value instanceof Date) {
                csvData.push(value.toISOString());
                continue;
            }
            if (typeof value === 'string') {
                csvData.push(value.replaceAll(',', '"@"'));
            } else {
                csvData.push(value);
            }
        }
        dataToWrite += csvData.toString() + '\n';
        row = data.pop();
    }

    // Write all data to data.csv
    fs.writeFile('data.csv', headers + '\n' + dataToWrite, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Successfully created file');
        }
    });
}

export async function readCSV(pathToFile: string): Promise<Record<string, any>[]> {
    return new Promise((resolve, reject) => {
        fs.readFile(pathToFile, 'utf8', async (err, data) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            resolve(CSVtoData(data));
        });
    });
}

async function CSVtoData(data: string): Promise<Record<string, any>[]> {
    console.log('Data to CSV');

    let splitData = data.split('\n');
    let headerFields = splitData[0].split(',');
    console.log(headerFields);

    // Parse the non-header CSV data
    const objs: Record<string, any>[] = [];
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

            // Check if the value is null
            if (value === 'null') {
                obj[headerFields[j]] = null;
                continue;
            }

            // Otherwise, add as is
            obj[headerFields[j]] = row[j].replaceAll('"@"', ',');
        }
        console.log(obj);
        objs.push(obj);
    }
    return objs;
}
