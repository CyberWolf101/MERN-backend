const Workout = require("../models/WorkoutModel")
const mongoose = require("mongoose")

// all workouts
const all_workouts = (req, res) => {
    const user_id = req.user._id                      //we created a custom request method which will run before the routes controllers(it has the _id property) and we are now storing it in the user_id const
    Workout.find({user_id}).sort({ createdAt: -1 })  //now we are finding only workouts based on the user id
        .then((result) => {
            res.status(200).json(result)
        }).catch((error) => {
            res.status(404).json({ error: error.message })  //We usually set error as the key in case we want to destructure with the dot notation in the frontend(e.g response.error)
        })
}

// get single workout
const single_workout = (req, res) => {
    const id = req.params.id
    Workout.findById(id)
        .then((result) => {
            res.status(200).json(result)
        }).catch((error) => {
            return res.status(404).json({ error: "could not find" })
        })
}

const testing = async (req, res) => {          // "testing = async ()" just reads tesing is equal to an async function :)
    const { id } = req.params
    const result = await Workout.findById(id)
    if (!result) {
        return res.status(404).json("not found")   //ALWAYS RETURN THESE ERRORS. cus if you don't, it will carry on the rest of the code  and we don't want that if there is an error
    } else {
        res.status(200).send(result)
    }
}

//add workout
const ad_workout = (req, res) => {
    const { title, load, reps } = req.body
    const workout = new Workout(req.body)
    workout.save()                       //we did not have to save when using thev.create method
        .then((result) => {
            res.status(200).json(result) //we need to set response status so the front end can detect any error
        }).catch((error) => {
            res.status(400).json({ error: error.message })
        })
}

//this works thesame way too
const add_workout = async (req, res) => {
    const user_id = req.user._id                    //we created a custom request method and we are now storing it in the user_id const
    const { title, load, reps } = req.body          //setting the req.body property to match our front end post request

    const emptyFields = []                          //we did this error handling here because we want to execute everything when that button is clicked
    if (!title) {
        emptyFields.push("title")               //so what we are basically implying here is that if the following are empty (title, load, reps) then we want to push something to that empty array
    }                                           //so that ultimately in the frontend, we can conditionally style it base on what is in that array
    if (!load) {
        emptyFields.push("load")
    }
    if (!reps) {

        emptyFields.push("reps")
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: "Please fill in all input spaces", emptyFields })         //and this line is saying if the length of the array is greater than 0 that just means atleast 1 of the fields has not been filled
    }                                                                                               //we don't want to go any further so we just return an error Note the return statement in important and we also passed in the emptyFileds var(which will be an aarray of all the fields that need filling) so we can use it in the front end

    try {                                            //we use this so the app wouldn't crash (i learnt that one the hard way) 
        const workout = await Workout.create({ title, load, reps,user_id }) //another method, instead of saying new Workout, we say .create({}) and pass in the objects that represents the new doc we want to create
        res.status(200).json(workout)                                        //we stored everything in workout so that's what we want to send back
    } catch (error) {
        res.status(400).json({ error: error.message })                  //send back an error in form of json too//this error is a constant like this and is always important don't add ur own text, if u want to do that use  the front end
    }
}




//delete workout
const delete_workout = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such workout" })
    }
    const workout = await Workout.findOneAndDelete({ _id: id })

    if (!workout) {
        return res.status(400).json({ error: "No such workout" })
    }
    await res.status(200).json(workout)
}

const deleteAworkout = async (req, res) => {
    const id = req.params.id                          //storing the id we grab from the request in the id const
    await Workout.findByIdAndRemove(id).exec()        //this removeby id plus .exec is a game changer
    res.status(200).json("deleted")
}


// update workout
const update_workout = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such workout" })
    }
    const workout = await Workout.findOneAndUpdate({ _id: id }, {      //since we are updating,we have two arguments, the first on is which doc we want to update and the second one is an object that represents the changes we want to make
        ...req.body                                                     //the way we get the properties we send is by using request.body and we have to spread it with "..." because it is an object
    })
    if (!workout) {
        return res.status(400).json({ error: "No such workout" })
    }
    res.status(200).json(workout)
}


module.exports = {
    all_workouts,
    single_workout,
    testing,              //testing does thesame thing as singleworkouts, we are just using the async method now
    add_workout,
    delete_workout,
    deleteAworkout,
    update_workout
}