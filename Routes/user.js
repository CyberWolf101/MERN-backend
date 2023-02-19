const express = require("express")
const router = express.Router()
const { login_user, singnup_user } = require('../controllers/userController')

//login route
router.post("/login", login_user)

//sign-up route
router.post("/signup", singnup_user)

module.exports = router;