console.log("you are connected to the js file now...");
//Login and SignIn page effect
const inputs=document.querySelectorAll('.inputs');
inputs.forEach(input=>{
    input.addEventListener('focus',()=>{
        document.querySelector('.notification').style.display='none';
        input.parentNode.parentNode.classList.add('focus');
        input.parentNode.classList.add('focus1');
    })
    input.addEventListener('blur',()=>{
        if(input.value==""){
            input.parentNode.classList.remove('focus1');
        }
        input.parentNode.parentNode.classList.remove('focus');
    })
})
//login and signIn button notification


let form =  document.querySelector('.loginform');
form.addEventListener('submit',async(e)=>{
    let username=document.querySelector('#username');
    let password=document.querySelector('#pass1');
    if (username.value.length<8 || pass1.value.length<8){
        e.preventDefault();
        document.querySelector('.notification').style.display='flex';
        document.querySelector('.errorInfo').innerHTML="<p>username or password must contain 8 letters</p>";
        document.querySelector('.errorInfo').style.fontSize="1rem";     
        username.value="";
        password.value="";
        inputs.forEach(input=>{
        input.parentNode.classList.remove('focus1');
        input.parentNode.parentNode.classList.remove('focus');
        try{
            let password2=document.querySelector('#pass2');
            password2.value="";
        }catch{
            console.log("hello...")
        }
        })
    }  
})












// don't  clear it !!!!!
// document.querySelector('.loginform').addEventListener('submit',async(e)=>{
//     e.preventDefault();
//     let name=document.querySelector('#username');
//     let password=document.querySelector('#pass1');
//     console.log(name.value);
//     console.log(password.value);
//     const response=await fetch('http://localhost:8080/login',{
//         method:"POST",
//         crossDomain:true,
//         headers:{
//             "Content-Type":"application/json",
//         },
//         body:JSON.stringify({
//             name,password,
//         })
//     })


// })