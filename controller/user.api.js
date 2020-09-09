const Task = require('../models/user.model');
const multer =  require('../node_modules/multer');
const {validationResult} = require ('express-validator');
var fs = require('fs');
var { genSaltSync,hashSync, compareSync,compare } = require('bcrypt');
var { sign, verify} = require('jsonwebtoken');
const moment = require('../node_modules/moment-timezone');

// var CryptoJS = require('crypto');

var myCallback2 = (err, date) => {
     if (err) throw err; // Check for the error and throw if it exists.
     var a = moment().tz("Asia/Kolkata");
     a.format()
     a.utc().format();
     return date = new Date(a).toISOString().replace(/T/, ' ').replace(/\..+/, '');
   
 }
 function toTimeZone1(time, zone) {
     var format = 'YYYY-MM-DD HH:mm:ss';
     return moment.tz(time,zone).utc().format(format);
 }
// console.log(toTimeZone1("2020-06-05 13:37:22","Asia/Kolkata"));
const crypto = require("crypto");


// // var secret = "./uploads/1.png";
// var password = 'crptrlssword';
// let key = crypto.createHash('sha256').update(String(password)).digest('base64').substr(0,256);
// // // Encryption
// // const cipher = crypto.createCipheriv("aes-256-ecb", Buffer.from(key, "base64"), null);
// // const encryptedSecret = cipher.update(secret, "base64", "base64") + cipher.final("base64");
// // console.log(encryptedSecret);

// // Decryption
// const decipher = crypto.createDecipheriv("aes-256-ecb", Buffer.from(key, 'base64'), null);
// const decryptedSecret = decipher.update("UOHdwiJg/nFMgIG+lFUQ4vCE+CNne5COK/EH19V3HJc=", "base64", 'utf-8') + decipher.final("utf-8");
// console.log(decryptedSecret.toString());

// var currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

// console.log(toTimeZone1(currentDate,"Asia/Kolkata"));


//------------------------------------ user_mobileregister ---------------------------------//


