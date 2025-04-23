import { loadMyGraph } from './loadGraph.ts';

import { myNode } from 'common/src/classes/classes.ts';
import { pathfindingStrategy } from './PathfindingStrategy.ts';

export class DFS implements pathfindingStrategy {
    async findMyPath(startPoint: myNode, endPoint: myNode): Promise<myNode[] | null | undefined> {
        //do i need to load this in another function "extracted" in the context class
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

        visited.add(starterNode.nodeId);

        while (queue.length > 0) {
            //pop the first item in the list
            const current = queue.shift()!;
            // change the current node and current path to that of the poped element

            const currentNode = current.node;
            const currentPath = current.path;

            // checking if we found the target node
            if (currentNode.nodeId === targetNode.nodeId) {
                return currentPath;
            }

            //adding to visited, and updating queues to add the neighbours
            for (const edge of graph.edges) {
                let neighbour = null;
                if (edge.from.nodeId === currentNode.nodeId) {
                    neighbour = edge.to;
                } else if (edge.to.nodeId === currentNode.nodeId) {
                    neighbour = edge.from;
                }

                if (neighbour && !visited.has(neighbour.nodeId)) {
                    visited.add(neighbour.nodeId);
                    queue.push({ node: neighbour, path: [...currentPath, neighbour] });
                }
            }
        }
    }
}
