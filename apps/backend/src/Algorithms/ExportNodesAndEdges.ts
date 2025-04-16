import prisma from '../bin/prisma-client';
// @ts-ignore
import fs from 'fs';
// @ts-ignore
import path from 'path';

declare const __dirname: string;

export async function exportNodesAndEdges(): Promise<void> {
    // Paths to JSON files
    const CHFloor1 = path.resolve(__dirname, 'JSONFiles', 'CHNodesEdges.json');
    const PP20thFloor1 = path.resolve(__dirname, 'JSONFiles', '20PPFloor1NodesEdges.json');
    const PP20thFloor2 = path.resolve(__dirname, 'JSONFiles', '20PPFloor2NodesEdges.json');
    const PP20thFloor3 = path.resolve(__dirname, 'JSONFiles', '20PPFloor3NodesEdges.json');
    const PP20thFloor4 = path.resolve(__dirname, 'JSONFiles', '20PPFloor4NodesEdges.json');
    const PP22thFloor3 = path.resolve(__dirname, 'JSONFiles', '22PPFloor3NodesEdges.json');
    const PP22thFloor4 = path.resolve(__dirname, 'JSONFiles', '22PPFloor4NodesEdges.json');

    const buildings = [
        CHFloor1,
        PP20thFloor1,
        PP20thFloor2,
        PP20thFloor3,
        PP20thFloor1,
        PP20thFloor4,
        PP22thFloor3,
        PP22thFloor4,
    ];

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
            // extract edges from all buildings
            await prisma.edge.createMany({
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
            await prisma.$disconnect();
        }
    }
}
