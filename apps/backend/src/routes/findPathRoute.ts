import express, { Request, Response } from 'express';
import { BFS } from '../Algorithms/BFS.ts';
import { DFS } from '../Algorithms/DFS.ts';
import { myNode } from '../Algorithms/classes.ts';
import { AlgorithmContext } from '../Algorithms/AlgorithmContext.ts';
import { pathfindingStrategy} from '../Algorithms/PathFindingStrategy.ts';


const expressRouter = express.Router()

expressRouter.post('/findPath',async function (req: Request, res: Response) {
    try {
        const { start: startNode, end: targetNode, strat: currentStratergy } = req.body;
        const PFStrat = new AlgorithmContext();


    }

});