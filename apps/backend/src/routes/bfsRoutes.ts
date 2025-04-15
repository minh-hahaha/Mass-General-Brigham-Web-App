import express, { Request, Response } from 'express';
import { bfs } from '../Algorithms/BFS.ts';

const expressRouter = express.Router();

expressRouter.post('/', async function (req: Request, res: Response) {
    try {
        const { start: startNode, end: targetNode } = req.body;
        const traversalResult = await bfs(startNode, targetNode);
        res.json(traversalResult);
    } catch (error) {
        console.error('Graph traversal error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default expressRouter;
