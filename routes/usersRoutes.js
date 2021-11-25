const express = require("express");
const { check } = require("express-validator");

// const fileUpload = require("../middlewares/FileUpload");
const usersController = require("../controllers/usersControllers");

const router = express.Router();

router.get("/", usersController.getUsers);
router.get("/:uid", usersController.getUserById);

router.post(
  "/signup",
  // fileUpload.single("image"), //Expecting a image with a key of image
  [
    check("name").not().isEmpty(),
    check("email")
      .normalizeEmail() // Test@test.com => test@test.com
      .isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.signup
);

router.post("/login", usersController.login);

module.exports = router;
