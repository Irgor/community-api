import express from 'express';
import { postController } from '@controllers/post.controller';

const router = express.Router();

router.get('/', postController.get);
router.get('/tags', postController.tags)
router.get('/:id', postController.show)

export = router;