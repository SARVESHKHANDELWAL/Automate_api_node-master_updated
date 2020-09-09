const {verify} = require('jsonwebtoken');

module.exports = {
   
 verifyToken:(req, res,next)=>{
     // Get auth header value
     const bearerHeader = req.headers['Authorization'];
     // Check if bearer is undefined
     if(typeof bearerHeader !== 'undefined') {
       // Split at the space
       const bearer = bearerHeader.split(' ');
       // Get token from array
       const bearerToken = bearer[1];
       // Set the token
       req.token = bearerToken;
       verify(req.token,"qwe1234",(err,decode)=>{
         if(err){
           res.json({status:403,msg:"Unautenticated"})
         };
         next();
       });
    //  res.json({message:"authorization success",bearer});
       // Next middleware
      //  next();
     } else {
       // Forbidden
       res.json({message:"authorization failed"});
     }
   
   }
   
}