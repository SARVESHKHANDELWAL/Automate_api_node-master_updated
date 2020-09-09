var conn = require('../models/db');
const moment = require('../node_modules/moment-timezone');
const {
    verify
} = require('jsonwebtoken');



//Interface
var Task = function(task) {
    this.userId = task.userId;
    this.android_token = task.android_token;

}


Task.getAllUser = function(result) {
    conn.query("Select * from user", function(err, res) {
        if (err) {
         console.error('somthing went wrong');
        } else {
           result(null, res);
        }
    });
}; 






Task.CheckUser = function(userdetails, result) {
    conn.query("Select * from  user where id=? AND android_token = ? ", [userdetails.userId, userdetails.android_token], function(err,res) {
        if (err) {
            result(err);
        } else {
             result(null,res);
        }
    });

}


Task.CreateFarm = function(farms, result) {
    
    conn.query("INSERT INTO farm (doa,name,userId,noOfPlots,area,farm_type) VALUES ('" + farms.doa + "','" + farms.name + "','" + farms.userId + "','" + farms.noOfPlots + "','" + farms.area + "','" + farms.farm_type+"')", function(err, res) {
        if (err) {
            result(err);
        } else {
            
            result(null, res);
           
        }
    }); 
} 



Task.CreateFarmPlot = function(polt, result) {
    conn.query("Insert into  farmPlot (name,farmId,area) VALUES ('" + polt.name + "','" + polt.farmId + "','" + polt.area + "')", function(err, res) {
        if (err) {
            result(err);
        } else {  
            result(null,res);   
        } 
    }); 
}; 


Task.UpdateFarm = function(udtFarm, result) {
    // var a = moment().tz("Asia/Kolkata");
    // a.format()
    // a.utc().format();
    // var date = new Date(a).toISOString().replace(/T/, ' ').replace(/\..+/, '');

    conn.query('UPDATE farm SET noOfPlots = ?, doa = ?  WHERE id = ?', [udtFarm.noOfPlots, udtFarm.doa, udtFarm.id], function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);

        }
    });
}



Task.addDeviceName = function(adDevice, result) {
    conn.query("Insert into deviceNameMaster (externalName,farmId,addedBy,isActive) VALUES ('" + adDevice.externalName + "','" + adDevice.farmId + "','" + adDevice.addedBy + "','" + adDevice.isActive + "')", function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);

        }
    });
}








Task.CheckPlotDevice = function(plotD, result) {

    conn.query("Select * from deviceMaster where number = ? AND password = ? AND isAssigned = ? ", [plotD.number, plotD.password, plotD.isAssigned], function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
        }
    });
}


Task.getMaxdevice_num = function(max, result) {
    conn.query("Select * from plotDevice ORDER BY plotDeviceNum DESC LIMIT 1", [max.plotDeviceNum], function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
        }
    });
}



Task.addPlot_Device = function(Pltdevice, result) {
    // var a = moment().tz("Asia/Kolkata");
    // a.format()
    // a.utc().format();
    // var date = new Date(a).toISOString().replace(/T/, ' ').replace(/\..+/, '');
    conn.query("Insert into plotDevice (plotDeviceNum,deviceId,addOn,deviceNameMstrId,plotId,farmId,addedBy) VALUES ('" + Pltdevice.plotDeviceNum + "','" + Pltdevice.deviceId + "','" + Pltdevice.addOn + "','" + Pltdevice.deviceNameMstrId + "','" + Pltdevice.plotId + "','" + Pltdevice.farmId + "','" + Pltdevice.addedBy + "')", function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
        }
    });
}




Task.AddDevice = function(ad_device, result) {

    conn.query("Insert into deviceMaster (number,password,typeId,mfgDate,renewalDate,isActive) VALUES ('" + ad_device.number + "','" + ad_device.password + "','" + ad_device.typeId + "','" + ad_device.mfgDate + "','" + ad_device.renewalDate + "','" + ad_device.isActive + "')", function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
        }
    });
}

Task.verifyNumber_device = function(verify_device, result) {

    conn.query("Select * from deviceMaster where number = ? ",[verify_device.number], function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
           
        }
    });
}




Task.UpdatePlotDeviceMaster = function(udtPlotDeviceMstr, result) {
    conn.query('UPDATE deviceMaster SET  isAssigned = ? WHERE number = ?', [udtPlotDeviceMstr.isAssigned, udtPlotDeviceMstr.number], function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
        }
    });
}



Task.fetchFarm = function(frm_id,result) {
    conn.query("Select * from farm where userId = ? ", [frm_id.userID], function(err, res) {
        if (err) {
            result(err);
        } else {
        
         result(null, res);
        
        }
    });
};


Task.fetchFarmid = function(frm_id,result) {
    conn.query("Select * from farm where userId = ? ", [frm_id.userId], function(err, res) {
        if (err) {
            result(err);
        } else {
        
         result(null, res);
        
        }
    });
};



Task.fetchFarmplot = function(frmplot_id, result) {
    conn.query("Select id as plotid,name,area,isCalAssigned from farmPlot where farmId = ? ", frmplot_id.farmId, function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);

        }
    });
};