exports.user_mobileregister = async(req,res,next)=>{
     const errors = validationResult(req); 
      if (!errors.isEmpty()) {
          res.json({
             err:errors
             });
       return 
     }else{
          Task.getregistration_mobile(req.body,(err,responce)=>{
               if(err) return next(err);
               if(responce.length > 0){
                    res.json({
                         status:2,
                          msg :"This mobile no is already registered please login "
                    });
               }else if(responce){
                    //res.send(responce);
                    //const result = compare(req.body.password, responce[0].password);
                         // if(result){
                             // responce[0].password = undefined;
                               const JWT = sign({
                                   // result: responce
                                   mobile: req.body.mobile,
                                   password: req.body.password,
                                }, "qwe1234", {
                                     expiresIn: '1d' // expires in  1days
                                });
                                
                                // Task.updtToken(req.body,(err,res_1)=>{
                                //    if(err) return next(err);
                                //      object = Object.assign({}, ...responce);
                                //      if(res_1){
                                //        return res.json({
                                //              data:object,
                                //              status: 1,
                                //              msg : 'login Successfully',
                                //              android_token : token_1,
                                //              token: JWT
                                             
                                //          });
                                //      }
                                // });

                                Task.getMaxUser_num(req.body, (err, res_2) => {
                                   if(err) return next(err);
                                   var max;
                                   if (res_2.length == 0 || !res_2) {
                                       max = 1;
                                   } else {
                                       max = res_2[0].user_num;
                                       max += 1;
                                       // res.send({data:max})
                                   }
                                  
                                   var token_1 = crypto.randomBytes(20).toString('hex')
                                   req.body['android_token'] = token_1;
                                   req.body['user_num'] = max;
                                    var a = moment().format('YYYY-MM-DD HH:mm:ss');
                                   req.body['doa'] = toTimeZone1(a, req.body['time_zone']);
                                   Task.registration_mobile(req.body, (err, res_3) => {
                                        if(err) return next(err);
                                      if(res_3){
                                         req.body['id'] = res_3.insertId;
                                         Task.selectUserWithMobile(req.body,(err,res_4)=>{
                                            if(err) return next(err);
                                            object = Object.assign({}, ...res_4);
                                              if(res_4.length == 0 || !res_4){
                                                  res.json({
                                                       status:0,
                                                       msg :"Cannot registered",
                                                   });
                                                  }else{
                                                  res.json({
                                                       status:1,
                                                       msg :"successfully registered",
                                                       android_token:req.body['android_token'],
                                                       token: JWT,
                                                       data:object
                                                  });
                                              }
                                         });
          
                                      }
                                   });
                               });
                              
                          // }
                    // Task.getMaxUser_num(req.body, (err, res_2) => {
                    //      if(err) return next(err);
                    //      var max;
                    //      if (res_2.length == 0 || !res_2) {
                    //          max = 1;
                    //      } else {
                    //          max = res_2[0].user_num;
                    //          max += 1;
                    //          // res.send({data:max})
                    //      }
                        
                    //      var token_1 = crypto.randomBytes(20).toString('hex')
                    //      req.body['android_token'] = token_1;
                    //      req.body['user_num'] = max;
                    //       var a = moment().format('YYYY-MM-DD HH:mm:ss');
                    //      req.body['doa'] = toTimeZone1(a, req.body['time_zone']);
                    //      Task.registration_mobile(req.body, (err, res_3) => {
                    //           if(err) return next(err);
                    //         if(res_3){
                    //            req.body['id'] = res_3.insertId;
                    //            Task.selectUserWithMobile(req.body,(err,res_4)=>{
                    //               if(err) return next(err);
                    //                 if(res_4.length == 0 || !res_4){
                    //                     res.json({
                    //                          status:0,
                    //                          msg :"Cannot registered",
                    //                      });
                    //                     }else{
                    //                     res.json({
                    //                          status:1,
                    //                          msg :"successfully registered",
                    //                          android_token:req.body['android_token'],
                    //                          data:res_4
                    //                     });
                    //                 }
                    //            });

                    //         }
                    //      });
                    //  });
               }
          });
     }
}

//------------------------------------ *END* ---------------------------------//



               
//------------------------------------ user_emailregister ---------------------------------//


exports.user_emailregister = async(req,res,next)=>{
      if(!req.body['email'] || !req.body['password']){
           res.json({
                status:0,
                msg:"email and password are required"
           });
      }
     else{
          Task.getregistration_email(req.body,(err,responce)=>{
              if(err) return next(err);
               if(responce.length > 0){
                   res.json({
                         status:2,
                         msg :"This email is already registered, Please try another email..."
                    });
               }else if(responce){

                    const JWT = sign({
                         // result: responce
                         email: req.body.email,
                         password: req.body.password,
                      }, "qwe1234", {
                           expiresIn: '1d' // expires in  1days
                      });

                  Task.getMaxUser_num(req.body, (err, res_2) => {
                         if(err) return next(err);
                         var max = 0;
                         if (res_2.length == 0 || !res_2) {
                             max = 1;
                         } else {
                             max = res_2[0].user_num;
                             max += 1;
                             // res.send({data:max})
                         }
                        
                         var token_1 = crypto.randomBytes(20).toString('hex')
                         req.body['android_token'] = token_1;
                         req.body['user_num'] = max;
                         req.body['u_id'] =  req.body['u_id'] ;
                         req.body['time_zone'] = req.body['time_zone'];
                         var a = moment().format('YYYY-MM-DD HH:mm:ss');
                         req.body['doa'] = toTimeZone1(a, req.body['time_zone']);
                         Task.registration_email(req.body, (err, res_3) => {
                              if(err) return next(err);
                            if(res_3){
                               req.body['id'] = res_3.insertId;
                               Task.selectUserWithEmail(req.body,(err,res_4)=>{
                                   if(err) return next(err);
                                   if(res_4[0].password == '' || res_4[0].password == null){
                                        res_4[0].isPassword = "N";
                                   }else{
                                        res_4[0].isPassword = "Y";
                                   }
                                   object = Object.assign({}, ...res_4);
                                   if(res_4.length == 0 || !res_4){
                                        res.json({
                                             status:0,
                                             msg :"Cannot registered",
                                             
                                        });
                                        
                                    }else{
                                        res.json({
                                             status:1,
                                             msg :"successfully registered",
                                             android_token:req.body['android_token'],
                                             token: JWT,
                                             userId : object.id,
                                             data:object
                                        });
                                    }
                               });

                            }
                         });
                     });
               }
          });
     }
}

