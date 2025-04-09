//import { loadGraph } from './ExportNodesAndEdges.ts';
//import { mapNode } from './classes.ts';

class mapNode {
    id: string;

    constructor(id: string) {
        this.id = id;
    }
}

// Simplified graph class
class Graph {
    nodes: Map<string, mapNode>;
    edges: Array<{ from: mapNode; to: mapNode }>;

    constructor() {
        this.nodes = new Map();
        this.edges = [];
    }

    addNode(id: string): mapNode {
        const node = new mapNode(id);
        this.nodes.set(id, node);
        return node;
    }

    addEdge(fromId: string, toId: string) {
        const fromNode = this.nodes.get(fromId);
        const toNode = this.nodes.get(toId);
        if (fromNode && toNode) {
            this.edges.push({ from: fromNode, to: toNode });
        }
    }

    getNode(id: string): mapNode | undefined {
        return this.nodes.get(id);
    }
}

// Create a test graph with just string IDs
function createGraph(): Graph {
    const g = new Graph();

    // Add nodes
    g.addNode('A');
    g.addNode('B');
    g.addNode('C');
    g.addNode('D');
    g.addNode('E');
    g.addNode('F');
    g.addNode('G');
    g.addNode('H');
    g.addNode('I');
    g.addNode('J');
    g.addNode('K');
    g.addNode('L');

    // Add edges
    g.addEdge('A', 'B');
    g.addEdge('B', 'C');
    g.addEdge('C', 'D');
    g.addEdge('C', 'I');
    g.addEdge('D', 'E');
    g.addEdge('E', 'F');
    g.addEdge('F', 'G');
    g.addEdge('G', 'H');
    g.addEdge('H', 'J');
    g.addEdge('I', 'J');
    g.addEdge('J', 'K');
    g.addEdge('K', 'L');
    g.addEdge('B', 'A');
    g.addEdge('C', 'B');
    g.addEdge('D', 'C');
    g.addEdge('I', 'C');
    g.addEdge('E', 'D');
    g.addEdge('F', 'E');
    g.addEdge('G', 'F');
    g.addEdge('H', 'G');
    g.addEdge('J', 'H');
    g.addEdge('J', 'I');
    g.addEdge('K', 'J');
    g.addEdge('L', 'K');

    return g;
}
export async function bfs(
    startPoint: string,
    endPoint: string
): Promise<mapNode[] | null | undefined> {
    const graph = createGraph();

    const starterNode = graph.getNode(startPoint);
    const targetNode = graph.getNode(endPoint);

    if (!starterNode || !targetNode) {
        return null;
    }

    const visited: Set<String> = new Set();
    const queue: {
        node: mapNode;
        path: mapNode[];
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

        let neighbours: mapNode[] = [];
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

// Need to test my BFS

// const C = g.addNode("C", 0, 1, 1, "type");
// const D = g.addNode("D", 1, 1, 1, "type");
// const E = g.addNode("E", -2, 2, 1, "type");
// const F = g.addNode("F", -1, 2, 1, "type");
// const H = g.addNode("H", 0, 2, 1, "type");
// const G = g.addNode("G", 1, 3, 1, "type");
//
// // Edges
// g.addEdge(A, B, "e1");
// g.addEdge(A, C, "e2");
// g.addEdge(A, D, "e3");
// g.addEdge(B, E, "e4");
// g.addEdge(B, F, "e5");
// g.addEdge(C, H, "e6");
// g.addEdge(F, H, "e7");
// g.addEdge(D, G, "e8");
// g.addEdge(H, G, "e9");
// g.addEdge(D, H, "e10"); // Optional shortcut
//
//
//

//
//
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

const path = cleanedUpBFS('J', 'G');
console.log('Path from J to G:', path);
