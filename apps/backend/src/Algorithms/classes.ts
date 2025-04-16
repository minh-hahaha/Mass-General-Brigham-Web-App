export class myNode {
    id: string;
    x: number;
    y: number;
    floor: string;
    nodeType: string;
    buildingId: string;
    name: string;
    roomNumber: string | null;

    constructor(
        nodeID: string,
        x: number,
        y: number,
        floor: string,
        nodeType: string,
        buildingId: string,
        name: string,
        roomNumber: string | null
    ) {
        this.id = nodeID;
        this.x = x;
        this.y = y;
        this.floor = floor;
        this.nodeType = nodeType;
        this.buildingId = buildingId;
        this.name = name;
        this.roomNumber = roomNumber;
    }
}

class myEdge {
    id: number;
    from: myNode;
    to: myNode;

    constructor(id: number, from: myNode, to: myNode) {
        /* Do i need the neighbors */

        this.id = id;
        this.from = from;
        this.to = to;
    }
}

export class Graph {
    /* need to create the graph for traversal */
    nodes: myNode[];
    edges: myEdge[];

    constructor() {
        this.nodes = [];
        this.edges = [];
    }
    addNode(
        id: string,
        x: number,
        y: number,
        floor: string,
        nodeType: string,
        buildingId: string,
        name: string,
        roomNumber: string | null
    ): myNode {
        const node = new myNode(id, x, y, floor, nodeType, buildingId, name, roomNumber);
        this.nodes.push(node);
        return node;
    }

    addEdge(from: myNode, to: myNode, id: number): myEdge {
        const edge = new myEdge(id, from, to);
        this.edges.push(edge);
        return edge;
    }

    getNode(id: string): myNode | undefined {
        return this.nodes.find((node) => node.id === id);
    }
}
