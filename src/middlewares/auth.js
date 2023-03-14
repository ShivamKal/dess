const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { http } = require("winston");


/**
 * Custom callback function implementation to verify callback from passport
 * - If authentication failed, reject the promise and send back an ApiError object with
 * --- Response status code - "401 Unauthorized"
 * --- Message - "Please authenticate"
 *
 * - If authentication succeeded,
 * --- set the `req.user` property as the user object corresponding to the authenticated token
 * --- resolve the promise
 */
const verifyCallback = (req, resolve, reject) => async (err, user, info) => {  
  const idFromParam=req.params.id

  if(user){
    if(idFromParam){
      if(user._id.toString()!==idFromParam){
        reject(new ApiError(httpStatus.FORBIDDEN))
      }
    }
    req.user=user
    resolve()
  }else{
    reject(new ApiError(httpStatus.UNAUTHORIZED))
  }

};  

/**
 * Auth middleware to authenticate using Passport "jwt" strategy with sessions disabled and a custom callback function
 * 
 */
const auth = async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate("jwt",{ session: false },verifyCallback(req, resolve, reject))(req, res, next);
  })
    .then(() => next())
    .catch((err) => {
      next(err)
    });
};

module.exports = auth;