Task.getDeviceName = function(getDevice_name, result) {
    conn.query("Select * from deviceNameMaster where farmId = ? ",[getDevice_name.farmId], function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);

        }
    });
};


Task.getPlotDevice = function(getPlot_Device, result) {
    conn.query("SELECT typeId,plotDeviceNum,externalName,deviceNameMstrId,deviceId FROM plotDevice INNER JOIN deviceNameMaster ON plotDevice.deviceNameMstrId = deviceNameMaster.id LEFT JOIN deviceMaster ON  plotDevice.deviceNameMstrId = deviceMaster.id where plotDevice.plotId = ? AND plotDevice.farmId = ? AND plotDevice.isActive = ? ", [getPlot_Device.plotId,getPlot_Device.farmId,getPlot_Device.isActive], function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);

        }
    });
};

Task.get_plot = function(getPlot_Device, result) {
    conn.query("SELECT typeId,plotDeviceNum,externalName,deviceNameMstrId,deviceId FROM plotDevice INNER JOIN deviceNameMaster ON plotDevice.deviceNameMstrId = deviceNameMaster.id LEFT JOIN deviceMaster ON  plotDevice.deviceNameMstrId = deviceMaster.id where plotDevice.plotId = ? AND plotDevice.isActive = ? ", [getPlot_Device.plotId,getPlot_Device.isActive], function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);

        }
    });
};

Task.getFarm_Devices = function(getFarm_Device, result) {
    conn.query("SELECT typeId,plotDeviceNum,externalName,deviceNameMstrId,deviceId FROM plotDevice INNER JOIN deviceNameMaster ON plotDevice.deviceNameMstrId = deviceNameMaster.id LEFT JOIN deviceMaster ON  plotDevice.deviceNameMstrId = deviceMaster.id where plotDevice.plotId = ? AND plotDevice.farmId = ? AND plotDevice.isActive = ?", [getFarm_Device.plotId,getFarm_Device.farmId,getFarm_Device.isActive], function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);

        }
    });
};

Task.getFarm_Plot_Devices = function(gt,result){
    conn.query('Select * from farmPlot where farmId = ? ',[gt.farmId],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}

Task.PlotAreaID = function(slct, result) {
    conn.query('Select id from farmPlot  WHERE id = ?', [slct.id], function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
        }
    });
}


Task.UpdatePlotArea = function(udtPlotarea, result) {
    conn.query('UPDATE farmPlot SET  area = ? WHERE id = ?', [udtPlotarea.area, udtPlotarea.id], function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
        }
    });
}

//---------------------------------------- Update Plot And Farm Devices ------------------------------//