//------------------------------------ *END* ---------------------------------//



//-----------------------------------  user_loginemail -------------------------//


exports. user_loginemail = async(req,res,next)=>{
     if(!req.body['email'] || !req.body['password']){
          res.json({
               status:2,
               msg :"email is required"
          });
     }else{
         req.body['is_active'] = 'Y';
          req.body['is_admin'] = 'N';
         Task.user_loginwith_Email(req.body,(err,responce)=>{
          if(err) return next(err);
               if(responce.length == 0 || !responce){
                    res.json({
                         status:0,
                         msg :"invalid email or password"
                    });
               }else if(responce) {
                    
                   const result = compare(req.body.password, responce[0].password);
                          if(result){
                              responce[0].password = undefined;
                               const JWT = sign({
                                    result: responce
                                }, "qwe1234", {
                                     expiresIn: '1d' // expires in  1days
                                });
                                var token_1 = crypto.randomBytes(20).toString('hex')
                                req.body['android_token'] = token_1;
                                req.body['id'] = responce[0].id;
                                Task.updtToken(req.body,(err,res_1)=>{
                                   if(err) return next(err);
                                     object = Object.assign({}, ...responce);
                                     if(res_1){
                                       return res.json({
                                             data:object,
                                             status: 1,
                                             msg : 'login Successfully',
                                             android_token : token_1,
                                             token: JWT
                                        });
                                     }
                                });
                              
                           }
                     }
          });
     }

}
//----------------------------------------- * END * -----------------------------------------//


//------------------------------------- user_login with mobile ----------------------------------//


exports.user_loginmobile = async(req,res,next)=>{
 
     if(!req.body['mobile'] || !req.body['password']){
          res.json({
               status:2,
               msg :"mobile is required"
          });
     }else{
         req.body['is_active'] = 'Y';
          req.body['is_admin'] = 'N';
         Task.user_loginwith_Mobile(req.body,(err,responce)=>{
          if(err) return next(err);
               if(responce.length == 0 || !responce){
                    res.json({
                         status:0,
                         msg :"invalid mobile or password"
                    });
               }else if(responce) {
                          const result = compare(req.body.password, responce[0].password);
                          if(result){
                              responce[0].password = undefined;
                               const JWT = sign({
                                    result: responce
                                }, "qwe1234", {
                                     expiresIn: '1d' // expires in  1days
                                });
                                var token_1 = crypto.randomBytes(20).toString('hex')
                                req.body['android_token'] = token_1;
                                req.body['id'] = responce[0].id;
                                Task.updtToken(req.body,(err,res_1)=>{
                                   if(err) return next(err);
                                     object = Object.assign({}, ...responce);
                                     if(res_1){
                                       return res.json({
                                             data:object,
                                             status: 1,
                                             msg : 'login Successfully',
                                             android_token : token_1,
                                             token: JWT
                                             
                                         });
                                     }
                                });
                              
                           }
                     }
          });
     }

}
//----------------------------------------- * END * -----------------------------------------//

//-------------------------------------- user_login admin -----------------------------------//

