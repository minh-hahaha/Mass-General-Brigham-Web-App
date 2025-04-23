import { myNode } from 'common/src/classes/classes.ts';
import { pathfindingStrategy } from './PathfindingStrategy.ts';

export class AlgorithmContext {
    // when initializing it can be null because why not
    private strategy: pathfindingStrategy | null = null;

    constructor(pathfindingStrategy: pathfindingStrategy) {
        this.strategy = pathfindingStrategy;
    }

    public setPathfindingStrategy(pathfindingStrategy: null | pathfindingStrategy) {
        this.strategy = pathfindingStrategy;
    }
    async findPath(startPoint: myNode, endPoint: myNode): Promise<myNode[] | undefined | null> {
        if (this.strategy === null) {
            throw new Error('Strategy is set to null');
        }
        return this.strategy.findMyPath(startPoint, endPoint);
    }
}
