const jwt = require('jsonwebtoken')


const token_decode = require('../logic/token_decode')
const listing = require('../logic/listing');
const pumpModal = require('../models/pump');
const pump = require('../models/pump');

const key =  require('../config/cryptoKey')

const registerPump = async (req, res) => {
    try {
        const {
            pumpName,
            pumpLocation, // need to send the lat, long in array format,
            pumpPassword,
            pumpUserid
        } = req.body

        if (!pumpName) return res.status(401).json({
            status: false,
            msg: 'Please pass Pump Name.'
        })
        if (!pumpLocation) return res.status(401).json({
            status: false,
            msg: 'Please enter Pump Location.'
        })
        if (!pumpPassword) return res.status(401).json({
            status: false,
            msg: 'Please enter the Pump Password.'
        })

        const pumpUseridInstance = await pumpModal.findOne({
            pumpUserid: pumpUserid
        })
        if (pumpUseridInstance) return res.status(409).json({
            status: false,
            msg: 'Pump already exist.'
        })

        const instance = new pumpModal({
            pumpUserid: pumpUserid,
            pumpLocation: pumpLocation,
            pumpPassword: pumpPassword,
            pumpName: pumpName
        })
        const data = await instance.save()
        return res.json({
            status: true,
            msg: 'Saved successfully',
            data: data
        })


    } catch (err) {
        console.log("err is", err)
        return res.json({
            status: false,
            msg: 'Something went wrong.'
        })
    }
}

const loginPump = async (req, res) => {
    try {
        const {
            pumpUserid,
            pumpPassword
        } = req.body

        const checkIfExistsOrNot = await pumpModal.findOne({
            pumpUserid: pumpUserid,
            pumpPassword: pumpPassword
        })
        if (!checkIfExistsOrNot) return res.status(401).json({
            status: false,
            msg: 'Invalid username and password'
        })

        const token = jwt.sign(checkIfExistsOrNot.toJSON(), key)

        return res.json({
            status: true,
            msg: 'Login successfully done.',
            token: token
        })

    } catch (err) {
        console.log("err is", err)
        return res.json({
            status: false,
            msg: 'Something went wrong.'
        })
    }
}



const listOfAllPumps = async (req, res, next) => {

    try {
        const { startingValue, lastValue } = req.body
        const data = {
            query: {},
            // listofFieldsTofetch: '',
            model: pumpModal,
            startingValue: startingValue,
            lastValue: lastValue
        }

        const result = await listing(data)

        return res.status(200).send(result);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, msg: 'Something Went Wrong.' })
    }
}




module.exports = {
    registerPump: registerPump,
    listOfAllPumps: listOfAllPumps,
    loginPump: loginPump
}