Task.fetch_plotD_1 = function(fetch_plotD, result){
    conn.query("Select * from plotDevice where PlotId=? AND plotDeviceNum = ? AND isActive ='Y' ", [fetch_plotD.plotId, fetch_plotD.plotDeviceNum, fetch_plotD.isActive], function(err, res) {
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}
Task.fetch_farmD_1 = function(fetch_plotD, result){
    conn.query("Select * from plotDevice where farmId=? AND plotDeviceNum = ? AND isActive ='Y' ", [fetch_plotD.farmId, fetch_plotD.plotDeviceNum, fetch_plotD.isActive], function(err, res) {
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}
Task.fetch_plotD_2 = function(fetch_plotD, result){
    conn.query("UPDATE plotDevice SET  isActive = ? WHERE PlotId = ? AND plotDeviceNum = ?", [fetch_plotD.isActive, fetch_plotD.plotId, fetch_plotD.plotDeviceNum], function(err, res) {
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}

Task.fetch_farmD_2 = function(fetch_plotD, result){
    conn.query("UPDATE plotDevice SET  isActive = ? WHERE farmId = ? AND plotDeviceNum = ?", [fetch_plotD.isActive, fetch_plotD.farmId, fetch_plotD.plotDeviceNum], function(err, res) {
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}
Task.fetch_plotD_3 = function(fetch_plotD, result){
    conn.query("Select plotDeviceNum,deviceId,plotId,deviceNameMstrId,addOn,isActive,addedBy,locationLat,locationLong,farmId from plotDevice where plotDeviceId = ? ", [fetch_plotD.plotDeviceId], function(err, res) {
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}

Task.fetch_plotD_4 = function(fetch_plotD, result){
    conn.query("Insert into plotDevice (plotDeviceNum,deviceId,plotId,deviceNameMstrId,isActive,addedBy,locationLat,locationLong,farmId,addOn) VALUES ('" + fetch_plotD.plotDeviceNum + "','" + fetch_plotD.deviceId + "','" + fetch_plotD.plotId + "','" + fetch_plotD.deviceNameMstrId + "','" + fetch_plotD.isActive + "','" + fetch_plotD.addedBy + "','" + fetch_plotD.locationLat + "','" + fetch_plotD.locationLong + "','" + fetch_plotD.farmId + "','" + fetch_plotD.addOn + "') ", function(err, res) {
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}

Task.fetch_plotD_5 = function(fetch_plotD,result){
conn.query("UPDATE plotDevice SET isActive = ?, addOn = ?, deviceId = ? , deviceNameMstrId = ?  WHERE plotDeviceId = ? AND plotDeviceNum = ?", [fetch_plotD.isActive,fetch_plotD.addOn,fetch_plotD.deviceId, fetch_plotD.deviceNameMstrId,fetch_plotD.plotDeviceId,fetch_plotD.plotDeviceNum], function(err, res) {
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}

Task.NUmPAss = function(nuM,result){
    conn.query("Select * from deviceMaster where number=? AND password = ? ", [nuM.number, nuM.password], function(err, res_4) {
        if(err){
            result(err);
        }else{
            result(null,res_4);
        }
    })
}

//--------------------------------------------- * END * ------------------------------------//


Task.get_farm_plot_name = function(pastdevice_schedule, result) {
    conn.query('Select deviceMaster.typeId,farm.id as farm_id, farm.name as farmName,farmPlot.id as plot_id, farmPlot.name as plotName,plotDevice.plotDeviceNum,deviceNameMaster.externalName,deviceSchedule.dispenseRate, deviceSchedule.dispenseQty,deviceSchedule.operationTimestamp,deviceSchedule.id as sch_id,deviceSchedule.operationEndTimeStamp from farm  LEFT JOIN  farmPlot ON farmPlot.farmId = farm.id INNER JOIN plotDevice ON plotDevice.plotId = farmPlot.id LEFT JOIN deviceNameMaster ON deviceNameMaster.Id= plotDevice.deviceNameMstrId LEFT JOIN deviceSchedule ON plotDevice.plotDeviceNum=deviceSchedule.plotDeviceNum LEFT JOIN deviceMaster ON plotDevice.deviceId=deviceMaster.id where farm.userId = ? AND deviceSchedule.operationTimestamp < ? AND deviceSchedule.isActive = ? ORDER BY operationTimestamp asc', [pastdevice_schedule.userId, pastdevice_schedule.operationTimestamp, pastdevice_schedule.isActive], function(err, res) {
        if (err) {
           result(err);
        } else {
            result(null, res);
        }
    });
}




Task.get_farm_plot_name_new = function(pastdevice_schedule, result) {
    conn.query('Select farm.id as farm_id, farm.name as farmName,plotDevice.plotDeviceNum,deviceNameMaster.externalName,deviceSchedule.dispenseRate, deviceSchedule.dispenseQty,deviceSchedule.operationTimestamp,deviceSchedule.id as sch_id from farm  INNER JOIN  plotDevice ON plotDevice.FarmId = farm.id LEFT JOIN deviceNameMaster ON deviceNameMaster.Id= plotDevice.deviceNameMstrId LEFT JOIN deviceSchedule ON deviceSchedule.plotDeviceNum = plotDevice.plotDeviceNum  where farm.userId = ? AND deviceSchedule.operationTimestamp < ? AND deviceSchedule.isActive = ? ORDER BY operationTimestamp asc', [pastdevice_schedule.userId, pastdevice_schedule.operationTimestamp, pastdevice_schedule.isActive], function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
        }
    });
}




Task.get_farm_plot_name_future = function(pastdevice_schedule, result) {
    conn.query('Select deviceMaster.typeId,farm.id as farm_id, farm.name as farmName,farmPlot.id as plot_id, farmPlot.name as plotName,plotDevice.plotDeviceNum,deviceNameMaster.externalName,deviceSchedule.dispenseRate, deviceSchedule.dispenseQty,deviceSchedule.operationTimestamp,deviceSchedule.id as sch_id,deviceSchedule.operationEndTimeStamp from farm  LEFT JOIN  farmPlot ON farmPlot.farmId = farm.id INNER JOIN plotDevice ON plotDevice.plotId = farmPlot.id LEFT JOIN deviceNameMaster ON deviceNameMaster.Id= plotDevice.deviceNameMstrId LEFT JOIN deviceSchedule ON plotDevice.plotDeviceNum=deviceSchedule.plotDeviceNum LEFT JOIN deviceMaster ON plotDevice.deviceId=deviceMaster.id where farm.userId = ? AND deviceSchedule.operationTimestamp > ? AND deviceSchedule.isActive = ? ORDER BY operationTimestamp asc', [pastdevice_schedule.userId, pastdevice_schedule.operationTimestamp, pastdevice_schedule.isActive], function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
        }
    });
}



Task.get_farm_plot_name_new_future = function(pastdevice_schedule, result) {
    conn.query('Select farm.id as farm_id, farm.name as farmName,plotDevice.plotDeviceNum,deviceNameMaster.externalName,deviceSchedule.dispenseRate, deviceSchedule.dispenseQty,deviceSchedule.operationTimestamp,deviceSchedule.id as sch_id from farm  INNER JOIN  plotDevice ON plotDevice.FarmId = farm.id LEFT JOIN deviceNameMaster ON deviceNameMaster.Id= plotDevice.deviceNameMstrId LEFT JOIN deviceSchedule ON deviceSchedule.plotDeviceNum = plotDevice.plotDeviceNum  where farm.userId = ? AND deviceSchedule.operationTimestamp > ? AND deviceSchedule.isActive = ? ORDER BY operationTimestamp asc', [pastdevice_schedule.userId, pastdevice_schedule.operationTimestamp, pastdevice_schedule.isActive], function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
        }
    });
}


Task.pastDSchedule_By_PlotDeviceNum = function(pastDevice_Sch_plotDeviceNum,result){
    conn.query("Select plotDevice.*,deviceMaster.*,deviceSchedule.*,deviceSchedule.id as sch_id from  deviceSchedule INNER JOIN plotDevice ON plotDevice.plotDeviceNum = deviceSchedule.plotDeviceNum INNER JOIN deviceMaster ON deviceMaster.id = plotDevice.deviceId where deviceSchedule.operationTimestamp < ? AND deviceSchedule.isExecuted = ? AND deviceSchedule.isActive = ? AND deviceSchedule.plotDeviceNum = ?",[pastDevice_Sch_plotDeviceNum.operationTimestamp,pastDevice_Sch_plotDeviceNum.isExecuted,pastDevice_Sch_plotDeviceNum.isActive,pastDevice_Sch_plotDeviceNum.plotDeviceNum],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}


Task.futureDSchedule_By_PlotDeviceNum = function(futureDevice_Sch_plotDeviceNum,result){
    conn.query("Select plotDevice.*,deviceMaster.*,deviceSchedule.*,deviceSchedule.id as sch_id from  deviceSchedule INNER JOIN plotDevice ON plotDevice.plotDeviceNum = deviceSchedule.plotDeviceNum INNER JOIN deviceMaster ON deviceMaster.id = plotDevice.deviceId where deviceSchedule.operationTimestamp > ? AND deviceSchedule.isExecuted = ? AND deviceSchedule.isActive = ? AND deviceSchedule.plotDeviceNum = ?",[futureDevice_Sch_plotDeviceNum.operationTimestamp,futureDevice_Sch_plotDeviceNum.isExecuted,futureDevice_Sch_plotDeviceNum.isActive,futureDevice_Sch_plotDeviceNum.plotDeviceNum],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}


Task.UpdateDeviceSchedule = function(getDSch,result){
    conn.query('UPDATE deviceSchedule SET operationTimestamp = ?,dispenseQty = ?,dispenseRate = ? where plotDeviceNum = ? AND id = ?',[getDSch.operationTimestamp,getDSch.dispenseQty,getDSch.dispenseRate,getDSch.plotDeviceNum,getDSch.id],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}


// Task.registration_mobile = function(mob,result){
//     var a = moment().tz("Asia/Kolkata");
//     a.format()
//     a.utc().format();
//     var date = new Date(a).toISOString().replace(/T/, ' ').replace(/\..+/, '');
//     conn.query("Insert into user (name,mobile,password,u_id,country_code,doa,android_token,user_num) VALUES ('" + mob.name + "','" + mob.mobile + "','" + mob.password + "','" + mob.u_id + "','"+mob.country_code +"','"+date+"','"+mob.android_token +"','"+mob.user_num +"')",function(err,res){
//         if(err){
//             result(null,err);
//         }else{
//             result(null,res);
//         }
//     });
// }

// Task.getregistration_mobile = function(mob,result){
//     conn.query("Select * from user where mobile=?",[mob.mobile],function(err,res){
//         if(err){
//             result(null,err);
//         }else{
//             result(null,res);
//             }
//     });
// }

Task.getMaxUser_num = function(max,result){
    conn.query("Select user_num from user ORDER BY user_num DESC LIMIT 1",[max.user_num],function(err,res){
               if(err){
                result(err);
               }else{
                   result(null,res);
               }
    });
}

// Task.registration_email = function(email,result){
//     var a = moment().tz("Asia/Kolkata");
//     a.format()
//     a.utc().format();
//     var date = new Date(a).toISOString().replace(/T/, ' ').replace(/\..+/, '');
//     conn.query("Insert into user (name,email,password,u_id,country_code,doa,android_token,user_num) VALUES ('" + email.name + "','" + email.email + "','" + email.password + "','" + email.u_id + "','"+email.country_code +"','"+date+"','"+email.android_token +"','"+email.user_num +"')",function(err,res){
//         if(err){
//             result(null,err);
//         }else{
//             result(null,res);
//         }
//     });
// }

// Task.getregistration_email = function(email,result){
//     conn.query("Select * from user where email=?",[email.email],function(err,res){
//         if(err){
//             result(null,err);
//         }else{
//             result(null,res);
//             }
//     });
// }

Task.getDevice = function(get,result){
    conn.query("Select * from deviceMaster where deviceMaster.isActive = 'y'",[get.isActive],function(err,res){
               if(err){
                result(err);
               }else{
                   result(null,res);
               }
    });
}

Task.get_Name_Mapping_Of_Farm = function(map,result){
    conn.query("Select t1.externalName,t3.farmId,t2.number,t2.password,t3.plotId,t3.plotDeviceNum from deviceNameMaster as t1  left outer join plotDevice as t3 on t3.deviceNameMstrId = t1.id  left outer join deviceMaster as t2  on t2.id = t3.deviceId where t3.farmId = ? ",[map.farmId],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}


Task.get_Name_Mapping_Of_Plot = function(map,result){
    conn.query("Select t1.externalName,t3.farmId,t2.number,t2.password,t3.plotId,t3.plotDeviceNum from deviceNameMaster as t1  left outer join plotDevice as t3 on t3.deviceNameMstrId = t1.id  left outer join deviceMaster as t2  on t2.id = t3.deviceId where t3.plotId = ? ",[map.plotId],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}

Task.emergencyStop = function(emr,result){
  conn.query("Insert into deviceSchedule (operationTimestamp,dispenseRate,dispenseQty,plotDeviceNum,addedBy) VALUES ('"+ emr.operationTimestamp +"','"+emr.dispenseRate +"','"+emr.dispenseQty +"','"+emr.plotDeviceNum +"','"+emr.addedBy +"')",function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res)
        }
    });
}

Task.fetch_farm_device = function(frmDevice,result){
    conn.query("Select farm.id as farmId,plotDevice.plotDeviceNum,plotDevice.deviceId from farm INNER JOIN plotDevice ON plotDevice.farmId = farm.id where farm.id = ?",[frmDevice.id],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}

Task.get_device_state = function(gT,result){
    conn.query("Select * from deviceLog where deviceLog.deviceId = ? ORDER BY id DESC LIMIT 1",[gT.deviceId],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
            
        }
    });
}

Task.fetch_all_plots  = function(gT,result){
    conn.query("Select farmPlot.id as plotId,plotDevice.plotDeviceNum,plotDevice.deviceId from farmPlot INNER JOIN plotDevice ON plotDevice.plotId = farmPlot.id where  farmPlot.farmId = ?",[gT.id],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}

Task.emergencyStopOfPlotsOfUser = function(gT,result){
    conn.query("Select plotDeviceNum,deviceId from plotDevice where plotId = ?",[gT.plotId],function(err,res){
        if(err){
            result(err);

        }else{
            result(null,res);
        }
    });
}

Task.fetchPlotDeviceState = function(ftchPlot,result){
    conn.query("Select plotDevice.plotDeviceNum,deviceNameMaster.externalName,plotDevice.deviceNameMstrId,plotDevice.deviceId from plotDevice INNER JOIN deviceNameMaster ON plotDevice.deviceNameMstrId=deviceNameMaster.id where plotDevice.farmId = 0 AND plotDevice.isActive ='Y' ",[ftchPlot.plotId],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}

Task.fetchFarmDeviceState = function(ftchPlot,result){
    conn.query("Select plotDevice.plotDeviceNum,deviceNameMaster.externalName,plotDevice.deviceNameMstrId,plotDevice.deviceId from plotDevice INNER JOIN deviceNameMaster ON plotDevice.deviceNameMstrId=deviceNameMaster.id where plotDevice.plotId = 0 AND plotDevice.isActive ='Y' ",[ftchPlot.farmId],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}

Task.insertSchedule = function(a,result){
    conn.query("Insert into deviceSchedule (operationTimestamp,dispenseRate,dispenseQty,plotDeviceNum,addedBy,operationEndTimeStamp) VALUES ('"+ a.operationTimestamp +"','"+a.dispenseRate +"','"+a.dispenseQty +"','"+a.plotDeviceNum +"','"+a.addedBy +"','"+a.operationEndTimeStamp +"')",function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}


Task.start_Device = function(id,strtD,result){
     conn.query("Insert into deviceSchedule (plotDeviceNum,operationTimestamp,dispenseQty,dispenseRate) VALUES ('"+strtD.plotDeviceNum +"','"+strtD.operationTimestamp+"','"+strtD.dispenseQty+"','"+strtD.dispenseRate+"') ",[id],function(err,res){
         if(err){
            result(err);
         }else{
             result(null,res);
         }
     });
}

Task.delete_DeviceSchedule = function(dlt,result){
    conn.query("UPDATE deviceSchedule SET isActive = ? WHERE  id = ? ",[dlt.isActive,dlt.id],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}


Task.device_Master = function(plotD, result) {

    conn.query("Select * from deviceMaster where number = ? AND password = ? AND isAssigned = ?",[plotD.number,plotD.password,plotD.isAssigned], function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
        }
    });
}



//----------------------------------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------------------------------//

Task.select_deviceMaster_update = function(udt,result){
    conn.query("UPDATE deviceMaster SET isAssigned = ?",[udt.isAssigned], function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
            
        }
    });
}

Task.select_deviceMaster_update__2 = function(udt,result){
    conn.query("UPDATE deviceMaster SET isAssigned = ? where id = ? AND password = ?",[udt.isAssigned,udt.id,udt.password], function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
            
        }
    });
}
Task.select_deviceMasterupdate = function(udt,result){
    conn.query("UPDATE deviceMaster SET isAssigned = ?,isActive = ?",[udt.isAssigned,udt.isActive], function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
            
        }
    });
}


Task.select_deviceMaster_update2 = function(udt,result){
    conn.query("UPDATE deviceNameMaster SET  externalName = ? where id = ?",[udt.externalName,udt.id], function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
            
        }
    });
}


Task.select_devicenameMaster_update__3 = function(udt,result){
    conn.query("UPDATE deviceNameMaster SET  isActive = ? where externalName = ? AND id = ?",[udt.isActive,udt.externalName,udt.id], function(err,res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
            
        }
    });
}

//----------------------------------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------------------------------//


// Task.select_deviceMaster_update3 = function(udt,result){
//     conn.query("UPDATE deviceNameMaster SET  externalName = ? where id = ? AND password = ?",[udt.externalName,udt.id,udt.password], function(err, res) {
//         if (err) {
//             result(null, err);
//         } else {
//             result(null, res);
            
//         }
//     });
// }
//----------------------------------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------------------------------//

Task.select_plotdevice_update = function(udt,result){
    conn.query("UPDATE plotDevice SET isActive = ? where plotDeviceId = ?",[udt.isActive,udt.plotDeviceId], function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
            
        }
    });
}
Task.select_plotdevice_update__2 = function(udt,result){
    conn.query("UPDATE plotDevice SET isActive = ? where plotDeviceNum = ?",[udt.isActive,udt.plotDeviceNum], function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
            
        }
    });
}

