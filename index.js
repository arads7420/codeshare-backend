const express = require('express')
const app = express()

const authRoutes = require('./routes/auth.js')
const userRoutes = require('./routes/users.js')
const postRoutes = require('./routes/posts.js')
const commentRoutes = require('./routes/comments.js')
const upvoteRoutes = require('./routes/upvotes.js')

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/upvotes", upvoteRoutes)


app.listen(5000, () => {
    console.log("Server is listening on Port-5000")
})
