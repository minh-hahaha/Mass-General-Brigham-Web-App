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
                    employee_name: req.body.employee_name,
                    requester_room_number: req.body.requester_room_number,
                    requester_department_id: req.body.requester_department_id,


                    //optional fields
                    //location_id: req.body.locationId ?? null,
                    employeeId: req.body.employeeId ?? null, // change to user id in the future?
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

                    sanitation_department_id: req.body.sanitation_department_id,
                    sanitation_location_id:req.body.sanitation_location_id,
                    sanitation_room_number: req.body.sanitation_room_number,
                    //completeBy: req.body.completeBy,
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

            return { serviceRequest, sanitation };
        });

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

export default router;
