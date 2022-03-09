const userModel=require('../models/userModels');
const hothostModel=require('../models/hothostModels');
const reviewModels=require('../models/reviewModels');
const guestModel=require('../models/gusetModels');
const mongoose=require('mongoose');


const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.length === 0) return false
    return true;
}

const isValidObjectId = function(objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
}

const isValidMobileNum = function (value) {
    if (!(/^[6-9]\d{9}$/.test(value))) {
        return false
    }
    return true
}

const isValidSyntaxOfEmail = function (value) {
    if (!(validator.validate(value))) {
        return false
    }
    return true
}

const isAlphabet = function (value) {
    let regex = /^[A-Za-z ]+$/
    if (!(regex.test(value))) {
        return false
    }
    return true
}

const isKeyPresent = function (value) {
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}



//---------------------------------------API-Validation----------------------------------------//

// i!isValid(fname) || !isValid(lname) || !isValid(lname)

const checkUser = async (req, res, next) => {
    try {
        
        let userData = req.body
        
        if (!isValidRequestBody(userData)) {
            return res.status(400).send({ status: false, message: "Please provide data for successful registration" });
        }
        let { userName, email, phone, password, address } = userBody;
        if (!isValid(userName)) {
            return res.status(400).send({ status: false, message: "Please provide fname or fname field" });
        }
        
        if (!isAlphabet(fname)) {
            return res.status(400).send({ status: false, message: "You can't use special character or number in fname" });
        }
        
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "Please provide Email id or email field" });;
        }
        if (!isValidSyntaxOfEmail(email)) {
            return res.status(404).send({ status: false, message: "Please provide a valid Email Id" });
        }
        if (!isValid(phone)) {
            return res.status(400).send({ status: false, message: "Please provide phone number or phone field" });
        }
        if (!isValidMobileNum(phone)) {
            return res.status(400).send({ status: false, message: '1 Please provide a valid phone number' })
        }
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "Please provide password or password field" });;
        }
        let size = Object.keys(password.trim()).length
        if (size < 8 || size > 15) {
            return res.status(400).send({ status: false, message: "Please provide password with minimum 8 and maximum 14 characters" });;
        }
        if (!isValid(address)) {
            return res.status(400).send({ status: false, message: "Please provide address or address field" });;
        }
        let isDBexists = await userModel.find();
        let dbLen = isDBexists.length
        if (dbLen != 0) {
            const DuplicateEmail = await userModel.find({ email: email });
            const emailFound = DuplicateEmail.length;
            if (emailFound != 0) {
                return res.status(400).send({ status: false, message: "This email Id already exists with another user" });
            }
            const duplicatePhone = await userModel.findOne({ phone: phone })
            if (duplicatePhone) {
                return res.status(400).send({ status: false, message: "This phone number already exists with another user" });
            }
        }
        next();
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

