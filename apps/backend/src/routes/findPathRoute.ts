import express, { Request, Response } from 'express';
import { BFS } from '../Algorithms/BFS.ts';
import { DFS } from '../Algorithms/DFS.ts';
import { AlgorithmContext } from '../Algorithms/AlgorithmContext.ts';
import { pathfindingStrategy } from '../Algorithms/PathfindingStrategy.ts';
import { AStar } from '../Algorithms/A_STAR.ts';

const expressRouter = express.Router();

expressRouter.post('/', async function (req: Request, res: Response) {
    try {
        const { start: startNode, end: targetNode, strategy: currentStratergy } = req.body;
        //console.log('strat ' + currentStratergy);
        const AlgoContext = new AlgorithmContext(new BFS());

        let pathFindingStrategy: pathfindingStrategy | null = null;

        if (currentStratergy === 'BFS') {
            pathFindingStrategy = new BFS();
        } else if (currentStratergy === 'DFS') {
            pathFindingStrategy = new DFS();
        } else if (currentStratergy === 'A_STAR') {
            pathFindingStrategy = new AStar();
        } else {
            res.status(400).json({ error: 'Choose a valid path finding strategy' });
        }
        AlgoContext.setPathfindingStrategy(pathFindingStrategy);

        const traversalResult = await AlgoContext.findPath(startNode, targetNode);

        res.json(traversalResult);
    } catch (err) {
        console.error('Error while traversing :', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
export default expressRouter;
