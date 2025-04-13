import { Graph, myNode } from './classes.ts';
import { readCSV } from '../CSVImportExport.ts';
import PrismaClient from '../bin/prisma-client';

export async function exportNodesAndEdges(): Promise<void> {
    const path = require('path');

    // absolute path to nodes file
    const nodePath = path.resolve(__dirname, 'CSVFiles', 'tempnodes.csv');
    // absolute path to edges file
    const edgePath = path.resolve(__dirname, 'CSVFiles', 'tempedges.csv');

    // load node data
    const nodeData = await readCSV(nodePath);
    const nodeMap: Map<string, myNode> = new Map();
    // load edge data
    const edgeData = await readCSV(edgePath);

    for (const row of nodeData) {
        // put nodes in graph for edges
        const exportedNode = {
            id: row.nodeID,
            xPixel: Number(row.xcoord),
            yPixel: Number(row.ycoord),
            floor: Number(row.floor),
            nodeType: String(row.nodeType),
            building: String(row.building) || '',
            longName: String(row.longName) || '',
            shortName: String(row.shortName) || '',
        };
        // populate nodes in table
        await PrismaClient.node.create({
            data: {
                xPixel: Number(row.xcoord),
                yPixel: Number(row.ycoord),
                floor: Number(row.floor),
                nodeType: String(row.nodeType),
                building: String(row.building) || '',
                longName: String(row.longName) || '',
                shortName: String(row.shortName) || '',
            },
        });
        nodeMap.set(row.nodeID, exportedNode);
    }

    for (const row of edgeData) {
        const [startNodeID, endNodeID] = row.edgeID.split('_');

        // get the nodes from the map with the node ID
        const fromNode = nodeMap.get(startNodeID);
        const toNode = nodeMap.get(endNodeID);

        // test for either node is undefined
        if (!fromNode || !toNode) {
            console.warn(`Skipping edge ${row.edgeID}: Starting and/or End Node not found`);
            continue;
        }

        await PrismaClient.edge.create({
            data: {
                id: row.edgeID,
                fromId: Number(fromNode.id),
                toId: Number(toNode.id),
            },
        });
    }
}
