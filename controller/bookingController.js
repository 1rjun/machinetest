const jwt = require('jsonwebtoken')


const token_decode = require('../logic/token_decode')
const listing = require('../logic/listing');
const pumpModal = require('../models/pump');

const key =  require('../config/cryptoKey');
const users = require('../models/users');
const bookingModal = require('../models/booking')

const booking = async (req, res) => {
    try {
        const { token } = req.headers
        const { _id } = token_decode(token);
        const {
            bookingType,
            pumpLocation
        } = req.body
        
        if (!bookingType) return res.status(401).json({
            status: false,
            msg: 'Please pass booking Type.'
        })
        // pumpModal.collection.createIndex({pumpLocation: "2dsphere"})

      const pumpInstance = await pumpModal.findOne({
            pumpLocation:{
             "$near":{
                 "$geometry":{
                    "type":"Point",
                    "coordinates":pumpLocation
                 },
                 "$maxDistance":1000
             }
            }
        })
        setTimeout(() => {
            
        }, 1000);
        const instance = await new bookingModal({
            bookingType: bookingType,
            bookingByid: _id,
            pumpId: pumpInstance._id
        })
        const data = await instance.save()
        return res.json({
            status: true,
            msg: 'Saved successfully',
            data: instance,
            pumpInstance: pumpInstance
        })


    } catch (err) {
        console.log("err is", err)
        return res.json({
            status: false,
            msg: 'Something went wrong.'
        })
    }
}


const listMyBooking = async (req, res, next) => {

    try {
        const { token } = req.headers
        const { _id } = token_decode(token);
        const { startingValue, lastValue } = req.body
        const data = {
            query: {
                pumpId:_id
            },
            // listofFieldsTofetch: '',
            model: bookingModal,
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




const multer = require("multer");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/");
  },

  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    const fileExtension = file.originalname.split(".")[1];
    cb(null, "profileImage." + fileExtension);
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 3000000, //It mean 3 mb - Is max file size
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(
        new Error(
          `Please Upload 'png, jpg and jpeg' format of logo image only.`
        )
      );
    }
    cb(undefined, true);
  },
}).single("upload");



module.exports = {
    booking: booking,
    listMyBooking: listMyBooking
}