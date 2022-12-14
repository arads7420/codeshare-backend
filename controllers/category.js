const {prisma} = require('../utils/prisma.js')
const jwt = require('jsonwebtoken')

const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany()
        res.status(200).json(categories)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}


module.exports = {
    getCategories,
}

