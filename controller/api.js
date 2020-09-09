var Task = require('../models/model');
var {
    genSaltSync,
    hashSync,
    compareSync,
    compare
} = require('bcrypt');
var {

    sign,
    verify
} = require('jsonwebtoken');
const moment = require('moment-timezone');
const { JSON_SCHEMA } = require('js-yaml');
moment.suppressDeprecationWarnings = true;


var a = moment().tz("Asia/Kolkata");

var date = a.format("YYYY-MM-DD HH:mm:ss");



// var toLocalTime = function(time,zone) {
//     var d = new Date(time,Date);
//     var offset = (new Date().getTimezoneOffset(zone) / 60) * -1;
//     var n = new Date(d.getTime() + offset);
//     return n;
//   };
//   var s = "2013-11-18 11:55";
//   console.log(toLocalTime(s).toISOString().replace(/T/, ' ').replace(/\..+/, ''))
// var input = "05/30/2014 11:21:37 AM"
// var fmt   = "MM/DD/YYYY h:mm:ss A";  // must match the input
// var zone  = "America/New_York";
// var m = moment.tz(input, zone);
// m.utc();
// console.log(m.toISOString().replace(/T/, ' ').replace(/\..+/, ''))
// Create a new Date instance, representing the current instant in time

var myCallback = (err, data) => {
    if (err) throw err; // Check for the error and throw if it exists.
    var time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    var seconds = 15;
    var dateFormat = 'YYYY-MM-DD HH:mm:ss';
    console.log(data); // Otherwise proceed as usual.
    return data = moment(time).utc().add(seconds, 'seconds').format(dateFormat);
};
 var AddExtraTime = (time,seconds)=>{
     return moment(time).add(seconds,'seconds').format('YYYY-MM-DD HH:mm:ss');
 }

// var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
// console.log(mysqlTimestamp);
//   var s = "2013-11-18 11:55";
//   var t = "America/Toronto";
//     var date = moment.tz(s,t);
      
//     console.log(  date.utc().format())

// var myCallback2 = (date) => {
// // Check for the error and throw if it exists.
//     var a = moment().tz();
//     a.utc().format();
//      return date = new Date(a).toISOString().replace(/T/, ' ').replace(/\..+/, '');
// }
function toTimeZone1(time, zone) {
    var format = 'YYYY-MM-DD HH:mm:ss';
    return moment.tz(time,zone).utc().format(format);
}

// function toTimeZone(time,zone) {
//       var m = moment.tz(time,zone);
//     m.utc()
//      return m.format("YYYY-MM-DD HH:mm:ss");
        
// }

function currenTime(time, zone) {
 return  moment.utc(time).tz(zone).format("YYYY-MM-DD HH:mm:ss");
}

// console.log(toTimeZone("2014-06-01 20:23:10","Asia/Kolkata").toISOString().replace(/T/, ' ').replace(/\..+/, ''))
// // var date ="2014-06-01 12:00";
// // var timezone = "America/New_York"
// // var newYork    = moment.tz(timezone);
// // newYork.format(); 
// // console.log(newYork.format().replace(/T/, ' ').replace(/\..+/, ''))
//--------- User Details API ------------//

exports.UserDetails = async (req, res) => {
    Task.getAllUser(function(err, task) {
        
        if (err)
            res.send(err);
           
        res.send(JSON.stringify({
            "status": 200,
            msg: 'get User Data',
            data: task

        }));
    });
};
//--------- *END API* --------------------//



//--------- Add farm API ---------------//
/*
exports.addFarm = async (req,res,next) => {
     
    if (!req.body['android_token']) {
        res.json({
            'status': 10,
            msg: 'Token Is Required'
        });
    }else {
       Task.CheckUser(req.body,(err,responce) => {
           if(err) return next(err);
               if (responce.length == 0 || !responce) {
                res.json({
                    'status': 10,
                    msg: 'Token is expired'
                });
            } else{
                req.body['userId'] = responce[0].user_num;
                var a = moment().tz(responce[0].time_zone);
                 a.format()
                 a.utc().format();
                var date = a.toISOString().slice(0, 19).replace('T', ' ');
                req.body['doa'] = date;
                req.body['noOfPlots'] = '1';
                Task.CreateFarm(req.body,(err, res_1) => {
                    if(err) return next(err);
                    if (res_1) {
                        req.body['name'] = '1';
                        req.body['farmId'] = res_1.insertId;
                        Task.CreateFarmPlot(req.body, (err, res_2) => {
                            if(err) return next(err);
                            if(res_2){
                                
                                res.json({
                                    status: 1,
                                    msg: 'successfully inserted data',
                                    data:res_2
                                 });
                            }else{
                                res.json({
                                    status: 0,
                                    msg: 'failed!',
                                });
                            }
                         });
                    } 
                });
           }
            
         
        });
    }
}*/
//------------------------ *END API*  -------------------------//



//-------------- Add User Plot ---------------------//

exports.AddUserPlot = async (req,res,next) => {
   
    if (!req.body['android_token']) {
        res.json({
            status: 10,
            msg: 'Token is Requried'
        });
    } else {
        Task.CheckUser(req.body, (err, responce) => {
            if(err) return next(err);
            if (responce.length == 0 || !responce) {
                res.json({
                    status: 10,
                    msg: 'Token is expired'
                });
            } else if (!req.body['farmId']) {
                res.json({
                    status: 0,
                    msg: " farmId  are required!"
                });
            } else if (responce) {
                Task.CreateFarmPlot(req.body, (err, res_3) => {
                    if(err) return next(err);
                     if (res_3) {
                            req.body['id'] = req.body['farmId'];
                            req.body['noOfPlots'] = req.body['noOfPlots'];
                            var a = moment().tz(responce[0].time_zone);
                                a.format()
                                a.utc().format();
                            var date = a.toISOString().slice(0, 19).replace('T', ' ');
                            req.body['doa'] = date;
                            Task.UpdateFarm(req.body, function(err, res_4) {
                                if(err) return next(err.message);
                                if(!res_4){
                                    res.json({
                                        status: 0,
                                        msg: "failed",
                                        data:res_4
                                    });
                                }else{
                                    res.json({
                                        status: 1,
                                        msg: "inserted And Updated Data Successfully",
                                        data:res_4
                                    });
                                }
                                
                                });
                            } 
                    });
                
             }

        });
    }

}
//------------------------ *END API* ----------------//


//----------------------------- Fetch Farm Details API ---------------------//

exports.Fetch_a_Farm = async (req,res,next) => {
  if (!req.body['android_token']) {
        res.json({
            'status': 10,
            msg: 'Token Is Required'
        });
    } else {

        Task.CheckUser(req.body, (err, responce) => {
            if(err) return next(err);
            if (responce.length == 0 || !responce) {
                res.json({
                    'status': 10,
                    msg: 'token is expired'
                });
            } else if (responce) {
              req.body['userID'] = responce[0].user_num;
                Task.fetchFarm(req.body, (err, res_fetchFarm) => {
                    if(err) return next(err);
                    if (res_fetchFarm.length == 0 || !res_fetchFarm) {
                        res.json({
                            status: 0,
                            msg: 'cannot select data',
                            data: []
                        });
                     } else {
                        res.json({
                            status: 1,
                            msg: 'successfully select data',
                            data: res_fetchFarm
                        });
                    }

                });

            }
        });
    }

}
//----------------------------------- *END API* ---------------------------//


//----------------------------- Fetch FarmPlot Details API ---------------------//

exports.Fetch_a_FarmPlot = async (req,res,next) => { 

    if (!req.body['android_token']) {
        res.json({
            'status': 10,
            msg: 'Token Is Required' 
        });
    } else {
        Task.CheckUser(req.body, (err, responce) => {

            if(err) return next(err);
            if (responce.length == 0 || !responce) {
                res.json({
                    'status': 10,
                    msg: 'token is expired'
                });
            } else if (!req.body['farmId']) {
                res.json({
                    'status': 0,
                    msg: 'farmId are required !'
                });
            } else if (responce) {

                Task.fetchFarmplot(req.body, (err, res_fetchFarmPlot) => {
                    if(err) return next(err);
                    if(res_fetchFarmPlot.length == 0 || !res_fetchFarmPlot){
                        res.json({
                            status: 0,
                            msg: 'Failed, Unable to fetch',
                            data: []
                        }); 
                     
                    }else{
                        res.json({
                            status: 1,
                            msg: 'successfully select data',
                            data: res_fetchFarmPlot
                        });
                    }
                       
                });

            } 
        });
    }

}
//----------------------------------- *END API* ---------------------------//


//----------------------------- Update Plot Area in farmplot table API ---------------------//

exports.Update_a_PlotArea = async (req,res,next) => {

    if (!req.body['android_token']) {
        res.json({
            'status': 10,
            msg: 'Token Is Required'
        });
    } else {
        Task.CheckUser(req.body, (err, responce) => {    
            if(err) return next(err);
            if (responce.length == 0 || !responce) {
                res.json({
                    'status': 10,
                    msg: 'token is expired'
                });
            } else if (!req.body['id']) {
                res.json({
                    'status': 0,
                    msg: 'id are required'
                });
            } else if (responce) {
                req.body['id'] = req.body['id'];
                req.body['area'] = req.body['area'];
              Task.UpdatePlotArea(req.body,(err,res_Id)=>{
                if(err) return next(err);
                  if(res_Id.length == 0 || !res_Id){
                      res.json({
                          status:0,
                          msg:"can not update!"
                      });
                  }else {
                    Task.UpdatePlotArea(req.body, (err,res_updtPlotArea) => {
                        if(err) return next(err);
                        if(res_updtPlotArea){
                            res.json({
                                status: 1,
                                msg: 'area update',
                                data:res_updtPlotArea
                            });
                        }
                     });
                  }
              });  
            
            }
        });
    }

}
//----------------------------------- *END API* ---------------------------//


//----------------------------- Fetch deviceNameMaster Details API ---------------------//

exports.Fetch_a_getDeviceName = async (req,res,next) => {

    var adDevice = new Task(req.body);


    if (!adDevice.android_token) {
        res.json({
            'status': 10,
            msg: 'Token Is Required'
        });
    } else {
        Task.CheckUser(adDevice, (err, responce) => {
            if(err) return next(err);
            if (responce.length == 0 || !responce) {
                res.json({
                    'status': 10,
                    msg: 'token is expired '
                });
            } else if (!req.body['farmId']) {
                res.json({
                    status: 0,
                    msg: "farmId are required"
                });
            } else if (responce) {
               Task.getDeviceName(req.body, (err, res_fetchFarmPlot) => {
                if(err) return next(err);
                   if(res_fetchFarmPlot.length == 0 || !res_fetchFarmPlot){
                    res.json({
                        status: 0,
                        msg: 'Failed, Unable to fetch',
                        data: []
                    });
                   } else {
                        res.json({
                            status: 1,
                            msg: 'success',
                            data: res_fetchFarmPlot
                        });
                    }
                });
            }
        });
    }
}
//----------------------------------- *END API* ---------------------------//


//------------------AddDeviceName API ------------//

exports.aDdeviceName = async (req,res,next) => {
    var adDevicename = new Task(req.body);

    if (!adDevicename.android_token) {
        res.json({
            'status': 10,
            msg: 'Token Is Required'
        });
    } else {

        Task.CheckUser(adDevicename, (err, responce) => {
            if(err) return next(err);
            if (responce.length == 0 || !responce) {
                res.json({
                    'status': 10,
                    msg: 'token is expired'
                });
            } else if (!req.body['farmId'] || !req.body['externalName']) {
                res.json({
                    status: 0,
                    msg: "externalName AND farmId  are required"
                });
            } else if (responce) {
                req.body['isActive'] = 'Y';
                Task.addDeviceName(req.body, (err, res_5) => {
                    if(err) return next(err);
                    if (!res_5) {
                        res.json({
                            'status': 0,
                            msg: 'Failed'
                        });

                    } else {
                        res.json({
                            'status': 1,
                            msg: 'successfully inserted data'
                        });
                    }
                });

            }
         });
    }
};
//----------------------------------- *END API* ---------------------------//





