import { PrismaClient } from 'database';

// Create the prisma client, this automatically connects to the database
const client = new PrismaClient();

//EXAMPLE DATABASE VALUES
//is ran with "yarn run dev"
//if there's an error with "TABLECreateManyInput" make sure to run "yarn workspace database generate" in the console

async function main() {
    const createBuilding = await client.building.create({
        data: {
            building_name: 'name',
            building_id: 1,
        },
    });

    const createDepartment = await client.department.create({
        data: {
            dep_services: 'Intensive Care',
            dep_name: 'Wilson Wong ICU',
            building_id: 1,
            dep_phone: 'Phone Number',
        },
    });
}

main().then(() => console.log('Temp Data Loaded'));

// Export the client
export default client;
