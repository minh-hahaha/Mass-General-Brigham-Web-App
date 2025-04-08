import { Graph, myNode } from './BFS';
import { readCSV } from '../CSVImportExport';

export async function loadGraph (nodePath: string, edgePath: string): Promise<Graph> {
    const graph = new Graph();

    // load node data
    const nodeData = await readCSV(nodePath);
    const nodeMap: Map<string, myNode> = new Map()

    for (const row of nodeData) {
        const node = graph.addNode(
            row.id,
            Number(row.xPixel),
            Number(row.yPixel),
            Number(row.floor),
            String(row.nodeType)
        );
        nodeMap.set(row.id, node)
    }

    // load edge data
    const edgeData = await readCSV(edgePath);

    for (const row of edgeData) {
        const fromNode = nodeMap.get(row.from);
        const toNode = nodeMap.get(row.to);

        if (!fromNode || !toNode) {
            console.warn(`Skipping edge ${row.id}: Starting and/or End Node not found`);
            continue;
        }
        graph.addEdge(fromNode, toNode, row.id)
    }

    return graph;
}
