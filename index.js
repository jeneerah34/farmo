if (process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}
const nodemailer = require("nodemailer");
let transportmail = nodemailer.createTransport({
  service:'gmail',
  auth: {
    user: "farmowebapp@gmail.com",
    pass: "vkvw ecve rbzq mjpt",
  },
});
const express=require('express');
const app=express();
const path=require('path');
const multer=require('multer');
const {storage}=require('./cloudinary');
const upload = multer({storage});
const bcrypt=require('bcrypt');
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const crypto=require('crypto');

const methodOverride=require('method-override');
const mongoshUrl="mongodb+srv://logeshsundar72727:logesh%4072727@cluster0.4atki.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
function generateSecurityKey(length=32){
    return crypto.randomBytes(length).toString('hex');
}
const securityKey= generateSecurityKey();
mongoose.connect(mongoshUrl)
.then(()=>{
    console.log("The database connected successfully");
})
.catch(err=>{
    console.log("Error");
    console.log(err);
})
//database models
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
    },
    fullname: String,
    phone:Number,
    email:String,
    state:String,
    district:String,
    address:String,
    product:[{
        image:String,
        Name:String,
        price:Number,
        stock:Number,
        min:Number,
    }]

});
const User = mongoose.model('user',userSchema);
//express codes
var token;
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,"/public")));
app.set('view engine','ejs');
app.set("views",path.join(__dirname,"/views"));
app.use(methodOverride('_method'));
app.get('/',(req,res)=>{
    if(token==null){
    res.render('login');
    }else{
        try{
            async function find(){
            let userData = await User.find({});
            const userData1=await User.findOne({name:jwt.verify(token,securityKey)});
            console.log("user")
            userData=userData.filter((user)=>{
                console.log(user.name,userData1.name);
                if(user.name!==userData1.name){
                    console.log("hello");
                    return true;
                }return false;
            });
            console.log("modified");
            console.log(userData);
            res.render('home',{userData});
        }
        find();
            }catch{
                res.render('login');
            }
        
    }
})

app.get('/new', async(req,res)=>{
    try{
    const userData=await User.findOne({name:jwt.verify(token,securityKey)});
    if(userData.fullname==undefined){
        res.render('profile',{userData});
    }
    res.render('new',{userData});
    }catch{

        res.render('login');
    }
})

app.get('/profile',async(req,res)=>{
    // const username=jwt.verify(token,securityKey)
    try{
    const userData= await User.findOne({name:jwt.verify(token,securityKey)});
    res.render('profile',{userData});
    }catch{
        res.render('login');
    }
})
app.get('/track',async(req,res)=>{
    try{
        const userData= await User.findOne({name:jwt.verify(token,securityKey)});
        if(userData.fullname==undefined){
            res.render('profile',{userData});
        }res.render('track');
        }catch{
            res.render('login');
        }
});

app.get('/orders',async(req,res)=>{
    try{
    const userData= await User.findOne({name:jwt.verify(token,securityKey)});
    if(userData.fullname==undefined){
        res.render('profile',{userData});
    }
    res.render('orders',{userData});
    }catch{

        res.render('login');
    }
})

app.get('/SignUp',(req,res)=>{
    res.render('signIn');
})

app.get('/home',async(req,res)=>{
    try{
    let userData = await User.find({});
    const userData1=await User.findOne({name:jwt.verify(token,securityKey)});
    console.log("FUllname");
    console.log(userData1.fullname);
    if(userData1.fullname==undefined){
        res.render('profile',{userData:userData1});
    }
    console.log("user")
    userData=userData.filter((user)=>{
        console.log(user._id.toString(),userData1._id);
        if(user.name!==userData1.name){
            console.log("hello");
            return true;
        }return false;
    });
    console.log("modified");
    console.log(userData);
    res.render('home',{userData});
    }catch{
        res.render('login');
    }
})

app.put('/new/edit/:id',upload.single('image'),async(req,res)=>{
    try{
    const {id}=req.params;
    console.log(req.body,req.file.path)
    const {Name,price,min,stock}=req.body;
    let image=req.file.path;
    const userData=await User.findById(id);
    userData.product.push({image:image,Name:Name,price:price,min:min,stock:stock});
    userData.save();
    res.redirect('/orders');
    }catch{
        res.redirect('/');
    }
})
app.put('/profile/edit/:id', async(req,res)=>{
    try{
    const {id}=req.params;
    await User.findByIdAndUpdate(id,req.body,{runValidators:true,new:true});
    res.redirect('/profile');
    }catch{
        res.redirect('/');
    }
})
app.put('/MyProducts/edit/:id',async(req,res)=>{
    try{
        const{Name,price,min,stock}=req.body;
        const {id}=req.params;
        const userData=await User.findOne({name:jwt.verify(token,securityKey)});
        userData.product.forEach(p=>{
            if(p._id==id){
                p.Name=Name;
                p.price=price;
                p.min=min;
                p.stock=stock;
                userData.save();
                res.redirect('/orders')
            }
        })
    }catch{
        res.redirect('login');
    }
})
app.delete('/MyProducts/delete/:id',async(req,res)=>{
    try{
        const {id}=req.params;
        const userData=await User.findOne({name:jwt.verify(token,securityKey)});
        console.log(userData.product);
        userData.product=userData.product.filter((p)=>p._id.toString()!==id);
        userData.save();
        res.redirect('/orders');
    }catch{
        res.redirect('/');
    }
})
app.get('/profile/:id', async(req,res)=>{
    try{
    const {id}=req.params;
    const userData=await User.findById(id);
    res.render('editProfile',{id,userData});
    }catch{
        res.render('login');
    }
})
app.get('/buy/:id1/:id2',async(req,res)=>{
    console.log(req.params);
    const {id1,id2}=req.params;
    try{
    const userData=await User.findById(id1);
    userData.product.forEach(p=>{
        if(p._id==id2){
            res.render('buy',{userData,p});
        }
    
})
    }catch{
        res.redirect('/');
    }
})

