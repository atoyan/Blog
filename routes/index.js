var express =  require("express");
var router  = express.Router();
var user    = require("../models/user");
var passport = require("passport");

router.get("/",  function(req,res){
    // var pictureNew = picture({
    //     name: "agnija picture"
    // })
    // pictureNew.save(function(err,createdPic){
    //     if(err){
    //         console.log(err)
    //     }
    //     else{console.log(createdPic)}
    // })
    
    res.render("index" , {message:req.flash("message")});
})



//LOGIN PAGE
router.get("/login", function(req,res){

        res.render("login", {message: req.flash("message")});
})
//LOGIN LOGIC
router.post("/login", passport.authenticate("local",
{    
    successRedirect: "/", 
    failureRedirect: "/login",
    failureFlash : true,
    successFlash: 'Welcome!'
    

}), function(req,res){
   username= res.locals.currentUser.username;
   
});

router.get("/logout" , isLoggedIn, function(req,res){
    
    req.logout();
    req.flash("message", "Logged out");
    res.redirect("/");

})






function isLoggedIn(req,res, next){
    if(req.isAuthenticated()){
        return next();
}
req.flash("message", "You must be logged in before logging out");
res.redirect("/");
}

// REGISTER ADMIN USER
// app.get('/register',function(req,res){

//     res.render("register");

// })

// app.post('/register', function(req,res){

//     var username = req.body.username;
//     var password = req.body.password;
//     user.register(new user({username: username}), password, function(err,registeredUser){
//         if(err){
//             console.log(err)
//             return res.render('register');
//         }
//         else{
//            passport.authenticate("local")(req, res , function(){
//                 res.redirect('/');
//            })

       
//         }
//     })


// })



module.exports=router;