exports.user_loginadmin = async(req,res,next)=>{
     if(!req.body['email'] || !req.body['password']){
          res.json({
               status:2,
               msg :"email is required"
          });
     }else{
         req.body['is_active'] = 'Y';
          req.body['is_admin'] = 'Y';
         Task.user_loginwith_Email(req.body,(err,responce)=>{
          if(err) return next(err);
               if(responce.length == 0 || !responce){
                    res.json({
                         status:0,
                         msg :"invalid email or password"
                    });
               }else if(responce) {
                   const result = compare(req.body.password, responce[0].password);
                          if(result){
                              responce[0].password = undefined;
                               const JWT = sign({
                                    result: responce
                                }, "qwe1234", {
                                     expiresIn: '1d' // expires in  1days
                                });
                                var token_1 = crypto.randomBytes(20).toString('hex')
                                req.body['android_token'] = token_1;
                                req.body['id'] = responce[0].id;
                                Task.updtToken(req.body,(err,res_1)=>{
                                   if(err) return next(err);
                                     object = Object.assign({}, ...responce);
                                     if(res_1){
                                       return res.json({
                                             data:object,
                                             status: 1,
                                             msg : 'login Successfully',
                                             android_token : token_1,
                                             token: JWT
                                             
                                         });
                                     }
                                });
                              
                           }
                     }
          });
     }

}
//----------------------------------------- * END * -----------------------------------------//


//---------------------------------------  add Delegate User ---------------------------------//

exports.addDelegateUser = async(req,res,next)=>{
     if(!req.body['android_token']){
          res.json({
               status:10,
               msg :"token is required"
          });
     }else{
          req.body['id'] = req.body['userId'];
          Task.CheckUser(req.body,(err,responce)=>{
               if(err) return next(err);
               if(responce.length == 0 || !responce){
                    res.json({
                         status:10,
                         msg :"token is expired"
                    });
               }else if(responce){
                    if(!req.body['mobile']){
                         res.json({
                              status:0,
                              msg :'mobile are required!'
                         });
                    }else{
                         var mob = req.body['mobile']
                         var checkMob = responce[0].mobile;
                         // console.log(checkMob == req.body['mobile'])
                         if(checkMob == mob){
                              res.json({
                                   status:2,
                                   msg :'This mobile no is yours add a new number to add delegate user'
                              });
                         }else  {
                             Task.getregistration_mobile(req.body,(err,res_1)=>{
                              if(err) return next(err);
                                  if(res_1){
                                       req.body['user_num'] = responce[0].user_num;
                                       req.body['id'] = res_1[0].id;
                                       Task.updtUser_num(req.body,(err,res_2)=>{
                                        if(err) return next(err);
                                            if(res_2){
                                                 res.json({
                                                      status:1,
                                                      msg :'successfully registered',
                                                      data :res_2
                                                 });
                                            }else{
                                             res.json({
                                                  status:0,
                                                  msg :'cannot update',
                                                  
                                             });
                                            }
                                       });
                                  }else{
                                   res.json({
                                        status:3,
                                        msg :'The delegate user mobile number is not registered please register user first',
                                   });
                                  }
                             }); 
                         }
                    }
                  
               }
          });
     }
}
//-------------------------------------------- * END * -------------------------------------//


//---------------------------------------- fetchUserProfile --------------------------------//

exports.fetchUserProfile = async(req,res,next)=>{
     if(!req.body['android_token']){
          res.json({
               status:10,
               msg :"token is required"
          });
     }else{
          Task.CheckUser(req.body,(err,responce)=>{
               if(err) return next(err);
               if(responce.length == 0 || !responce){
                    res.json({
                         status:10,
                         msg :"token is expired"
                    });
               }else{
                    req.body['id'] = req.body['userId'];
                    Task.fetchProfile(req.body,(err,res_1)=>{
                         if(err) return next(err);
                         object = Object.assign({}, ...res_1);
                         if(res_1.length == 0 || !res_1){
                              res.json({
                                   status:0,
                                   msg :"failed",
                                   
                              });
                             
                         }else{
                              res.json({
                                   status:1,
                                   msg :"success",
                                   data:object
                              });
                         }
                    });
               }
          });
     }
}
//--------------------------------------------- * END * -------------------------------------------//


