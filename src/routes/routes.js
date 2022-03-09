const express=require('express');
const router=express.Router();
const guestControllers=require('../controllers/guestControllers');
const hotHostControllers=require('../controllers/hotHostControllers');
const reviewControllers=require('../controllers/reviewControllers');
const userControllers=require('../controllers/userControllers');
const middlewares=require('./middlewares/middleware.js');
const valideter=require('../valideter/valideter.js');

router.post('/register',valideter.checkUser,userControllers.registeUser);
router.post('/login',userControllers.userLogin);
router.post('/register-propaty',middlewares.checkLogin,hotHostControllers.registerHotalOrHostal);//,getHotalHostal,getSpacfic)
router.post('/guestShinUp',guestControllers.shinUpGuest);
router.post('/loginGuest',guestControllers.guestLogin);
router.post('/creatReview',middlewares.checkLogin,reviewControllers.creatReview);
router.get('/user/:userId',middlewares.checkLogin,userControllers.getuserById);
router.put('/user/:userId',middlewares.checkLogin,valideter.checkUserupdate,userControllers.updateProfile);
router.get('/guest/:guestId',middlewares.checkLogin,guestControllers.getguestById);
router.put('/guest/:guestId',middlewares.checkLogin,valideter.checkGuestupdate,guestControllers.updateProfile);
//-------Get API's ---------------//
router.get('/allHotalHostal',hotHostControllers.getHotalHostal);
router.get('/getHotalHostal',hotHostControllers.getSpacfic);
router.get('/getHotalById/:hotalId',hotHostControllers.getHotalOrHostal);
router.put('/user/:userId/hotal/:hotalId',valideter.checkHotal,hotHostControllers.updateHotal);
router.delete('/user/:userId/hotal/:hotalId',middlewares.checkLogin,hotHostControllers.deleteHotal);
router.put('/updateReview/:review',middlewares.checkLogin,reviewControllers.updateReview);
router.delete('/deleteReview/:reviewId',reviewControllers.deletedReview);

module.exports=router;