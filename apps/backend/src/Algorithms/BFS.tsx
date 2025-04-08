
class myNode{
    id: String;
    neighbors: myNode[];
    xPixel: number;
    yPixel: number;

    constructor(id: string, xPixel: number,yPixel: number){
        /* Do i need the neighbors */

        this.id = id;
        this.neighbors = [];
        this.xPixel = xPixel;
        this.yPixel = yPixel;
    }

    addNeighbors(neighbors: myNode){
        this.neighbors.push(neighbors);
    }

}

class graph{
    /* need to create the graph for traversal */
    nodes: myNode[];

    constructor(nodes: myNode[]){
        this.nodes = nodes;
    }
    addNode(id:string, xPixel:number, yPixel:number){
        const node = new myNode(id, xPixel, yPixel);
        this.nodes.push(node);
        return node;
    }

    addEdge(sourceNode: myNode, destinationNode: myNode){
        sourceNode.addNeighbors(destinationNode);
        destinationNode.addNeighbors(sourceNode);
    }
}

/*
class BFSResults{
    targetNode: myNode;
    rootNode: myNode;
    pathEdges: myNode[];
    found: boolean;

    constructor(targetNode: myNode, rootNode: myNode,  pathEdges: myNode[],found: boolean){
        this.targetNode = targetNode;
        this.rootNode = rootNode;
        this.pathEdges = pathEdges;
        this.found = found;
    }

}*/

function BFS ( startNode: myNode, targetNode: myNode ){
    return startNode.neighbors;

}







