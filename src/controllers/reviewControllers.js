const reviewModels=require('../models/reviewModels');
const hothostModels=require('../models/reviewModels');
const ObjectId=require('mongoose').Types.ObjectId;

const creatReview=(req,res)=>{
    try{
        let hotalId=req.params.hotalId;
        let checkHotalId=ObjectId.isValid(hotalId);
        if(!checkHotalId){
            return res.status(400).send({status:false,message:'Invalid User Id'});
        }
        let guestId=req.params.guestId;
        let checkId=ObjectId.isValid(guestId);
        if(!checkId){
            return res.status(400).send({status:false,message:'Invalid User Id'});
        }
        let requestBody=req.body;
        let{rating,review}=requestBody;
        let guestData=await guestModels.findOne({_id:guestId});
        if(!guestData){
            return res.status(403).send({status:false,Message:"Guest dos not rxist"});
        }
        let reviewedBy=guestData.guestName;
        let hotalData=await hothostModels.findOne({_id:hotalId});
        if(!hotalData){
            return res.status(403).send({status:false,Message:'Hotal dose not exist'});
        }
        let hotalOrHostalId=hotalData._id;
        let reviewAt=moment().format('MMM Do YY');
       let allReviewData={rating,review,reviewedBy,hotalOrHostalId,reviewAt};
       const reviewData=await reviewModels.create(allReviewData);
       let checker=await reviewModels.find({hotalOrHostalId:hotalId,isDeleted:false});
         let number=checker.length;
         await hotalOrHostalId.finOneAndUpdate({_id:hotalId,isDeleted:false},{reviews:number});
       return res.status(201).send({status:true,Message:'Thank you for your feed back',Review:reviewData});

    }catch(err){
        return res.status(500).send(err.message);
    }
}

const updateReview= async (req,res)=>{
    try{
        let body=req.body;
        let reviewId=req.params.reviewId
        let{reviewedBy,review,rating}=body;
        const updatedReview = await reviewModels.findOneAndUpdate({ _id: reviewId }, { reviewedBy: reviewedBy, review: review, rating: rating }, { new: true }).select({ __v: 0 });
        return res.status(200).send({ status: true, message: 'Review updated successfully', data: updatedReview });
    }catch(err){
        return res.status(500).send(err.message);
    }
}

const deletedReview=(req,res)=>{
    try{
        let reviewId=req.params.reviewId;

        let reviewData=await reviewModels.findOne({_id:reviewId});
        if(!reviewData){
            return res.status(403).send({status:false,Message:"Review dos not rxist"});
        }
        const review=await reviewModels.findOneAndUpdate({_id:reviewId,isDeleted:true});
        return res.status(200).send({ status: true, message: 'Review Deleted successfully'});
    }catch(err){
        return res.status(500).send(err.message);
    }
}

module.exports={creatReview,updateReview,deletedReview};