//------------------AddDevice API ------------//

exports.adevice = async (req,res,next) => {
    var adDevice = new Task(req.body);
   if (!adDevice.android_token) {
        res.json({
            'status': 10,
            msg: 'Token Is Required'
        });
    } else {
        Task.CheckUser(adDevice, (err, responce) => {
            if(err) return next(err);
            if (responce.length == 0 || !responce) {
                res.json({
                    'status': 10,
                    msg: 'token is expired'
                });
            } else if (!req.body['number'] || !req.body['password']) {
                res.json({
                    status: 0,
                    msg: "number and password are required"
                });
            } else {
                    Task.verifyNumber_device(req.body, (err, res_0) => {
                    if(err) return next(err);
                    if (res_0.length > 0 || !res_0) {
                        res.json({
                            status: 2,
                            msg: 'This number is already exist'
                        });
                    } else {
                            req.body['isActive'] = 'Y';
                            Task.AddDevice(req.body, (err, res_5) => {
                                if(err) return next(err);
                                if (!res_5) {
                                    res.json({
                                        'status': 0,
                                        msg: 'Failed to insert data'
                                    });
                                } else {
                                    res.json({
                                        'status': 1,
                                        msg: 'successfully inserted data'
                                    });

                                }
                            });
                         }
                });
            }


        });
    }
};
//----------------------------------- *END API* ---------------------------//



//---------------------------------- AddplotDevice API --------------------------//

exports.addPlotDevice = async (req,res,next) => {
    var deviceId;

    if (!req.body['android_token']) {
        res.json({
            'status': 10,
            msg: 'Token is Required'
        });
    } else {
        Task.CheckUser(req.body, (err, responce) => {
            if(err) return next(err);
            if (responce.length == 0 || !responce) {
                res.json({
                    'status': 10,
                    msg: 'token is expired'
                });
            } else if (!req.body['number'] || !req.body['password']) {
                res.json({
                    status: 0,
                    msg: 'required'
                });
            } else if (responce) {
                req.body['isAssigned'] = 'N';
                Task.CheckPlotDevice(req.body, (err, res_6) => {
                    if(err) return next(err);
                    if (res_6.length == 0 || !res_6) {
                        res.json({
                            'status': 2,
                            msg: 'this number and password  does not exist'
                        });
                    } else {
                        if (!req.body['plotId'] || !req.body['deviceNameMstrId']) {
                            res.json({
                                'status': 0,
                                msg: 'plotId and deviceNameMstrId are required'
                            });

                        } else {
                            req.body['deviceId'] = res_6[0].id;
                            req.body['addedBy'] = req.body['userId'];
                            Task.getMaxdevice_num(req.body, (err, res_7) => {
                                if(err) return next(err);
                                var max;
                                if (res_7.length == 0 || !res_7) {
                                    max = 1;
                                } else {
                                    max = res_7[0].plotDeviceNum;
                                    max += 1;
                                }
                                req.body['plotDeviceNum'] = max;
                                req.body['farmId'] = "0";
                                var a = moment().tz(responce[0].time_zone);
                                a.format()
                                a.utc().format();
                               var date = a.toISOString().slice(0, 19).replace('T', ' ');
                                req.body['addOn'] = date;
                                req.body['deviceNameMstrId'] = req.body['deviceNameMstrId']
                                Task.addPlot_Device(req.body, (err, res_8) => {
                                    if(err) return next(err);
                                    if (res_8) {
                                        req.body['isAssigned'] = 'Y';
                                        Task.UpdatePlotDeviceMaster(req.body, (err, res_9) => {
                                            if(err) return next(err);
                                            res.json({
                                                'status': 1,
                                                msg: 'Data Updated Successfull'
                                            });
                                        });
                                    } else {
                                        res.json({
                                            'status': 0,
                                            msg: 'failed cannot insert data'
                                        });
                                    }
                                });
                            });
                        }
                    }
                });

            } 
        });
    }
}
//----------------------------------- *END API* ---------------------------//


//---------------------------------- addFarmDevice API --------------------------//

exports.addFarmDevice = async (req,res,next) => {
    var deviceId;
    var aDPlotDevice = new Task(req.body);
    if (!aDPlotDevice.android_token) {
        res.json({
            'status': 10,
            msg: 'Token is Required'
        });
    } else {
        Task.CheckUser(aDPlotDevice, (err, responce) => {
            if(err) return next(err);
            if (responce.length == 0 || !responce) {
                res.json({
                    'status': 10,
                    msg: 'token is expired'
                });
            } else if (!req.body['number'] || !req.body['password']) {
                res.json({
                    'status': 0,
                    msg: 'Number and Password is Required'
                });
            } else if (responce) {
                req.body['isAssigned'] = 'N';
                Task.CheckPlotDevice(req.body, (err, res_10) => {
                    if(err) return next(err);
                    if (res_10.length == 0 || !res_10) {
                        res.json({
                            'status': 2,
                            msg: 'this number and password  does not exist'
                        });
                    } else {
                        if (!req.body['farmId'] || !req.body['deviceNameMstrId']) {
                            res.json({
                                'status': 0,
                                msg: 'farmId and deviceNameMstrId are required'
                            });

                        } else {
                            // res.send(res_6);
                            req.body['deviceId'] = res_10[0].id;
                            req.body['addedBy'] = req.body['userId'];
                            Task.getMaxdevice_num(req.body, (err, res_11) => {
                                if(err) return next(err);
                                var max;
                                if (res_11.length == 0 || !res_11) {
                                    max = 1;
                                } else {
                                    max = res_11[0].plotDeviceNum;
                                    max += 1;
                                }
                                req.body['plotDeviceNum'] = max;
                                req.body['plotId'] = "0";
                                var a = moment().tz(responce[0].time_zone);
                                a.format()
                                a.utc().format();
                              var date = a.toISOString().slice(0, 19).replace('T', ' ');
                                req.body['addOn'] = date;
                                Task.addPlot_Device(req.body, (err, res_12) => {
                                    if(err) return next(err);
                                    if (res_12) {
                                        req.body['isAssigned'] = 'Y';
                                        Task.UpdatePlotDeviceMaster(req.body, (err, res_13) => {
                                            if(err) return next(err);
                                            res.json({
                                                'status': 1,
                                                msg: 'Data Updated Successfull'
                                            });
                                        });
                                    } else {
                                        res.json({
                                            'status': 0,
                                            msg: 'failed cannot insert data'
                                        });
                                    }
                                });
                            });
                        }
                    }
                });

            } 
        });
    }
}
//----------------------------------- *END API* ---------------------------//




//----------------------------- Fetch  Plot Device Details API ---------------------//

exports.Fetch_a_getPlotDevice = async (req,res,next) => {

    var adDevice = new Task(req.body);
    if (!adDevice.android_token) {
        res.json({
            'status': 10,
            msg: 'Token Is Required'
        });
    } else {
        Task.CheckUser(adDevice, (err, responce) => {
            if(err) return next(err);
            if (responce.length == 0 || !responce) {
                res.json({
                    'status': 10,
                    msg: 'token is expired'
                });
            }
           else if (!req.body['plotId']) {
                res.json({
                    status: 0,
                    msg: "plotId are required"
                });
            } else if (responce) {
                req.body['plotId'] = req.body['plotId'];
                req.body['farmId'] = '0';
                req.body['isActive'] = 'Y';
                Task.getPlotDevice(req.body,(err, res_fetchPlotDevice) =>{
                    if(err) return next(err);
                    if(res_fetchPlotDevice.length == 0 || !res_fetchPlotDevice){
                        res.json({
                            status: 0,
                            msg: 'Failed, Unable to fetch',
                            result: []
                        });
                    }else {
                        res.json({
                            status: 1,
                            msg: 'Success',
                            result : res_fetchPlotDevice
                        });
                    }

                });
            }
        });
    }
}
//----------------------------------- *END API* ---------------------------//


//----------------------------- Fetch  farm Device Details API ---------------------//

exports.Fetch_a_getFarmDevice = async (req,res,next) => {

    var adDevice = new Task(req.body);
    if (!adDevice.android_token) {
        res.json({
            'status': 10,
            msg: 'Token Is Required'
        });
    }else{
        Task.CheckUser(adDevice, (err, responce) => {
            if(err) return next(err);
            if (responce.length == 0 || !responce) {
                res.json({
                    'status': 10,
                    msg: 'token is expired'
                });
                
            }
         else if (responce) {
                req.body['plotId'] = '0';
                req.body['isActive'] = 'Y';
               Task.getFarm_Devices(req.body, (err, res_fetchFarmDevice) => {
                if(err) return next(err);
                     if(res_fetchFarmDevice.length == 0 || !res_fetchFarmDevice){
                        res.json({
                            status: 0,
                            msg: 'Failed, Unable to fetch',
                            result: []
                        });
                     }else{
                        res.json({
                            status: 1,
                            msg: 'success',
                            result : res_fetchFarmDevice
                        });  
                     }
    
                });
            }
        });
    }
    
}
//----------------------------------- *END API* ---------------------------//


//----------------------------------  getFarmPlotDevices ---------------------//

exports. getFarmPlotDevices = async(req,res,next)=>{
    if(!req.body['android_token']){
           res.json({
            'status': 10,
            msg: 'Token Is Required'
        });
    }else{
        Task.CheckUser(req.body,(err,responce)=>{
            if(err) return next(err);
            if(responce.length == 0 || !responce){
                res.json({
                    'status': 10,
                    msg: 'token is expired'
                });
            }else  if (!req.body['farmId']) {
                res.json({
                    status: 0,
                    msg: "farmId are required"
                });
            } else if (responce) {
                req.body['farmId'] = req.body['farmId'];
                Task.getFarm_Plot_Devices(req.body, (err,farmPlot) => {
                    if(err) return next(err);
                   if(farmPlot.length == 0 || !farmPlot){
                    res.json({
                        status:0,
                        msg:"Failed"
                     });
                   }else {
                      req.body['plotId'] = farmPlot[0].id;
                      req.body['isActive'] = 'Y';
                      Task.get_plot(req.body,(err,res1)=>{
                        if(err) return next(err);
                          for(var i = 0; i < res1.length ; i++){
                               if(res1.length == 0 || !res1){
                                res.json({
                                    status:0,
                                    msg:"Failed!!!",
                                    data:res1
                                });
                            }else{
                                res.json({
                                    status:1,
                                    msg:"success",
                                    data:res1
                                });
                               }
                               return;
                              }
                        });
                      }
                  });
            }
        });
    }
}
//---------------------------------------- * END * -------------------------------------//




//----------------------------- get Devices Details API ---------------------//


exports.getDevices = async (req,res,next) => {
    if (!req.body['android_token']) {
        res.json({
            status: 10,
            msg: "token is required"
        });
    }
   else{
        Task.CheckUser(req.body, (err, responce) => {
        if(err) return next(err);
        if (responce.length == 0 || !responce) {
            res.json({
                status: 10,
                msg: "token is expired"
            });
        }
      else  if (responce) {
          req.body['isActive'] = 'Y';
            Task.getDevice(req.body, (err, res_1) => {
                if(err) return next(err);
                if(res_1.length == 0 || !res_1){
                    res.json({
                        status: 0,
                        msg: "failed",
                        data:[]
                    });
                } else {
                    res.json({
                        status: 1,
                        msg: "success",
                        data: res_1
                    });
                }
            });
        }
    });
}
}


//----------------------------------- *END API* ---------------------------//




//----------------------------- Update Plot Device API ---------------------//

