var express = require ("express");
    app     = express();
   
    passport= require("passport");
    LocalStrategy   = require('passport-local').Strategy;
    bodyParser= require("body-parser");
    router  = express.Router();
    multer  =   require("multer");
    upload  =   multer({dest: "uploads/"});
    fs      =   require("fs");
    methodOverride = require("method-override")
    flash       = require("connect-flash");
    mongoose    = require("mongoose")
    
    //ROUTER ROUTES
    indexRoutes = require("./routes/index")
    albumRoutes = require("./routes/gallery");

    //MODELS
    album = require("./models/album");
    user  = require ("./models/user");

    app.set("view engine", "ejs");
    app.set('trust proxy', 1)

   
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({ extended: true }))
  
    app.use(methodOverride("_method"));
    app.use(flash());
    app.use(require("express-session")({
    secret: "Andraniksecretveryverysecret",
    resave: false,
    saveUninitialized: false

}))


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
        next();
    });

  app.use(indexRoutes);        
  app.use(albumRoutes);   

    
   //CONNECT TO MONGOLAB
     mongoose.connect("mongodb://adminuser:siguldas2931@ds113482.mlab.com:13482/blog", { useNewUrlParser: true });
    
          
           
    



    app.listen(3000,function(err){

        if(err){
            console.log(err)
        }
        else{
            console.log("Running")
        }
    })