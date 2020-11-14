const express = require("express"); 
const router = express.Router();
const passport = require("passport");
const Customer = require("../models/customer");
const Vendor = require("../models/vendor");
const middlewareObj = require('../middleware');

//LANDING PAGE
router.get("/", (req,res) => {
    console.log("in index page with strategy:" + req.session.strategy);
    console.log("req.user: " + req.user); 
      
    res.render("landing");
  })
  

//REGISTER
router.get("/register", (req, res) => {
    console.log("register page");
    res.render("register");
})

router.post("/register", middlewareObj.checkRole, (req, res) => {
    //store session variable (session.strategy) to store role -> customerLocal/vendorLocal
    req.session.strategy = res.locals.role;
    var UserModel = req.session.strategy === ("customerLocal") ? Customer : Vendor;
    var newUser = new UserModel({username: req.body.username});

    UserModel.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        console.log("registering: " + user);    
        //req.user somehow undefined for vendorLocal
        //therefore, store session variable (session.currentUser) to store authenticated user
        req.session.currentUser = user;
        passport.authenticate(req.session.strategy)(req, res, () => {
            console.log("authenticate after registering:" + req.user);
            res.redirect("/");
        })
    })
})

//LOGIN
router.get("/login", (req,res) => {
    res.render("login");
})

router.post("/login", middlewareObj.checkRole, (req, res, next) => {
    //store session variable (session.strategy) to store role -> customerLocal/vendorLocal
    req.session.strategy = res.locals.role;
    passport.authenticate(res.locals.role, (err, user, info) => {
    if (err) { 
        return next(err); 
    }
    if (!user) { 
        return res.redirect("/login"); 
    }
    req.logIn(user, function(err) {
        if (err) { return next(err); }
        console.log("in login req.user: " + req.user.username);
        //req.user somehow undefined for vendorLocal
        //therefore, store session variable (session.currentUser) to store authenticated user
        req.session.currentUser = user;
        return res.redirect("/");
    });})(req, res, next);
})


//LOGOUT
router.get("/logout", (req, res) => {
    //Destroy session variables since currentUser is stored in session
    req.session.destroy();
    req.logOut();
    res.redirect("/");
})

module.exports = router;