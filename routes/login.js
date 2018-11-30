var express =require("express");
var router = express.Router();
var passport=require('passport');
router.route('/')
        .get((req,res)=>res.render("login"))
        .post(passport.authenticate('local',{failureRedirect:"/login",
                                             successRedirect:"/"}));

//Export
module.exports= router;