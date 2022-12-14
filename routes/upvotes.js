const express = require('express')
const router = express.Router()
const { getUpvotes, addUpvote, deleteUpvote } = require('../controllers/upvote.js')

router.get("/", getUpvotes)
router.post("/", addUpvote)
router.delete("/", deleteUpvote)

module.exports = router
