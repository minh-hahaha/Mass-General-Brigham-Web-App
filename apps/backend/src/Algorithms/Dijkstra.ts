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

        const visited: Set<String> = new Set();
        const queue: {
            node: myNode;
            path: myNode[];
        }[] = [];
        // Initalizing the queue
        queue.push({ node: starterNode, path: [starterNode] });

        visited.add(starterNode.nodeId);





    }
}
