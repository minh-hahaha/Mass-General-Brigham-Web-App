import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

// router.get('/', async function (req: Request, res: Response) {
//     const departmentId = parseInt(req.params.deptId);
//     const department = await PrismaClient.department.findUnique({
//         where: { deptId: departmentId },
//         include: { nodeReception: true }, // Include the associated node
//     });
//
//     if (department == null) {
//         console.error('No department found in database!');
//         res.sendStatus(204);
//     } else {
//         res.send(department.nodeReception);
//     }
// });

export default router;
