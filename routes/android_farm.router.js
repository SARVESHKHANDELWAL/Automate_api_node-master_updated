 module.exports = app => {
    var router = require("express").Router();
  const routes = require("../controller/api");
  const userRoutes = require("../controller/user.api")
  const jwt = require('jsonwebtoken');
  const {
      verifyToken
  } = require("../auth/token");



  // Retrieve user details 
  router.get("/user", routes.UserDetails);

  //--------------Create Farm Route Containing Three Sub Routes-------------------------//


//------------Create Domestic Farm -----------------------//
  router.post("/addFarms_domestic",routes.addFarm_domestic);


//------------Create Sigle Farm Sigle Plot -----------------------//

router.post("/addFarms_sf_sp",routes.addFarm_sf_sp);



//------------Create Sigle Farm Multiple Plot -----------------------//

router.post("/addFarms_sf_mp",routes.addFarm_sf_mp);



//Check User Farm Exist Api
router.post("/checkuser_farm",routes.checkuser_farm);

 // create a user plot
  router.post("/addPlot",verifyToken,routes.AddUserPlot);

  // Retrieve a Farm details
  router.post("/fetchFarm",verifyToken,routes.Fetch_a_Farm);

  // Retrieve a FarmPlot details
  router.post("/getFarmPlots",verifyToken,routes.Fetch_a_FarmPlot);

  // Update a plotArea details
  router.post("/updatePlotArea",verifyToken,routes.Update_a_PlotArea);

  // add device Name
  router.post("/addDeviceName",verifyToken, routes.aDdeviceName);

  // Retrieve a device Name
  router.post("/getDeviceName",verifyToken, routes.Fetch_a_getDeviceName);

 // create a  deivce
 router.post("/addDevice",verifyToken,routes.adevice);
 
 // create a user plot deivce
 router.post("/addPlotDevice",verifyToken,routes.addPlotDevice);

  // create a user farm deivce
  router.post("/addFarmDevice",verifyToken, routes.addFarmDevice);

  // Retrieve a user plot deivce
  router.post("/getPlotDevices", verifyToken,routes.Fetch_a_getPlotDevice);

  // Retrieve a user plot deivce
  router.post("/getFarmPlotDevices",verifyToken,  routes.getFarmPlotDevices);

  // Retrieve a deivces
  router.post("/getDevice",verifyToken,  routes.getDevices);

  // Retrieve a user farm deivce
  router.post("/getFarmDevices",verifyToken, routes.Fetch_a_getFarmDevice);

  // update a user plot deivce
  router.post("/updatePlotDevice",verifyToken, routes.Update_a_Plot_Device);

 // update a user Farm deivce
  router.post("/updateFarmDevice",verifyToken, routes.Update_a_Farm_Device);

//  // user login
//   router.post("/login", routes.logIn);

  // past Device Schedule
  router.post("/pastDeviceSchedule",verifyToken, routes.past_Device_Schedule);

  //future_Device_Schedule
  router.post("/futureDeviceSchedule",verifyToken, routes.future_Device_Schedule);

  //pastDeviceScheduleBy_PlotDeviceNum
  router.post("/pastDeviceScheduleByPlotDeviceNum",verifyToken, routes.pastDeviceScheduleBy_PlotDeviceNum);

//futureDeviceScheduleBy_PlotDeviceNum
router.post("/futureDeviceScheduleByPlotDeviceNum",verifyToken,routes.futureDeviceScheduleBy_PlotDeviceNum);

//Update_Device_Schedule
router.post("/updateDeviceSchedule",verifyToken, routes.Update_Device_Schedule);

//get_NameMappingOf_Farm
router.post("/getNameMappingOfFarm",verifyToken, routes.get_NameMappingOf_Farm);

//get_NameMappingOf_plot
router.post("/getNameMappingOfPlot",verifyToken, routes.getNameMappingOf_Plot);

//emergencyStop
router.post("/emergencyStop",verifyToken, routes.emergency_Stop);

//emergencyStop_Of_All_Plots_Farms_Device_Of_Farm
router.post("/emergencyStopOfAllPlotsFarmsDeviceOfFarm",verifyToken, routes.emergencyStopOfAllPlotsFarmsDeviceOfFarm);

//emergencyStopOf_PlotsOfUser
router.post("/emergencyStopOfPlotsOfUser",verifyToken, routes.emergencyStopOf_PlotsOfUser);

//emergencyStopOfUser
router.post("/emergencyStopOfUser",verifyToken, routes.emergencyStopOfUser);

//getPlotDevicesAndState
router.post("/getPlotDevicesAndState",verifyToken, routes.getPlotDevicesAndState);

//getFarmDevicesAndState
router.post("/getFarmDevicesAndState",verifyToken, routes.getFarmDevicesAndState);


//insertSchedules
router.post("/insertSchedules",verifyToken, routes.insertSchedules);

//deleteDeviceSchedule
router.post("/deleteDeviceSchedule",verifyToken, routes.deleteDeviceSchedule);

//registerDevicewithuser
router.post("/registerDevicewithuser",verifyToken, routes.registerDevicewithuser);


//insertSchedulesByGA
router.post("/insertSchedulesByGA", routes.insertSchedulesByGA);


//viewAllDeviceByEmail
router.post("/viewAllDeviceByEmail", routes.viewAllDeviceByEmail);

//deleteDeviceOfUser
router.post("/deleteDeviceOfUser",verifyToken, routes.deleteDeviceOfUser);


//viewAllActiveDevices
router.post("/viewAllActiveDevices",verifyToken, routes.viewAllActiveDevices);


//stopSpecificDevice
router.post("/stopSpecificDevice",verifyToken, routes.stopSpecificDevice);


//renameDeviceFromUserGA
router.post("/renameDeviceFromUserGA", routes.renameDeviceFromUserGA);



//removeDeviceFromUserGA
router.post("/removeDeviceFromUserGA", routes.removeDeviceFromUserGA);



//startAllDevices
router.post("/startAllDevices",verifyToken, routes.startAllDevices);


//stopAllDevices
router.post("/stopAllDevices",verifyToken, routes.stopAllDevices);


//getDeviceStatebyGA
router.post("/getDeviceStatebyGA", routes.getDeviceStatebyGA);

//startDevice
router.get("/startDevice/:id", routes.startDevice);


//getDeviceState
router.post("/getDeviceState",verifyToken, routes.getDevicestate);



 
 

// router.post('/authenticate', verifyToken);
//main router
  app.use('/android_farm', router);
};

