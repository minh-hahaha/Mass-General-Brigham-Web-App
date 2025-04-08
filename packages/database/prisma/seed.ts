import { PrismaClient } from 'database'


// Create the prisma client, this automatically connects to the database
const prisma = new PrismaClient();

//EXAMPLE DATABASE VALUES
//is ran with "yarn run dev"
//if there's an error with "TABLECreateManyInput" make sure to run "yarn workspace database generate" in the console

async function main() {
    const createManyEmployees = await prisma.employee.createMany({
        data: [
            /*                                                                                                    yyyy:mm:dd */
            {
                id: 1,
                first_name: 'Test',
                middle_name: 'A',
                last_name: 'Person',
                position: 'Surgeon',
                date_hired: new Date(2025, 4, 5),
                email: 'surgeon1@gmail.com',
                password: 'surgeon',
                department_id: 1,
            },
            {
                id: 2,
                first_name: 'Test',
                middle_name: 'B',
                last_name: 'Person',
                position: 'Nurse',
                date_hired: new Date(2023, 6, 9),
                email: 'nurse1@gmail.com',
                password: 'nurse',
                department_id: 2,
            },
            {
                id: 3,
                first_name: 'Test',
                middle_name: 'C',
                last_name: 'Person',
                position: 'Doctor',
                date_hired: new Date(2020, 10, 17),
                email: 'doctor1@gmail.com',
                password: 'doctor',
                department_id: 3,
            },
            {
                id: 4,
                first_name: 'Test',
                middle_name: 'D',
                last_name: 'Person',
                position: 'Surgeon',
                date_hired: new Date(2022, 2, 6),
                email: 'surgeon2@gmail.com',
                password: 'surgeon2',
                department_id: 4,
            },
            {
                id: 5,
                first_name: 'Test',
                middle_name: 'E',
                last_name: 'Person',
                position: 'Nurse',
                date_hired: new Date(2024, 1, 14),
                email: 'nurse2@gmail.com',
                password: 'nurse2',
                department_id: 5,
            },
        ],
        skipDuplicates: true,
    });

    const createManyServiceReqs = await prisma.serviceRequest.createMany({
        data: [
            /*                                      yyyy:mm:dd  hh:mm:ss */
            {
                request_id: 1,
                employee_id: 1,
                request_date: new Date(2025, 3, 15, 13, 32, 10),
                status: 'in progress',
                comments: 'comment',
                priority: "urgent",
                location_id: 1,
                service_type: 'equipment',
                transport_type:'Equipment Request',
            },
            {
                request_id: 2,
                employee_id: null,
                request_date: new Date(2025, 3, 6, 9, 15, 14),
                status: 'not started',
                comments: null,
                priority: "urgent",
                location_id: 1,
                service_type: 'equipment',
                transport_type:'Equipment Request',
            },
            {
                request_id: 3,
                employee_id: 2,
                request_date: new Date(2025, 4, 2, 10, 4, 38),
                status: 'in progress',
                comments: null,
                priority: "urgent",
                location_id: 1,
                service_type: 'equipment',
                transport_type:'Equipment Request',
            },
            {
                request_id: 4,
                employee_id: 4,
                request_date: new Date(2025, 2, 20, 7, 8, 50),
                status: 'completed',
                comments: 'comment',
                priority: "urgent",
                location_id: 1,
                service_type: 'equipment',
                transport_type:'Equipment Request',
            },
            {
                request_id: 5,
                employee_id: 2,
                request_date: new Date(2025, 1, 31, 15, 1, 42),
                status: 'in progress',
                comments: 'comment',
                priority: "urgent",
                location_id: 1,
                service_type: 'equipment',
                transport_type:'Equipment Request',
            },
            {
                request_id: 6,
                employee_id: 3,
                request_date: new Date(2025, 4, 1, 13, 23, 30),
                status: 'not started',
                comments: 'comment',
                priority: "urgent",
                location_id: 1,
                service_type: 'equipment',
                transport_type:'Equipment Request',
            },
            {
                request_id: 7,
                employee_id: 3,
                request_date: new Date(2025, 1, 16, 12, 54, 14),
                status: 'completed',
                comments: null,
                priority: "urgent",
                location_id: 1,
                service_type: 'equipment',
                transport_type:'Equipment Request',
            },
            {
                request_id: 8,
                employee_id: null,
                request_date: new Date(2025, 4, 3, 10, 33, 11),
                status: 'not started',
                comments: 'comment',
                priority: "urgent",
                location_id: 1,
                service_type: 'equipment',
                transport_type:'Equipment Request',
            },
            {
                request_id: 9,
                employee_id: null,
                request_date: new Date(2025, 3, 19, 15, 39, 20),
                status: 'not started',
                comments: null,
                priority: "urgent",
                location_id: 1,
                service_type: 'equipment',
                transport_type:'Equipment Request',
            },
            {
                request_id: 10,
                employee_id: 5,
                request_date: new Date(2025, 4, 2, 3, 42, 15),
                status: 'completed',
                comments: null,
                priority: "urgent",
                location_id: 1,
                service_type: 'equipment',
                transport_type:'Equipment Request',
            },
        ],
        skipDuplicates: true,
    });
    console.log({ createManyEmployees, createManyServiceReqs})
}


main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()


    })
main().then(() => console.log('Temp Data Loaded'));


