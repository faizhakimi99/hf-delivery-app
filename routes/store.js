const express = require("express"); 
const router = express.Router();
const Store = require("../models/store");

//Store routes (customer view)
//INDEX ROUTES - SHOW ALL STORES
router.get("/stores", (req, res) => {
    Store.find({}, (err, allStores) => {
        if(err){
            console.log(err);
            res.redirect("/");
        }
        else{
            res.render("stores", {stores: allStores});
        }
    })
})

//SHOW ROUTE - SHOW PARTICULAR STORE
router.get("/stores/:store_id", (req, res) => {
    Store.findById(req.params.store_id, (err, foundStore) => {
        if(err){
            console.log(err);
        }
        else{
            res.render("showStore", {store: foundStore});
        }
    })
})

module.exports = router;