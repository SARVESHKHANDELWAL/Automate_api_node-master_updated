module.exports = app => {
     const router = require("express").Router();
     const userRoutes = require("../controller/user.api");
     const jwt = require('jsonwebtoken');
     const {verifyToken} = require("../auth/token");
     const {userValidation} = require('../userValidation/userValidation');
     
//--------------------------------- user Login APIs ------------------------------//
 
    // user registration with mobile
   router.post("/user_mobileregister",userValidation(), userRoutes.user_mobileregister);
 
   // user registration with email
   router.post("/user_emailregister", userRoutes.user_emailregister);
 
   // user login with email
   router.post("/user_loginemail", userRoutes.user_loginemail);
 
   // user login with mobile
   router.post("/user_loginmobile", userRoutes.user_loginmobile);

     // user login with admin
     router.post("/user_loginadmin", userRoutes.user_loginadmin);
 
   // add Delegate User
   router.post("/addDelegateUser", userRoutes.addDelegateUser);
 
   // fetch User Profile
   router.post("/fetchUserProfile", userRoutes.fetchUserProfile);
 
   // loginbyu_id
   router.post("/loginbyu_id", userRoutes.loginbyu_id);
 
   // resetPassword
   router.post("/resetPassword", userRoutes.resetPassword);
 
    // newPassword
   router.post("/newPassword", userRoutes.newPassword);
 
   // checkOldpassword
    router.post("/checkOldpassword", userRoutes.checkOldpassword);
 
   // updateUserProfile
   router.post("/update_profile_image", userRoutes.updateUserProfile);

  // updateUserProfile
  router.post("/updateUserProfile", userRoutes.updateUserProfileD);
 
 //--------------------------------- * END * ------------------------------//
 
 // router.post('/authenticate', verifyToken);
 //main router
   app.use('/android_user', router);
 };