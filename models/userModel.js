const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require("bcrypt")
const validator = require("validator")            //we installed a package called validator (npm install validator)that will help us check if user email and password is valid


const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true   //to make sure we don't have thesame type of username in the db
    },
    password: {
        type: String,
        required: true
    }
})
//STATIC SIGNUP FUNCTION
//so when a user sends data(email and password), we don't want to save the password to the db in it's original form, that will be a security risk.
//and recall, when we create models with mongoose, they automatically come with methods(like .find(), .deletById). But we can make our own but we make some validations first
//the arguments will be used when calling the function
userSchema.statics.signup = async function (email, password) {     //we refernce the schema first and a method called statics then whatever name u want to give the method.NOTE we can't use arrow function with the "this" keyword
    //VALIDATIONS 
    if (!email || !password) {                           //checking if email & password have a value
        throw Error("All fields must be filled")        //we could also do all this in the controller file
    }
    if (!validator.isEmail(email)) {                         //this method checks if the value is an email and we pass in the email (the .isEmail() is a method)
        throw Error("Email is not valid!")    //we return errors so the rest of the code will not execute and cause the app to break
    }
    // if (!validator.isStrongPassword(password)) {                      //isStrongPassword is also a method all coming from the vallidator package we installed
    //     throw Error("Password must cosist of atleast 8 characters, an uppercase letter, a number and atleast one special character(!#$*%)")
    // }//Note, so far as you install validator, it will do this jobs but we just want to send a better error messsage

    if (password.length < 8){
        throw Error("Password must contain atleast 8 characters")
    }
    //Code to run after validation
    const exists = await this.findOne({ email })
    if (exists) {                                         //checking if the email exist already,i know it's already done in the schema but we want to send back a custom err response.
        throw Error("email already in use!")            //so if the const above(exists) has a value, we throw error cus we cant say res.send
    }                                                   //so at this point everything is okay and we want to save the email and password to the db. we install a package called bcrypt (npm install bcrypt) so our password can be save in an hash(#) format
    const salt = await bcrypt.genSalt(10)              //using salt enables identicall passwords to have differnt hashing sequences..and it prevents password matching by hackers. the value we passed is the password length. the longer it is, the harder it is to crack.
    const hash = await bcrypt.hash(password, salt)    //this takes in two arguments first is the pain text password the user wants to use to sign up and the second on is the salt value

    const user = await this.create({ email, password: hash })  //so we write an instance to create an email and password and we set the pwrd to the hash const so that it can combine the pwrd and salt . so we store everything the user const so we can use it has a custom method
    return user;                                                 //cus we are going to call it from elsewhere and we want it to return th+e user
}//we could do all this inside the sign up controller too but since we use the "this" method, we can refer to this model



// STATIC LOGIN FUNCTION
userSchema.statics.login = async function (email, password) {  //to compare the password, we have to use bycrypt again cus everything is hashed
    if (!email || !password) {                           //checking if email & password have a value
        throw Error("All fields must be filled")        //we could also do all this in the controller file
    }
    const user = await this.findOne({ email })
    if (!user) {                                     //IF we can't find a user based on the email in the db                  
        throw Error("Incorrect email")
    }                                                         //when the user passes the first if check then at this point we want to try to match the password. so we use a method in bycrypt called compare
    const match = await bcrypt.compare(password, user.password)       //so we pass in 2 arguments the password (plain text) and the HASHED password "user.password"(cus the password property is on the user document cus recall it was equal to this.findOne and the this refers to this model)
    if (!match) {                                           //when the user passes the first if check for the email we also do one for the password
        throw Error("Incorrect password")
    }
    return user                                        //so if all the checks are passed, there is a match and we can do what we want with the user
}







const User = mongoose.model("user", userSchema)
module.exports = User;
