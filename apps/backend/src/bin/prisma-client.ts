import { PrismaClient } from 'database';

// Create the prisma client, this automatically connects to the database
const client = new PrismaClient();

export default client;
