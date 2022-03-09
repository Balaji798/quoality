const userModels=require('../models/userModels');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registeUser= async (req,res)=>{
    try{
        let userBody=req.body;
        let{userName,email,phone,password, address}=userBody;
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        const userData={userName,email,phone,password, address};
        const registerData= await userModels.create(userData);
        return res.status(201).send({status:true,message:'User created successfully',Dtata:registerData})
}catch(err){
    return res.status(500).send(err.message);
}
}

const userLogin=async (req,res)=>{
    try{
        const email=req.body.email;
        const bodyPassword=req.body.password;
        let user = await userModels.findOne({email:email});
        if(user){
        const { _id,userName, password } = user
        const validPassword = await bcrypt.compare(bodyPassword, password);
        if (!validPassword) {
            return res.status(400).send({ message: "Invalid Password" })
        }
        let payload = { userId: _id, email: email };
        const generatedToken = jwt.sign(payload, "quoality", { expiresIn: '10080m' });
        res.header('user-login-key', generatedToken);
        return res.status(200).send({
            status: true,
            message: userName + " you have logged in Succesfully",
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

const getuserById = async (req, res) => {
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


module.exports={registeUser,userLogin, getuserById,updateProfile};