//----------------------------------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------------------------------//
// Task.select_deviceMaster_update2 = function(udt,result){
//     conn.query("UPDATE deviceMaster SET isAssigned = ? AND isActive = 'Y",[udt.isAssigned,udt.isActive], function(err, res) {
//         if (err) {
//             result(null, err);
//         } else {
//             result(null, res);
            
//         }
//     });
// }


Task.selectUser = function(src,result){
    conn.query("select * from user where email = ?",[src.email], function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
            
        }
    });
}


Task.insertDeviceNameMaster  = function(insrt ,result){
    conn.query("Insert into deviceNameMaster (externalName,farmId) VALUES ('"+insrt.dname+"','"+insrt.farmId +"')",function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}

Task.getLastUserId = function(gt,result){
    conn.query("Select * from plotDevice ORDER BY plotDeviceNum DESC",[gt.plotDeviceNum],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}
//for maximum number 
Task.getLastUserId_1 = function(gt,result){
    conn.query("Select * from user ORDER BY user_num DESC",[gt.user_num],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}

Task.insertPlot_Device = function(Pltdevice, result) {
   
    conn.query("Insert into plotDevice (plotDeviceNum,deviceId,deviceNameMstrId,plotId,farmId,addedBy) VALUES ('" + Pltdevice.plotDeviceNum + "','" + Pltdevice.deviceId + "','" + Pltdevice.deviceNameMstrId + "','" + Pltdevice.plotId + "','" + Pltdevice.farmId + "','" + Pltdevice.addedBy + "')", function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
        }
    });
}

Task.insertUser = function(insrtUser,result){
    conn.query("Insert into user (u_id,user_num,email) VALUES ('"+insrtUser.u_id +"','"+insrtUser.user_num +"','"+insrtUser.email +"')",function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}


Task.CreateFarm1 = function(farms, result) {
  
    conn.query("Insert into  farm (name,area,userId) VALUES ('" + farms.name + "','" + farms.area + "','" + farms.userId + "')", function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
        }
    });
}



