//navbar code
const close=document.querySelector('.closeIcon');
close.addEventListener('click',()=>{
    document.querySelector('.hiddenSidebar').style.display="none";
})
const menu=document.querySelector('.hidden');
menu.addEventListener('click',()=>{
    document.querySelector('.hiddenSidebar').style.display="flex";
})

const sidebar=document.querySelector('.hiddenSidebar');
sidebar.addEventListener('blur',()=>{
    document.querySelector('.hiddenSidebar').style.display="none";

})
