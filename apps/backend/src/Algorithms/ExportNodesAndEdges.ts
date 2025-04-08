import { Graph, myNode } from './classes.ts';
import { readCSV } from '../CSVImportExport.ts';

export async function loadGraph (): Promise<Graph> {
    const graph = new Graph();
    const path = require('path');

    // absolute path to nodes file
    const nodePath = path.resolve(__dirname, 'CSVFiles', 'tempnodes.csv');

    // load node data
    const nodeData = await readCSV(nodePath);
    const nodeMap: Map<string, myNode> = new Map()

    for (const row of nodeData) {
        const node = graph.addNode(
            // load each value from the row
            row.nodeID,
            Number(row.xcoord),
            Number(row.ycoord),
            Number(row.floor),
            String(row.nodeType)
        );
        // set row ID key to the node value
        nodeMap.set(row.nodeID, node)
    }

    // absolute path to edges file
    const edgePath = path.resolve(__dirname, 'CSVFiles', 'tempedges.csv');

    // load edge data
    const edgeData = await readCSV(edgePath);

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
        // add the edges to the graph
        graph.addEdge(fromNode, toNode, row.edgeID)
    }

    return graph;
}