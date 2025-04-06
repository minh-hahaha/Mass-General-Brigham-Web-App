import { PrismaClient } from 'database';

// Create the prisma client, this automatically connects to the database
const client = new PrismaClient();

//EXAMPLE DATABASE VALUES
//is ran with "yarn run dev"
//if there's an error with "TABLECreateManyInput" make sure to run "yarn workspace database generate" in the console

async function main() {
    const createManyEmployees = await client.employee.createMany({
        data: [
            /*                                                                                                    yyyy:mm:dd */
            {
                id: 1,
                first_name: 'Test',
                middle_name: 'A',
                last_name: 'Person',
                position: 'Surgeon',
                date_hired: new Date(2025, 4, 5),
            },
            {
                id: 2,
                first_name: 'Test',
                middle_name: 'B',
                last_name: 'Person',
                position: 'Nurse',
                date_hired: new Date(2023, 6, 9),
            },
            {
                id: 3,
                first_name: 'Test',
                middle_name: 'C',
                last_name: 'Person',
                position: 'Doctor',
                date_hired: new Date(2020, 10, 17),
            },
            {
                id: 4,
                first_name: 'Test',
                middle_name: 'D',
                last_name: 'Person',
                position: 'Surgeon',
                date_hired: new Date(2022, 2, 6),
            },
            {
                id: 5,
                first_name: 'Test',
                middle_name: 'E',
                last_name: 'Person',
                position: 'Nurse',
                date_hired: new Date(2024, 1, 14),
            },
        ],
        skipDuplicates: true,
    });

    const createManyServiceReqs = await client.serviceRequest.createMany({
        data: [
            /*                                      yyyy:mm:dd  hh:mm:ss */
            {
                employee_id: 1,
                request_date: new Date(2025, 3, 15, 13, 32, 10),
                status: 'in progress',
                comments: 'comment',
                urgency: 10,
                location: 1,
                service: 'equipment',
            },
            {
                employee_id: null,
                request_date: new Date(2025, 3, 6, 9, 15, 14),
                status: 'not started',
                comments: null,
                urgency: 5,
                location: 2,
                service: 'equipment',
            },
            {
                employee_id: 2,
                request_date: new Date(2025, 4, 2, 10, 4, 38),
                status: 'in progress',
                comments: null,
                urgency: 2,
                location: 3,
                service: 'equipment',
            },
            {
                employee_id: 4,
                request_date: new Date(2025, 2, 20, 7, 8, 50),
                status: 'completed',
                comments: 'comment',
                urgency: 7,
                location: 4,
                service: 'equipment',
            },
            {
                employee_id: 2,
                request_date: new Date(2025, 1, 31, 15, 1, 42),
                status: 'in progress',
                comments: 'comment',
                urgency: 2,
                location: 5,
                service: 'equipment',
            },
            {
                employee_id: 3,
                request_date: new Date(2025, 4, 1, 13, 23, 30),
                status: 'not started',
                comments: 'comment',
                urgency: 3,
                location: 6,
                service: 'equipment',
            },
            {
                employee_id: 3,
                request_date: new Date(2025, 1, 16, 12, 54, 14),
                status: 'completed',
                comments: null,
                urgency: 1,
                location: 7,
                service: 'equipment',
            },
            {
                employee_id: null,
                request_date: new Date(2025, 4, 3, 10, 33, 11),
                status: 'not started',
                comments: 'comment',
                urgency: 4,
                location: 8,
                service: 'equipment',
            },
            {
                employee_id: null,
                request_date: new Date(2025, 3, 19, 15, 39, 20),
                status: 'not started',
                comments: null,
                urgency: 5,
                location: 9,
                service: 'equipment',
            },
            {
                employee_id: 5,
                request_date: new Date(2025, 4, 2, 3, 42, 15),
                status: 'completed',
                comments: null,
                urgency: 6,
                location: 10,
                service: 'equipment',
            },
        ],
        skipDuplicates: true,
    });
}

main().then(() => console.log('Inserted Temp Data'));

// Export the client
export default client;
