const {prisma} = require('../utils/prisma.js')
const jwt = require('jsonwebtoken')

const getUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(req.params.userId, 10)
            }
        })
        if(user !== null) {
            delete user.password
        }
        
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}


const updateUser = async (req, res) => {
    const token = req.cookies.accessToken
    if(!token) return res.status(403).json({error: "Not logged In"})

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, userInfo) => {
        if(err) return res.status(403).json({error: "Token is not valid"})

        try {
            const updatedUser = await prisma.user.update({
                where: {
                  id: userInfo.id,
                },
                data: {
                    name: req.body.name,
                    email: req.body.email,
                    img: req.body.img,
                    shortDesc: req.body.shortDesc,
                    about: req.body.about,
                    githublink: req.body.githublink,
                    linkedinlink: req.body.linkedinlink,
                },
            })
            res.status(200).json(updatedUser)
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    })
}

module.exports = {
    getUser,
    updateUser
}