import express from 'express';
import { postController } from '@controllers/post.controller';

const router = express.Router();

router.get('/', postController.get);
router.get('/:id', postController.show)
router.get('/tags', postController.tags)

export = router;