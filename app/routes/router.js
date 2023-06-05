const express = require('express');
const router = express.Router()
const {
    register,
    login,
} = require('../controllers/auth_controller.js')

const { me, updateProfile, changePassword} = require("../controllers/profile_controller.js");

router.post("/register", register)
router.post("/login", login)
router.get("/me", me)
router.put("/me", updateProfile)
router.patch('/password', changePassword);


module.exports = router;