import { userController } from '../controllers/user.controller';
import express from 'express';

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.post('/refresh', userController.refresh);
router.put('/update', userController.update);
router.delete('/destroy/:id', userController.destroy);

export = router;