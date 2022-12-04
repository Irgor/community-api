import express from 'express';
import { reportsController } from '../controllers/reports.controller';

const router = express.Router();

router.get('/all', reportsController.all);
router.get('/emails', reportsController.emails);
router.get('/infos', reportsController.infos);
router.get('/count', reportsController.count);

export = router;