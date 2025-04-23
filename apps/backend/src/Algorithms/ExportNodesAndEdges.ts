import prisma from '../bin/prisma-client';
// @ts-ignore
import fs from 'fs';
// @ts-ignore
import path from 'path';

declare const __dirname: string;

export async function exportNodesAndEdges(): Promise<void> {
    // Paths to JSON files
    const CHPath = path.resolve(__dirname, 'JSONFiles', 'CHFloor1AllNodesAndEdgesNew.json');
    const PP20F1Path = path.resolve(__dirname, 'JSONFiles', 'PPF01NodesAndEdges.json');
    const PP20F2Path = path.resolve(__dirname, 'JSONFiles', 'PPF02NodesAndEdges.json');

    const buildings = [CHPath, PP20F1Path, PP20F2Path];

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
