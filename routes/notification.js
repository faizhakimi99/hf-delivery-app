const express = require("express"); 
const router = express.Router();
const Store = require("../models/store");
const Cart = require("../models/cart");
const Order = require("../models/order");
const middlewareObj = require('../middleware');

router.get("/notification", middlewareObj.isLoggedIn, (req, res) => {
  
    if(req.session.strategy === "vendorLocal"){
        Order.find({customer: req.session.currentUser._id}).populate("store").exec((err, notiOrders) => {
            if(err){
                console.log(err);
            }
            else{
                res.render("notification", {notiOrders: notiOrders});
            }
        })
    }
   
})
module.exports = router;