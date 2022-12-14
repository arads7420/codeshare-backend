const express = require('express')
const router = express.Router()
const { getPosts, addPost, getPostsByUserId, updatePost, deletePost, getSearchResults} = require('../controllers/post.js')

router.get("/", getPosts)
router.get("/myposts", getPostsByUserId)
router.get("/search", getSearchResults)
router.post("/", addPost)
router.put("/", updatePost)
router.delete("/", deletePost)

module.exports = router