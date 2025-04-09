import { PrismaClient } from 'database';

// Create the prisma client, this automatically connects to the database
const client = new PrismaClient();

//EXAMPLE DATABASE VALUES
//is ran with "yarn run dev"
//if there's an error with "TABLECreateManyInput" make sure to run "yarn workspace database generate" in the console

async function main() {
    const createEmployee = await client.employee.create({
        data: {
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
}

main().then(() => console.log('Temp Data Loaded'));

// Export the client
export default client;
