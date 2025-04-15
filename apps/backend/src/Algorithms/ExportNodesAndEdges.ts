import PrismaClient from '../bin/prisma-client';
import fs from 'fs';

export async function exportNodesAndEdges(): Promise<void> {
    const path = require('path');
    // Paths to JSON files
    const CHPath = path.resolve(__dirname, 'JSONFiles', 'chestnutHillNodesEdges.json');
    const PP20thPath = path.resolve(__dirname, 'JSONFiles', '20PPFloor1NodesEdges.json');

    const buildings = [CHPath, PP20thPath];

    // go through buildings
    for (const building of buildings) {
        const rawData = fs.readFileSync(building, 'utf-8');
        const { nodes, edges } = JSON.parse(rawData);

        try {
            // extract nodes from all buildings
            await PrismaClient.node.createMany({
                data: nodes,
                skipDuplicates: true,
            });
            // extract edges from all buildings
            await PrismaClient.edge.createMany({
                data: edges.map((e: { from: any; to: any }) => ({
                    from: e.from,
                    to: e.to,
                })),
                skipDuplicates: true,
            });
            console.log('Extraction successful!');
        } catch (error) {
            console.log('Error with extracting JSON data: ' + error);
        } finally {
            await PrismaClient.$disconnect();
        }
    }
}