Task.addDeviceName_1 = function(adDevice, result) {
    conn.query("Insert into deviceNameMaster (externalName,farmId,addedBy) VALUES ('" + adDevice.externalName + "','" + adDevice.farmId + "','" + adDevice.addedBy + "')", function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);

        }
    });
}

//-----------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------//
Task.getPlotDeviceNum2 = function(gT,result){
    conn.query("Select plotDevice.*,deviceMaster.*,dnm.*,farm.id as farm_id,farmPlot.id as plotId,user.*,dnm.id as external_id,dnm.externalName as Dn from user INNER JOIN farm ON farm.userId=user.user_num INNER JOIN farmPlot ON farmPlot.farmId=farm.id LEFT JOIN deviceNameMaster as dnm ON dnm.farmId=farm.id && dnm.isActive='Y' LEFT JOIN plotDevice ON plotDevice.plotId=farmPlot.id && plotDevice.isActive='Y' LEFT JOIN deviceMaster ON deviceMaster.id=plotDevice.deviceId where user.email = ?",[gT.email],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res)
        }
    });
}
Task.getPlotDeviceNum_7 = function(gT,result){
    conn.query("Select plotDevice.*, deviceMaster.*,dnm.*,farm.id as farm_id,farmPlot.id as plotId,user.*,dnm.id as external_id,dnm.externalName as Dn from user INNER JOIN farm ON farm.userId=user.user_num INNER JOIN farmPlot ON farmPlot.farmId=farm.id LEFT JOIN deviceNameMaster as dnm ON dnm.farmId=farm.id && dnm.isActive='Y' LEFT JOIN plotDevice ON plotDevice.plotId=farmPlot.id && plotDevice.isActive='Y' LEFT JOIN deviceMaster ON deviceMaster.id=plotDevice.deviceId where user.email = ? AND dnm.externalName = ? AND plotDevice.isActive = ? ",[gT.email,gT.externalName,gT.isActive],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res)
        }
    });
}

