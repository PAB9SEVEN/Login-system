var mongoose=require('mongoose');
var bcrypt=require('bcryptjs');

var userschema=mongoose.Schema({
    username:{
        type:String,
        index:true
        
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    name:{
    type:String
}
    
});
var User=module.exports=mongoose.model('user',userschema); //made a variable called user whih actually is used to export or inject inot other model
//var user=module.exports=mongoose.model('modename,schemaname)
module.exports.createUser=function(newuser,callback){ //used to create a createUser function 
    //to hash a password
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newuser.password, salt, function(err, hash) {
newuser.password=hash;
        newuser.save(callback); //user is saved into the database frm here//
        
        
    });
});
}
module.exports.getuserbyusername=function(username,callback){
    var query={username:username};
    User.findOne(query,callback);
    
    
}

//module.exports.finduser=function(id,callback){
    
  //  User.findById(id,callback);
//}
module.exports.checkpassword=function(password,hash,callback){
    bcrypt.compare(password, hash, function(err, ismatch) {
        if(err) throw err;
        callback(null,ismatch);
        
    // res === false 
});
}