import express from 'express';
import { postController } from '@controllers/post.controller';

const router = express.Router();

router.post('/', postController.create);
router.post('/:id/image', postController.createImage);
// router.get('/', postController.get);
// router.get('/:id', postController.show)
router.put('/:id', postController.update)
router.post('/:id/like', postController.like)
router.delete('/:id', postController.destroy)

export = router;