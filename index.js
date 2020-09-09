var createError = require('http-errors');
const express = require('express');
const bodeParser = require('body-parser');
var corsMiddleware = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger_croprigate..json');
const {connection} = require('./models/db');
var {checkToken} = require('./controller/api');
const port = process.env.PORT || 3000;
// process.env.SECRET_KEY="thisismysecretkey";

const app = express();

//  //cors()
// app.use(cors());
//CORS middleware
var corsMiddleware = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); //replace localhost with actual host
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');
   next();
}

app.use(corsMiddleware);


//Swagger 
app.use("/api-docs",swaggerUi.serve, swaggerUi.setup(swaggerDoc));

//use body-parser to help data parse in json 
app.use(bodeParser.urlencoded({ extended: true }));
app.use(bodeParser.json());
bodyParser = {
  json: {limit: '50mb', extended: true},
  urlencoded: {limit: '50mb', extended: true}
};



//Routes
var routes = require('./routes/android_farm.router'); //importing route
routes(app);
var router = require('./routes/android_user.router'); //importing route
router(app);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
 res.json({
   status:0,
   message:"Oops Something Went Wrong !",
   responce:err.message
   });
  });



// Create server
app.listen(port,(err,res)=>{
    if(err) throw err;
    console.log('server connected on port : ' + `${port}`);
});



