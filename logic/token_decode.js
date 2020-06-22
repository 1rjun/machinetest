const jwt = require('jsonwebtoken')

const config = require('../config')
const key = require('../config/cryptoKey')

token_decode = (token) => {
    try {
        const decode = jwt.verify(token, key)
        // console.log(JSON.stringify(decode._id))
        if (decode) {
            return decode
        }
        return false
    }
    catch (err) {
        return false
    }
}

module.exports = token_decode