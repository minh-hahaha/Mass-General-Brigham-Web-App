import { PrismaClient } from '../../../../packages/database';

// Create the prisma client, this automatically connects to the database
const client = new PrismaClient();

//EXAMPLE DATABASE VALUES
//is ran with "yarn run dev"
//if there's an error with "TABLECreateManyInput" make sure to run "yarn workspace database generate" in the console

async function main() {}

main().then(() => console.log('Temp Data Loaded'));

// Export the client
export default client;
