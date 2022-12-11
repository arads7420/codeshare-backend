const express = require('express')
const cors = require('cors')
const cookieParse = require('cookie-parser')
const dotenv = require('dotenv')
dotenv.config()
const app = express()
const port = process.env.PORT || 5000;

const authRoutes = require('./routes/auth.js')
const userRoutes = require('./routes/users.js')
const postRoutes = require('./routes/posts.js')
const commentRoutes = require('./routes/comments.js')
const upvoteRoutes = require('./routes/upvotes.js')


// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(cookieParse())

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/upvotes", upvoteRoutes)


app.listen(port, () => {
    console.log(`Server is listening on Port-${port}`)
})
