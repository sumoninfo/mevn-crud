const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');

// posts routes
router.get('/posts', PostController.index);
router.post('/posts', PostController.store);
router.get('/posts/:id', PostController.show);
router.put('/posts/:id', PostController.update);
router.delete('/posts/:id', PostController.delete);

module.exports = router;
