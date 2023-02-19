const User = require('../models/userModel')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")              //this package(npm install jsonwebtoken) will help us generate tokens.A token is what tells the frontend if a user is authenticated or not so we can do something with that info

const createToken = (id) => {                   // we are creating a function so we can reuse it elsewhere(ie login_user controller and signup user contoller). we take in an argument id cus we will grab it from the req body when we call the fuction and and a user is assigned an id(we just called it id here)
    return jwt.sign({ _id: id }, process.env.SECRET, { expiresIn: "3d" })    //.sign is a method of jsonwebtoken used to create and asign a token. we pass in 3 arguments. first is the id to identify a user, second is a secret string that will be only known to the server and we put that in an env file. third argument can be an option and we use the expiresIn option that is to say it will expire in 3days
}                                                                         // and we need to return it so when we call it, it will return a token for us


//sign-up user
const singnup_user = async (req, res) => {
    const { email, password } = req.body            //grabbing email and password from the request body

    try {
        const user = await User.signup(email, password)                    //using the custom method we created and we put in the arguments we passsed in so it will be able to communicate with the request body and the the custom method
        const token = createToken(user._id)                              // we called the function here and passed in the user id we get from the request
        res.status(200).json({ email, token })                                             //so if we don't get an err, we have a user cus we returned it so chose to pass the email and token to the browser . so that token is what we can use to  tell the browser that a user has be authenticated
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}


//login user
const login_user = async (req, res) => {  
    const { email, password } = req.body

    try {
        const user = await User.login(email, password)    //the user we returned is stored here so we have assces to it

        const token = createToken(user._id)              //when we get a user we create a token and we store that inside the token const
        res.status(200).json({ email, token })                        
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }

}

module.exports = { singnup_user, login_user }
















//this is the method we go with if we didn't want to use the the custom method
// const singnup_user = async (req, res) => {
//     const { email, password } = req.body            //grabbing email and password from the request body
//     const exist = await User.findOne({ email })
//     if (exist) {
//         return res.status(400).send("already in use")  //we return this so it will not continue with the rest of the code and break
//     }
//     const salt = await bcrypt.genSalt(10)
//     const hash = await bcrypt.hash(password, salt)
//     try {
//         const user = await User.create({ email, password: hash })
//         res.status(200).json({ email, user })
//     } catch (error) {
//         res.status(400).json({ error: error.message })
//     }
// }