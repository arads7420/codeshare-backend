const {prisma} = require('../utils/prisma.js')
const jwt = require('jsonwebtoken')

const getUpvotes = async (req, res) => {
    const postId = parseInt(req.query.postId, 10);
    try {
        const posts = await prisma.upvote.findMany({
            where: {
                postId: postId
            }
        })
        res.status(200).json(posts)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const addUpvote = async (req, res) => {
    const token = req.cookies.accessToken
    if(!token) return res.status(403).json({error: "Not logged In"})

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, userInfo) => {
        if(err) return res.status(403).json({error: "Token is not valid"})

        try {
            const upvote = await prisma.upvote.create({
                data: {
                    userId: userInfo.id,
                    postId: req.body.postId
                }
            })
            res.status(200).json(upvote)
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    })
}

const deleteUpvote = async (req, res) => {
    const token = req.cookies.accessToken
    if(!token) return res.status(403).json({error: "Not logged In"})

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, userInfo) => {
        if(err) return res.status(403).json({error: "Token is not valid"})

        try {
            const upvote = await prisma.upvote.delete({
                where: {
                    userId_postId: {
                        userId: userInfo.id,
                        postId: req.body.postId
                    }
                }
            })
            res.status(200).json({message: "Post has been disliked"})
        } catch (error) {
            console.log(error)
            res.status(500).json({error: "Some error has occurred"})
        }
    })
}

module.exports = {
    getUpvotes,
    addUpvote,
    deleteUpvote
}