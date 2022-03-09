const guestModels=require('../models/guestModels');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const shinUpGuest=async (req,res)=>{
    try{
        let requestBody=req.body;
        let{guestName,email,phone,password,address}=requestBody;
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        const guestData={guestName,email,phone,password,address};
        const createdData=await guestModels.create(guestData);
        return res.status(201).send({status:true,Message:'ShinUp Success',Dtat:createdData});
    }catch(err){
        return res.status(500).send(err.message);
    }
}

const guestLogin=async (req,res)=>{
    try{
        const myEmail = req.body.email
        const myPassword = req.body.password
        let user = await guestModels.findOne({ email: myEmail });
        if (user) {
            const { _id,guestName, password } = user
            const validPassword = await bcrypt.compare(myPassword, password);
            if (!validPassword) {
                return res.status(400).send({ message: "Invalid Password" })
            }
            let payload = { userId: _id, email: myEmail };
            const generatedToken = jwt.sign(payload, "quoality", { expiresIn: '10080m' });
            res.header('user-login-key', generatedToken);
            return res.status(200).send({
                status: true,
                message: guestName + " you have logged in Succesfully",
                data: {
                    userId: user._id,
                    token: generatedToken,
                }
            });
        } else {
            return res.status(400).send({ status: false, message: "Oops...Invalid credentials" });
        }
    }catch(err){
        return res.status(500).send(err.message);
    }
}

const getguestById = async (req, res) => {
    try {
        const userId = req.params.userId
        let checkId = ObjectId.isValid(userId);
        if (!checkId) {
            return res.status(400).send({ status: false, message: "Please Provide a valid userId in query params" });;
        }
        const searchprofile = await userModels.findOne({ _id: userId })
        if (!searchprofile) {
            return res.status(404).send({ status: false, message: 'profile does not exist' })
        }
        const Data = await userModel.find({ _id: userId })
        return res.status(200).send({ status: true, message: 'user profile details', data: Data })
    } catch (error) {
        return res.status(500).send({ success: false, error: error.message });
    }
}


const updateProfile = async (req, res) => {
    try {
        const userId = req.params.userId
        let checkId = ObjectId.isValid(userId);
        if (!checkId) {
            return res.status(400).send({ status: false, message: "Please Provide a valid userId in query params" });;
        }
        let userBody = req.body
        
        let { userName, email, phone,password, address } = userBody

        if (password) {
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
        }
        let updateAddress = await userModels.findOne({ _id: userId })
        if (!updateAddress) {
            return res.status(400).send({ status: false, message: "This userId does not exist" });;
        }
        updateAddress.address
        if (address) {
            if (address) {
                if (address.street) {
                    updateAddress.address.shipping.street = address.shipping.street
                }
                if (address.city) {
                    updateAddress.address.city = address.shipping.city
                }
                if (address.pincode) {
                    updateAddress.address.shipping.pincode = address.shipping.pincode
                }
            }
            
        }
        let updateProfile = await userModels.findOneAndUpdate({ _id: userId }, { userName:userName, email: email, phone:phone,password: password, profileImage: profileImage, address: updateAddress.address }, { new: true })
        return res.status(200).send({ status: true, message: "user profile update successfull", data: updateProfile })
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports={shinUpGuest,guestLogin,getguestById,updateProfile};