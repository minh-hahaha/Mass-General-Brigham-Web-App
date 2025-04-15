import PrismaClient from '../bin/prisma-client';
import { myNode, Graph } from './classes.ts';
// import { exportNodesAndEdges } from './ExportNodesAndEdges.ts';

export async function loadMyGraph(): Promise<Graph> {
    // get the nodes and edges from the database

    // await exportNodesAndEdges();

    const nodes = await PrismaClient.node.findMany({});
    const edges = await PrismaClient.edge.findMany({});

    const graph = new Graph();

    //craeting a map to look up nodes when creatig the edges

    let nodeMap = new Map<number, myNode>();

    for (const aNode of nodes) {
        const node = graph.addNode(
            aNode.id.toString(),
            aNode.xPixel,
            aNode.yPixel,
            aNode.floor,
            aNode.nodeType,
            aNode.building,
            aNode.longName,
            aNode.shortName
        );
        nodeMap.set(aNode.id, node);
    }

    for (const aEdge of edges) {
        const from = nodeMap.get(aEdge.fromId);
        const to = nodeMap.get(aEdge.toId);

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

// export async function cleanedUpBFS(startPoint: string, endPoint: string): Promise<string[][]> {
//     const bfsResult = await bfs(startPoint, endPoint);
//
//     const results: string[][] = [];
//
//     if (bfsResult) {
//         for (let i = 0, lenBFS = bfsResult.length - 1; i < lenBFS; i++) {
//             results.push([bfsResult[i].id, bfsResult[i + 1].id]);
//         }
//     }
//
//     return results;
// }

// const test = cleanedUpBFS('1', '19');
