var conn = require('../models/db');
const moment = require('../node_modules/moment-timezone');
const {
    verify
} = require('jsonwebtoken');


exports.getregistration_mobile = function(mob,result){
     conn.query("Select * from user where mobile = ?",[mob.mobile],function(err,res){
         if(err){
            result(err);
         }else{
             result(null,res);
             }
     });
 }

 exports.registration_mobile = function(mob,result){
    // var a = moment().tz("Asia/Kolkata");
    // a.format()
    // a.utc().format();
    // var date = new Date(a).toISOString().replace(/T/, ' ').replace(/\..+/, '');
    conn.query("Insert into user (mobile,name,password,u_id,country_code,time_zone,doa,android_token,user_num) VALUES ('" + mob.mobile + "','" + mob.name + "','" + mob.password + "','" + mob.u_id + "','"+mob.country_code +"','"+mob.time_zone +"','"+mob.doa+"','"+mob.android_token +"','"+mob.user_num +"')",function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}

exports.selectUserWithMobile = function(mob,result){
    conn.query("Select id,u_id,name,mobile,email,user_num,doa from user where id=?",[mob.id],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
            }
    });
}
exports.selectUserWithEmail = function(mob,result){
    conn.query("Select id,u_id,name,mobile,email,user_num,password from user where id=?",[mob.id],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
            }
    });
}

exports.getMaxUser_num = function(max,result){
    conn.query("Select user_num from user ORDER BY user_num DESC LIMIT 1",[max.user_num],function(err,res){
               if(err){
                result(err);
               }else{
                result(null,res);
               }
    });
}

exports.registration_email = function(email,result){

    conn.query("Insert into user (email,name,password,u_id,country_code,time_zone,doa,android_token,user_num) VALUES ('" + email.email + "','" + email.name + "','" + email.password + "','" + email.u_id + "','"+email.country_code +"','"+email.time_zone +"','"+email.doa+"','"+email.android_token +"','"+email.user_num +"')",function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}
exports.U_idRegistration = function(U_id,result){

    conn.query("Insert into user (name,email,country_code,time_zone,android_token,u_id,user_num,is_active,is_admin) VALUES ('" + U_id.name + "','" + U_id.email + "','"+U_id.country_code +"','"+U_id.time_zone +"','"+U_id.android_token +"','" + U_id.u_id + "','"+U_id.user_num +"','"+U_id.is_active +"','"+U_id.is_admin +"')",function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}


exports.getregistration_email = function(email1,result){
    conn.query("Select id,u_id,name,mobile,email,user_num,password from user where email = ?",[email1.email],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
           
            }
    });
}

exports.user_loginwith_Email = function(eml,result){
    conn.query("Select id,email,mobile,u_id,user_num,password from user where email = ? AND password =  ?  AND is_active = ? AND is_admin = ?",[eml.email,eml.password,eml.is_active,eml.is_admin],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}

exports.user_loginwith_Mobile = function(mob,result){
    conn.query("Select id,email,mobile,u_id,user_num,password from user where mobile = ? AND password =  ?  AND is_active = ? AND is_admin = ?",[mob.mobile,mob.password,mob.is_active,mob.is_admin],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}


exports.updtToken = function(updt,result){
    conn.query('UPDATE user SET android_token = ? where id = ? ',[updt.android_token,updt.id],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}
exports.updtUser_num = function(updt,result){
    conn.query('UPDATE user SET user_num = ? where id = ? ',[updt.user_num,updt.id],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}

exports.CheckUser = function(userdetails, result) {
    conn.query("Select * from user where id=? AND android_token = ?", [userdetails.userId, userdetails.android_token], function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
        }
    });
}

exports.fetchProfile = function(userdetails, result) {
    conn.query("Select email,name,mobile,profileImage from user where id = ? ",userdetails.id, function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
        }
    });
}


exports.ProfileImg = function(userdetails, result) {
    conn.query("UPDATE  user SET profileImage = ?,doa = ? where id = ? ",[userdetails.profileImage,userdetails.doa,userdetails.id], function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
        }
    });
}

exports.user_loginwith_U_id = function(mob,result){
    conn.query("Select id,u_id,name,mobile,email,user_num,password from user where u_id = ? ",[mob.u_id],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
         
        }
    });
}


exports.selectPassword = function(psw,result){
    conn.query("Select * from user where id = ? AND password  = ?",[psw.id,psw.password],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}

exports.PswUpdate = function(psw,result){
    conn.query("UPDATE user SET password = ? where id = ?",[psw.password,psw.id],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}

exports.updateUserProfile_name = function(gt,result){
    conn.query("Update user SET name = ? where id = ?",[gt.name,gt.id],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}