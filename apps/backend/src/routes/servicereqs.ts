import express, { Router, Request, Response } from 'express';
import { Prisma } from 'database';
import PrismaClient from '../bin/prisma-client';
import { dataToCSV, readCSV } from '../CSVImportExport.ts';
import * as console from 'node:console';

const router: Router = express.Router();

//SWITCH CASE ROULETTE

//Here Lies what remains of Jake's code
// //Note: Route not set up yet
// router.post('/csv', async function (req: Request, res: Response) {
//     const csvData = await readCSV('./data.csv');
//     try {
//         for (let data of csvData) {
//             const dataToUpsert = {
//                 request_id: data.request_id,
//                 employee_id: data.employee_id,
//                 request_date: data.request_date,
//                 status: data.status,
//                 comments: data.comments,
//                 priority: data.priority,
//                 location_id: data.location_id,
//                 service_type: data.service_type,
//                 transport_type: data.service_type,
//                 request_time: data.request_time,
//             };
//             await PrismaClient.serviceRequest.upsert({
//                 where: { request_id: data.request_id },
//                 update: dataToUpsert,
//                 create: dataToUpsert,
//             });
//         }
//         res.sendStatus(200);
//     } catch (err) {
//         console.log(err);
//         res.sendStatus(400);
//     }
// });

export default router;
