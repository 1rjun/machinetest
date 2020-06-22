const jwt = require('jsonwebtoken')


const token_decode = require('../logic/token_decode')
const listing = require('../logic/listing');
const pumpModal = require('../models/pump');
const pump = require('../models/pump');

const key =  require('../config/cryptoKey');
const users = require('../models/users');
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


const registerUser = async (req, res) => {
    try {
        const {
            userId,
            userName,
            userPassword
        } = req.body

        if (!userName) return res.status(401).json({
            status: false,
            msg: 'Please pass user Name.'
        })
        if (!userId) return res.status(401).json({
            status: false,
            msg: 'Please pass user id.'
        })
        
        if (!userPassword) return res.status(401).json({
            status: false,
            msg: 'Please enter the user password.'
        })

        const userInstance = await users.findOne({
            userId: userId
        })
        if (userInstance) return res.status(409).json({
            status: false,
            msg: 'User already exist.'
        })

        const instance = new users({
            userId: userId,
            userPassword: userPassword,
            userName: userName
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

const loginUser = async (req, res) => {
    try {
        const {
            userId,
            userPassword
        } = req.body

        const checkIfExistsOrNot = await users.findOne({
            userId: userId,
            userPassword: userPassword
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



const listOfAllUsers= async (req, res, next) => {

    try {
        const { startingValue, lastValue } = req.body
        const data = {
            query: {},
            // listofFieldsTofetch: '',
            model: users,
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


const uploadImage = async(req, res) =>{
    
        upload(req, res, function (error) {
          if (error) {
            console.log(error);
            if (error.code === "LIMIT_FILE_SIZE") {
              return res
                .status(409)
                .json({ status: true, msg: "You Can Upload Max 3mb File." });
            }
            return res.status(409).json({ status: true, msg: error.message });
          }
          console.log(req.file);
          return res
            .status(200)
            .json({ status: true, msg: "Uploaded Successfully." });
        });
      
}

module.exports = {
    registerUser: registerUser,
    loginUser: loginUser,
    listOfAllUsers: listOfAllUsers,
    uploadImage:uploadImage
    
}