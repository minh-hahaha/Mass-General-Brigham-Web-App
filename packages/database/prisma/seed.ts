import client from '../../../apps/backend/src/bin/prisma-client.ts'


// Create the prisma client, this automatically connects to the database
//const prisma = new PrismaClient();

//EXAMPLE DATABASE VALUES
//is ran with "yarn run dev"
//if there's an error with "TABLECreateManyInput" make sure to run "yarn workspace database generate" in the console

async function main() {
    const createManyDepartments = await client.department.createMany({
        data: [
            /*                                                                                                    yyyy:mm:dd */
            {
                dep_id: 1,
                dep_name: 'Department1',
                building_id: 0,
                dep_phone: '1',
                dep_services: 'surgery',
            },
            {
                dep_id: 2,
                dep_name: 'Department2',
                building_id: 0,
                dep_phone: '12',
                dep_services: 'surgery',
            },
            {
                dep_id: 3,
                dep_name: 'Department3',
                building_id: 0,
                dep_phone: '123',
                dep_services: 'surgery',
            },
            {
                dep_id: 4,
                dep_name: 'Department4',
                building_id: 0,
                dep_phone: '1234',
                dep_services: 'surgery',
            },
            {
                dep_id: 5,
                dep_name: 'Department5',
                building_id: 0,
                dep_phone: '12345',
                dep_services: 'surgery',
            },
        ],
        skipDuplicates: true,
    });
    const createManyBuildings = await client.building.createMany({
        data: [
            /*                                                                                                    yyyy:mm:dd */
            {

                building_name: 'Building0',

            },
        ],
    });
    const createManyLocations = await client.location.createMany({
        data: [
            /*                                                                                                    yyyy:mm:dd */
            {
                loc_type: 'hallway',
                floor: 0,
            },
        ],
    });

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

    const createManyServiceReqs = await client.serviceRequest.createMany({
        data: [
            /* 
                                                 yyyy:mm:dd  hh:mm:ss */

            {
                status: 'Completed',
                priority: 'urgent',
                service_type: 'Patient Transportation',
                transport_type: 'Gurney',
            },

            {
                status: 'In Progress',
                priority: 'urgent',
                service_type: 'Equipment Request',
                transport_type: 'Cart',
            },
            {
                status: 'Queued',
                priority: 'urgent',
                service_type: 'X-Ray',
                transport_type: 'None',
            },
            {
                status: 'Queued',
                priority: 'urgent',
                service_type: 'equipment request',
                transport_type: 'cart',
            },
            {
                status: 'Queued',
                priority: 'urgent',
                service_type: 'Blood Work',
                transport_type: 'None',
            },
        ],
        skipDuplicates: true,
    });



    console.log({ createManyDepartments, createManyBuildings , createManyLocations, createManyEmployees , createManyServiceReqs});
}


main()
    .then(async () => {
        await client.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await client.$disconnect()


    })
main().then(() => console.log('Temp Data Loaded'));


