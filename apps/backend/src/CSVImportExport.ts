import fs from 'node:fs';

export async function dataToCSV(data: Record<string, any>[]) {
    const headers: string[] = [];
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
                // Any data with double quotes, commas or CRLF (\n\r) need to be encased in double quotes
                let newVal = value.replaceAll('"', '""');
                if (
                    value.includes(',') ||
                    value.includes('\n') ||
                    value.includes('\r') ||
                    value.includes('\r\n')
                ) {
                    newVal = '"' + newVal + '"';
                }
                csvData.push(newVal);
            } else {
                if (value === null) {
                    csvData.push('null');
                } else {
                    csvData.push(value);
                }
            }
        }
        dataToWrite += csvData.toString() + '\r\n';
        row = data.pop();
    }

    // Return csv data as string
    return headers + '\r\n' + dataToWrite;
}

export async function readCSV(pathToFile: string): Promise<Record<string, any>[]> {
    return new Promise((resolve, reject) => {
        fs.readFile(pathToFile, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            resolve(CSVtoData(data));
        });
    });
}

export function CSVtoData(data: string): Record<string, any>[] {
    let splitData: string[] = [];
    // Windows Line Splitting
    if (data.includes('\r\n')) {
        splitData = data.split('\r\n');
    } else {
        // macOS Unix Linux Line Splitting
        splitData = data.split('\n');
    }
    let headerFields = splitData[0].split(',');

    // Parse the non-header CSV data
    const objs: Record<string, any>[] = [];
    for (let i = 1; i < splitData.length; i++) {
        if (splitData[i] === '') {
            continue;
        }
        let row = splitString(splitData[i]);
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
            // Shouldn't need this cause it just gets turned back to a string anyway
            // const date = new Date(value);
            // if (!isNaN(date.getTime())) {
            //     obj[headerFields[j]] = date.toISOString();
            //     continue;
            // }

            // Check if the value is null
            if (value === 'null') {
                obj[headerFields[j]] = null;
                continue;
            }

            // Check if the value is boolean
            if (value === 'true') {
                obj[headerFields[j]] = true;
                continue;
            } else if (value === 'false') {
                obj[headerFields[j]] = false;
                continue;
            }

            // Otherwise, add as is
            obj[headerFields[j]] = row[j];
        }
        objs.push(obj);
    }
    return objs;
}

function splitString(row: string): string[] {
    let inQuotes = false;
    let stringPiece = '';
    let splitString: string[] = [];

    for (let i = 0; i < row.length; i++) {
        let char = row[i];
        // Check for quote marks, denoting the final string having "'s or a comma in it
        if (char === '"') {
            // Check for double quotes, which means that one of the "'s is part of the original string
            if (inQuotes && row[i + 1] === '"') {
                stringPiece += '\"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
            // A comma not in quotes signifies the end of the string
        } else if (char === ',' && !inQuotes) {
            splitString.push(stringPiece);
            stringPiece = '';
            // Otherwise add the character normally
        } else {
            stringPiece += char;
        }
    }
    // Add the final string to the array
    splitString.push(stringPiece);
    return splitString;
}
