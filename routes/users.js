const express = require('express')
const router = express.Router()
const { getUser, updateUser } = require('../controllers/user.js')

router.get("/find/:userId", getUser)
router.put("/", updateUser)

module.exports = router