export class myNode{
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



export class Graph{
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
}