const checkUserupdate = async (req, res, next) => {
    try {
        let userBody = req.body
        let paramsId = req.params.userId
        let checkId = ObjectId.isValid(paramsId);
        if (!checkId) {
            return res.status(400).send({ status: false, message: "Please Provide a valid userId in path params" });;
        }
        if (!(req.userId == paramsId)) {
            return res.status(400).send({ status: false, message: "Sorry you are not authorized to do this action" })
        }
        if (!isValidRequestBody(userBody)) {
            return res.status(400).send({ status: false, message: "Please provide data to update" });
        }
        let {userName, email, phone, password, address} = userBody;
        if (!isKeyPresent(userName)) {
            return res.status(400).send({ status: false, message: "Please provide fname" });
        }
        if (!isAlphabet(userName)) {
            return res.status(400).send({ status: false, message: "You can't use special character or number in userName" });
        }
        
        if (!isKeyPresent(email)) {
            return res.status(400).send({ status: false, message: "Please provide email" });
        }
        if (email) {
            if (!isValidSyntaxOfEmail(email)) {
                return res.status(404).send({ status: false, message: "Please provide a valid Email Id" });
            }
        }
        if (!isKeyPresent(phone)) {
            return res.status(400).send({ status: false, message: "Please provide email" });
        }
        if (phone) {
            if (!isValidMobileNum(phone)) {
                return res.status(400).send({ status: false, message: 'Please provide a valid phone number' })
            }
        }
        if (!isKeyPresent(password)) {
            return res.status(400).send({ status: false, message: "Please provide password" });
        }
        if (password) {
            let size = Object.keys(password.trim()).length
            if (size < 8 || size > 15) {
                return res.status(400).send({ status: false, message: "Please provide password with minimum 8 and maximum 14 characters" });;
            }
        }
        if (!isKeyPresent(address)) {
            return res.status(400).send({ status: false, message: "Please provide address" });
        }

        const foundId = await userModel.findOne({ email: email });
        if (foundId) {
            let userId1 = foundId._id
            if (userId1 == paramsId) { // here we are checking that if we are the owner of duplicate id then still we are able to update
                const duplicatePhone1 = await userModel.findOne({ phone: phone })
                if (duplicatePhone1) {
                    let userId2 = duplicatePhone1._id
                    if (userId2 == paramsId) {
                        return next();
                    } else if (duplicatePhone1) {
                        return res.status(400).send({ status: false, message: "This phone number already exists with another user(1)" });
                    }
                } else {
                    return next();
                }
            }
        }

        const foundId1 = await userModel.findOne({ phone: phone });
        if (foundId1) {
            let userId3 = foundId1._id
            if (userId3 == paramsId) { // here we are checking that if we are the owner of duplicate id then still we are able to update
                const duplicateEmail1 = await userModel.findOne({ email: email })
                if (duplicateEmail1) {
                    let userId2 = duplicateEmail1._id
                    if (userId2 == paramsId) {
                        return next();
                    } else if (duplicateEmail1) {
                        return res.status(400).send({ status: false, message: "This email Id is already exists with another user(1)" });
                    }
                } else {
                    return next();
                }
            }
        }
        const DuplicateEmail = await userModel.find({ email: email });
        const emailFound = DuplicateEmail.length;
        if (emailFound != 0) {
            return res.status(400).send({ status: false, message: "This email Id already exists with another user(2)" });
        }
        const duplicatePhone = await userModel.findOne({ phone: phone })
        if (duplicatePhone) {
            return res.status(400).send({ status: false, message: "This phone number already exists with another user(2)" });
        }
        next();
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}


const checkGuestupdate = async (req, res, next) => {
    try {
        let myData = req.body.data
        if (!myData) {
            return res.status(400).send({ status: false, message: "Please provide data to update" });
        }
        let userBody = JSON.parse(req.body.data)
        let paramsId = req.params.userId
        let checkId = ObjectId.isValid(paramsId);
        if (!checkId) {
            return res.status(400).send({ status: false, message: "Please Provide a valid userId in path params" });;
        }
        if (!(req.userId == paramsId)) {
            return res.status(400).send({ status: false, message: "Sorry you are not authorized to do this action" })
        }
        if (!isValidRequestBody(userBody)) {
            return res.status(400).send({ status: false, message: "Please provide data to update" });
        }
        let { guestName, email, profileImage, phone, password, address } = userBody;
        if (!isKeyPresent(guestName)) {
            return res.status(400).send({ status: false, message: "Please provide fname" });
        }
        if (!isAlphabet(guestName)) {
            return res.status(400).send({ status: false, message: "You can't use special character or number in fname" });
        }
        
        if (!isKeyPresent(email)) {
            return res.status(400).send({ status: false, message: "Please provide email" });
        }
        if (email) {
            if (!isValidSyntaxOfEmail(email)) {
                return res.status(404).send({ status: false, message: "Please provide a valid Email Id" });
            }
        }
        if (!isKeyPresent(phone)) {
            return res.status(400).send({ status: false, message: "Please provide email" });
        }
        if (phone) {
            if (!isValidMobileNum(phone)) {
                return res.status(400).send({ status: false, message: 'Please provide a valid phone number' })
            }
        }
        if (!isKeyPresent(password)) {
            return res.status(400).send({ status: false, message: "Please provide password" });
        }
        if (password) {
            let size = Object.keys(password.trim()).length
            if (size < 8 || size > 15) {
                return res.status(400).send({ status: false, message: "Please provide password with minimum 8 and maximum 14 characters" });;
            }
        }
        if (!isKeyPresent(address)) {
            return res.status(400).send({ status: false, message: "Please provide address" });
        }

        const foundId = await userModel.findOne({ email: email });
        if (foundId) {
            let userId1 = foundId._id
            if (userId1 == paramsId) { // here we are checking that if we are the owner of duplicate id then still we are able to update
                const duplicatePhone1 = await userModel.findOne({ phone: phone })
                if (duplicatePhone1) {
                    let userId2 = duplicatePhone1._id
                    if (userId2 == paramsId) {
                        return next();
                    } else if (duplicatePhone1) {
                        return res.status(400).send({ status: false, message: "This phone number already exists with another user(1)" });
                    }
                } else {
                    return next();
                }
            }
        }

        const foundId1 = await userModel.findOne({ phone: phone });
        if (foundId1) {
            let userId3 = foundId1._id
            if (userId3 == paramsId) { // here we are checking that if we are the owner of duplicate id then still we are able to update
                const duplicateEmail1 = await userModel.findOne({ email: email })
                if (duplicateEmail1) {
                    let userId2 = duplicateEmail1._id
                    if (userId2 == paramsId) {
                        return next();
                    } else if (duplicateEmail1) {
                        return res.status(400).send({ status: false, message: "This email Id is already exists with another user(1)" });
                    }
                } else {
                    return next();
                }
            }
        }
        const DuplicateEmail = await userModel.find({ email: email });
        const emailFound = DuplicateEmail.length;
        if (emailFound != 0) {
            return res.status(400).send({ status: false, message: "This email Id already exists with another user(2)" });
        }
        const duplicatePhone = await userModel.findOne({ phone: phone })
        if (duplicatePhone) {
            return res.status(400).send({ status: false, message: "This phone number already exists with another user(2)" });
        }
        next();
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

const checkGuest = async (req, res, next) => {
    try {
        
        let guestData = req.body
        
        if (!isValidRequestBody(guestData)) {
            return res.status(400).send({ status: false, message: "Please provide data for successful registration" });
        }
        let { guestName, email, phone, password, address } = userBody;
        if (!isValid(guestName)) {
            return res.status(400).send({ status: false, message: "Please provide fname or fname field" });
        }
        
        if (!isAlphabet(guestName)) {
            return res.status(400).send({ status: false, message: "You can't use special character or number in fname" });
        }
        
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "Please provide Email id or email field" });;
        }
        if (!isValidSyntaxOfEmail(email)) {
            return res.status(404).send({ status: false, message: "Please provide a valid Email Id" });
        }
        if (!isValid(phone)) {
            return res.status(400).send({ status: false, message: "Please provide phone number or phone field" });
        }
        if (!isValidMobileNum(phone)) {
            return res.status(400).send({ status: false, message: '1 Please provide a valid phone number' })
        }
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "Please provide password or password field" });;
        }
        let size = Object.keys(password.trim()).length
        if (size < 8 || size > 15) {
            return res.status(400).send({ status: false, message: "Please provide password with minimum 8 and maximum 14 characters" });;
        }
        if (!isValid(address)) {
            return res.status(400).send({ status: false, message: "Please provide address or address field" });;
        }
        let isDBexists = await userModel.find();
        let dbLen = isDBexists.length
        if (dbLen != 0) {
            const DuplicateEmail = await guestModel.find({ email: email });
            const emailFound = DuplicateEmail.length;
            if (emailFound != 0) {
                return res.status(400).send({ status: false, message: "This email Id already exists with another user" });
            }
            const duplicatePhone = await userModel.findOne({ phone: phone })
            if (duplicatePhone) {
                return res.status(400).send({ status: false, message: "This phone number already exists with another user" });
            }
        }
        next();
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}




