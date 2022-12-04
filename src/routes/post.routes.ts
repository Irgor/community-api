import express from 'express';
import { postController } from '../controllers/post.controller';

const router = express.Router();

router.post('/', postController.create);
router.post('/:id/image', postController.createImage);
router.post('/:id/likes', postController.likes)
router.post('/buy/:id', postController.purchase)
router.put('/:id', postController.update)
router.delete('/:id', postController.destroy)

export = router;