//------------------------------------------ loginbyu_id ----------------------------------------//


exports.loginbyu_id = async(req,res,next)=>{
 
     if(!req.body['u_id'] || !req.body['email']){
          res.json({
               status:10,
               msg:'u_id and email are required'
          });
     }else{
          req.body['is_active'] = 'Y';
          req.body['is_admin'] = 'N';
          var u_ID = req.body['u_id'];
          var password = 'crptrlssword';
         let key = crypto.createHash('sha256').update(String(password)).digest('base64').substr(0,256);
         // Decryption
        const decipher = crypto.createDecipheriv("aes-256-ecb", Buffer.from(key, 'base64'), null);
        const decryptedSecret = decipher.update(u_ID, "base64", 'utf-8') + decipher.final("utf-8");
        const decrypted = decryptedSecret.toString();
        if(decrypted == null || decrypted == ''){
          res.json({
               status:0,
               msg:"u_id is not in encrypted form"
          });
        }else{
             req.body['u_id'] = decrypted;
             Task.user_loginwith_U_id(req.body,(err,res_1)=>{
               if(err) return next(err);
               if(res_1.length > 0){
                    if(res_1[0].password == '' || res_1[0].password == null){
                         res_1[0].isPassword = 'N';
                    }else{
                         res_1[0].isPassword = 'Y';
                    }
                    object = Object.assign({}, ...res_1);
                    var token_1 = crypto.randomBytes(20).toString('hex')
                    req.body['android_token'] = token_1;
                    req.body['id'] = res_1[0].id;
                    Task.updtToken(req.body,(err,res_2)=>{
                         if(err) return next(err);
                         if(res_2){
                              res.json({
                                   status:1,
                                   msg:"login successfully",
                                   android_token:req.body['android_token'],
                                   data:object
                              });
                         }
                    });
               }else{
                    Task.getMaxUser_num(req.body, (err, res_3) => {
                         if(err) return next(err);
                         var max;
                         if (res_3.length == 0 || !res_3) {
                             max = 1;
                         } else {
                             max = res_3[0].user_num;
                             max += 1;
                             // res.send({data:max})
                         }
                        var token_1 = crypto.randomBytes(20).toString('hex')
                         req.body['android_token'] = token_1;
                         req.body['user_num'] = max;
                         req.body['u_id'] = decrypted;
                         Task.U_idRegistration(req.body,(err,res_4)=>{
                              if(err) return next(err);
                              if(res_4){
                                  Task.user_loginwith_U_id(req.body,(err,res_5)=>{
                                        if(err) return next(err);
                                        if(res_5){
                                             if(res_5[0].password == '' || res_5[0].password == null){
                                                  res_5[0].isPassword = 'N';
                                             }else{
                                                  res_5[0].isPassword = 'Y';
                                             }
                                             object = Object.assign({}, ...res_5);
                                             res.json({
                                                  status:3,
                                                  msg:"successfully inserted",
                                                  android_token:req.body['android_token'],
                                                  data:object
                                             });
                                        }else{
                                             res.json({
                                                  status:4,
                                                  msg:"not inserted successfully",
                                                
                                             });
                                        }
                                   });
                              }
                         });
                    });
                 }
               
             });
        }
           
       
}
 

}
//---------------------------------------------- * END * ------------------------------------------//


//---------------------------------------------- resetPassword ------------------------------------//

exports.resetPassword = async(req,res,next)=>{
     if(!req.body['android_token']){
          res.json({
               status:10,
               msg :"token is required"
          });
     }else{
         
          Task.CheckUser(req.body,(err,responce)=>{
               if(err) return next(err);
               if(responce.length == 0 || !responce){
                    res.json({
                         status:10,
                         msg :"token is expired"
                    });
               }else if(responce){
                   req.body['id'] = req.body['userId'];
                    Task.selectPassword(req.body,(err,res_1)=>{
                         if(err) return next(err);
                         if(res_1.length > 0 || !res_1){
                              res.json({
                                   status:2,
                                   msg :'new password cant be old password'
                              });
                         }else{
                           req.body['id'] = req.body['userId'];
                           Task.PswUpdate(req.body,(err,res_2)=>{
                              if(err) return next(err);
                                if(!res_2){
                                   res.json({
                                        status:0,
                                        msg :"unable to change password",
                                       
                                   }); 
                                   
                                }else{
                                   res.json({
                                        status:1,
                                        msg :"password changed",
                                        data:res_2
                                   });
                                }
                           });   
                         }
                    });
               }
          });
     }
}
//--------------------------------------------- * END * ---------------------------------------//

