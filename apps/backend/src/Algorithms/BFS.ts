
class myNode{
    id: String;
    xPixel: number;
    yPixel: number;
    floor: number;
    nodeType: string;


    constructor(id: string, xPixel: number,yPixel: number, floor: number, nodeType: string) {

        this.id = id;
        this.xPixel = xPixel;
        this.yPixel = yPixel;
        this.floor = floor;
        this.nodeType = nodeType;
    }


}

class myEdge{
    id: String;
    from: myNode;
    to: myNode;

    constructor(id: string, from: myNode,to: myNode){
        /* Do i need the neighbors */

        this.id = id;
        this.from = from;
        this.to = to;
    }
}



class graph{
    /* need to create the graph for traversal */
    nodes: myNode[];
    edges: myEdge[];

    constructor(){
        this.nodes = [];
        this.edges = [];
    }
    addNode(id: string, xPixel: number, yPixel: number, floor: number, nodeType: string): myNode {
        const node = new myNode(id, xPixel, yPixel, floor, nodeType);
        this.nodes.push(node);
        return node;
    }

    addEdge(from: myNode, to: myNode, id: string): myEdge {
        const edge = new myEdge(id, from, to);
        this.edges.push(edge);
        return edge;
    }


    bfs (starterNode: myNode, targetNode: myNode) : myNode[] | null | undefined {
        if (!starterNode || !targetNode){
            return null;
        }

        const visited: Set<String> = new Set();
        const queue: {
            node: myNode;
            path: myNode[];

        } [] = [];
        // Initalizing the queue
        queue.push({ node: starterNode, path: [starterNode] });

        visited.add(starterNode.id);

        while (queue.length > 0 ) {
            //pop the first item in the list
            const current = queue.shift()!;
            // change the current node and current path to that of the poped element

            const currentNode = current.node;
            const currentPath = current.path;

            // checking if we found the target node
            if(currentNode.id === targetNode.id){
                return currentPath;
            }

            let neighbours: myNode[] = [];
            //adding to visited, and updating queues to add the neighbours
            for(const edge of this.edges){
                if (edge.from.id === currentNode.id){
                    const neighbour = edge.to;
                    if(!visited.has(neighbour.id) ){
                        visited.add(neighbour.id);
                        queue.push({ node: neighbour, path: [...currentPath, neighbour] });

                    }
                }
                else if (edge.to.id === currentNode.id){
                    const neighbour = edge.from;
                    if(!visited.has(neighbour.id) ){
                        visited.add(neighbour.id);
                        queue.push({ node: neighbour, path: [...currentPath,neighbour] });
                    }
                }

            }
        }


    }
}



// Need to test my BFS
const g = new graph();

const A = g.addNode("A", 0, 0, 1, "type");
const B = g.addNode("B", -1, 1, 1, "type");
const C = g.addNode("C", 0, 1, 1, "type");
const D = g.addNode("D", 1, 1, 1, "type");
const E = g.addNode("E", -2, 2, 1, "type");
const F = g.addNode("F", -1, 2, 1, "type");
const H = g.addNode("H", 0, 2, 1, "type");
const G = g.addNode("G", 1, 3, 1, "type");

// Edges
g.addEdge(A, B, "e1");
g.addEdge(A, C, "e2");
g.addEdge(A, D, "e3");
g.addEdge(B, E, "e4");
g.addEdge(B, F, "e5");
g.addEdge(C, H, "e6");
g.addEdge(F, H, "e7");
g.addEdge(D, G, "e8");
g.addEdge(H, G, "e9");
g.addEdge(D, H, "e10"); // Optional shortcut



console.log(g.bfs(A,G));



