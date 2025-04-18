export class myNode {
    nodeId: string;
    x: number;
    y: number;
    floor: string;
    nodeType: string;
    buildingId: string;
    name: string;
    roomNumber: string | null;

    constructor(
        nodeId: string,
        x: number,
        y: number,
        floor: string,
        nodeType: string,
        buildingId: string,
        name: string,
        roomNumber: string | null
    ) {
        this.nodeId = nodeId;
        this.x = x;
        this.y = y;
        this.floor = floor;
        this.nodeType = nodeType;
        this.buildingId = buildingId;
        this.name = name;
        this.roomNumber = roomNumber;
    }
}

export class myEdge {
    edgeId: number;
    from: myNode;
    to: myNode;

    constructor(edgeId: number, from: myNode, to: myNode) {
        /* Do i need the neighbors */

        this.edgeId = edgeId;
        this.from = from;
        this.to = to;
    }
}

export class minhEdges {
    edgeId: number;
    from: string;
    to: string;
    nodeFrom: myNode;
    nodeTo: myNode;

    constructor (
        edgeId: number,
        from: string,
        to: string,
        nodeFrom: myNode,
        nodeTo: myNode,
    )  {
        this.edgeId = edgeId;
        this.from = from;
        this.to = to;
        this.nodeFrom = nodeFrom;
        this.nodeTo = nodeTo;
    }
}