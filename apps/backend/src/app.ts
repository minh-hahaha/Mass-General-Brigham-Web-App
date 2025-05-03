import createError, { HttpError } from 'http-errors';
import express, { Express, NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import assignedRouter from './routes/assignedrequests.ts';
import employeeRouter from './routes/employee.ts';
import servicereqsRouter from './routes/forms/servicereqs.ts';
import validateRouter from './routes/validate.ts';
import patientTransportRouter from './routes/forms/patienttransport.ts';
import directoryRouter from './routes/directory.ts';
import graphRouter from './routes/findPathRoute.ts';
import sanitationRouter from './routes/forms/sanitation.ts';
import translationRouter from './routes/forms/translationrequest.ts';
import directoryNodeRouter from './routes/directoryNode.ts';
import maintenanceRouter from './routes/forms/maintenancerequest.ts';
import medicalDeviceRouter from './routes/forms/medicaldevicerequest.ts';
import nodeRouter from './routes/node.ts';
import edgeRouter from './routes/edge.ts';
import originRouter from './routes/recentorigins.ts';
import textToSpeechRouter from './routes/textToSpeech.ts';
import assignedRequestsRouter from './routes/assignedrequests.ts';
import serviceSummaryRouter from './routes/servicesummary.ts';
import buildingRouter from './routes/building.ts';

import { ROUTES } from 'common/src/constants';
import { checkJwt } from './routes/auth.ts';

const app: Express = express(); // Setup the backend

// Setup generic middlewear
app.use(
    logger('dev', {
        stream: {
            // This is a "hack" that gets the output to appear in the remote debugger :)
            write: (msg) => console.info(msg),
        },
    })
); // This records all HTTP requests

app.use(express.json()); // This processes requests as JSON
app.use(express.urlencoded({ extended: false })); // URL parser
app.use(cookieParser()); // Cookie parser

// Setup routers. ALL ROUTERS MUST use /api as a start point, or they //SIR YES SIR
// won't be reached by the default proxy and prod setup

app.use(ROUTES.ASSIGNED, assignedRouter);
app.use(ROUTES.VALIDATE, validateRouter);
app.use(ROUTES.SANITATION, sanitationRouter);
app.use(ROUTES.EDITSANITATION, sanitationRouter);

//Employee
app.use(ROUTES.EMPLOYEE, employeeRouter);
app.use(ROUTES.EMPLOYEE_CSV, employeeRouter);
app.use(ROUTES.EMPLOYEE_NAMES, employeeRouter);
app.use(ROUTES.EMPLOYEE_EMAIL, employeeRouter);
app.use(ROUTES.EMPLOYEE_NAME_ID, employeeRouter);

//Building
app.use(ROUTES.BUILDING, buildingRouter);
app.use(ROUTES.BUILDING_NOT, buildingRouter);

//Directory
app.use(ROUTES.DIRECTORY, directoryRouter);
app.use(ROUTES.DIRECTORY_CSV, directoryRouter);
app.use(ROUTES.DIRECTORY_NAMES, directoryRouter);
app.use(ROUTES.DIRECTORY_NODE, directoryNodeRouter);
app.use(ROUTES.DIRECTORY_BUILDING, directoryRouter);
app.use(ROUTES.DIRECTORY_JSON, directoryRouter);

//Service Requests
app.use(ROUTES.SERVICEREQUESTS, servicereqsRouter);
app.use(ROUTES.TRANSLATIONREQUEST, translationRouter);
app.use(ROUTES.EDITTRANSLATIONREQUEST, translationRouter);
app.use(ROUTES.MAINTENANCEREQUEST, maintenanceRouter);
app.use(ROUTES.EDITMAINTENANCEREQUEST, maintenanceRouter);
app.use(ROUTES.PATIENTTRANSPORT, patientTransportRouter);
app.use(ROUTES.EDITPATIENTTRANSPORT, patientTransportRouter);
app.use(ROUTES.MEDICALDEVICEREQUEST, medicalDeviceRouter);
app.use(ROUTES.SANITATION, sanitationRouter);
app.use(ROUTES.TRANSLATIONREQUEST, translationRouter);
app.use(ROUTES.PATIENTTRANSPORT, patientTransportRouter);
app.use(ROUTES.EDITMEDICALDEVICEREQUEST, medicalDeviceRouter);

//Algorithms
app.use(ROUTES.FINDPATH, graphRouter);
app.use(ROUTES.NODE, nodeRouter);
app.use(ROUTES.EDGE, edgeRouter);
app.use(ROUTES.NODE_EDGE_CSV, nodeRouter);
app.use(ROUTES.NODE_EDGE_JSON, nodeRouter);

app.use(ROUTES.RECENT_ORIGINS, originRouter);

app.use(ROUTES.TTS, textToSpeechRouter);

//Account
app.use(ROUTES.SERVICESUMMARY, checkJwt, serviceSummaryRouter);
app.use(ROUTES.ASSIGNEDREQUESTS, checkJwt, assignedRequestsRouter);

/**
 * Catch all 404 errors, and forward them to the error handler
 */
app.use((req: Request, res: Response, next: NextFunction) => {
    // Have the next (generic error handler) process a 404 error
    next(createError(404));
});

/**
 * Generic error handler
 */
app.use((err: HttpError, req: Request, res: Response) => {
    // Provide the error message
    res.statusMessage = err.message;

    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Reply with the error
    res.status(err.status || 500);
});

// Export the backend, so that www.ts can start it
export default app;