const checkHotal = async (req, res, next) => {
    try {
       
        let hotalData = req.body
      
        if (!isValidRequestBody(hotalData)) {
            return res.status(400).send({ status: false, message: "Please provide data to create product" });
        }
        let { name,type, services, address } = hotalData;
        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: "Please provide name or name field" });
        }
        if (!isValid(type)) {
            return res.status(400).send({ status: false, message: "Please provide name or name field" });
        }
       
        if (!isValid(services)) {
            return res.status(400).send({ status: false, message: "Please provide services or services field" });;
        }
        if (!isValid(address)) {
            return res.status(400).send({ status: false, message: "Please provide services or services field" });;
        }
       
        next();
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

const checkHotalUpdate=(req,res,next)=>{
    try{
        let requestBody=re.body;
        let hotalId=req.params.hotalId;
        if(!isValid(hotalId)){
            return res.status(400).send({ status: false, message: "Please provide hotal Id " }); 
        }
        if(!isValidObjectId(hotalId)){
            return res.status(400).send({ status: false, message: "Please provide valid hotal Id " }); 
        }
        if (!isValidRequestBody(hotalData)) {
            return res.status(400).send({ status: false, message: "Please provide data to create product" });
        }
        let { name,type, services, address } = requestBody;
        if(name){
        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: "Please provide name or name field" });
        }
        }
        if(type){
        if (!isValid(type)) {
            return res.status(400).send({ status: false, message: "Please provide name or name field" });
        }
        }
       if(services){
        if (!isValid(services)) {
            return res.status(400).send({ status: false, message: "Please provide services or services field" });;
        }
        }
        if(address){
        if (!isValid(address)) {
            return res.status(400).send({ status: false, message: "Please provide services or services field" });;
        }
        }
        next();
    }catch (err) {
        res.status(500).send(err.message)
    }
}



