import prisma from '../bin/prisma-client';
// @ts-ignore
import fs from 'fs';
// @ts-ignore
import path from 'path';

declare const __dirname: string;

export async function exportNodesAndEdges(): Promise<void> {
    // Paths to JSON files
    const AllNodesEdges = path.resolve(__dirname, 'JSONFiles', 'AllNodesEdges.json');
    // const CHPath = path.resolve(__dirname, 'JSONFiles', 'CHFloor1AllNodesAndEdgesNew.json');
    // const PPF01 = path.resolve(__dirname, 'JSONFiles', 'PPF01NodesAndEdgesNew.json');
    // const PPF02 = path.resolve(__dirname, 'JSONFiles', 'PPF02NodesAndEdgesNew.json');
    // const PPF03 = path.resolve(__dirname, 'JSONFiles', 'PPF03NodesAndEdgesNew.json');
    // const PPF04 = path.resolve(__dirname, 'JSONFiles', 'PPF04NodesAndEdgesNew.json');

    // const buildings = [CHPath, PPF03, PPF04, PPF01, PPF02];
    const buildings = [AllNodesEdges];

    // go through buildings
    for (const building of buildings) {
        const rawData = fs.readFileSync(building, 'utf-8');
        const { nodes, edges } = JSON.parse(rawData);

        try {
            // extract nodes from all buildings
            await prisma.node.createMany({
                data: nodes,
                skipDuplicates: true,
            });
            console.log('Seed NODES!');

            // extract edges from all buildings
            await prisma.edge.createMany({
                data: edges.map((e: { from: any; to: any }) => ({
                    from: e.from,
                    to: e.to,
                })),
                skipDuplicates: true,
            });
            console.log('Seed EDGES!');
        } catch (error) {
            console.log('Error with extracting JSON data: ' + error);
        } finally {
            await prisma.$disconnect();
        }
    }
}
