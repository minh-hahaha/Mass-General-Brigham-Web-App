import { loadGraph } from './ExportNodesAndEdges.ts';
import { Graph, myNode } from "./classes.ts";

export async function bfs(startPoint: string, endPoint: string): Promise<myNode[] | null | undefined> {

    const graph = await loadGraph();

    const starterNode = graph.getNode(startPoint)
    const targetNode = graph.getNode(endPoint);

    if (!starterNode || !targetNode) {
        return null;
    }


    const visited: Set<String> = new Set();
    const queue: {
        node: myNode;
        path: myNode[];

    } [] = [];
    // Initalizing the queue
    queue.push({node: starterNode, path: [starterNode]});

    visited.add(starterNode.id);

    while (queue.length > 0 ) {
        //pop the first item in the list
        const current = queue.shift()!;
        // change the current node and current path to that of the poped element

        const currentNode = current.node;
        const currentPath = current.path;

        // checking if we found the target node
        if(currentNode.id === targetNode.id){
            console.log(currentPath);
            return currentPath;
        }

        let neighbours: myNode[] = [];
        //adding to visited, and updating queues to add the neighbours
        for (const edge of graph.edges) {
            if (edge.from.id === currentNode.id) {
                const neighbour = edge.to;
                if(!visited.has(neighbour.id) ){
                    visited.add(neighbour.id);
                    queue.push({ node: neighbour, path: [...currentPath, neighbour] });

                }
            } else if (edge.to.id === currentNode.id) {
                const neighbour = edge.from;
                if(!visited.has(neighbour.id) ){
                    visited.add(neighbour.id);
                    queue.push({ node: neighbour, path: [...currentPath,neighbour] });
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
console.log(bfs("L","G"));

//
//
