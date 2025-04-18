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

export class myEdge {
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