const authorizer = async (req, res, next) => {
    try {
        let paramsId = req.params.userId
        let checkId = ObjectId.isValid(paramsId);
        if (!checkId) {
            console.log("authorizer checking paramsId")
            return res.status(400).send({ status: false, message: "Please Provide a valid userId in path params" });;
        }
        if (!(req.userId == paramsId)) {
            console.log("authorizer checking authorization")
            return res.status(400).send({ status: false, message: "Sorry you are not authorized to do this action" })
        }
        console.log("authorizer working properly")
        next();
    } catch (err) {
        return res.status(500).send(err.message)
    }
}

const checkReview=(req,res,next)=>{
    try{
        let body=req.body;
        let hotalId=req.params.hotalId;
        let reviewId=req.params.reviewId;
        if(!(isValid(hotalId&&reviewId))){
            return res.status(404).send({status:false,message:'please provide the id '});
        }
        if(!isValidRequestBody(body)){
            return res.status(400).send({status:false,message:'please provide required field'});
        }
        if(!isValidObjectId(hotalId)){
            return res.status(400).send({status:false,message:'invalid hotalId'});
        }
        if(!isValidObjectId(reviewId)){
            return res.status(400).send({status:false,message:'invalid review id'});
        }
        let {reviewedBy,review,rating}=body;
        if(reviewedBy){
        if(!isValid(reviewedBy)){
            return res.status(400).send({status:false,message:'please provid guest name'});
        }
        }
        if(review){
        if(!isValid(review)){
            return res.status(400).send({status:false,message:'please provid review'})
        }
        }
        if(rating){
            if(!isValid(rating)){
                return res.status(400).send({status:false,message:'please provid rating'});
            }
            if(!(rating>=1 && rating<=5)){
                return res.status(400).send({status:false,message:'Rating Value Should Be In Between 1 to 5'});
            }
        }

        next();
    }catch(err){
        return res.status(500).send(err.message);
    }
}





module.exports = { checkUser, checkUserupdate,checkGuestupdate,checkGuest, checkHotal, checkHotalUpdate, authorizer ,checkReview};