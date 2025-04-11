import { myNode } from './classes.ts';
import PrismaClient from '../bin/prisma-client';

export async function bfs(
    startPoint: string,
    endPoint: string
): Promise<myNode[] | null | undefined> {

    const nodes = await PrismaClient.node.findMany({})
    const edges = await PrismaClient.edge.findMany({})



    const starterNode = graph.getNode(startPoint);
    const targetNode = graph.getNode(endPoint);

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

        let neighbours: myNode[] = [];
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

export async function cleanedUpBFS(startPoint: string, endPoint: string): Promise<string[][]> {
    const bfsResult = await bfs(startPoint, endPoint);

    const results: string[][] = [];

    if (bfsResult) {
        for (let i = 0, lenBFS = bfsResult.length - 1; i < lenBFS; i++) {
            results.push([bfsResult[i].id, bfsResult[i + 1].id]);
        }
    }

    return results;
}

const test = cleanedUpBFS('A', 'G');