//-------------------------------------------- newPassword -----------------------------------//

exports.newPassword = async(req,res,next)=>{
     if(!req.body['android_token']){
          res.json({
               status:10,
               msg :"token is required"
          });
     }else{
          req.body['id'] = req.body['userId'];
          Task.CheckUser(req.body,(err,responce)=>{
               if(err) return next(err);
               if(responce.length == 0 || !responce){
                    res.json({
                         status:10,
                         msg :"token is expired"
                    });
               }else if(responce){
                    req.body['id'] = req.body['userId'];
                    req.body['password'] = req.body['password'];
                  Task.PswUpdate(req.body,(err,res_2)=>{
                         if(err) return next(err);
                                if(res_2){
                                     res.json({
                                          status: 1,
                                          msg :"password changed",
                                          data:res_2
                                     });
                                }else{
                                   res.json({
                                        status:0,
                                        msg :"unable to change password",
                                        
                                   }); 
                                }
                           });   
                         }
                });
     }

}
//------------------------------------------- *END* ---------------------------//


//---------------------------------------- checkOldpassword --------------------//

exports.checkOldpassword = async(req,res,next)=>{

     if(!req.body['android_token']){
          res.json({
               status:10,
               msg :"token is required"
          });
     }else{
          req.body['id'] = req.body['userId'];
          Task.CheckUser(req.body,(err,responce)=>{
               if(err) return next(err);
               if(responce.length == 0 || !responce){
                    res.json({
                         status:10,
                         msg :"token is expired"
                    });
               }else if(responce){
                   req.body['id'] = req.body['userId'];
                    req.body['password'] = req.body['password'];
                   Task.selectPassword(req.body,(err,res_1)=>{
                    if(err) return next(err);
                     if(res_1.length > 0 ){
                              res.json({
                                   status:1,
                                   msg :'password matched',
                                  
                              });
                         }else{
                              res.json({
                                   status:0,
                                   msg :'invalid password'
                              });
                         }
                    });
               }
          });
     }
}
//------------------------------------------- *END* ---------------------------//


//--------------------------------------- updateUserProfile -------------------//
// var Base64 = require('js-base64').Base64;
// const storage = multer.diskStorage({
//      destination: function(req, file, cb) {
//      cb(null, '../uploads/user_')
//     },
//    filename: function(req, file, cb) {
// //    console.log(file)
//   cb(null, file.originalname)
//  }
// });
// const upload = multer({ storage }).single('profileImage');
// exports.updateUserProfile = (req,res,next)=>{
     
