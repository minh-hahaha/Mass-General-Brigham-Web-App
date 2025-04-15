import express, { Request, Response } from 'express';
import  {cleanedUpBFS} from "../Algorithms/BFS.ts";

const expressRouter = express.Router()

expressRouter.post('/traverse', async (req: Request, res: Response) => {
    try {
        const { startNode, targetNode } = req.body;
        const traversalResult = await cleanedUpBFS(startNode, targetNode);
        res.json(traversalResult);
    } catch (error) {
        console.error('Graph traversal error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default expressRouter;