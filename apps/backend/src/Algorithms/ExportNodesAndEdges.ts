import PrismaClient from '../bin/prisma-client';
import fs from 'fs';

export async function extractNodesAndEdges(): Promise<void> {
    const path = require('path');
    // Paths to JSON files
    const CHPath = path.resolve(__dirname, 'JSONFiles', 'chestnutHillNodesEdges.json');
    const PP20thPath = path.resolve(__dirname, 'JSONFiles', '20PPFloor1NodesEdges.json');

    const buildings = [CHPath, PP20thPath];

    // go through buildings
    for (const building of buildings) {
        const rawData = fs.readFileSync(building, 'utf-8');
        const { nodes, edges } = JSON.parse(rawData);

        // turn floor, buildingid, and room number into ints
        const sanitizedNodes = nodes.map((node: any) => ({
            ...node,
            floor: parseInt(node.floor, 10),
            buildingId: parseInt(node.buildingId, 10),
            roomNumber: node.roomNumber ? parseInt(node.roomNumber, 10) : null,
        }));

        // turn ids into ints
        const sanitizedEdges = edges.map((edge: any) => ({
            ...edge,
            fromNodeId: parseInt(edge.fromNodeId, 10),
            toNodeId: parseInt(edge.toNodeId, 10),
        }));

        try {
            // extract nodes from all buildings
            await PrismaClient.node.createMany({
                data: sanitizedNodes,
                skipDuplicates: true,
            });
            // extract edges from all buildings
            await PrismaClient.edge.createMany({
                data: sanitizedEdges.map((e: { from: any; to: any }) => ({
                    fromAndTo: `${e.from}_${e.to}`, // or any consistent unique string
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