app.get('/Myproducts/:id',async(req,res)=>{
    try{
    const {id}=req.params;
    const userData=await User.findOne({name:jwt.verify(token,securityKey)});
    userData.product.forEach(p=>{
        if(p._id==id){
            res.render('editMyProducts',{p});
        }
    })
    }catch{

        res.render('login');
    }
})

app.get('/logout',(req,res)=>{
    token=null;
    res.render('login');
})
app.post('/signUp',(req,res)=>{
    console.log(req.body);
    let {username,pass1,pass2}=req.body;
    if(username.length>=8 && pass1.length>=8){
    if(pass1===pass2){
    const find=async function(){
        const user=await User.findOne({name:username});
        if(user!=null){
            res.redirect('signIn');
        }else{
            pass1= await bcrypt.hash(pass2,10);
            let userData=new User({name:username,password:pass1});
            await userData.save();
            token = jwt.sign(username,securityKey);
            res.redirect('profile');
        }
    }
    find();
}else{
    res.redirect("signIn")
}}else{
    res.redirect("signIn");
}
})

app.post('/login',async(req,res)=>{
    console.log(req.body);
    const {username,pass1}=req.body;
    try{
        const userData=await User.findOne({name:username})
        if (userData==null){
            res.redirect('/');
        }else{
            if(await bcrypt.compare(pass1,userData.password)){
            token = jwt.sign(username,securityKey);
            res.redirect('home');
            }else{
                res.redirect('/');
            }

        }
    }catch(err){
        console.log("error");
        console.log(err);
        res.redirect('/');
    }

    //real code

//     if(username.length>=8 && pass1.length>=8){
//     const find= async function(){
//     const userData=await User.findOne({name:username});
//     if(userData==null){
//         res.redirect("/");
//     }else{
//         if(await bcrypt.compare(pass1,userData.password)){
//             userId=userData._id;
//             res.redirect('home');
//         }else{
//             res.redirect('/');
//         }
//     }
//     }
//     find();
// }else{
//         res.redirect('/');
//     }
})

app.post('/buy/product/:id1/:id2',async(req,res)=>{
    const {id1,id2}=req.params;
    const{quantity}=req.body;
    try{
        const userData=await User.findOne({name:jwt.verify(token,securityKey)});
        const farmer=await User.findById(id1);
        let product;
        farmer.product.forEach(p=>{
            if(p._id.toString()==id2){
                product=p;
            }
        })
        let mailContent={
            from:"farmowebapp@gmail.com",
            to:userData.email,
            subject:"Purchased Mail",
            text:`Hello, ${userData.fullname} \n
            You have Purchased ${quantity}kg of ${product.Name} from ${farmer.name}\n
            For further details about your order Please contact the information given below:\n
            Email: ${farmer.email}\n
            Phone: ${farmer.phone}\n
            Thank you for having a trade with us\n
            Have a nice day...`,
          }
transportmail.sendMail(mailContent,async function(err,val){
    if(err){
      console.log(err);
      await User.findByIdAndDelete(userData._id.toString());
      token=null;
      res.redirect('/');
    }
    else{
      console.log(val.response," sent mail...");
      let mailContent={
        from:"farmowebapp@gmail.com",
        to:farmer.email,
        subject:"Order Received Mail",
        text:`Hello, ${farmer.fullname} \n
        ${userData.fullname} has Purchased ${quantity}kg of your product named ${product.Name}\n
        For futher details about his/her order Please contact the information given below:\n
        Email: ${userData.email}\n
        Phone: ${userData.phone}\n
        Thank you selling your fresh products in our website\n
        Have a nice day...`,
      }
      transportmail.sendMail(mailContent,async function(err,val){
        if(err){
          console.log(err);
          let mailContent={
            from:"farmowebapp@gmail.com",
            to:userData.email,
            subject:"Purchased failed",
            text:`Hello, ${userData.fullname} \n
            Sorry for inconveniences ${farmer.fullname} is a fake user\n
            We will remove him from our website within 2hours
            Thank you have a nice day...`,
          }
          await User.findByIdAndDelete(id1);
          res.redirect('/home');
          transportmail.sendMail(mailContent,function(err,val){
            if(err){
              console.log(err);
            }
            else{
              console.log(val.response," sent mail...")
            }
          }
          )          
        }
        else{
          console.log(val.response," sent mail...");
          console.log(product.stock-quantity);
          farmer.product.forEach(p=>{
            if(p._id.toString()==id2){
                p.stock=(p.stock-quantity);
            }
        });
        farmer.save();
        res.redirect('/home');
        }
      }
      )
    }
  }
  )
  
          
    }catch(e){
        console.log("error");
        console.log(e);
        res.redirect('/home');
        }

})
app.get('/:id',(req,res)=>{
    res.send("Error")
});
app.listen(8080,()=>{
    console.log("listening to the port 8080...");
})