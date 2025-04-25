import express, { Router, Request, Response } from 'express';
import PrismaClient from '../../bin/prisma-client.ts';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const requests = await PrismaClient.serviceRequest.findMany({
            where: {
                serviceType: 'Maintenance Request',
            },
            include: {
                maintenanceRequest: true, // includes MaintenanceRequest entry
            },
        });

        res.status(200).json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch maintenance requests' });
    }
});

router.post('/', async (req: Request, res: Response) => {
    //Format for tempDate is 2025-04-04T01:44
    console.log(req.body);
    const tempDate = new Date(req.body.maintenanceDate || req.body.pickupDate);

    try {
        const result = await PrismaClient.$transaction(async (prisma) => {
            //creates entry for service request
            const serviceRequest = await prisma.serviceRequest.create({
                data: {
                    employeeId: req.body.employeeId || req.body.assignedToId,
                    status: 'Pending',
                    comments: req.body.notes,
                    priority: req.body.priority,
                    serviceType: 'Maintenance Request',
                    employeeName: req.body.employeeName,
                },
            });

            //create entry for maintenance request table
            const maintenanceRequest = await prisma.maintenanceRequest.create({
                data: {
                    servMaintenanceId: serviceRequest.requestId,
                    maintenanceType: req.body.maintenanceType,
                    maintenanceDescription: req.body.maintenanceDescription,
                    maintenanceHospital: req.body.maintenanceHospital,
                    maintenanceLocation: req.body.maintenanceLocation,
                    maintenanceTime: new Date(req.body.maintenanceTime) ?? null,
                },
            });

            return { serviceRequest, maintenanceRequest };
        });

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

export default router;