Task.getPlotDeviceNum_6 = function(gT,result){
    conn.query("Select plotDevice.*, deviceMaster.*,dnm.*,farm.id as farm_id,farmPlot.id as plotId,user.*,dnm.id as external_id,dnm.externalName as Dn from user INNER JOIN farm ON farm.userId=user.user_num INNER JOIN farmPlot ON farmPlot.farmId=farm.id LEFT JOIN deviceNameMaster as dnm ON dnm.farmId=farm.id && dnm.isActive='Y' LEFT JOIN plotDevice ON plotDevice.plotId=farmPlot.id && plotDevice.isActive='Y' LEFT JOIN deviceMaster ON deviceMaster.id=plotDevice.deviceId where user.email = ? AND plotDevice.isActive = ?",[gT.email,gT.isActive],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res)
        }
    });
}

Task.getPlotDeviceNum____5 = function(gT,result){
    conn.query("Select plotDevice.*,deviceMaster.*,dnm.*,farm.id as farm_id,farmPlot.id as plotId,user.*,dnm.id as external_id,dnm.externalName as Dn from user INNER JOIN farm ON farm.userId=user.user_num INNER JOIN farmPlot ON farmPlot.farmId=farm.id LEFT JOIN deviceNameMaster as dnm ON dnm.farmId=farm.id && dnm.isActive='Y' LEFT JOIN plotDevice ON plotDevice.plotId=farmPlot.id && plotDevice.isActive='Y' LEFT JOIN deviceMaster ON deviceMaster.id=plotDevice.deviceId where user.email = ? AND dnm.externalName = ?  AND deviceMaster.isAssigned = ? AND deviceMaster.password = ? ",[gT.email,gT.externalName,gT.isAssigned,gT.password],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res)
        }
    });
}

