const express = require("express");
const { check } = require("express-validator");

const postsControllers = require("../controllers/postsControllers");
const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

router.get("/", postsControllers.getPosts);

router.get("/:pid", postsControllers.getPostById);

router.get("/user/:uid", postsControllers.getPostsByUserId);

router.use(checkAuth);

router.post(
  "/",
  [check("breed").not().isEmpty(), check("description").isLength({ min: 15 })],
  postsControllers.createPost
);

router.patch(
  "/:pid",
  [check("breed").not().isEmpty(), check("description").isLength({ min: 15 })],
  postsControllers.updatePost
);

router.delete("/:pid", postsControllers.deletePost);

module.exports = router;
