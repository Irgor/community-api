import express from 'express';
import controller from '@controllers/post.controller';

const router = express.Router();

router.post('/', controller.create);
router.post('/:id/image', controller.createImage);
router.get('/', controller.get);
router.get('/:id', controller.show)
router.put('/:id', controller.update)
router.delete('/:id', controller.destroy)

export = router;