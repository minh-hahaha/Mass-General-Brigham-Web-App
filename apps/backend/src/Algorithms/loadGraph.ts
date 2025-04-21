import { Graph, myNode } from './classes.ts';
import PrismaClient from '../bin/prisma-client';

export async function loadMyGraph(): Promise<Graph> {
    // get the nodes and edges from the database

    const nodes = await PrismaClient.node.findMany({});
    const edges = await PrismaClient.edge.findMany({});

    const graph = new Graph();

    //craeting a map to look up nodes when creatig the edges

    let nodeMap = new Map<string, myNode>();

    for (const aNode of nodes) {
        const node = graph.addNode(
            aNode.nodeId,
            Number(aNode.x),
            Number(aNode.y),
            aNode.floor,
            aNode.nodeType,
            aNode.buildingId,
            aNode.name,
            aNode.roomNumber
        );
        nodeMap.set(aNode.nodeId, node);
    }

    for (const aEdge of edges) {
        const from = nodeMap.get(aEdge.from);
        const to = nodeMap.get(aEdge.to);

        if (from && to) {
            graph.addEdge(from, to, aEdge.edgeId);
        }
    }
    return graph;
}
