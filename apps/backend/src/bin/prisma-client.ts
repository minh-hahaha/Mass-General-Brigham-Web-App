import { PrismaClient } from '../../../../packages/database';
//
// Create the prisma client, this automatically connects to the database
const client = new PrismaClient();
//
// //EXAMPLE DATABASE VALUES
// //is ran with "yarn run dev"
// //if there's an error with "TABLECreateManyInput" make sure to run "yarn workspace database generate" in the console
//
// async function main() {
//     /* const createEmployee = await client.employee.create({
//         data: {
//             first_name: 'AdMinh',
//             middle_name: '',
//             last_name: 'Ha',
//             position: 'Surgeon',
//             date_hired: new Date(2025, 4, 5),
//             email: 'admin',
//             password: 'admin',
//             admin: true,
//         },
//     });*/
//     populateDatabase();
// }
//
// main().then(() => console.log('Temp Data Loaded'));
//
// async function populateDatabase() {
//     try {
//         // Node Data
//         const nodesData = [
//             {
//                 shortName: 'A',
//                 xPixel: 384.23,
//                 yPixel: 441.85,
//                 floor: 1,
//                 nodeType: 'Parking Lot',
//                 building: 'Main Building',
//                 longName: 'Parking Lot A',
//             },
//             {
//                 shortName: 'B',
//                 xPixel: 383.76,
//                 yPixel: 494.05,
//                 floor: 1,
//                 nodeType: 'Parking Lot',
//                 building: 'Main Building',
//                 longName: 'Parking Lot B',
//             },
//             {
//                 shortName: 'C',
//                 xPixel: 548.14,
//                 yPixel: 495.39,
//                 floor: 1,
//                 nodeType: 'Parking Lot',
//                 building: 'Main Building',
//                 longName: 'Parking Lot C',
//             },
//             {
//                 shortName: 'D',
//                 xPixel: 550.39,
//                 yPixel: 533.14,
//                 floor: 1,
//                 nodeType: 'Main Entrance',
//                 building: 'Main Building',
//                 longName: 'Main Entrance',
//             },
//             {
//                 shortName: 'E',
//                 xPixel: 548.11,
//                 yPixel: 621.48,
//                 floor: 1,
//                 nodeType: 'Hallway',
//                 building: 'Main Building',
//                 longName: 'Hallway E',
//             },
//             {
//                 shortName: 'F',
//                 xPixel: 550.03,
//                 yPixel: 696.97,
//                 floor: 1,
//                 nodeType: 'Hallway',
//                 building: 'Main Building',
//                 longName: 'Hallway F',
//             },
//             {
//                 shortName: 'G',
//                 xPixel: 617.38,
//                 yPixel: 700.03,
//                 floor: 1,
//                 nodeType: 'Reception',
//                 building: 'Main Building',
//                 longName: 'Reception',
//             },
//             {
//                 shortName: 'H',
//                 xPixel: 662.56,
//                 yPixel: 699.77,
//                 floor: 1,
//                 nodeType: 'Side Entrance',
//                 building: 'Main Building',
//                 longName: 'Side Entrance',
//             },
//             {
//                 shortName: 'I',
//                 xPixel: 757.31,
//                 yPixel: 497.1,
//                 floor: 1,
//                 nodeType: 'Parking Lot',
//                 building: 'Main Building',
//                 longName: 'Parking Lot I',
//             },
//             {
//                 shortName: 'J',
//                 xPixel: 748.1,
//                 yPixel: 697.96,
//                 floor: 1,
//                 nodeType: 'Parking Lot',
//                 building: 'Main Building',
//                 longName: 'Parking Lot J',
//             },
//             {
//                 shortName: 'K',
//                 xPixel: 740.05,
//                 yPixel: 851.66,
//                 floor: 1,
//                 nodeType: 'Parking Lot',
//                 building: 'Main Building',
//                 longName: 'Parking Lot K',
//             },
//             {
//                 shortName: 'L',
//                 xPixel: 434.9,
//                 yPixel: 858.91,
//                 floor: 1,
//                 nodeType: 'Parking Lot',
//                 building: 'Main Building',
//                 longName: 'Parking Lot L',
//             },
//         ];
//
//         // Create Nodes
//         const createdNodes = [];
//         for (const nodeData of nodesData) {
//             const createdNode = await client.node.create({
//                 data: nodeData,
//             });
//             createdNodes.push(createdNode);
//         }
//
//         // Node Shortname to ID Mapping
//         const nodeShortNameToId: { [key: string]: number } = {};
//         createdNodes.forEach((node) => {
//             nodeShortNameToId[node.shortName] = node.id;
//         });
//
//         // Edge Data
//         const edgesData = [
//             { id: 'A_B', fromId: nodeShortNameToId['A'], toId: nodeShortNameToId['B'] },
//             { id: 'B_C', fromId: nodeShortNameToId['B'], toId: nodeShortNameToId['C'] },
//             { id: 'C_D', fromId: nodeShortNameToId['C'], toId: nodeShortNameToId['D'] },
//             { id: 'C_I', fromId: nodeShortNameToId['C'], toId: nodeShortNameToId['I'] },
//             { id: 'D_E', fromId: nodeShortNameToId['D'], toId: nodeShortNameToId['E'] },
//             { id: 'E_F', fromId: nodeShortNameToId['E'], toId: nodeShortNameToId['F'] },
//             { id: 'F_G', fromId: nodeShortNameToId['F'], toId: nodeShortNameToId['G'] },
//             { id: 'G_H', fromId: nodeShortNameToId['G'], toId: nodeShortNameToId['H'] },
//             { id: 'H_J', fromId: nodeShortNameToId['H'], toId: nodeShortNameToId['J'] },
//             { id: 'I_J', fromId: nodeShortNameToId['I'], toId: nodeShortNameToId['J'] },
//             { id: 'J_K', fromId: nodeShortNameToId['J'], toId: nodeShortNameToId['K'] },
//             { id: 'K_L', fromId: nodeShortNameToId['K'], toId: nodeShortNameToId['L'] },
//             { id: 'B_A', fromId: nodeShortNameToId['B'], toId: nodeShortNameToId['A'] },
//             { id: 'C_B', fromId: nodeShortNameToId['C'], toId: nodeShortNameToId['B'] },
//             { id: 'D_C', fromId: nodeShortNameToId['D'], toId: nodeShortNameToId['C'] },
//             { id: 'I_C', fromId: nodeShortNameToId['I'], toId: nodeShortNameToId['C'] },
//             { id: 'E_D', fromId: nodeShortNameToId['E'], toId: nodeShortNameToId['D'] },
//             { id: 'F_E', fromId: nodeShortNameToId['F'], toId: nodeShortNameToId['E'] },
//             { id: 'G_F', fromId: nodeShortNameToId['G'], toId: nodeShortNameToId['F'] },
//             { id: 'H_G', fromId: nodeShortNameToId['H'], toId: nodeShortNameToId['G'] },
//             { id: 'J_H', fromId: nodeShortNameToId['J'], toId: nodeShortNameToId['H'] },
//             { id: 'J_I', fromId: nodeShortNameToId['J'], toId: nodeShortNameToId['I'] },
//             { id: 'K_J', fromId: nodeShortNameToId['K'], toId: nodeShortNameToId['J'] },
//             { id: 'L_K', fromId: nodeShortNameToId['L'], toId: nodeShortNameToId['K'] },
//         ];
//
//         // Create Edges
//         for (const edgeData of edgesData) {
//             await client.edge.create({
//                 data: edgeData,
//             });
//         }
//
//         console.log('Database populated successfully!');
//     } catch (error) {
//         console.error('Error populating database:', error);
//     } finally {
//         await client.$disconnect();
//     }
// }
//
// // Export the client
export default client;
