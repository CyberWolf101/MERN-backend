//so this file is for all the workouts and for the fact we don't have ascess to the app. handler, we use the express router
//so apparently we can't use the sandbox method here, we have to use post man if we want to text anything
const express = require("express")
const router = express.Router()
const { all_workouts, single_workout, testing,
    add_workout, delete_workout, deleteAworkout,
    update_workout } = require("../controllers/workoutControllers")
// const controller = require("../controller/controllers")  //we could use this if we wanted and just say "controller.all_workouts" and it'll work. but here we are destructuring
const requireAuth = require("../middleware/requireAuth")

// we want to protect these routes in a way that only authenticated users can acccess them so we use our custom middleware to check if the request came loaded with the json web token for that user so it will fire for every route.
router.use(requireAuth)

//Rotes
router.get("/", all_workouts)
router.delete("/:id", deleteAworkout)
router.get("/:id", single_workout)
router.post("/", add_workout)
router.patch("/:id", update_workout)
module.exports = router;