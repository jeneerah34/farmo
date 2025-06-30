const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:8,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:8
    }
});
const User = mongoose.model('user',userSchema);
module.exports=User;