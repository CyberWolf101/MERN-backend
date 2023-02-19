const mongoose = require("mongoose")
const Schema = mongoose.Schema
const workoutSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    reps: {
        type: Number,
        required: true
    },
    load: {
        type: Number,
        required: true
    },
    user_id: {
        type: String,
        required: true              //this will reflect the id of the user that adds the workout.so now all documents will have a user
    }
}, { timestamps: true })

const Workout = mongoose.model("Workout", workoutSchema);
module.exports = Workout;
