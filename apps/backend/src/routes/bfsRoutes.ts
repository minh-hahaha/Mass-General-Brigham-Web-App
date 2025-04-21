import express, { Request, Response } from 'express';
import { BFS } from '../Algorithms/BFS.ts';
import { DFS } from '../Algorithms/DFS.ts';
import { myNode } from '../Algorithms/classes.ts';

const expressRouter = express.Router();

expressRouter.post('/', async function (req: Request, res: Response) {
    try {
        const { start: startNode, end: targetNode } = req.body;

        const traversalResult = await bfs(startNode, targetNode);

        //console.log(traversalResult);

        res.json(traversalResult);


    } catch (error) {
        console.error('Graph traversal error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default expressRouter;
