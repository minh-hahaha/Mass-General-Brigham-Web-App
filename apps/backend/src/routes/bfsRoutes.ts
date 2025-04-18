import express, { Request, Response } from 'express';
import { bfs } from '../Algorithms/BFS.ts';
import { myNode } from '../Algorithms/classes.ts';

const expressRouter = express.Router();

class Vector {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    dot(other: Vector): number {
        return this.x * other.x + this.y * other.y;
    }

    angleTo(other: Vector): number {
        const dot = this.dot(other);
        const cross = this.x * other.y - this.y * other.x;
        // Return angle in degrees
        // Using degrees instead of radians bc it's easier to compare bigger numbers than decimals
        return Math.atan2(cross, dot) * 180 / Math.PI;
    }
}

expressRouter.post('/', async function (req: Request, res: Response) {
    try {
        const { start: startNode, end: targetNode } = req.body;
        const traversalResult = await bfs(startNode, targetNode);
        res.json(traversalResult);
        createTextPath(traversalResult);
    } catch (error) {
        console.error('Graph traversal error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

function createTextPath(traversalResult: myNode[] | undefined | null) {
    // Make sure a path exists
    if (!traversalResult) {
        console.log('No Path');
        return;
    }

    // Initial facing direction. TODO: need to be able to figure out direction for the first node
    // Currently starts facing south
    let currentDirection = new Vector(0, traversalResult[0].y + 50);
    // Traversing floors: when the user is taking the elevator or stairs
    let traversingFloors = false;
    // Loop through each node in the list
    for (let i = 0; i < traversalResult.length; i++) {
        // Get the current and next node
        let currentNode = traversalResult[i];
        let nextNode = traversalResult[i + 1];
        // If there is no next node, we have reached the destination
        if (!nextNode) {
            console.log(`You have arrived at ${currentNode.name}`);
            break;
        }

        const dy = nextNode.y - currentNode.y;
        const dx = nextNode.x - currentNode.x;
        // Get the direction the user will be facing
        const newDirection = new Vector(dx, dy);
        // Get the angle between the user's current facing and the next node's facing
        const angle = currentDirection.angleTo(newDirection);
        // Make the user's current direction the new direction
        currentDirection = newDirection;
        // If the next node is an elevator or stairs, the user will be changing floors
        if (nextNode.nodeType === 'Elevator' || nextNode.nodeType === 'Stairs') {
            traversingFloors = true;
            // If the next node is not an elevator or stairs, and the user should be traversing floors,
            // we have arrived at the next walkable node
        } else if (traversingFloors && (nextNode.nodeType !== 'Elevator' && nextNode.nodeType !== 'Stairs')) {
            traversingFloors = false;
            // Instruct the user to take the elevator to the nth floor
            console.log(
                `Take the Elevator to the ${nextNode.floor}${getNumberSuffix(nextNode.floor)} floor`
            );
        }
        // The default instructions if not traversing floors or if getting off the elevator/stairs
        if (!traversingFloors || (traversingFloors && (nextNode.nodeType !== 'Elevator' && nextNode.nodeType !== 'Stairs'))) {
            console.log(
                `From the ${currentNode.id} ${determineDirection(angle)} until you reach the ${nextNode.id}`
            );
        }
    }
}

function determineDirection(angle: number): string {
    let prefix = '';
    if (angle < -75 && angle > -105) {
        prefix = 'Turn Left then ';
    } else if (angle > 75 && angle < 105) {
        prefix = 'Turn Right then ';
    }
    return prefix + 'Continue Straight';
}

function getNumberSuffix(num: string): string {
    if (num.endsWith('1') && num === '11') {
        return 'st';
    } else if (num.endsWith('2') && num === '12') {
        return 'nd';
    } else if (num.endsWith('3') && num === '13') {
        return 'rd';
    } else {
        return 'th';
    }
}

export default expressRouter;
