import { PrismaClient } from 'database';

// Create the prisma client, this automatically connects to the database
const client = new PrismaClient();

//EXAMPLE DATABASE VALUES
//is ran with "yarn run dev"
//if there's an error with "TABLECreateManyInput" make sure to run "yarn workspace database generate" in the console

async function main() {
    /*
    const createEmployee = await client.employee.create({
        data: {
            id: 0,
            first_name: 'AdMinh',
            middle_name: '',
            last_name: 'Ha',
            position: 'Surgeon',
            date_hired: new Date(2025, 4, 5),
            email: 'admin',
            password: 'admin',
            admin: true,
        },
    });

    const createBuilding = await client.building.create({
        data: {
            building_id: 0,
            building_name: 'admin',
        },
    });

    const createDepartment = await client.department.create({
        data: {
            dep_id: 0,
            dep_services: 'test department',
            dep_name: 'Admin Department',
            building_id: 0,
            dep_phone: '508-111-1111',
        },
    });

    const createLocation = await client.location.create({
        data: {
            loc_id: 0,
            room_num: 0,
            floor: 0,
            department_id: 0,
            loc_type: 'test location',
        },
    });

    const createServiceRequest = await client.serviceRequest.create({
        data: {
            request_id: 0,
            employee_id: 0,
            request_date: new Date('2025-04-08T14:30:00Z').toISOString(),
            status: 'Pending',
            comments: 'test service request',
            location_id: 0,
            service_type: 'Patient Transport',
            priority: 'High',
            request_time: new Date('2025-04-08T14:30:00Z').toISOString(),
            transport_type: 'Other',
        },
    });

    const createTransportRequest = await client.patientTransport.create({
        data: {
            patient_id: 0,
            patient_name: 'AdMinh',
            pickup_location: 'Library 302',
            servReq_id: 0,
        },
    });
     */
}

main().then(() => console.log('Temp Data Loaded'));

// Export the client
export default client;
