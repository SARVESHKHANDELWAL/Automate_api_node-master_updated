const {body} =  require ('express-validator');


exports.userValidation = ()=>{
    return [body('mobile','mobile is required').isNumeric(),body('password','password is required').isAlphanumeric().isLength({min:8,max:20}).withMessage('Password should not be empty, minimum eight characters, at least one letter, one number and one special characte')]
}
exports.emailValidation = ()=>{
     return [body('email','email is required').isEmail(),body('password','password is required').isAlphanumeric().isLength({min:8,max:20}).withMessage('Password should not be empty, minimum eight characters, at least one letter, one number and one special characte')]
 }
 exports.passwordValidation = ()=>{
     return [body("password", "password is not matching").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")]
 }