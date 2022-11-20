import express from 'express';
import { reportsController } from '@controllers/reports.controller';

const router = express.Router();

router.get('/all', reportsController.all);

export = router;