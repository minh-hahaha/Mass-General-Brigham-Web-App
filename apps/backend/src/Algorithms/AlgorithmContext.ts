import { myNode } from 'common/src/classes/classes.ts';
import {pathfindingStrategy} from "./PathfindingStrategy.ts";

export class AlgorithmContext {
    private strategy: pathfindingStrategy;


    constructor(pathfindingStrategy: pathfindingStrategy) {
        this.strategy = pathfindingStrategy;
    }

    public setPathfindingStrategy(pathfindingStrategy: pathfindingStrategy) {
        this.strategy = pathfindingStrategy;
    }
    async findPath(startPoint: myNode, endPoint: myNode): Promise<myNode[] | undefined | null> {
        return this.strategy.findMyPath(startPoint, endPoint);
    }
}