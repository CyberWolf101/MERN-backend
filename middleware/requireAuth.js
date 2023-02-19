//to require authentication
//if we want to protect these routes in a way that only authenticated users can acccess them we use middleware to check if the request came loaded with the json web token for that user so it will fire for every route.
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")
const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers                             //we want to grab the authorization property from the request headers cus it usually contain the web tokens
    if (!authorization) {                                             //incase we don't have a value
        return res.status(401).json({ error: "Authorization token required" })
    }
    const token = authorization.split(' ')[1]                     //we want to get the token from the authorization which usually look like thie "Bearerjio4jog5j4tju54hy" so basically Bearer + the token. but we only want the token so we use the split method which will split it to an array so we can use the second part of it [1] and not [0]

    try {                                                         //so we want to try to verify the token here to make sure it's legit using jwt
    const { _id } = jwt.verify(token, process.env.SECRET)        //in the process of asking jwt to verify the token  pass in the const token and the secret. ps we are just grabbing the id property and storing ot in req.user so that when we go on to the next middleware(i.e the routes) we will have that id available to us cus this moddleware will run first  (ps this id is present in the db) . 
        req.user = await User.findOne({ _id }).select("_id")         // creating a custom request method and setting it to the _id property after verifying. The .user we attached to it can be called it anything actually cus we are creating our own method. the reason for this will ultimately be to assign a single user to a particular workout when it is created to that we can filter by the user id when rendering. So in essence, before the user have access to the routes, a user must have been identified already
        //we say select cus we want to get the id property in the response else we'll get the email and password
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: "Request not authorized" })
    }
//the last process and the _id destructuring in the try block is for for the workout controller when we try to find a user workouts by id
}
module.exports = requireAuth;