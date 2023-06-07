const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/auth_controller.js");

const {
    me,
    updateProfile,
    changePassword,
} = require("../controllers/profile_controller.js");

router.post("/register", register);
router.post("/login", login);
router.delete("/logout", logout);
router.get("/:user_id/account", me);
router.put("/:user_id/account", updateProfile);
router.patch("/password", changePassword);

module.exports = router;