//      upload(req,res,(err)=>{
//           if(err) return next(err);
//           if(!req.body['android_token']){
//                res.json({
//                     status:10,
//                     msg :"token is required"
//                });
//           }else{
//                req.body['id'] = req.body['userId'];
//                Task.CheckUser(req.body,(err,responce)=>{
//                     if(err) return next(err);
//                     if(responce.length == 0 || !responce){
//                          res.json({
//                               msg :"token is expired", 
//                               status:10
//                            });
//                      }else{
//                          if(!req.file){
//                              res.json({
//                                 msg : "No file received", 
//                                  status:0
//                               });
//                          }else{
//                               var imgData = req.body['profileImage'];
//                               var imgLink = null;
//                               var id = req.body['userId'];
//                               var a = moment().format('YYYY-MM-DD HH:mm:ss');
//                               var todayTime = a;
//                               var path = '../uploads/user_' + " " + id;
//                               var imgName = "img_" + " " + todayTime + " " + ".png";
//                               var imagse = Base64.decode(imgData);
//                               console.log(imagse)
//                              if (!fs.existsSync(path)){
//                                    fs.mkdirSync(path);
//                                }
//                                imgLink = 'http://localhost/uploads/user_' + " " + id + " " + imgName;
//                                var ImgPath = path + " " + "/" + " " + imgName;
//                               var a = moment().format('YYYY-MM-DD HH:mm:ss');
//                               req.body['doa'] = toTimeZone1(a,responce[0].time_zone);
//                               req.body['id'] = req.body['userId'];
//                               req.body['profileImage'] = imgLink;
//                               Task.ProfileImg(req.body,(err,res_1)=>{
//                                    if(err) return next(err);
//                                    if(res_1){
//                                         res.json({
//                                              msg : "profile image updated successfully", 
//                                              status:1,
//                                              data:res_1
//                                           });  
//                                    }else{
//                                         res.json({
//                                              msg : "unable to update profile", 
//                                              status:0
//                                           });  
//                                    }
//                               });
//                          }
//                      }

//                });
              
//           }
        
//      });

// };
//------------------------------------------- *END* ---------------------------//


//---------------------------------------- updateUserProfile ----------------------//

exports.updateUserProfileD = async(req,res,next)=>{
      if(!req.body['android_token']){
           res.json({
                status : 10,
                msg : "token is required"
           });
      }else{
           Task.CheckUser(req.body,(err,responce)=>{
               if(err) return next(err);
                if(responce.length == 0 || !responce){
                     res.json({
                          status:10,
                          msg :"token is expired"
                     });
                }else{

                     req.body['name'] = req.body['name'];
                     req.body['id'] = req.body['userId'];
                     Task.updateUserProfile_name(req.body,(err,res_1)=>{
                         if(err) return next(err);
                          if(!res_1){
                               res.json({
                                    status:0,
                                    msg :'not update'
                               });
                          }else{
                              res.json({
                                   status:1,
                                   msg :'success',
                                   data:res_1
                              }); 
                          }
                     });
                }
           });
      }
}
//---------------------------------------------- END ------------------------------------------//


exports.updateUserProfile = async(req,res,next)=>{
     if(!req.body['android_token']){
          res.json({
               status:10,
               msg:"token is requires"
          });
     }else{
          Task.CheckUser(req.body,(err,responce)=>{
               if(err) return next(err);
               if(responce.length == 0 || !responce){
                    res.json({
                         status:10,
                         msg:"token is expired"
                    });
               }else{
                     var imgData = req.body['profileImage'];
                     var buf = Buffer.from(imgData,'base64');
                     let text = buf.toString('utf-8');
                    //  console.log(text);  
                    //  console.log(buf);
                     var id = req.body['userId'];
                    //  console.log(id);
                     
                     var imgname = "img_"  +  ".png";
                     var path = './uploads/user_' + " " + id;
                     var imgLink = 'http://localhost/uploads/user_' + id + imgname ;
                    //   console.log(path)
                    if (!fs.existsSync(path)) {
                         fs.mkdirSync(path, 0777, true);
                     }
                     var imgpath = path + "/" + imgname;
                     fs.writeFile(imgpath, buf, (err) => {
                         if(err) return next(err);
                         req.body['doa'] = moment().format('YYYY-MM-DD HH:mm:ss');
                          req.body['profileImage'] = imgLink ;
                          req.body['id'] = req.body['userId'];
                          Task.ProfileImg(req.body,(err,res_1)=>{
                              if(err) return next(err);
                              if(res_1){
                                   res.json({
                                        status:1,
                                        msg:"profile image updated successfully"
                                   });
                              }else{
                                   res.json({
                                        status:0,
                                        msg:"unable to update profile"
                                   });
                              }
                          });
                         // console.log('The binary data has been decoded and saved to my-file.png');
                       });
               }
          });
     }
}







