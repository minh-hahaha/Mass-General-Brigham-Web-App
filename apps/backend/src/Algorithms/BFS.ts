import PrismaClient from '../bin/prisma-client';
import { Graph } from './classes.ts';
import { exportNodesAndEdges } from './ExportNodesAndEdges.ts';

import { myNode } from 'common/src/classes/classes.ts';

export async function loadMyGraph(): Promise<Graph> {
    // get the nodes and edges from the database

    const nodes = await PrismaClient.node.findMany({});
    const edges = await PrismaClient.edge.findMany({});

    const graph = new Graph();

    //craeting a map to look up nodes when creatig the edges

    let nodeMap = new Map<string, myNode>();

    for (const aNode of nodes) {
        const node = graph.addNode(
            aNode.id,
            Number(aNode.x),
            Number(aNode.y),
            aNode.floor,
            aNode.nodeType,
            aNode.buildingId,
            aNode.name,
            aNode.roomNumber
        );
        nodeMap.set(aNode.id, node);
    }

    for (const aEdge of edges) {
        const from = nodeMap.get(aEdge.from);
        const to = nodeMap.get(aEdge.to);

        if (from && to) {
            graph.addEdge(from, to, aEdge.id);
        }
    }
    return graph;
}

export async function bfs(
    startPoint: myNode,
    endPoint: myNode
): Promise<myNode[] | null | undefined> {
    const graph = await loadMyGraph();

    const starterNode = startPoint;
    const targetNode = endPoint;

    if (!starterNode || !targetNode) {
        return null;
    }

    const visited: Set<String> = new Set();
    const queue: {
        node: myNode;
        path: myNode[];
    }[] = [];
    // Initalizing the queue
    queue.push({ node: starterNode, path: [starterNode] });

    visited.add(starterNode.id);

    while (queue.length > 0) {
        //pop the first item in the list
        const current = queue.shift()!;
        // change the current node and current path to that of the poped element

        const currentNode = current.node;
        const currentPath = current.path;

        // checking if we found the target node
        if (currentNode.id === targetNode.id) {
            return currentPath;
        }

        //adding to visited, and updating queues to add the neighbours
        for (const edge of graph.edges) {
            if (edge.from.id === currentNode.id) {
                const neighbour = edge.to;
                if (!visited.has(neighbour.id)) {
                    visited.add(neighbour.id);
                    queue.push({ node: neighbour, path: [...currentPath, neighbour] });
                }
            } else if (edge.to.id === currentNode.id) {
                const neighbour = edge.from;
                if (!visited.has(neighbour.id)) {
                    visited.add(neighbour.id);
                    queue.push({ node: neighbour, path: [...currentPath, neighbour] });
                }
            }
        }
    }
}
