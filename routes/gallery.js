var express =  require("express");
var router  =  express.Router();
var album   =  require("../models/album")
var picture =  require("../models/picture");
var multer  =  require("multer");

/// MULTER CONFIG
var storage = multer.diskStorage({
    destination: function (req, file, cb)  {
      cb(null, 'public/images/uploads')
    },
    filename: function (req, file, cb)  {
      cb(null, file.originalname + ".jpg")
    }
});
var upload = multer({storage: storage});


//SHOW ALL ALBUMS
router.get("/gallery", function(req,res){
    
    album.find({}).populate("images").exec(function(err,albums){
        if(err){
            console.log(err)
        }
        else{
             res.render("gallery/index" , {albums: albums} );
        }
    })

  
})

    //CREATE ALBUM
    router.post("/gallery",isLoggedIn,function(req,res){

    var name = req.body.name;
    var desc = req.body.desc;
    var newAlbum = {name: name , desc: desc};
    album.create(newAlbum,function(err,albumCreated){
        if(err){
            console.log(err)
        }
        else{
          
            console.log(albumCreated)
            res.redirect("/gallery");
        }
    })


})

//SHOW CREATE FORM
router.get("/gallery/new", isLoggedIn, function (req,res){

    res.render("gallery/new")


}) 


//SHOW SINGLE ALBUM
router.get("/gallery/:id", function(req,res){
    album.findById(req.params.id).populate("images").exec(function(err,album){
        if(err){
            console.log(err)
        }
        else{
            res.render("gallery/show", {album:album, message:req.flash("message")});
        }
    })

})


//ALBUM ADD PICTURES
router.put("/gallery/:id",isLoggedIn ,function(req,res){
    var checkboxes =[];
        checkboxes = req.body.images;
    
             var singlePicture = {}
              var pictureList =[];
       
            if(checkboxes!=null && checkboxes.length==1 && checkboxes[0]!=null){
                picture.findById(checkboxes[0] , function (err,foundPicture){
                    if(err){console.log(err)}
                    else{
                        singlePicture=foundPicture;
                        console.log("SIngle picture = >" + singlePicture)
                        album.findById(req.params.id , function(err,foundAlbum){
                            if(err){console.log(err)
                            res.redirect("back")}
                            else{
                                console.log("found picture = " + foundPicture + " and found album = " +foundAlbum)
                                foundAlbum.images.push(foundPicture)
                                foundAlbum.save();
                                req.flash("message", "Successfully Added Picture")
                                res.redirect("back");
                            }
                        })
                    }
                })

            }
            else if(checkboxes==null){
                req.flash("message", "You didn't select any pictures to add to the album!")
                res.redirect("back")
                

            }
            else if(checkboxes.length>=2){
                    
                for(var i=0;i<checkboxes.length;i++){
                    picture.findById(checkboxes[i] , function(err,foundPicture){
                        if(err){
                            console.log(err)
                        }
                        else{
                            pictureList.push(foundPicture);
                           
                        }

                    })
                }
                
                album.findById(req.params.id, function(err,foundAlbum){
                    if(err){
                        console.log(err)
                    }
                    else{
                        console.log("The pictures" +pictureList)
                        pictureList.forEach(function(pic){
                            foundAlbum.images.push(pic)
                        })
                        foundAlbum.save();
                        req.flash("message" , "Multiple pictures added to the album")
                        res.redirect("back")
                    }

                })
                
               


            }
        
        
      

})


    //ALBUM REMOVE PICTURES

    router.put("/gallery/:id/:image_id" , isLoggedIn, function(req,res){
            //var picId = []
            //picId.push(req.body.originalname);
       // console.log("picture id = = = " + picId);
        album.findById(req.params.id).populate("images").exec(function(err,foundAlbum){
            if(err){console.log(err)
            }
            else{
                        picture.findById( req.params.image_id, function(err,foundpic){
                            if(err){console.log(err)
                                res.redirect("back");
                            }
                            else{console.log(foundpic)
                                foundAlbum.images.pull(foundpic)
                                foundAlbum.save();
                                req.flash("message" , "Picture removed from the album")
                                res.redirect("back")
                            }
                        })    

                        
                    
                
            }
        })
    })



//SHOW EDIT FORM
router.get("/gallery/:id/edit", isLoggedIn, function(req,res){
    album.findById(req.params.id).populate("images").exec(function(err,album){
        if(err){
            console.log(err)
        }
        else{
            
            picture.find({}, function(err,pictures){
                if(err){
                    console.log(err)
                    res.redirect("back")
                }
                res.render("gallery/edit", {album:album , pictures:pictures , message: req.flash("message")});
            })
        }
    })

})







//DELETE ALBUM

router.delete("/gallery/:id",isLoggedIn ,function(req,res){
    album.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err)
            res.redirect("/gallery");
        }
        else{
            res.redirect("/gallery");
        }
    })
})

//SHOW ALL PICTURES
router.get("/pictures", isLoggedIn , function(req,res){

    picture.find({}, function(err,pictures){
        if(err){
            console.log(err)
            res.redirect("back")
        }
        res.render("picture/index", {pictures:pictures , message: req.flash("message")})
    })

})


//UPLOAD PICTURE

router.post("/pictures",isLoggedIn,upload.single('file'), function (req,res){

    var file = req.file;
    
    var pic = new picture({fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        encoding: req.file.encoding,
        mimetype: req.file.mimetype,
        destination:req.file.destination,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size });


        pic.save(function(err){
                if(err){
                    console.log(err)
                
                   }
                    req.flash("message", "Uploaded")
                    res.redirect("back");
        })
    


})


//DELETE A PICTURE
router.delete("/pictures/:id", isLoggedIn, function(req,res){

    picture.findByIdAndRemove(req.params.id ,function(err){
        if(err){
            console.log(err)
            req.flash("message", "something went wrong")
        }
        else{
            req.flash("message", "picture deleted successfully")
            res.redirect("back")
        }
    })


})




function isLoggedIn(req,res, next){
    if(req.isAuthenticated()){
        return next();
}
req.flash("message", "You must be logged in before logging out");
res.redirect("/login");
}


module.exports=router;