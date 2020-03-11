const express = require("express");
const auth = require("../middleware/auth.middleware");
const router = express();
const userController = require("../controllers/userController");

router.post("/register", userController.registerNewUser);
router.post("/login", userController.loginUser);
router.post("/me", auth, userController.getUserDetails);
router.post("/me/logout", auth, userController.logoutUser);
router.post("/me/logout-all", auth, userController.logoutAllUser);

module.exports = router;
