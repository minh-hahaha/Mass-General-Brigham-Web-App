import { myEdge, myNode } from 'common/src/classes/classes.ts';
export { myNode, myEdge };

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
