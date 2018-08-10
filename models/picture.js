var mongoose = require ("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var pictureSchema = new mongoose.Schema(
  { fieldname: String,
    originalname: String,
    encoding: String,
    mimeptype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number
  });
   

pictureSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Picture",pictureSchema);