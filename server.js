const express = require("express");
const app = express();
const cors = require("cors")
const mongoose = require("mongoose");
const workoutRouter = require("./Routes/workouts")
const userRouter = require('./Routes/user')        //user routes
require("dotenv").config()      //so to use it, we just require it and invoke the config methof on it  (check mern-stack.txt)

mongoose.connect(process.env.DATAURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT, () => {         //since we want to keep our port number private,we say PROCESS which is a global object available to us in node and .env . whatever the environmental variable was called(port in caps)
            console.log("Data-base connected & listening on port", process.env.PORT +"...")
        });
    }).catch((err) => {
        console.log(err.message)
    })
app.use(cors())
app.set("view engine", "ejs")
app.use(express.static("public"))
//app.use(express.urlencoded({ extended: true })) //this middleware doesn't work for react

//when handling a post request or patch request, and we are sending data from the frontend,we use the middleware below to asscess the body over there. so basically it it detects a data we are sending to the server it passes it to the request object (so to get access now we say req.body in the controller file)
app.use(express.json())

//app.use((req, res, next) => {
// console.log("path:" + req.path, "method:" + req.method)
// next()
//})
//using the router imported and apply /workouts to everything

app.use("/workouts", workoutRouter)
app.use("/user", userRouter)

