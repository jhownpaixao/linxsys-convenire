/* eslint-disable prettier/prettier */
import express from 'express';
import { AttendantController } from '../Controllers';
import { ThrowHTTPMethodNotAllowed } from '@Core';

const AttendantRoute = express.Router();

AttendantRoute.route('/')
    .post(AttendantController.store)
    .get(AttendantController.list)
    .all(ThrowHTTPMethodNotAllowed);

export default AttendantRoute;
