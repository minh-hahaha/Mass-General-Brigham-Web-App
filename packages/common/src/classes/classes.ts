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
    distance: number;

    constructor(edgeId: number, from: myNode, to: myNode) {
        /* Do i need the neighbors */
        this.edgeId = edgeId;
        this.from = from;
        this.to = to;
        this.distance = this.calculateDistance(from, to);
    }

    calculateDistance(from: myNode, to: myNode) {
        const toFeetX = to.x * (Math.cos(to.y * Math.PI / 180) * 69.172) * 5280;
        const fromFeetX = from.x * (Math.cos(from.y * Math.PI / 180) * 69.172) * 5280;

        const toFeetY = to.y * 364320;
        const fromFeetY = from.y * 364320;

        const feetX = toFeetX - fromFeetX;
        const feetY = toFeetY - fromFeetY;

        return Math.sqrt(Math.pow(feetX, 2) + Math.pow(feetY, 2));
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