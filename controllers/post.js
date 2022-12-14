const {prisma} = require('../utils/prisma.js')
const jwt = require('jsonwebtoken')

const getPosts = async (req, res) => {
    try {
        if(req.query.categoryId) {
            const posts = await prisma.post.findMany({
                where: {
                    categoryId: parseInt(req.query.categoryId, 10)
                },
                include: {
                    type: true,
                    upvotes: true,
                    category: true,
                    user: {
                        select: {
                            id: true,
                            username: true,
                            img: true,
                        }
                    }
                }
            })
            res.status(200).json(posts)
        }
        else {
            const posts = await prisma.post.findMany({
                include: {
                    type: true,
                    upvotes: true,
                    category: true,
                    user: {
                        select: {
                            id: true,
                            username: true,
                            img: true,
                        }
                    }
                }
            })
            res.status(200).json(posts)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const getSearchResults = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            where: {
                title: {
                    contains: req.query.searchtext,
                    mode: 'insensitive'
                }
            },
            include: {
                type: true,
                upvotes: true,
                category: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        img: true,
                    }
                }
            }
        })
        res.status(200).json(posts)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const addPost = async (req, res) => {
    const token = req.cookies.accessToken
    if(!token) return res.status(403).json({error: "Not logged In"})

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, userInfo) => {
        if(err) return res.status(403).json({error: "Token is not valid"})

        try {
            const data = req.body
            const post = await prisma.post.create({
                data: {
                  title: data.title,
                  shortDesc: data.shortDesc,
                  link: data.link,
                  logo: data.logo,
                  description: data.description,
                  images: req.body.images,
                  type: {
                    connect: {
                        id: data.type.id,
                    } 
                  },
                  category: {
                    connect: data.category
                  },
                  user: {
                    connect: {
                        id: data.user.id
                    }
                  }
                },
            })
            res.status(200).json(post)
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    })
}

const getPostsByUserId = async (req, res) => {
    const token = req.cookies.accessToken
    if(!token) return res.status(403).json({error: "Not logged In"})

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, userInfo) => {
        if(err) return res.status(403).json({error: "Token is not valid"})

        try {
            const posts = await prisma.post.findMany({
                where: {
                    userId: userInfo.id
                },
                include: {
                    type: true,
                    upvotes: true,
                    category: true,
                    user: {
                        select: {
                            id: true,
                            username: true,
                            img: true,
                        }
                    }
                }
            })
            if(posts === null) {
                posts = []
            }
            res.status(200).json(posts)
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    })

}

const updatePost = async (req, res) => {
    const token = req.cookies.accessToken
    if(!token) return res.status(403).json({error: "Not logged In"})

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, userInfo) => {
        if(err) return res.status(403).json({error: "Token is not valid"})

        try {
            const data = req.body.inputs
            const updatedPost = await prisma.post.update({
                where: {
                    id: req.body.postId,
                },
                data: {
                    logo: req.body.logo,
                    title: data.title,
                    shortDesc: data.shortDesc,
                    link: data.link,
                    description: data.description,
                    images: req.body.images,
                    type: {
                        connect: {
                            id: data.type.id,
                        } 
                    },
                    category: {
                        connect: {
                            id: parseInt(data.category, 10)
                        }
                    },
                },
            })
            res.status(200).json(updatedPost)
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    })
}

const deletePost = async (req, res) => {
    const token = req.cookies.accessToken
    if(!token) return res.status(403).json({error: "Not logged In"})

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, userInfo) => {
        if(err) return res.status(403).json({error: "Token is not valid"})

        try {
            const post = await prisma.post.delete({
                where: {
                    id: req.body.postId
                }
            })
            res.status(200).json({message: "Post has been deleted"})
        } catch (error) {
            console.log(error)
            res.status(500).json({error: "Some error has occurred"})
        }
    })
}

module.exports = {
    getPosts,
    addPost,
    getPostsByUserId,
    updatePost,
    deletePost,
    getSearchResults
}

