import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

// sanitationRequest {
//     //Service Request fields
//     request_id:          number;
//     status:              'Unassigned' | 'Assigned' | 'Working' | null;
//     priority:            'Low' | 'Medium' | 'High' | 'Emergency';
//     request_time:        string;
//
//     //Optional fields
//     location_id:         string;
//     comments:            string;
//     request_date:        string;
//     employee_id:         string;
//
//     //Sanitation fields
//     sanitationType:      string;
//     recurring:           boolean;
//     hazardLevel:         'None' | 'Sharp' | 'Biohazard';
//     disposalRequired:    boolean;
//     completeBy:          string;
// }

router.get('/', async (req: Request, res: Response) => {
    try {
        const requests = await PrismaClient.serviceRequest.findMany({
            where: {
                serviceType: 'Sanitation',
            },
            include: {
                //might flag an error
                sanitation: true,
            },
        });

        res.status(200).json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch patient transport requests' });
    }
});

router.post('/', async (req: Request, res: Response) => {
    //Format for tempDate is  2025-04-04T01:44
    //(maybe on future iterations split the field?)
    const tempDate = new Date(req.body.pickupDate);
    const pickupDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate());

    try {
        const result = await PrismaClient.$transaction(async (prisma) => {
            //creates entry for service request
            const serviceRequest = await prisma.serviceRequest.create({
                data: {
                    priority: req.body.priority,
                    status: req.body.status,
                    comments: req.body.notes,
                    serviceType: 'Sanitation',

                    //9 commandments
                    employeeName: req.body.employeeName,
                    requesterRoomNumber: req.body.requesterRoomNumber,
                    requesterDepartmentId: req.body.requesterDepartmentId,

                    //optional fields
                    //location_id: req.body.locationId ?? null,
                    employeeId: req.body.employeeId || null, // change to user id in the future?
                    //request_date: new Date(pickupDate) ?? null,
                    //request_time: new Date(req.body.pickupTime) ?? null,
                },
            });

            //create entry for patient transport table
            const sanitation = await prisma.sanitation.create({
                data: {
                    servReqId: serviceRequest.requestId,
                    sanitationType: req.body.sanitationType,
                    recurring: req.body.recurring,
                    hazardLevel: req.body.hazardLevel,
                    disposalRequired: req.body.disposalRequired,

                    sanitationDepartmentId: req.body.sanitationDepartmentId,
                    sanitationLocationId: req.body.sanitationLocationId,
                    sanitationRoomNumber: req.body.sanitationRoomNumber,
                    completeBy: new Date(req.body.completeBy).toISOString(),
                },
                select: {
                    servReqId: true,
                    sanitationType: true,
                    recurring: true,
                    hazardLevel: true,
                    disposalRequired: true,
                    completeBy: true,
                },
            });
            console.log(sanitation);
            return { serviceRequest, sanitation };
        });

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

router.post('/edit', async (req: Request, res: Response) => {
    //Format for tempDate is  2025-04-04T01:44
    //(maybe on future iterations split the field?)
    const tempDate = new Date(req.body.sanitationRequest.pickupDate);
    const pickupDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate());

    try {
        const result = await PrismaClient.$transaction(async (prisma) => {
            //creates entry for service request
            const serviceRequest = await prisma.serviceRequest.update({
                where: { requestId: req.body.requestId },
                data: {
                    priority: req.body.sanitationRequest.priority,
                    status: req.body.sanitationRequest.status,
                    comments: req.body.sanitationRequest.notes,
                    serviceType: 'Sanitation',

                    //9 commandments
                    employeeName: req.body.sanitationRequest.employeeName,
                    requesterRoomNumber: req.body.sanitationRequest.requesterRoomNumber,
                    requesterDepartmentId: req.body.sanitationRequest.requesterDepartmentId,

                    //optional fields
                    //location_id: req.body.locationId ?? null,
                    employeeId: req.body.sanitationRequest.employeeId || null, // change to user id in the future?
                    //request_date: new Date(pickupDate) ?? null,
                    //request_time: new Date(req.body.pickupTime) ?? null,
                },
            });

            //create entry for patient transport table
            const sanitation = await prisma.sanitation.update({
                where: { servReqId: req.body.requestId },
                data: {
                    sanitationType: req.body.sanitationRequest.sanitationType,
                    recurring: req.body.sanitationRequest.recurring,
                    hazardLevel: req.body.sanitationRequest.hazardLevel,
                    disposalRequired: req.body.sanitationRequest.disposalRequired,

                    sanitationDepartmentId: req.body.sanitationRequest.sanitationDepartmentId,
                    sanitationLocationId: req.body.sanitationRequest.sanitationLocationId,
                    sanitationRoomNumber: req.body.sanitationRequest.sanitationRoomNumber,
                    completeBy: new Date(req.body.sanitationRequest.completeBy).toISOString(),
                },
                select: {
                    servReqId: true,
                    sanitationType: true,
                    recurring: true,
                    hazardLevel: true,
                    disposalRequired: true,
                    completeBy: true,
                },
            });
            console.log(sanitation);
            return { serviceRequest, sanitation };
        });

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

export default router;