Task.getPlotDeviceNum = function(Gt,result){
    conn.query("Select deviceMaster.*,dnm.*,farm.id as farm_id,farmPlot.id as plotId,plotDevice.*,user.*,dnm.id as external_id from user INNER JOIN farm ON farm.userId=user.user_num INNER JOIN farmPlot ON farmPlot.farmId=farm.id LEFT JOIN deviceNameMaster as dnm ON dnm.farmId=farm.id && dnm.isActive='Y' LEFT JOIN plotDevice ON plotDevice.deviceNameMstrId=dnm.id && plotDevice.isActive='Y' LEFT JOIN deviceMaster ON deviceMaster.id=plotDevice.deviceId where user.email = ? AND plotDevice.isActive = ? ",[Gt.email,Gt.isActive],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}

Task.getPlotDeviceNum__2 = function(Gt,result){
    conn.query("Select deviceMaster.*,dnm.*,farm.id as farm_id,farmPlot.id as plotId,plotDevice.*,user.*,dnm.id as external_id from user INNER JOIN farm ON farm.userId=user.user_num INNER JOIN farmPlot ON farmPlot.farmId=farm.id LEFT JOIN deviceNameMaster as dnm ON dnm.farmId=farm.id && dnm.isActive='Y' LEFT JOIN plotDevice ON plotDevice.deviceNameMstrId=dnm.id && plotDevice.isActive='Y' LEFT JOIN deviceMaster ON deviceMaster.id=plotDevice.deviceId where  dnm.externalName = ?",[Gt.externalName],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}


Task.getPlotDeviceNum__4 = function(Gt,result){
    conn.query("Select deviceMaster.*,dnm.*,farm.id as farm_id,farmPlot.id as plotId,plotDevice.*,user.*,dnm.id as external_id from user INNER JOIN farm ON farm.userId=user.user_num INNER JOIN farmPlot ON farmPlot.farmId=farm.id LEFT JOIN deviceNameMaster as dnm ON dnm.farmId=farm.id && dnm.isActive='Y' LEFT JOIN plotDevice ON plotDevice.deviceNameMstrId=dnm.id && plotDevice.isActive='Y' LEFT JOIN deviceMaster ON deviceMaster.id=plotDevice.deviceId where user.email = ? AND dnm.externalName = ? ",[Gt.email,Gt.externalName],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}

Task.getPlotDeviceNum_3 = function(Gt,result){
    conn.query("Select deviceMaster.*,dnm.*,farm.id as farm_id,farmPlot.id as plotId,plotDevice.*,user.*,dnm.id as external_id from user INNER JOIN farm ON farm.userId=user.user_num INNER JOIN farmPlot ON farmPlot.farmId=farm.id LEFT JOIN deviceNameMaster as dnm ON dnm.farmId=farm.id && dnm.isActive='Y' LEFT JOIN plotDevice ON plotDevice.deviceNameMstrId=dnm.id && plotDevice.isActive='Y' LEFT JOIN deviceMaster ON deviceMaster.id=plotDevice.deviceId where user.email = ? AND plotDevice.isActive = ? AND dnm.isActive =?",[ Gt.email,Gt.isActive ,Gt.isActive],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}
//-----------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------//

Task.getPlotDeviceNumSchedule = function(Gt,result){
    conn.query("Select deviceMaster.*,dnm.*,farm.id as farm_id,farmPlot.id as plotId,plotDevice.*,user.*,deviceSchedule.plotDeviceNum,dnm.id as external_id,dnm.externalName  from user INNER JOIN farm ON farm.userId=user.user_num INNER JOIN farmPlot ON farmPlot.farmId=farm.id LEFT JOIN deviceNameMaster as dnm ON dnm.farmId=farm.id LEFT JOIN plotDevice ON plotDevice.deviceNameMstrId=dnm.id LEFT JOIN deviceMaster ON deviceMaster.id = plotDevice.deviceId LEFT JOIN deviceSchedule ON deviceSchedule.plotDeviceNum = plotDevice.plotDeviceNum where user.email = ? AND deviceSchedule.isActive = ? AND deviceMaster.isActive = ? AND deviceSchedule.isSentToBroker = ? AND deviceSchedule.operationTimestamp < ? AND deviceSchedule.operationEndTimeStamp > ?",[ Gt.email,Gt.isActive ,Gt.isActive,Gt.isSentToBroker,Gt.operationTimestamp,Gt.operationEndTimeStamp],function(err,res){
        if(err){
            result(null,err);
        }else{
            result(null,res);
        }
    });
}

Task.getPlotDeviceNumSchedule_2 = function(Gt,result){
    conn.query("Select deviceMaster.*,dnm.*,farm.id as farm_id,farmPlot.id as plotId,plotDevice.*,user.*,deviceSchedule.plotDeviceNum,dnm.id as external_id,dnm.externalName  from user INNER JOIN farm ON farm.userId=user.user_num INNER JOIN farmPlot ON farmPlot.farmId=farm.id LEFT JOIN deviceNameMaster as dnm ON dnm.farmId=farm.id LEFT JOIN plotDevice ON plotDevice.deviceNameMstrId=dnm.id LEFT JOIN deviceMaster ON deviceMaster.id = plotDevice.deviceId LEFT JOIN deviceSchedule ON deviceSchedule.plotDeviceNum = plotDevice.plotDeviceNum where user.email = ? AND dnm.externalName = ?  AND deviceSchedule.isSentToBroker = ? AND deviceSchedule.operationTimestamp > ? ",[ Gt.email,Gt.externalName,Gt.isSentToBroker,Gt.operationTimestamp],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}
Task.getPlotDeviceNumSchedule_3 = function(Gt,result){
    conn.query("Select deviceMaster.*,dnm.*,farm.id as farm_id,farmPlot.id as plotId,plotDevice.*,user.*,deviceSchedule.plotDeviceNum,dnm.id as external_id,dnm.externalName  from user INNER JOIN farm ON farm.userId=user.user_num INNER JOIN farmPlot ON farmPlot.farmId=farm.id LEFT JOIN deviceNameMaster as dnm ON dnm.farmId=farm.id LEFT JOIN plotDevice ON plotDevice.deviceNameMstrId=dnm.id LEFT JOIN deviceMaster ON deviceMaster.id = plotDevice.deviceId LEFT JOIN deviceSchedule ON deviceSchedule.plotDeviceNum = plotDevice.plotDeviceNum where user.email = ? AND deviceSchedule.isSentToBroker = ?  AND plotDevice.isActive = ?",[Gt.email,Gt.isSentToBroker,Gt.isActive],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}


Task.selectOrderBy = function(scltOrder,result){
    conn.query("Select state from deviceLog where deviceId = ?  ORDER BY deviceId DESC",[scltOrder.deviceId],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}

Task.plot_1select = function(gT,result){
    conn.query("Select * from plotDevice where deviceId = ? AND plotDeviceNum = ? AND isActive = ? ",[gT.deviceId,gT.plotDeviceNum,gT.isActive],function(err,res){
        if(err){
            result(err);

        }else{
            result(null,res);
           
        }
    });
}
Task.plot_1select2 = function(gT,result){
    conn.query("Select * from plotDevice where deviceId = ?  AND isActive = ? ",[gT.deviceId,gT.isActive],function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
           
        }
    });
}

Task.device_Master2 = function(plotD,result){
    conn.query("Select * from deviceMaster where number = ? AND password = ? ",[plotD.number,plotD.password], function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
        }
    });
}


//New Updated Model Query
//add farm

/*Task.addFarm = function(farms,result){
    conn.query("INSERT INTO farm (doa,name,userId,noOfPlots,area,farm_type) VALUES ('" + farms.doa + "','" + farms.name + "','" + farms.userId + "','" + farms.noOfPlots + "','" + farms.area + "','"+ farms.farm_type + "')", function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
        }
    });
}



//create farm plot

Task.CreateFarmPlot  = function(plot,result){
    conn.query("INSERT INTO   farmPlot  (name,farmId,area) VALUES ('" + plot.name + "','" + plot.farmId + "','" + plot.area + "')", function(err, res) {
        if (err) {
            result(err);
        } else {
            result(null, res);
        }
    });
}
  */





module.exports = Task 