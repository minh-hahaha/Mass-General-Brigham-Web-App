import { loadMyGraph } from './loadGraph.ts';

import { myNode } from 'common/src/classes/classes.ts';
import { pathfindingStrategy } from './PathfindingStrategy.ts';

export class DIJKSTRA implements pathfindingStrategy {
    async findMyPath(startPoint: myNode, endPoint: myNode): Promise<myNode[] | null | undefined> {
        //do i need to load this in another function "extracted" in the context class
        const graph = await loadMyGraph();

        const starterNode = startPoint;
        const targetNode = endPoint;

        if (!starterNode || !targetNode) {
            return null;
        }

        const myPrevious: Map<string, myNode | null> = new Map();
        const distances: Map<string, number | null> = new Map();

        const visited: Set<String> = new Set();
        const queue: { node: myNode; distance: number }[] = [];

        // Initalizing the queue

        for (const node of graph.nodes) {
            distances.set(node.nodeId, Infinity);
            myPrevious.set(node.nodeId, null);
        }

        distances.set(startPoint.nodeId, 0);
        queue.push({ node: startPoint, distance: 0 });

        while (queue.length > 0) {
            queue.sort((a, b) => a.distance - b.distance);
            const { node: currentNode } = queue.shift()!;

            if (visited.has(currentNode.nodeId)) {
                continue;
            }
            visited.add(currentNode.nodeId);

            //found the endpoint
            if (currentNode.nodeId === endPoint.nodeId) {
                const path: myNode[] = [];
                let current: myNode | null = endPoint;
                while (current) {
                    path.unshift(current);
                    current = myPrevious.get(current.nodeId) || null;
                }
                return path;
            }


        }

        return null;
    }
}
