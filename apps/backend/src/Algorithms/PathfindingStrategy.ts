import { myNode } from 'common/src/classes/classes.ts';
export interface pathfindingStrategy {
    findMyPath(startPoint: myNode, endPoint: myNode): Promise<myNode[] | null | undefined>;
}
