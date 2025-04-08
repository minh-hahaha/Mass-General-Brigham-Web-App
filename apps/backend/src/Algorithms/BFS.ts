
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

// remove undefined eventually
// function bfs (starterNode: myNode, targetNode: myNode, graph: graph) : {nodes: myNode[], edges: myEdge[]} | null | undefined {
//
//     // if there is an error with the node, or the grpah return nulls
//     if (!starterNode || !targetNode || !graph){
//         return null;
//     }
//
//     const visited: Set<String> = new Set();
//     const queue: {
//         pathNodes: myNode[];
//         pathEdges: myEdge[];
//         node: myNode;
//
//     } [] = [];
//
//     visited.add(starterNode.id);
//     queue.push({pathNodes:[starterNode],pathEdges: [], node: starterNode});
//
//     while (queue.length > 0){
//         //const [current, edge, currentPath, currentNodes] = queue.shift();
//         // let node = queue.shift() as myNode;
//         const {pathNodes, pathEdges, node} = queue.shift()!;
//         if(targetNode.id === node.id){
//             return {nodes: pathNodes, edges: pathEdges};
//         }
//         if(!visited.has(node.id)){
//             visited.add(node.id);
//         }
//
//         // get all the neighbors that are yet to be visited
//
//         const unvistedNeighbors = graph.edges.filter(
//             (edge) => edge.to.id === node.id || edge.from.id === node.id
//         )
//
//         for ( const edge of unvistedNeighbors){
//             const path
//             if(!visited.has(edge.id)){
//                queue.push({
//                    pathNodes: [...pathNodes,unvistedNeighbors],
//                    pathEdges: [...pathEdges,edge],
//                    node: unvistedNeighbors
//                 });
//             }
//         }
//
//
//     }
//
// }



// Need to test my BFS
const myGraph = new graph();


