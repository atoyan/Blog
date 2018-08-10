var mongoose = require ("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var albumSchema = new mongoose.Schema({
    name: String,
    desc: String,
    images : [
        {
            type: mongoose.SchemaTypes.ObjectId,
             ref:"Picture"
                }
    ]
   
});
albumSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Album",albumSchema);