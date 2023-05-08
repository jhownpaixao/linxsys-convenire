/* eslint-disable prettier/prettier */
import express from 'express';
import { AttendantController } from '../controllers';
import { ThrowHTTPMethodNotAllowed } from '@core';

const AttendantRoute = express.Router();

AttendantRoute.route('/')
    .post(AttendantController.store)
    .get(AttendantController.list)
    .all(ThrowHTTPMethodNotAllowed);

export default AttendantRoute;