exports.Update_a_Plot_Device = async (req,res,next) => {

    if (!req.body['android_token']) {
        res.json({
            'status': 10,
            msg: 'Token Is Required'
        });
    }
   else{
        Task.CheckUser(req.body, async (err, responce) => {
        if(err) return next(err);
        if (responce.length == 0 || !responce) {
            res.json({
                'status': 10,
                msg: 'token is expired'
            });
        }
      else  if (!req.body['plotId'] || !req.body['plotDeviceNum'] || !req.body['deviceNameMstrId']) {
            res.json({
                status: 0,
                msg: "plotId,deviceNameMstrId and plotDeviceNum are required "
            });
        } else if (!req.body['number'] || !req.body['password']) {
                    res.json({
                            status:0,
                            msg:"number Password is required"
                        });
        }else if(responce){
            Task.NUmPAss(req.body,(err,res_1)=>{
                if(err) return next(err);
                if(res_1.length == 0 || !res_1){
                    res.json({
                        status:2,
                        msg:"this number and password  does not exist"
                    });
                }else if(res_1){
                    Task.fetch_plotD_1(req.body,(err,res_2)=>{
                        if(err) return next(err);
                        if(res_2.length == 0 || !res_2){
                            res.json({
                                status:0,
                                msg:"failed to select ,update and insert!"
                            });
                        }else if(res_2){
                            req.body['isActive'] = 'N';
                            Task.fetch_plotD_2(req.body,(err,res_3)=>{
                                if(err) return next(err);
                                if(res_3){
                                    req.body['plotDeviceId'] = res_2[0].plotDeviceId;
                                    Task.fetch_plotD_3(req.body,(err,res_4)=>{
                                        if(err) return next(err);
                                        if(res_4){
                                           
                                            req.body['plotDeviceNum'] = res_4[0].plotDeviceNum;
                                            req.body['deviceId'] = res_4[0].deviceId;
                                            req.body['plotId'] = res_4[0].plotId;
                                            // req.body['deviceNameMstrId'] = res_4[0].deviceNameMstrId;
                                            // console.log( req.body['deviceNameMstrId'])
                                            req.body['isActive'] = res_4[0].isActive;
                                            req.body['addedBy'] = res_4[0].addedBy;
                                            req.body['locationLat'] = res_4[0].locationLat;
                                            req.body['locationLong'] = res_4[0].locationLong;
                                            req.body['farmId'] = res_4[0].farmId;
                                           
                                          Task.fetch_plotD_4(req.body,(err,res_5)=>{
                                            if(err) return next(err);
                                              if(res_5){
                                                //   console.log(res_1[0].id)
                                                req.body['deviceNameMstrId'] = req.body['deviceNameMstrId'];
                                                // console.log( req.body['deviceNameMstrId'])
                                                req.body['isActive'] = 'Y';
                                                var a = moment().tz(responce[0].time_zone);
                                                a.utc().format();
                                                var date = a.format("YYYY-MM-DD HH:mm:ss");
                                            
                                                req.body['addOn'] = date;
                                               
                                                req.body['deviceId'] = res_1[0].id;
                                                req.body['plotDeviceId'] = res_5.insertId;
                                             Task.fetch_plotD_5(req.body,(err,res_6)=>{
                                                if(err) return next(err);
                                                 if(!res_6){
                                                    res.json({
                                                        status:0,
                                                        msg:"falied to update !!"
                                                    });
                                                 }else{
                                                    res.json({
                                                        status:1,
                                                        msg:"updated successfully",
                                                        data:res_6
                                                    });
                                                 }
                                             });   

                                              }
                                          });  


                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
           
        }
   });
      
   }
}
//----------------------------------- *END API* ---------------------------//




//----------------------------- Update Farm Device API ---------------------//

exports.Update_a_Farm_Device = async (req,res,next) => {


    if (!req.body['android_token']) {
        res.json({
            'status': 10,
            msg: 'Token Is Required'
        });
    }
   else{
        Task.CheckUser(req.body, async (err, responce) => {
            if(err) return next(err);
        if (responce.length == 0 || !responce) {
            res.json({
                'status': 10,
                msg: 'token is expired'
            });
        }
      else  if (!req.body['farmId'] || !req.body['plotDeviceNum'] || !req.body['deviceNameMstrId']) {
            res.json({
                status: 0,
                msg: "farmId,deviceNameMstrId and plotDeviceNum are required "
            });
        } else if (!req.body['number'] || !req.body['password']) {
                    res.json({
                            status:0,
                            msg:"number Password is required"
                        });
        }else if(responce){
            Task.NUmPAss(req.body,(err,res_1)=>{
                if(err) return next(err);
                if(res_1.length == 0 || !res_1){
                    res.json({
                        status:2,
                        msg:"this number and password  does not exist"
                    });
                }else if(res_1){
                    Task.fetch_farmD_1(req.body,(err,res_2)=>{
                        if(err) return next(err);
                        if(res_2.length == 0 || !res_2){
                            res.json({
                                status:0,
                                msg:"failed to select ,update and insert!"
                            });
                        }else if(res_2){
                            req.body['isActive'] = 'N';
                            Task.fetch_farmD_2(req.body,(err,res_3)=>{
                                if(err) return next(err);
                                if(res_3){
                                    req.body['plotDeviceId'] = res_2[0].plotDeviceId;
                                    Task.fetch_plotD_3(req.body,(err,res_4)=>{
                                        if(err) return next(err);
                                        if(res_4){
                                           
                                            req.body['plotDeviceNum'] = res_4[0].plotDeviceNum;
                                            req.body['deviceId'] = res_4[0].deviceId;
                                            req.body['plotId'] = res_4[0].plotId;
                                            // req.body['deviceNameMstrId'] = res_4[0].deviceNameMstrId;
                                            // console.log( req.body['deviceNameMstrId'])
                                            req.body['isActive'] = res_4[0].isActive;
                                            req.body['addedBy'] = res_4[0].addedBy;
                                            req.body['locationLat'] = res_4[0].locationLat;
                                            req.body['locationLong'] = res_4[0].locationLong;
                                            req.body['farmId'] = res_4[0].farmId;
                                           
                                          Task.fetch_plotD_4(req.body,(err,res_5)=>{
                                            if(err) return next(err);
                                              if(res_5){
                                                //   console.log(res_1[0].id)
                                                req.body['deviceNameMstrId'] = req.body['deviceNameMstrId'];
                                                // console.log( req.body['deviceNameMstrId'])
                                                req.body['isActive'] = 'Y';
                                                var a = moment().tz(responce[0].time_zone);
                                                a.utc().format();
                                               var date = a.format("YYYY-MM-DD HH:mm:ss");
                                               req.body['addOn'] = date;
                                                req.body['deviceId'] = res_1[0].id;
                                                req.body['plotDeviceId'] = res_5.insertId;
                                             Task.fetch_plotD_5(req.body,(err,res_6)=>{
                                                if(err) return next(err);
                                                 if(!res_6){
                                                    res.json({
                                                        status:0,
                                                        msg:"falied to update !!"
                                                    });
                                                 }else{
                                                    res.json({
                                                        status:1,
                                                        msg:"updated successfully",
                                                        data:res_6
                                                    });
                                                 }
                                             });   

                                              }
                                          });  


                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
           
        }
   });
      
   }
}
//----------------------------------- *END API* ---------------------------//




// //----------------------------- User registration API ---------------------//
// exports.regitration = async (req, res) => {
//     const body = req.body;
//     const salt = genSaltSync(10);
//     body.password = hashSync(body.password, salt);
//     Task.userRegistration(body, (err, responce) => {
//         if (err) {
//             return res.status(501).json({
//                 success: 0,
//                 message: "data not inserted"
//             });
//         }
//         return res.status(200).json({
//             success: 1,
//             message: "data inseted successfully",
//             data: responce
//         });
//     });
// }
// //----------------------------------- *END API* ---------------------------//



// //----------------------------- User Login API ---------------------//

// exports.logIn = async (req, res) => {
//     var body = req.body;

//     Task.userLogin(body.email, (err, res_1) => {
//         if (err)
//             throw err;
//         if (!res_1) {
//             res.json({
//                 status: 10,
//                 message: "please enter email and password"
//             });
//         }
//         const result = compare(body.password, res_1['password']);
//         if (result) {
//             res_1['password'] = undefined;
//             const JWT = sign({
//                 result: res_1
//             }, "qwe1234", {
//                 expiresIn: '1d' // expires in  1days
//             });
//             return res.json({
//                 status: 200,
//                 message: 'login Successfully',
//                 token: JWT
//             });
//         } else {
//             return res.json({
//                 status: 0,
//                 message: "Invalid email or password"
//             });
//         }
//     });


// }
// //----------------------------------- *END API* ---------------------------//



//----------------------------- User past_Device_Schedule API ---------------------//

exports.past_Device_Schedule = async (req,res,next) => {
    var responce_1 = {};

    if (!req.body['android_token']) {
        res.json({
            status: 10,
            msg: 'Token Is Required'
        });
    }else{
         Task.CheckUser(req.body, (err, responce) => {
            if(err) return next(err);
        if (responce.length == 0 || !responce) {
            res.json({
                status: 10,
                msg: "token is expired"
            });
        }
       else if (responce) {
            req.body['userId'] = responce[0].user_num;
            req.body['isActive'] = 'Y';
            var a = moment().tz(responce[0].time_zone);
            a.utc().format();
            var date = a.format("YYYY-MM-DD HH:mm:ss");
              req.body['operationTimestamp'] = date;
          
            Task.get_farm_plot_name(req.body, (err, res_1) => {
                if(err) return next(err);
                if (res_1) {
                    for (let i = 0; i < res_1.length; i++) {
                        res_1[i].operationTimestamp = currenTime(res_1[i].operationTimestamp,responce[0].time_zone);
                        res_1[i].operationEndTimeStamp = currenTime(res_1[i].operationEndTimeStamp,responce[0].time_zone);
                    }
                   
                }
                responce_1['status'] = 1;
                responce_1['msg'] = "successfully get  data";
                if (res_1) {
                    //flag 
                    responce_1['plot'] = res_1;
                 } else {
                    responce_1['plot'] = [];
                   
                }
            
            
            });
            Task.get_farm_plot_name_new(req.body, (err, res_2) => {
                if(err) return next(err);
                if (res_2) {
                    for (let j = 0; j < res_2.length; j++) {
                        res_2[j].operationTimestamp = currenTime(res_2[j].operationTimestamp,responce[0].time_zone);
                        res_2[j].operationEndTimeStamp = currenTime(res_2[j].operationEndTimeStamp,responce[0].time_zone);
                    }
                    
                }
                if (res_2) {
                    //flag 
                    responce_1['farm'] = res_2;
                   
                } else {
                    responce_1['farm'] = [];
                 
                }
             
                res.send(responce_1);
            });
            // res.send(responce_1);
        }

    });
}
}
//----------------------------------- *END API* ---------------------------//


//----------------------------- User future_Device_Schedule API ---------------------//


exports.future_Device_Schedule = async (req,res,next) => {
    var responce_1 = {};

    if (!req.body['android_token']) {
        res.json({
            'status': 10,
            msg: 'Token Is Required'
        });
    }
   else
   {
       Task.CheckUser(req.body, (err, responce) => {
        if(err) return next(err);
        if (responce.length == 0 || !responce) {
            res.json({
                status: 10,
                msg: "token is expired"
            });
        }
      else  if (responce) {
            req.body['userId'] = responce[0].user_num;
            req.body['isActive'] = 'Y';
            var a = moment().tz(responce[0].time_zone);
                a.utc().format();
            var date = a.format("YYYY-MM-DD HH:mm:ss");
            req.body['operationTimestamp'] = date;
            Task.get_farm_plot_name_future(req.body, (err, res_1) => {
                if(err) return next(err);
                if (res_1) {
                    for (let i = 0; i < res_1.length; i++) {
                        res_1[i].operationTimestamp = currenTime(res_1[i].operationTimestamp,responce[0].time_zone);
                        res_1[i].operationEndTimeStamp = currenTime(res_1[i].operationEndTimeStamp,responce[0].time_zone);
                    }
                }
                responce_1['status'] = 1;
                responce_1['msg'] = "success";
                if (res_1) {
                    //flag 
                    responce_1['plot'] = res_1;
                } else {
                    responce_1['plot'] = [];
                }
                // responce_1['status'] = 1;
                // responce_1['msg'] = "success";
            });
            Task.get_farm_plot_name_new_future(req.body, (err, res_2) => {
                if(err) return next(err);
                if (res_2) {
                    for (let j = 0; j < res_2.length; j++) {
                        res_2[j].operationTimestamp = currenTime(res_2[j].operationTimestamp,responce[0].time_zone);
                        res_2[j].operationEndTimeStamp = currenTime(res_2[j].operationEndTimeStamp,responce[0].time_zone);
                    }
                }
                if (res_2) {
                    //flag 
                    responce_1['farm'] = res_2;
                } else {
                    responce_1['farm'] = [];
                }
               
                res.send(responce_1);
            });
        }

    });
}
}
//----------------------------------- *END API* ---------------------------//



//----------------------------- User past_Device_Schedule-By_PlotDeviceNum API ---------------------//


exports.pastDeviceScheduleBy_PlotDeviceNum = async (req,res,next) => {
    var responce_1 = {};
    if (!req.body['android_token']) {
        res.json({
            status: 10,
            msg: "token is required"
        });
    }
    else {
        Task.CheckUser(req.body, (err, responce) => {
            if(err) return next(err);
        if (responce.length == 0 || !responce) {
            res.json({
                status: 10,
                msg: "token is required"
            });
        }
       else if (responce) {
            req.body['isExecuted'] = 'Y';
            req.body['isActive'] = 'Y';
            var a = moment().tz(responce[0].time_zone);
            a.utc().format();
            var date = a.format("YYYY-MM-DD HH:mm:ss");
             req.body['operationTimestamp'] = date;
         
            Task.pastDSchedule_By_PlotDeviceNum(req.body, (err, res_1) => {
                if(err) return next(err);
                if(res_1){
                    for (let i = 0; i < res_1.length; i++) {
                        res_1[i].operationTimestamp = currenTime(res_1[i].operationTimestamp,responce[0].time_zone);
                        res_1[i].operationEndTimeStamp = currenTime(res_1[i].operationEndTimeStamp,responce[0].time_zone);
                    }
                }
                   responce_1 = res_1;
                    res.json({
                        status: 1,
                        message: 'success',
                        plot: responce_1
                    });
                });
        }
    });
    }
}
//----------------------------------- *END API* ---------------------------//



//----------------------------- User future_Device_Schedule-By_PlotDeviceNum API ---------------------//


exports.futureDeviceScheduleBy_PlotDeviceNum = async (req,res,next) => {
    var responce_1 = {};
    if (!req.body['android_token']) {
        res.json({
            status: 10,
            msg: "token is required"
        });
    }
   else{

    Task.CheckUser(req.body, (err, responce) => {
        if(err) return next(err);
        if (responce.length == 0 || !responce) {
            res.json({
                status: 10,
                msg: "token is required"
            });
        }
       else if (responce) {
            req.body['isExecuted'] = 'N';
            req.body['isActive'] = "Y";
            var a = moment().tz(responce[0].time_zone);
            a.utc().format();
           var date = a.format("YYYY-MM-DD HH:mm:ss");
        req.body['operationTimestamp'] = date;
          
            Task.futureDSchedule_By_PlotDeviceNum(req.body, (err, res_1) => {
                if(err) return next(err);
                if (res_1) {
                    for (let i = 0; i < res_1.length; i++) {
                           
                        res_1[i].operationTimestamp = currenTime(res_1[i].operationTimestamp,responce[0].time_zone);
                        res_1[i].operationEndTimeStamp =currenTime(res_1[i].operationEndTimeStamp,responce[0].time_zone) ;
                    }
                }
                    responce_1= res_1;
                    res.json({
                        status: 1,
                        msg: 'success',
                        plot: responce_1
                    });
                 });
        }
    });
}
}
//----------------------------------- *END API* ---------------------------//



//-----------------------------  Update_Device_Schedule API ---------------------//

exports.Update_Device_Schedule = async (req,res,next) => {
    if (!req.body['android_token']) {
        res.json({
            status: 10,
            msg: "token is required"
        });
    }else{
        Task.CheckUser(req.body, (err, responce) => {
            if(err) return next(err);
        if (responce.length == 0 || !responce) {
            res.json({
                status: 10,
                msg: "token is required"
            });
        }else if(!req.body['plotDeviceNum'] || !req.body['id'] || !req.body['dispenseQty'] || !req.body['dispenseRate']){
            res.json({
                status: 0,
                msg: "All field are required"
            });
        }
       else if (responce) {
           req.body['operationTimestamp'] = req.body['operationTimestamp'] ;
           req.body['dispenseQty'] = req.body['dispenseQty'] ;
           req.body['dispenseRate'] = req.body['dispenseRate'] ;
            Task.UpdateDeviceSchedule(req.body, (err, res_1) => {
                if(err) return next(err);
                if(res_1){
                    res.json({
                        status: 1,
                        msg: "successfully updated"
                    });
                }else{
                    res.json({
                        status: 0,
                        msg: "failed"
                    });
                }
              
            });
        }

    });
}
}
//----------------------------------- *END API* ---------------------------//


//----------------------------------- get_Name_Mapping_Of_Farm API-----------------------//


exports.get_NameMappingOf_Farm = async (req,res,next) => {
    if (!req.body['android_token']) {
        res.json({
            status: 10,
            msg: "token is required"
        });
    }
   else {
       Task.CheckUser(req.body, (err, responce) => {
        if(err) return next(err);
        if (responce.length == 0 || !responce) {
            res.json({
                status: 10,
                msg: "token is expired"
            });
        }
      else  if (!req.body['farmId']) {
            res.json({
                status: 0,
                msg: "farmId are required"
            });
        } else
        if (responce) {
            Task.get_Name_Mapping_Of_Farm(req.body, (err, res_1) => {
                if(err) return next(err);
                if(res_1.length == 0 || !res_1){
                    res.json({
                        status: 0,
                        msg: 'Failed',
                        data:[]
                    });
                }
                else{
                    res.json({
                        status: 1,
                        msg: "successfully select data",
                        data: res_1
                    });
                }
            });
        }
    });
}
}
//------------------------------------- *END* --------------------------------//


//------------------------------------ get_Name_Mapping_Of_Plot API ---------------------------//

exports.getNameMappingOf_Plot = async (req,res,next) => {
    if (!req.body['android_token']) {
        res.json({
            status: 10,
            msg: "token is required"
        });
    }
   else {
       Task.CheckUser(req.body, (err, responce) => {
        if(err) return next(err);
        if (responce.length == 0 || !responce) {
            res.json({
                status: 10,
                msg: "token is expired"
            });
        }
      else  if (!req.body['plotId']) {
            res.json({
                status: 0,
                msg: "plotId are required"
            });

        } else if (responce) {
            Task.get_Name_Mapping_Of_Plot(req.body, (err, res_1) => {
                if(err) return next(err);
                if(res_1.length == 0 || !res_1){
                    res.json({
                        status: 0,
                        msg: "failed",
                        data:[]
                    });
                }
                else {
                    res.json({
                        status: 1,
                        msg: "success",
                        data: res_1
                    });
                }
            });
        }
    });
}
}
//------------------------------------- *END* --------------------------------//


//---------------------------------- emergency_Stop -------------------------------//

exports.emergency_Stop = async (req,res,next) => {
    if (!req.body['android_token']) {
        res.json({
            status: 10,
            msg: "token is required"
        });
    }
  else{
        Task.CheckUser(req.body, (err, responce) => {
            if(err) return next(err);
        if (responce.length == 0 || !responce) {
            res.json({
                'status': 10,
                msg: 'Token is expired'
            });
        }
       else if (!req.body['plotDeviceNum']) {
            res.json({
                'status': 0,
                msg: 'plotDeviceNum are required'
            });
        } else if (responce) {
            var d = toTimeZone1(date,responce[0].time_zone);
            req.body['operationTimestamp'] = AddExtraTime(d,15);
            // console.log( req.body['operationTimestamp']);
            req.body['addedBy'] = req.body['userId'];
            req.body['dispenseQty'] = 0;
            req.body['dispenseRate'] = 0;
            Task.emergencyStop(req.body, (err, res_1) => {
                if(err) return next(err);
                if(!res_1){
                    res.json({
                        status: 0,
                        msg: "failed"
                    });
                }
                else {
                    res.json({
                        status: 1,
                        msg: "success"
                    });
                }
            });
        }
    });
}
}
//------------------------------------- *END* --------------------------------//




//------------------------------------ emergencyStopOfAllPlotsFarmsDeviceOfFarm -------------------//

exports.emergencyStopOfAllPlotsFarmsDeviceOfFarm = async (req,res,next) => {
    var data;
    if (!req.body['android_token']) {
        res.json({
            status: 10,
            msg: "token is required"
        });
    }
   else{
      Task.CheckUser(req.body,(err, responce) => {
        if(err) return next(err);
        if (responce.length == 0 || !responce) {
            res.json({
                status: 10,
                msg: "token is expired"
            });
        } else if (responce) {
            var d = null;
            var d1 = null;
           req.body['id'] = req.body['farmId'];
            Task.fetch_farm_device(req.body, (err, res_1) => {
               if(err) return next(err);
               if (res_1) {    
                    var i = 0;
                    res_1.forEach(element => {
                        // console.log(element)
                        req.body['deviceId'] = element.deviceId;
                        Task.get_device_state(req.body,(err, res_2) => {
                            if(err) return next(err);
                            if(res_2.length > 0){
                                d = res_2[0].state;
                                if (d == 'CA') {
                                     var currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
                                     var d3 = toTimeZone1(currentDate,responce[0].time_zone);
                                    req.body['operationTimestamp'] = AddExtraTime(d3,15);
                                    // console.log( req.body['operationTimestamp']);
                                    req.body['plotDeviceNum'] = element.plotDeviceNum;
                                    req.body['dispenseRate'] = 0;
                                    req.body['dispenseQty'] = 0;
                                    req.body['addedBy'] =  req.body['userId'];
                                   Task.emergencyStop(req.body, (err, res_3) => {
                                           if(err) return next(err);
                                            i++;
                                         });
                                       }else{
                                           i++;
                                       }
                                       
                             } else {
                                i++;
                             }
                      });
                });

             }
                                                 
         req.body['id'] = req.body['farmId'];
         Task.fetch_all_plots(req.body, (err, res_4) => {
             if(err) return next(err);
             if (res_4) {
                 var j = 0;
                 res_4.forEach(element1 => {
                     req.body['deviceId'] = element1.deviceId;
                     Task.get_device_state(req.body, (err, res_5) => {
                         if(err) return next(err);
                          if (res_5.length > 0) {
                             d1 = res_5[0].state;
                             if (d1 == 'CA') {
                                var currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
                                var d3 = toTimeZone1(currentDate,responce[0].time_zone);
                                 req.body['operationTimestamp'] = AddExtraTime(d3,15);
                                 req.body['plotDeviceNum'] = element1.plotDeviceNum;
                                 req.body['dispenseRate'] = 0;
                                 req.body['dispenseQty'] = 0;
                                 req.body['addedBy'] = req.body['userId'];
                                 Task.emergencyStop(req.body, (err, res_6) => {
                                     if(err) return next(err);
                                     j++;
                                 });
                             } else {
                                 j++;
                             }
                         } else {
                             j++;
                         }
                     
                      });
                 });
             }
             if(res_1.length == 0 || !res_1 || res_4.length == 0 || !res_4){
                 res.json({
                     status:0,
                     msg:"failed"
                 });
             }else{
                res.json({
                    status:1,
                    msg:"success"
                });
             }
           
         });
                
         });
        
      
        }
       
    });
  
}
}
//------------------------------------- *END* --------------------------------//


//-------------------------------- emergencyStopOfPlotsOfUser ---------------------//

exports.emergencyStopOf_PlotsOfUser = async (req,res,next) => {
    var d = null;
    var res0 = null;
    if (!req.body['android_token']) {
        res.json({
            status: 10,
            msg: "token is required"
        });
    }
   else{
        Task.CheckUser(req.body, (err, responce) => {
            if(err) return next(err);
        if (responce.length == 0 || !responce) {
            res.json({
                status: 10,
                msg: "token is expired"
            });
        }
       else if (!req.body['plotId']) {
            res.json({
                status: 0,
                msg: "plotId are required"
            });
        } else if (responce) {
            Task.emergencyStopOfPlotsOfUser(req.body, (err, res_1) => {
                if(err) return next(err);
                if (res_1.length == 0 || !res_1) {
                    res.json({
                        status: 0,
                        message: "failed!"
                    });
                } else if (res_1) {
                    var i = 0;
                    res_1.forEach(element => {
                        req.body['deviceId'] = element.deviceId;
                        Task.get_device_state(req.body, (err, res_2) => {
                            if(err) return next(err);
                            
                           if (res_2.length > 0) {
                                //  res.send(res_2)
                                d = res_2[0].state;
                                if (d == 'CA') {
                                    var currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
                                    var d3 = toTimeZone1(currentDate,responce[0].time_zone);
                                    req.body['operationTimestamp'] = AddExtraTime(d3,15);
                                    req.body['plotDeviceNum'] = element.plotDeviceNum;
                                    req.body['dispenseRate'] = 0;
                                    req.body['dispenseQty'] = 0;
                                    req.body['addedBy'] = req.body['userId'];
                                    Task.emergencyStop(req.body, (err, res_3) => {
                                        if(err) return next(err);
                                        i++;
                                        
                                    });
                                } else {
                                    i++;
                                }
                               
                            } else {

                                i++;
                            }
                        });

                    });
                    res.json({
                        status: 1,
                        msg: "data insert successfully",
                        
                    });
                }
            });
        }
    });
}
}
//------------------------------------- *END* --------------------------------//


//--------------------------------- emergencyStopOfUser ------------------------//


exports.emergencyStopOfUser = async (req,res,next) => {
   
    var data2 = null;
    var d = null;
    var d1 = null;
    if (!req.body['android_token']) {
        res.json({
            status: 10,
            msg: "token is required"
        });
    }
   else{
        Task.CheckUser(req.body, (err, responce) => {
            if(err) return next(err);
        if (responce.length == 0 || !responce) {
            res.json({
                status: 10,
                msg: "token is required"
            });
        } else if (responce) {
            req.body['userID'] = responce[0].user_num;
            Task.fetchFarm(req.body, (err, res_1) => {
                if(err) return next(err);
                if(res_1.length == 0 || !res_1){
                   res.json({
                       status:0,
                       msg:'failed'
                   });
                }
               else if (res_1) {
                    k = 0;
                    res_1.forEach(element => {
                        req.body['id'] = element.id;
                     Task.fetch_all_plots(req.body, (err, res_2) => {
                            if(err) return next(err);
                           
                            if (res_2) {
                                var i = 0;
                                res_2.forEach(element1 => {
                                    req.body['deviceId'] = element1.deviceId;
                                    Task.get_device_state(req.body, (err, res_3) => {
                                        if(err) return next(err);
                                        if (res_3.length > 0) {
                                            d = res_3[0].state;
                                            if (d == 'CA') {
                                                var date = new Date().toISOString();
                                                var d3 = toTimeZone1(date,responce[0].time_zone);
                                                req.body['operationTimestamp'] = AddExtraTime(d3,15);
                                                req.body['plotDeviceNum'] = element1.plotDeviceNum;
                                                req.body['dispenseRate'] = 0;
                                                req.body['dispenseQty'] = 0;
                                                req.body['addedBy'] = responce[0].user_num;
                                                Task.emergencyStop(req.body, (err, res_4) => {
                                                    if(err) return next(err);
                                                    i++;
                                                });

                                            } else {
                                                i++;
                                            }
                                        } else {
                                            i++;
                                        }
                                    });
                                  
                                });
                               
                            }
                        
                           
                        });
                    
                        
                        req.body['id'] = element.id;
                        Task.fetch_farm_device(req.body, (err, res_5) => {
                             if(err) return next(err);
                            if (res_5) {
                                j = 0;
                                res_5.forEach(element2 => {
                                    req.body['deviceId'] = element2.deviceId;
                                    Task.get_device_state(req.body, (err, res_6) => {
                                        if(err) return next(err);
                                        if (res_6.length > 0) {
                                            d1 = res_6[0].state;
                                            if (d1 == "CA") {
                                                var date = new Date().toISOString();
                                                var d3 = toTimeZone1(date,responce[0].time_zone);
                                                req.body['operationTimestamp'] = AddExtraTime(d3,15);
                                                req.body['plotDeviceNum'] = element2.plotDeviceNum;
                                                req.body['dispenseRate'] = 0;
                                                req.body['dispenseQty'] = 0;
                                                req.body['addedBy'] = responce[0].user_num;
                                                Task.emergencyStop(req.body, (err, res_7) => {
                                                    if(err) return next(err);
                                                    j++;
                                                 
                                                });
                                            } else {
                                                j++;
                                            }
                                        } else {
                                            j++;
                                        }
                                    });
                                });
                             
                            }
                         });
                       k++;
                    });
                  res.json({
                      status:1,
                      msg:"success"
                  });
                 }
            
            
            });
          
        }
   
    });
}
}
//------------------------------------- *END* --------------------------------//


//--------------------------------------- getPlotDevicesAndState ------------------------------//


exports.getPlotDevicesAndState = async (req,res,next) => {
    if (!req.body['android_token']) {
        res.json({
            status: 10,
            msg: "token is required"
        });
    }
   else{
        Task.CheckUser(req.body, (err, responce) => {
            if(err) return next(err);
        if (responce.length == 0 || !responce) {
            res.json({
                status: 10,
                msg: "token is expired"
            });
        }
      else  if (!req.body['plotId']) {
            res.json({
                status: 0,
                msg: "plotId are required"
            });
        } else if (responce) {
            var i = 0;
            Task.fetchPlotDeviceState(req.body, (err, res_1) => {
                if(err) return next(err);
                if (res_1) {

                    res_1.forEach(element => {
                        req.body['deviceId'] = element.deviceId;
                        Task.get_device_state(req.body, (err, res_2) => {
                            if(err) return next(err);
                            if (res_2.length > 0) {
                                element.state = res_2[0].state;
                                i++;
                            }
                        });
                    });
                }
                if (res_1) {
                    res.json({
                        status: 1,
                        msg: "success",
                        data: res_1
                    });
                } else {
                    res.json({
                        status: 0,
                        msg: "failed"
                    });
                }
            });
        }
    });
}
}
//------------------------------------------- *END* -----------------------------//


//-------------------------------------- getFarmDevicesAndState ---------------------------//

exports.getFarmDevicesAndState = async (req,res,next) => {
    if (!req.body['android_token']) {
        res.json({
            status: 10,
            msg: "token is required"
        });
    }
    else {
        Task.CheckUser(req.body, (err, responce) => {
            if(err) return next(err);
        if (responce.length == 0 || !responce) {
            res.json({
                status: 10,
                msg: "token is expired"
            });
        }
       else if (!req.body['farmId']) {
            res.json({
                status: 0,
                msg: "farmId are required"
            });
        } else if (responce) {
            Task.fetchFarmDeviceState(req.body, (err, res_1) => {
                if(err) return next(err);
                if (res_1) {
                    var i = 0;
                    res_1.forEach(element => {
                        req.body['deviceId'] = element.deviceId;
                        Task.get_device_state(req.body, (err, res_2) => {
                            if(err) return next(err);
                            if (res_2.length > 0) {
                                element.state = res_2[0].state;
                                i++;
                            }
                        });
                    });
                }
                if (res_1) {
                    res.json({
                        status: 1,
                        msg: "success",
                        data: res_1
                    });
                } else {
                    res.json({
                        status: 0,
                        msg: "failed"
                    });
                }
            });
        }
    });
}
}
//---------------------------------------  insertSchedules -------------------------//

exports.insertSchedules = async (req,res,next) => {
    var data_response ;
    
    if (!req.body['android_token']) {
        res.json({
            status: 10,
            msg: "token is required"
        });
    }
   else{
        Task.CheckUser(req.body, (err, responce) => {
            if(err) return next(err);
        if (responce.length == 0 || !responce) {
            res.json({
                status: 10,
                msg: "token is expired"
            });
        }
       else if (!req.body['plotDeviceNum']) {
            res.json({
                status: 0,
                msg: "plotDeviceNum are required"
            });
        } else if (responce) {
            if (req.body['dispenseQty']) {
                var d = req.body['dispenseQty'];
                
            }
            if (req.body['dispenseRate']) {
                var d1 = req.body['dispenseRate'];
                
            }
            if (req.body['operationTimestamp']) {
               
               var oTS = req.body['operationTimestamp'];

            }
            if (req.body['operationEndTimeStamp']) {
               
               var otEs = req.body['operationEndTimeStamp'];
                
            }
        
            var p = req.body['plotDeviceNum'];
            // console.log(p);
            var date1 = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      try{
        for (var i = 0; i < oTS.length; i++) {
            // res_2[j].operationTimestamp = new Date(res_2[j].operationTimestamp).toUTCString();
            req.body['dispenseRate'] = d1;
            req.body['dispenseQty'] = d;
            req.body['operationTimestamp'] = toTimeZone1(oTS[i],responce[0].time_zone);
            req.body['operationEndTimeStamp'] = toTimeZone1(otEs[i],responce[0].time_zone);
            req.body['addedOn'] = date1;
            req.body['plotDeviceNum'] = p;
            Task.insertSchedule(req.body, (err, res_1) => {
                if(err) return next(err);
                
                
              });
         } 
         res.json({
             status:1,
             msg : "insert"
         });
      }catch (e){
        res.json({
            status:0,
            msg : "failed"
        });
      }
            
            
        }
    });
}
}
//--------------------------------------- *END* --------------------------------//


//------------------------------------- startDevice -----------------------//

exports.startDevice = async(req,res,next)=>{
    var b;
    var a = moment().tz("Asia/Kolkata");
    a.format()
    a.utc().format();
    var date = new Date(a).toISOString().replace(/T/, ' ').replace(/\..+/, '');
    var seconds = 5;
    var dateFormat = 'YYYY-MM-DD HH:mm:ss';
    var resultDate = moment(date).add(seconds, 'seconds').format(dateFormat);
    // console.log(resultDate)
    
    req.body['plotDeviceNum'] = req.params['id'];
    req.body['dispenseQty'] = "10";
    req.body['dispenseRate'] = "10";
    req.body['operationTimestamp'] = resultDate;
     Task.start_Device(req.params.id,req.body,(err,res_1)=>{
        if(err) return next(err);
         if(res_1){
            var a = moment().tz("Asia/Kolkata");
            a.format()
            a.utc().format();
            var date = new Date(a).toISOString().replace(/T/, ' ').replace(/\..+/, '');
            var seconds = 30;
            var dateFormat = 'YYYY-MM-DD HH:mm:ss';
            var resultDate1 = moment(date).add(seconds, 'seconds').format(dateFormat);
            // console.log(resultDate1)
            req.body['plotDeviceNum'] = req.params['id'];
            req.body['dispenseQty'] = "0";
            req.body['dispenseRate'] = "0";
            req.body['operationTimestamp'] = resultDate1;
            Task.start_Device(req.params.id,req.body,(err,res_2)=>{
                if(err) return next(err);
                if(res_2){
                    res.json({
                        status: 1,
                        msg: "successfully device start"
                    });
                }else{
                    res.json({
                        status: 1,
                        msg: "failed try again"
                    });
                }
            });
         }else{
            res.json({
                status: 1,
                msg: "failed try again"
            });
         }
     });
}
//----------------------------------- *END* -------------------------------------//


//------------------------------------ deleteDeviceSchedule -----------------------//

exports.deleteDeviceSchedule = async (req,res,next) => {
    if (!req.body['android_token']) {
        res.json({
            status: 10,
            msg: "token is required"
        });
    }
  else {
       Task.CheckUser(req.body, (err, responce) => {
        if(err) return next(err);
        if (responce.length == 0 || !responce) {
            res.json({
                status: 10,
                msg: "token is expired"
            });
        }
       else if (!req.body['id']) {
            res.json({
                status: 0,
                msg: "id are required"
            });
        } else if (responce) {
            req.body['isActive'] = 'N';
            Task.delete_DeviceSchedule(req.body, (err, res_1) => {
                if(err) return next(err);
                if (!res_1) {
                    res.json({
                        status: 0,
                        msg: 'failed'
                    });
                } else {
                    res.json({
                        status: 1,
                        msg: "deleted"
                    });
                }
            });
        }
    });
}
}
//-------------------------------------------- *END* -----------------------------------//


//---------------------------------------- registerDevicewithuser -----------------------//

exports.registerDevicewithuser = async (req,res,next) => {

    if (!req.body['email']) {
        res.json({
            status: 0,
            msg: "email not recived"
        });
    }
   else if (!req.body['deviceId']) {
        res.json({
            status: 0,
            msg: "device Id not recived"
        });
    }
  else  if (!req.body['dname']) {
        res.json({
            status: 0,
            msg: "device name not recived"
        });
    }
 else   if (!req.body['password']) {
        res.json({
            status: 0,
            msg: "device password not recived"
        });
    }else{
    //if all required parameters are there ,then checking and removing if there is any spaces in it.
    let dId = req.body['deviceId'].replace('', '');
    let dPass = req.body['password'].replace('', '');
    // console.log(dId);
    // console.log(dPass);
    Task.getPlotDeviceNum2(req.body, (err, res_1) => {
        if(err) return next(err);
        if (res_1.length > 0 || !res_1) {

            req.body['number'] = dId;
            req.body['password'] = dPass;
            req.body['isAssigned'] = 'Y';
            Task.device_Master(req.body, (err, res_2) => {
                if(err) return next(err);
                if (res_2.length > 0 || !res_2) {
                    res.json({
                        status: 0,
                        msg: "This device ID is already assigned, Please recheck your ID"
                    });
                }
                else {
                    req.body['number'] = dId;
                    req.body['password'] = dPass;
                    req.body['isAssigned'] = 'N';
                    Task.device_Master(req.body, (err, res_3) => {
                        console.log(res_3)
                        if(err) return next(err);
                        req.body['isAssigned'] = 'Y';
                        Task.select_deviceMaster_update(req.body, (err, res_4) => {
                            // res.send(res_4)
                            if(err) return next(err);
                            if (!res_4) {
                                res.json({
                                    status: 0,
                                    msg: "Unfortunately, I wasn't able to register your device right now. Please try again later",
                                });
                            }
                            else {
                                req.body['farmId'] = res_1[0].farmId;

                                Task.insertDeviceNameMaster(req.body, (err, res_5) => {
                                    if(err) return next(err);

                                    Task.getLastUserId(req.body, (err, res_6) => {
                                        if(err) return next(err);

                                        req.body['deviceId'] = res_3[0].id;
                                        req.body['plotDeviceNum'] = res_6[0].plotDeviceNum + 1;
                                        req.body['plotId'] = res_1[0].plotId;
                                        req.body['farmId'] = res_1[0].farmId;
                                        req.body['addedBy'] = res_1[0].id;
                                        req.body['deviceNameMstrId'] = res_5.insertId;
                                        Task.insertPlot_Device(req.body, (err, res_7) => {
                                            if(err) return next(err);
                                            if (res_7) {
                                                res.json({
                                                    status: 1,
                                                    msg: "The Device has been registered for " + res_1[0].email,
                                                    data: res_7
                                                });
                                              
                                            } else {
                                                res.json({
                                                    status: 0,
                                                    msg: "Unfortunately, I wasn't able to register your device right now. Please try again later"
                                                });
                                            }
                                        });
                                    });
                                });
                            }

                        });
                    });


                }

            });
        }
         else {
            var userID;
            req.body['number'] = dId;
            req.body['password'] = dPass;
            req.body['isAssigned'] = 'Y';
            Task.device_Master(req.body, (err, res_10) => {
                if(err) return next(err);
                if (res_10.length > 0 || !res_10) {
                    res.json({
                        status: 0,
                        msg: "This device is already assigned to someone else. Please check your device ID again."
                    });

                }
                 else {
                    req.body['number'] = dId;
                    req.body['password'] = dPass;
                    req.body['isAssigned'] = 'N';
                    Task.device_Master(req.body, (err, res_11) => {
                        // res.send(res_11)
                        if(err) return next(err);
                        if (res_11) {
                            req.body['isAssigned'] = 'Y';
                            req.body['isActive'] = 'Y';
                            Task.select_deviceMasterupdate(req.body, (err, res_12) => {
                                console.log(res_12)
                                if(err) return next(err);
                                if (!res_12) {
                                    res.json({
                                        status: 0,
                                        msg: "Unfortunately, I wasn't able to register your device right now. Please try again later"
                                    });
                                }
                                 else {
                                    Task.selectUser(req.body, (err, res_13) => {
                                        if(err) return next(err);
                                        if (res_13.length == 0 || !res_13) {
                                            Task.getLastUserId_1(req.body, (err, res_14) => {
                                                if(err) return next(err);
                                                req.body['u_id'] = 'dummyuser';
                                                req.body['user_num'] = res_14[0].user_num + 1;
                                                Task.insertUser(req.body, (err, res_15) => {
                                                    if(err) return next(err);
                                                    //    res.send(res_15)
                                                    // userID = req.body['user_num'];
                                                    // console.log(userID);
                                                    if (!res_15) {
                                                        res.json({
                                                            status: 0,
                                                            msg: "unable to register user !!"
                                                        });
                                                    } else if (res_15) {

                                                        userID = req.body['user_num'];
                                                        // console.log(userID);
                                                    } else {
                                                        userID = res_13[0].user_num;
                                                        // console.log(userID);
                                                    }
                                                    //if user already exist but dont have farm and plot
                                                    req.body['name'] = "user" + userID + " Farm";
                                                    req.body['userId'] = userID;
                                                    req.body['area'] = 0;
                                                    Task.CreateFarm1(req.body, (err, res_16) => {
                                                        if(err) return next(err);
                                                        if (!res_16) {
                                                            res.json({
                                                                status: 0,
                                                                msg: "unable to register farm"
                                                            });
                                                        } else {
                                                            req.body['farmId'] = res_16.insertId;
                                                            req.body['name'] = "dummyplot";
                                                            req.body['area'] = 0;
                                                            Task.CreateFarmPlot(req.body, (err, res_17) => {
                                                                // res.send(res_17)
                                                                if(err) return next(err);
                                                                if (!res_17) {
                                                                    res.json({
                                                                        status: 0,
                                                                        msg: "unable to register farm plot"
                                                                    });
                                                                } else {
                                                                    req.body['farmId'] = res_16.insertId;
                                                                    req.body['addedBy'] = userID;
                                                                    Task.addDeviceName_1(req.body, (er, res_18) => {
                                                                        if(err) return next(err);
                                                                        if (!res_18) {
                                                                            res.json({
                                                                                status: 0,
                                                                                msg: "unable to register device name"
                                                                            });
                                                                        } else {
                                                                            Task.getMaxdevice_num(req.body, (err, res_19) => {
                                                                                if(err) return next(err);
                                                                                var max;
                                                                                if (!res_19) {
                                                                                    max = 1;
                                                                                } else {
                                                                                    max = res_19[0].plotDeviceNum;
                                                                                    max += 1;
                                                                                }
                                                                                req.body['plotDeviceNum'] = max;
                                                                                req.body['deviceId'] = res_11[0].id;
                                                                                req.body['plotId'] = res_17.insertId;
                                                                                req.body['farmId'] = res_16.insertId;
                                                                                req.body['deviceNameMstrId'] = res_18.insertId;
                                                                                Task.insertPlot_Device(req.body, (err, res_19) => {
                                                                                    if(err) return next(err);
                                                                                    if (!res_19) {
                                                                                        res.json({
                                                                                            status: 0,
                                                                                            msg: "unable to register plotDevice"
                                                                                        });
                                                                                    } else {
                                                                                        res.json({
                                                                                            status: 1,
                                                                                            msg: "Congratulations! Your device has been successfully registered.",
                                                                                            data: res_19
                                                                                        });
                                                                                    }
                                                                                });
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }

                                                    });
                                                });
                                            });
                                        }

                                    });
                                }
                            });
                        }
                    });

                }
            });
        }
    });
}
}
//------------------------------------------------------------- * END * --------------------------------------------------------//


//----------------------------------------------------------- insert_Schedules_By_GA API ---------------------------------------//


exports.insertSchedulesByGA = async (req,res,next) => {
    //declaring necessary variables
    var oeTS = [];
    var ots = [];
    var dr;
    var dq;
    var Di;
    var pD;
    if(!req.body['email']){
        res.json({
            status:0,
            msg:'email not recived'
        });
    }else{
    req.body['email'] = req.body['addedBy'];
    //   req.body['externalName'] = req.body['deviceName'];
    req.body['isActive'] = 'Y';
    Task.getPlotDeviceNum(req.body, (err, res_1) => {
        if(err) return next(err);
        if (res_1.length == 0 || !res_1) {
            res.json({
                status: 4,
                msg: "Unfortunately, I wasn't able to register your device right now. Please try again later",
                data: res_1
            });

        } else {

            req.body['externalName'] = req.body['deviceName'];
            Task.getPlotDeviceNum__2(req.body, (err, res_2) => {
                if(err) return next(err);
                if (res_2.length == 0 || !res_2) {
                    res.json({
                        status: 4,
                        msg: "The entered device ID is not registered with your email. Please re check and try again. ",
                        data: res_2
                    });
                } else {
                    req.body['deviceId'] = res_2[0].deviceId;
                    Task.selectOrderBy(req.body, (err, res_3) => {
                        if(err) return next(err);
                        req.body['addedBy'] = res_1[0].email;
                        if (req.body['time'] && req.body['duration']) {
                            var time = new Date(req.body['time']).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                            //  console.log(time)
                            var seconds = 30;
                            var dateFormat = 'YYYY-MM-DD HH:mm:ss';
                            var resultDate = moment(time).add(seconds, 'seconds').format(dateFormat);
                            //  console.log(resultDate)
                            var dt = resultDate + " " + ("+" + " " + req.body['duration'] + " " + "minutes");
                            ots = resultDate;
                            oeTS = dt;
                            //   console.log(ots);
                            //   console.log(oeTS)
                            dr = -1;
                            dq = -1;
                        } else {
                            //if scheduling is done by rate and quantity OR b timestamps

                            if (req.body['dispenseQty']) {
                                dq = req.body['dispenseQty'];
                            } else {
                                dp = -1;
                            }

                            if (req.body['dispenseRate']) {
                                dr = req.body['dispenseRate'];
                            } else {
                                dr = -1;
                            }

                            if (req.body['operationTimestamp']) {
                                var time = new Date(req.body['operationTimestamp']).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                                //  console.log(time)
                                var seconds = 30;
                                var dateFormat = 'YYYY-MM-DD HH:mm:ss';
                                var resultDate = moment(time).add(seconds, 'seconds').format(dateFormat);
                                ots = resultDate;
                            } else {
                                ots = [];
                            }

                            if (req.body['operationEndTimeStamp']) {
                                var time1 = new Date(req.body['operationEndTimeStamp']).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                                //  console.log(time)
                                var seconds = 30;
                                var dateFormat = 'YYYY-MM-DD HH:mm:ss';
                                var resultDate1 = moment(time1).add(seconds, 'seconds').format(dateFormat);
                                oeTS = resultDate1;
                            } else {
                                oeTS = [];
                            }
                        }

                        if (req.body['plotDeviceNum']) {
                            req.body['deviceId'] = req.body['deviceId'];
                        } else if (res_1.length == 1) {
                            req.body['deviceId'] = res_1[0].deviceId;
                        } else if (req.body['deviceName']) {
                            req.body['externalName'] = req.body['deviceName'];
                            req.body['email'] = req.body['addedBy'];
                            Task.getPlotDeviceNum(req.body, (err, deviceBymail) => {
                                if(err) return next(err);
                                if (deviceBymail) {
                                    req.body['deviceId'] = deviceBymail[0].deviceId;
                                    req.body['plotDeviceNum'] = deviceBymail[0].plotDeviceNum;
                                    console.log(deviceBymail[0].deviceId)
                                    console.log(deviceBymail[0].plotDeviceNum)
                                } else {
                                    res.json({
                                        status: 4,
                                        msg: "Unfortunately, I wasn't able to register your device right now. Please try again later"
                                    });
                                }

                                req.body['isActive'] = 'Y';
                                Task.plot_1select(req.body, (err, res_6) => {
                                    if(err) return next(err);
                                    var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                                    try {
                                        if (ots) {
                                            for (var i; i < ots.length; i++) {
                                                req.body['dispenseQty'] = dq;
                                                req.body['dispenseRate'] = dq;
                                                req.body['operationTimestamp'] = ots[i];
                                                req.body['operationEndTimeStamp'] = oeTS[i];
                                                req.body['addedBy'] = date;
                                                req.body['plotDeviceNum'] = res_6[0].plotDeviceNum;
                                                Task.insertSchedule(req.body, (err, res_8) => {
                                                    if(err) return next(err);
                                                    res.json({
                                                        status: 1,
                                                        state: res_3[0].state,
                                                        msg: "device scheduled",

                                                    });
                                                });
                                            }
                                        } else {
                                            req.body['dispenseQty'] = dq;
                                            req.body['dispenseRate'] = dq;
                                            req.body['addedBy'] = date;
                                            req.body['plotDeviceNum'] = res_6[0].plotDeviceNum;
                                            Task.insertSchedule(req.body, (err, res_7) => {
                                                if(err) return next(err);
                                                res.json({
                                                    status: 1,
                                                    state: res_3[0].state,
                                                    msg: "device scheduled",

                                                });
                                            });
                                        }
                                    } catch (e){

                                        res.json({
                                            status: 0,
                                            msg: "failed"
                                        });

                                    }
                                });
                            });

                        } else {
                            res.json({
                                status: 3,
                                msg: "There are multiple device registered, Please enter the device Name."
                            });
                        }

                    });
                }
            });
        }

        //   req.body['deviceId'] = res_1[0].deviceId;
    });
    }
}
//----------------------------------------------------- *END* ----------------------------------//


//----------------------------------------- viewAllDeviceByEmail -------------------------------//

exports.viewAllDeviceByEmail = async (req,res,next) => {
    var devices = [];
    if (!req.body['email']) {
        res.json({
            status: 0,
            msg: "Please enter your email ID"
        });
    }else{
    req.body['isActive'] = 'Y';
    req.body['isActive'] = 'Y';
    Task.getPlotDeviceNum_3(req.body, (err, res_1) => {
        if(err) return next(err);
        if (!res_1) {
            res.json({
                status: 0,
                msg: "Sorry, No devices are registered with your email ID"
            });
        } else {
            res_1.forEach(element => {

                devices.push(
                    req.body['deviceId'] = element.deviceId,
                    req.body['name'] = element.externalName,
                    req.body['password'] = element.password,
                );
            });
        }
        if (devices) {
            res.json({
                status: 1,
                data: devices
            });
        } else {
            res.json({
                status: 0,
                data: [],
                msg: ""
            });
        }
    });
    }
}
// ---------------------------------------------- *END* ---------------------------------//


//------------------------------------ deleteDeviceOfUser ---------------------------//

exports.deleteDeviceOfUser = async (req,res,next) => {
    if (!req.body['deviceId'] || !req.body['password']) {
        res.json({
            status: 0,
            msg: "required"
        });
    } else {
        req.body['number'] = req.body['deviceId'];
        req.body['password'] = req.body['password'];
        Task.device_Master2(req.body, (err, res_1) => {
            if(err) return next(err);
            if (res_1) {
                req.body['isAssigned'] = 'N';
                Task.select_deviceMaster_update(req.body, (err, res_2) => {
                    if(err) return next(err);
                    if (res_2) {
                        req.body['deviceId'] = res_1[0].id;
                        req.body['isActive'] = 'Y';
                        Task.plot_1select2(req.body, (err, res_3) => {
                            if(err) return next(err);
                            if (!res_3.length > 0 || !res_3) {
                                res.json({
                                    status: 0,
                                    msg: "no device assigned"
                                });
                            } else {
                                req.body['plotDeviceId'] = res_3[0].plotDeviceId;
                                req.body['isActive'] = "N";
                                Task.select_plotdevice_update(req.body, (err, res_4) => {
                                    if(err) return next(err);
                                    if (res_4) {
                                        res.json({
                                            status: 1,
                                            msg: "success"
                                        });
                                    } else {
                                        res.json({
                                            status: 0,
                                            msg: "failed"
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        })
    }
}
//----------------------------------------------------- *END* ----------------------------------------//


//------------------------------------- viewAllActiveDevices API ------------------------------------//

exports.viewAllActiveDevices = async (req,res,next) => {
    if (!req.body['email']) {
        res.json({
            status: 0,
            msg: 'email required'
        });
    } else {
        var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        req.body['isActive'] = 'Y';
        req.body['isActive'] = 'Y';
        req.body['isSentToBroker'] = 'I';
        req.body['operationTimestamp'] = date;
        req.body['operationEndTimeStamp'] = date;
        try {
            Task.getPlotDeviceNumSchedule(req.body, (err, res_1) => {
                if(err) return next(err);
                if (err) {
                    res.json({
                        status: 0,
                        msg: "failed"
                    });
                } else if (res_1.length > 0) {
                    res.json({
                        status: 1,
                        msg: 'Success',
                        data: res_1
                    });
                } else {
                    res.json({
                        status: 1,
                        msg: 'no active devices',
                        data: res_1
                    });
                }
            });
        } catch (e) {
            res.json({
                status: 0,
                msg: "some error occurred",
                data: res

            });
        }
    }



}
//--------------------------------------------- *END* ----------------------------------------//


//----------------------------------------  stopSpecificDevice API --------------------------//

exports.stopSpecificDevice = async (req,res,next) => {
    if (!req.body['email']) {
        res.json({
            status: 0,
            msg: "email not received"
        });
    } else if (!req.body['dname']) {
        res.json({
            status: 0,
            msg: "device Name not received"
        });
    } else {
       
        req.body['externalName'] = req.body['dname'];
        // req.body['isSentToBroker'] =  'I';
        req.body['operationTimestamp'] = myCallback2();
        Task.getPlotDeviceNumSchedule_2(req.body, (err, res_1) => {
            if(err) return next(err);
            if (res_1.length > 0) {
                var time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                //  console.log(time)
                var seconds = 15;
                var dateFormat = 'YYYY-MM-DD HH:mm:ss';
                var resultDate = moment(time).add(seconds, 'seconds').format(dateFormat);
                req.body['operationTimestamp'] = resultDate;
                req.body['dispenseRate'] = 0;
                req.body['dispenseQty'] = 0;
                req.body['plotDeviceNum'] = res_1[0].plotDeviceNum;
                req.body['addedBy'] = res_1[0].user_num;
                Task.insertSchedule(req.body, (err, res_2) => {
                    if(err) return next(err);
                    if (res_2) {
                        res.json({
                            status: 1,
                            msg: "has stopped succeddfuly." + res_1[0].externalName
                        });
                    } else {
                        res.json({
                            status: 0,
                            msg: "Unfortunately, I couldn't stop the device now. Please try again later."
                        });
                    }
                });
            } else {
                res.json({
                    status: 0,
                    msg: "Sorry, there are no currently active devices."
                });
            }
        });

    }
}
//------------------------------------------------ renameDeviceFromUserGA -------------------------------------//


exports.renameDeviceFromUserGA = async (req,res,next) => {
    if (!req.body['email']) {
        res.json({
            status: 0,
            msg: "email not received"
        });
    } else if (!req.body['dname']) {
        res.json({
            status: 0,
            msg: "device name not received"
        });
    } else if (!req.body['Newdname']) {
        res.json({
            status: 0,
            msg: "new device name not received"
        });
    } else {
        req.body['externalName'] = req.body['dname'];
        Task.getPlotDeviceNum__4(req.body, (err, res_1) => {
            if(err) return next(err);
            if (res_1.length > 0) {
                // console.log(res_1[0].external_id)
                req.body['externalName'] = req.body['Newdname'];
                req.body['id'] = res_1[0].external_id;
                Task.select_deviceMaster_update2(req.body, (err, res_2) => {
                    if(err) return next(err);
                    if (res_2) {
                        res.json({
                            status: 1,
                            msg: "Changed" + " " + req.body['dname'] + " " + "to" + " " + req.body['Newdname'],
                            data: res_2
                        });
                    } else {
                        res.json({
                            status: 0,
                            msg: "Unfortunately, I couldn't rename the device now. Please try again later."
                        });
                    }

                });
            } else {
                res.json({
                    status: 0,
                    msg: "The device name is not registered to your email ID"
                });
            }
        });
    }

}
//---------------------------------------------- *END* -----------------------------------------//


//------------------------------------------- removeDeviceFromUserGA ----------------------------//

exports.removeDeviceFromUserGA = async (req,res,next) => {
    if (!req.body['email']) {
        res.json({
            status: 0,
            msg: "email not received"
        });
    } else if (!req.body['dname']) {
        res.json({
            status: 0,
            msg: "device name not received"
        });
    } else if (!req.body['password']) {
        res.json({
            status: 0,
            msg: "password not recevied"
        });
    } else {
        req.body['externalName'] = req.body['dname'];
        req.body['isAssigned'] = 'Y';
        Task.getPlotDeviceNum____5(req.body, (err, res_1) => {
            if(err) return next(err);
            if (res_1.length > 0) {
                req.body['plotDeviceNum'] = res_1[0].plotDeviceNum;
                req.body['isActive'] = 'N';
                Task.select_plotdevice_update__2(req.body, (err, res_2) => {
                    if(err) return next(err);
           
                    req.body['id'] = res_1[0].deviceId;
                    req.body['isAssigned'] = 'N';
                    Task.select_deviceMaster_update__2(req.body, (err, res_3) => {
                        if(err) return next(err);
                        // req.body['externalName'] = req.body['dname'];
                        req.body['id'] = res_1[0].external_id;
                        // console.log( res_1[0].external_id)
                        req.body['isActive'] = 'N';
                        Task.select_devicenameMaster_update__3(req.body, (err, res_4) => {
                            if(err) return next(err);
                            if (res_4) {
                                res.json({
                                    status: 1,
                                    msg: req.body['dname'] + " " + "has been removed sucessfully",
                                    data: res_4
                                });
                            } else {
                                res.json({
                                    status: 0,
                                    msg: "Unfortunately, I couldn't remove the device now. Please try again later."
                                });
                            }
                        });
                    });

                });
            } else {
                res.json({
                    status: 0,
                    msg: "Either your device name or password is incorrect"
                });
            }
        });
    }
}
//------------------------------------------------------ * END * ------------------------------------------//


//------------------------------------------- startAllDevices --------------------------------------------//


exports.startAllDevices = async (req,res,next) => {
    var result = [];
    if (!req.body['email']) {
        res.json({
            status: 0,
            msg: "email not received"
        });
    } else if (!req.body['operationTimestamp']) {
        res.json({
            status: 0,
            msg: "start time not received"
        });
    } else {
        req.body['isActive'] = 'Y';
        Task.getPlotDeviceNum_6(req.body, (err, res_1) => {
            if(err) return next(err);
            if (res_1.length == 0 || !res_1) {
                res.json({
                    status: 0,
                    msg: 'No devices registered with given email id'
                });
            } else if (res_1) {
                var time = new Date(req.body['operationTimestamp']);
                var seconds = 30;
                var dateFormat = 'YYYY-MM-DD HH:mm:ss';
                var resultDate = moment(time).add(seconds, 'seconds').format(dateFormat);
                res_1.forEach(element => {

                    if (req.body['dispenseQty'] && req.body['dispenseRate']) {
                     
                        //  console.log(resultDate)
                        req.body['operationTimestamp'] = resultDate;
                        req.body['plotDeviceNum'] = element.plotDeviceNum;
                        req.body['addedBy'] = element.user_num;
                        Task.insertSchedule(req.body, (err, res_2) => {
                            if(err) return next(err);
                            result.push(res_2);
                            // // res.send(result)
                            // res.json({
                            //     message:req.body['operationTimestamp']
                            // });
                        });

                    } else {
                        req.body['dispenseQty'] = -1;
                        req.body['dispenseRate'] = -1;
                        //  req.body['operationTimestamp'] = req.body['operationTimestamp'];
                        //  req.body['operationEndTimeStamp'] = req.body['operationEndTimeStamp'];
                        req.body['plotDeviceNum'] = element.plotDeviceNum;
                        req.body['addedBy'] = element.user_num;
                        Task.insertSchedule(req.body, (err, res_3) => {
                            if(err) return next(err);
                            result.push(res_3);


                        });
                    }

                });
                if (result) {
                    res.json({
                        status: 1,
                        msg: "All devices registered with " + " " + res_1[0].email + " " + "are scheduled at" + " " + req.body['operationTimestamp'],

                    });
                } else {
                    res.json({
                        status: 0,
                        msg: "Unfortunately, I couldn't start the devices now. Please try again later. "
                    });
                }
            }
        });
    }

}
//---------------------------------------------------- *END* -------------------------------------//


//--------------------------------------------------- stopAllDevices --------------------------------//

exports.stopAllDevices = async (req,res,next) => {
    var result1 = [];
    if (!req.body['email']) {
        res.json({
            status: 0,
            msg: "email not received"
        });
    } else {
        req.body['isSentToBroker'] = 'I';
        req.body['isActive'] = 'Y';
        Task.getPlotDeviceNumSchedule_3(req.body, (err, res_1) => {
            if(err) return next(err);
            if (res_1.length == 0 || !res_1) {
                res.json({
                    status: 0,
                    msg: "No active device found"
                });
            } else if (res_1) {
                var time = new Date(req.body['operationTimestamp'] ).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                var seconds = 15;
                var dateFormat = 'YYYY-MM-DD HH:mm:ss';
               data = moment(time).add(seconds, 'seconds').format(dateFormat);
                res_1.forEach(element => {
                   
                    req.body['operationTimestamp'] = data;
                    // console.log(  req.body['operationTimestamp'])
                    req.body['operationEndTimeStamp'] = req.body['operationEndTimeStamp'];
                    req.body['dispenseQty'] = 0;
                    req.body['dispenseRate'] = 0;
                    req.body['plotDeviceNum'] = element.plotDeviceNum;
                    req.body['addedBy'] = element.user_num;
                    Task.insertSchedule(req.body, (err, res_2) => {
                        if(err) return next(err);
                        result1.push(res_2);
                    });

                });
                if (result1) {

                    res.json({
                        status: 1,
                        msg: "all active devices registered with " + " " + res_1[0].email + " " + " email id are stopped"
                    });
                } else {
                    res.json({
                        status: 1,
                        msg: "Unfortunately, I couldn't stop the devices right now. Please try again later."
                    });
                }
            }
        });
    }
}
//--------------------------------------------------- * END * --------------------------------------------------// 


//------------------------------------------------- getDeviceStatebyGA -----------------------------------------//

exports.getDeviceStatebyGA = async (req,res,next) => {
    if (!req.body['email']) {
        res.json({
            status: 0,
            msg: "email not received"
        });
    } else if (!req.body['deviceName']) {
        res.json({
            status: 0,
            msg: "deviceName not received"
        });
    } else {
        req.body['externalName'] = req.body['deviceName'];
        req.body['isActive'] = 'Y';
        Task.getPlotDeviceNum_7(req.body, (err, res_1) => {
            if(err) return next(err);
            if (res_1.length > 0) {
                req.body['deviceId'] = res_1[0].deviceId;
                Task.selectOrderBy(req.body, (err, res_2) => {
                    if(err) return next(err);
                    if (res_2) {
                        res.json({
                            status: 1,
                            responce1: req.body['deviceName'],
                            responce: res_2[0].state
                        });
                    } else {
                        res.json({
                            status: 0,
                            responce1: req.body['deviceName'],
                            responce: "not available "
                        });
                    }
                });
            } else {
                res.json({
                    status: 0,
                    msg: "sorry ! i could not find any device registered with given Name"

                });
            }

        });

    }
}
//---------------------------------------------------- * END * -----------------------------------------------//

//---------------------------------------------- getDeviceState -----------------------------------------------//

exports.getDevicestate = async(req,res,next)=>{
    if(!req.body['android_token']){
        res.json({
            status:10,
            msg:"token is requried"
        });
    }else{
        Task.CheckUser(req.body,(err,res_1)=>{
            if(err) return next(err);
              if(res_1.length == 0 || !res_1){
                  res.json({
                      status:10,
                      msg:"token is expired"
                  });
              }
              else if(!req.body['deviceId']){
                    res.json({
                        status:0,
                        msg:"deviceId are required"
                    }); 
                  
              }else{
                  req.body['deviceId'] = req.body['deviceId'];
                  Task.get_device_state(req.body,(err,res_2)=>{
                    if(err) return next(err);
                   object = Object.assign({},  ...res_2);
                   var v = object.value;
                    object.value =  JSON.parse(v) ;
                      if(res_2.length == 0 || !res_2){
                        res.json({
                            status:0,
                            msg:"failed",
                          });
                       
                      }else{
                        res.json({
                            status:1,
                            msg:"success",
                            data:object
                        });
                      }
                  });
              }
        });
    }
}
//----------------------------------------------------- * END * ----------------------------------------//


//--------- -----------------------------Add farm API ------------------------------------------------------//


//--------- Add domestic farm API ---------------//
exports.addFarm_domestic = async (req,res,next) => {
     
    if (!req.body['android_token']) {
        res.json({
            'status': 10,
            msg: 'Token Is Required'
        });
    }else {
       Task.CheckUser(req.body,(err,responce) => {
           if(err) return next(err);
               if (responce.length == 0 || !responce) {
                res.json({
                    'status': 10,
                    msg: 'Token is expired'
                });
            } else{
                req.body['userId'] = responce[0].user_num;
                var a = moment().tz(responce[0].time_zone);
                 a.format()
                 a.utc().format();
                var date = a.toISOString().slice(0, 19).replace('T', ' ');
                req.body['doa'] = date;
                req.body['noOfPlots'] = '1';
                req.body['farm_type'] = 'domestic_user';
                Task.CreateFarm(req.body,(err, res_1) => {
                    if(err) return next(err);
                    if (res_1) {
                        
                       // req.body['name'] = '1';
                        req.body['farmId'] = res_1.insertId;
                        Task.CreateFarmPlot(req.body, (err, res_2) => {
                            if(err) return next(err); 
                            if(res_2){
                                
                                res.json({
                                    status: 1,
                                    msg: 'successfully inserted data',
                                    data:res_2
                                 });
                            } else{
                                res.json({
                                    status: 0,
                                    msg: 'failed!',
                                });
                            }
                         });
                    }  
                });
           }
            
         
        });
    }
} 


//--------- Add Sigle Farm - Sigle Plot farm API ---------------//

exports.addFarm_sf_sp = async (req,res,next) => {
     
    if (!req.body['android_token']) {
        res.json({
            'status': 10,
            msg: 'Token Is Required'
        });
    }else {
       Task.CheckUser(req.body,(err,responce) => {
           if(err) return next(err);
               if (responce.length == 0 || !responce) {
                res.json({
                    'status': 10,
                    msg: 'Token is expired'
                });
            } else{
                req.body['userId'] = responce[0].user_num;
                var a = moment().tz(responce[0].time_zone);
                 a.format()
                 a.utc().format();
                var date = a.toISOString().slice(0, 19).replace('T', ' ');
                req.body['doa'] = date;
                req.body['noOfPlots'] = '1';
                req.body['farm_type'] = 'sf_sp_user';
                Task.CreateFarm(req.body,(err, res_1) => {
                    if(err) return next(err);
                    if (res_1) {
                        
                       // req.body['name'] = '1';
                        req.body['farmId'] = res_1.insertId;
                        Task.CreateFarmPlot(req.body, (err, res_2) => {
                            if(err) return next(err);
                            if(res_2){
                                
                                res.json({
                                    status: 1,
                                    msg: 'successfully inserted data',
                                    data:res_2
                                 });
                            } else{
                                res.json({
                                    status: 0,
                                    msg: 'failed!',
                                });
                            }
                         });
                    } 
                });
           }
            
         
        });
    }
}


//--------- Add Sigle Farm - Multi Plot farm API ---------------//
var i; 
exports.addFarm_sf_mp = async (req,res,next) => {
     
    if (!req.body['android_token']) {
        res.json({
            'status': 10,
            msg: 'Token Is Required'
        });
    }else {
       Task.CheckUser(req.body,(err,responce) => {
           if(err) return next(err);
               if (responce.length == 0 || !responce) {
                res.json({
                    'status': 10,
                    msg: 'Token is expired'
                });
            } else{
                req.body['userId'] = responce[0].user_num;
                var a = moment().tz(responce[0].time_zone);
                 a.format()
                 a.utc().format();
                var date = a.toISOString().slice(0, 19).replace('T', ' ');
                req.body['doa'] = date;
                
                req.body['farm_type'] = 'sf_mp_user';
                Task.CreateFarm(req.body,(err, res_1) => {
                    if(err) return next(err);
                    if (res_1) {
                        
                        //req.body['name'] = '1';
                        req.body['farmId'] = res_1.insertId;
                        var id=res_1.insertId;
                        console.log(id);
                        var plot=req.body.noOfPlots;
                        console.log(plot);
                       
                       
                    for(i=1;i<=plot;i++)
                    {  
                        Task.CreateFarmPlot(req.body, (err, res_2) => {
                            if(err) return next(err);
                            if(res_2){
                                
                                res.json({
                                    status: 1,
                                    msg: 'successfully inserted data',
                                    data:res_2
                                    
                                 }); 
                                 
                            } else{
                                res.json({
                                    status: 0,
                                    msg: 'failed!',
                                });
                            }
                         }); 
                    } 
                   //for loop end
                    } 
                });
           }
            
         
        });
    }
}

//------------------------------------- Check Api for their exist a Farm or not -----------------------//

exports.checkuser_farm = async (req,res,next) => {
     
    if (!req.body['android_token']) {
        res.json({
            'status': 10,
            msg: 'Token Is Required'
        });
    }else {
       Task.CheckUser(req.body,(err,responce) => {
           if(err) return next(err);
               if (responce.length == 0 || !responce) {
                res.json({
                    'status': 10,
                    msg: 'Token is expired'
                });
            } 
            else {
                req.body['userId'] = responce[0].user_num;
                
                Task.fetchFarmid(req.body,(err,res_2) =>{
                   
                    if(err) return next(err);
                    if(res_2.length!=0){ 
                        console.log(res_2);
                        res.json({
                            status: 1,
                            msg: 'Farm exist',
                            data:res_2
                         });
                    } else{
                        res.json({
                            status: 0,
                            msg: 'Farm does not exists!',
                            data:[] 
                        });
                    }
                });
                
                    
                        
                        /*req.body['farmId'] = res_1.insertId;
                        Task.CreateFarmPlot(req.body, (err, res_2) => {
                            if(err) return next(err);
                            if(res_2){
                                
                                res.json({
                                    status: 1,
                                    msg: 'successfully inserted data',
                                    data:res_2
                                 });
                            } else{
                                res.json({
                                    status: 0,
                                    msg: 'failed!',
                                });
                            }
                         });*/
                    
                
           }
            
         
        });
    }
}
