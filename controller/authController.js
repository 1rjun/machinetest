// var jwt = require('jsonwebtoken')
var tokenDecode = require('../logic/token_decode')
const verifyToken = (req, res, next) => {
    try {
        const { token } = req.headers

        if (tokenDecode(token)) {
            next()
        }
        else {
            res.json({ msg: 'Invalid token', status: false })
        }
    }
    catch (err) {
        return res.json({ msg: 'Please pass token', status: false })
    }
}

module.exports = verifyToken
