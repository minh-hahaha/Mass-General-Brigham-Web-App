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
                    employeeId: req.body.employeeId,
                    status: 'Pending',
                    comments: req.body.notes,
                    priority: req.body.priority,
                    serviceType: 'Maintenance Request',
                },
            });

            //create entry for maintenance request table
            const maintenanceRequest = await prisma.maintenanceRequest.create({
                data: {
                    servMaintenanceId: serviceRequest.requestId,
                    maintenanceType: req.body.maintenanceType,
                    maintenanceHospital: req.body.maintenanceHospital,
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

router.post('/edit', async (req: Request, res: Response) => {
    //Format for tempDate is  2025-04-04T01:44
    console.log(req.body);
    const tempDate = new Date(
        req.body.maintenanceRequest.maintenanceDate || req.body.maintenanceRequest.pickupDate
    );

    try {
        const result = await PrismaClient.$transaction(async (prisma) => {
            //creates entry for service request
            const serviceRequest = await prisma.serviceRequest.update({
                where: { requestId: req.body.requestId },
                data: {
                    employeeId:
                        req.body.maintenanceRequest.employeeId ||
                        req.body.maintenanceRequest.assignedToId,
                    // requestDate: tempDate ?? null,
                    status: req.body.maintenanceRequest.status,
                    comments: req.body.maintenanceRequest.notes,
                    priority: req.body.maintenanceRequest.priority,
                    serviceType: 'Maintenance Request',
                    employeeName: req.body.maintenanceRequest.employeeName,
                },
            });

            //create entry for maintenance request table
            const maintenanceRequest = await prisma.maintenanceRequest.update({
                where: { servMaintenanceId: req.body.requestId },
                data: {
                    maintenanceType: req.body.maintenanceRequest.maintenanceType,
                    //maintenanceDescription: req.body.maintenanceRequest.maintenanceDescription,
                    maintenanceHospital: req.body.maintenanceRequest.maintenanceHospital,
                    //maintenanceLocation: req.body.maintenanceRequest.maintenanceLocation,
                    maintenanceTime: new Date(req.body.maintenanceRequest.maintenanceTime) ?? null,
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
