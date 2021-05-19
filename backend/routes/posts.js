const express = require('express');
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const PostController = require('../controllers/post');



router.post('/',checkAuth,extractFile,PostController.createPost)

router.put('/:id',checkAuth, extractFile,PostController.updatePost)

router.get('/',PostController.getPosts);

router.delete("/:id",checkAuth,  PostController.deletePost)

router.get("/:id", PostController.getPostById)

module.exports = router;
