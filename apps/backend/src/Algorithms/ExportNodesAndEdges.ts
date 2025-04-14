import { readCSV } from '../CSVImportExport.ts';
import PrismaClient from '../bin/prisma-client';

export async function exportNodesAndEdges(): Promise<void> {
    const path = require('path');

    // absolute path to nodes file
    const nodePath = path.resolve(__dirname, 'CSVFiles', 'Node.csv');
    // absolute path to edges file
    const edgePath = path.resolve(__dirname, 'CSVFiles', 'Edge.csv');

    // load node data
    const nodeData = await readCSV(nodePath);
    // load edge data
    const edgeData = await readCSV(edgePath);

    const nodeMap: Map<string, number> = new Map();

    try {
        for (const row of nodeData) {
            // put nodes in graph for edges
            const exportedNode = await PrismaClient.node.upsert({
                where: {
                    id: row.nodeID,
                },
                update: {},
                create: {
                    xPixel: Number(row.xcoord),
                    yPixel: Number(row.ycoord),
                    floor: Number(row.floor), nodeType:
                        String(row.nodeType),
                        building: String(row.building),
                        longName: String(row.longName),
                        shortName: String(row.shortName),
                },
            });

            nodeMap.set(row.nodeID, exportedNode.id);
            // populate nodes in table
        }
        for (const row of edgeData) {

            const [rawStartID, rawEndID] = row.id.split('_').map((id: string) => id.trim());
            const fromId = nodeMap.get(rawStartID);
            const toId = nodeMap.get(rawEndID);

            // test for either node is undefined
            if (fromId === undefined || toId === undefined) {
                console.warn(`Skipping edge ${row.edgeID}: Starting and/or End Node not found`);
                continue;
            }

            await PrismaClient.edge.upsert({
                where: {
                    id: row.id
                },
                update: {},
                create: {
                    id: row.id,
                    fromId,
                    toId,
                },
            });
        }
    } catch(err) {
        console.error('Error importing data:', err);
    } finally {
        await PrismaClient.$disconnect();
    }
}
