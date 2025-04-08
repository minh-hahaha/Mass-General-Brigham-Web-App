import { loadGraph } from './ExportNodesAndEdges.ts';



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

export class myEdge{
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

async function bfs (starterNode: myNode, targetNode: myNode){

    // calls upon loadGraph to fill the graph with nodes and edges from the files.
    const graph = await loadGraph('./CSVFiles/tempnodes.csv', './CSVFiles/tempedges.csv')

}


/* I am testing my BFS*/
const myGraph = new Graph();

const practiceNodeA = myGraph.addNode("A",0,0, 1, "A");
const practiceNode1 = myGraph.addNode("1",0,0, 1, "1");
const practiceNodeE1 = myGraph.addNode("E1",0,0, 1, "E1");


myGraph.addEdge(practiceNodeA,practiceNode1, "A-1");
myGraph.addEdge(practiceNode1,practiceNodeA, "1-A");



myGraph.addEdge(practiceNode1,practiceNodeE1, "1-E1");
myGraph.addEdge(practiceNodeE1,practiceNode1, "E1-1");



bfs(practiceNode1,practiceNodeA,myGraph);






