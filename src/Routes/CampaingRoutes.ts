/* eslint-disable prettier/prettier */
import { ThrowHTTPMethodNotAllowed } from '@core';
import express from 'express';
import { CampaingController } from '../controllers/CampaingController';

const CampaingRoutes = express.Router();

CampaingRoutes
    .route('/')
    .post(CampaingController.store)
    .get(CampaingController.list)
    .all(ThrowHTTPMethodNotAllowed);

export default CampaingRoutes;
