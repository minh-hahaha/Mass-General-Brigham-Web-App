import express, { Router, Request, Response } from 'express';
import { Prisma } from 'database';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

router.get('/', async function (req: Request, res: Response) {
    const email = req.query.email as string;
    console.log(email);
    const adminUser = await PrismaClient.employee.findUnique({
        where: { email: email },
    });

    if (adminUser == null) {
        console.error('No admin user found in database!');
        res.sendStatus(204);
    } else {
        res.send(adminUser);
    }
});

export default router;
