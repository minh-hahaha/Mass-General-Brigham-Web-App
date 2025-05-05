import { loadMyGraph } from './loadGraph.ts';
import { myNode, myEdge } from 'common/src/classes/classes.ts';
import { pathfindingStrategy } from './PathfindingStrategy.ts';

export class AStar implements pathfindingStrategy {
    async findMyPath(startPoint: myNode, endPoint: myNode): Promise<myNode[] | null | undefined> {
        const graph: { edges: myEdge[] } = await loadMyGraph();

        const openSet = new Map<string, myNode>();
        const cameFrom = new Map<string, myNode>();

        const gScore = new Map<string, number>();
        const fScore = new Map<string, number>();

        const startId = startPoint.nodeId;
        const endId = endPoint.nodeId;

        openSet.set(startId, startPoint);
        gScore.set(startId, 0);
        fScore.set(startId, this.heuristic(startPoint, endPoint));

        while (openSet.size > 0) {
            // Find the node in openSet with the lowest fScore
            let current: myNode = [...openSet.values()].reduce((a, b) => {
                return (fScore.get(a.nodeId)! < fScore.get(b.nodeId)!) ? a : b;
            });

            if (current.nodeId === endId) {
                return this.reconstructPath(cameFrom, current);
            }

            openSet.delete(current.nodeId);

            const neighbors = this.getNeighbors(current, graph.edges);

            for (const { neighbor, distance } of neighbors) {
                const tentativeG = gScore.get(current.nodeId)! + distance;

                if (tentativeG < (gScore.get(neighbor.nodeId) ?? Infinity)) {
                    cameFrom.set(neighbor.nodeId, current);
                    gScore.set(neighbor.nodeId, tentativeG);
                    fScore.set(neighbor.nodeId, tentativeG + this.heuristic(neighbor, endPoint));

                    if (!openSet.has(neighbor.nodeId)) {
                        openSet.set(neighbor.nodeId, neighbor);
                    }
                }
            }
        }

        return null; // No path found
    }

    private reconstructPath(cameFrom: Map<string, myNode>, current: myNode): myNode[] {
        const path = [current];
        while (cameFrom.has(current.nodeId)) {
            current = cameFrom.get(current.nodeId)!;
            path.unshift(current);
        }
        return path;
    }

    private heuristic(a: myNode, b: myNode): number {
        // Simple Manhattan heuristic with floor penalty
        const dx = Math.abs(a.x - b.x);
        const dy = Math.abs(a.y - b.y);
        const floorA = parseInt(a.floor);
        const floorB = parseInt(b.floor);
        const floorDiff = isNaN(floorA) || isNaN(floorB)
            ? (a.floor === b.floor ? 0 : 1)
            : Math.abs(floorA - floorB);

        const floorPenalty = floorDiff * 100; // Adjust this weight as needed
        return dx + dy + floorPenalty;
    }

    private getNeighbors(node: myNode, edges: myEdge[]): { neighbor: myNode, distance: number }[] {
        const neighbors: { neighbor: myNode, distance: number }[] = [];

        for (const edge of edges) {
            if (edge.from.nodeId === node.nodeId) {
                neighbors.push({ neighbor: edge.to, distance: edge.distanceFeet });
            } else if (edge.to.nodeId === node.nodeId) {
                neighbors.push({ neighbor: edge.from, distance: edge.distanceFeet });
            }
        }

        return neighbors;
    }
}
