//get elements
const itemList = document.querySelector(".items");
const httpForm = document.getElementById("httpForm");
const itemInput = document.getElementById("itemInput");
const imageInput = document.getElementById("imageInput");
const feedback = document.querySelector(".feedback");
//const items = document.querySelector(".items");
const submitBtn = document.getElementById("submitBtn");
let edited_item_id=0;
//submit items 
httpForm.addEventListener('submit',submitForm);
function submitForm(event){
  event.preventDefault();
  const itemValue=itemInput.value;//taking input value 
  const imageValue=imageInput.value;//takingthe image value 

  if(itemValue.length===0 || imageValue.length===0)
  {
    showFeedback('YOU MUST HAVE ENTERD WRONG VALUES!!');
  }
  else{
    itemInput.value='';
    imageInput.value='';
    PostItemAPI(itemValue,imageValue);
}
};


//showFeedback function
function showFeedback(text)
{
  feedback.classList.add('showItem');
feedback.innerHTML=`<p> ${text}</p>`;

setTimeout(()=>{
  feedback.classList.remove('showItem');
},4000);
}
// load items
document.addEventListener("DOMContentLoaded", function() {
  getItemsAPI(showItems);
});


 

//submit item

function getItemsAPI(cb) {
  const url = "https://600487de75860e0017c5bd71.mockapi.io/article";
  const ajax = new XMLHttpRequest();
  ajax.open("GET", url, true);

  ajax.onload = function() {
    if (this.status === 200) {
      cb(this.responseText);
    } else {
      console.log("something went wrong");
    }
  };
  ajax.onerror = function() {
    console.log("hello");
  };
  ajax.send();


}

function showItems(data)
{
  const Items=JSON.parse(data);
 
  let info='';

  Items.forEach(item => {
    info+=`<li class="list-group-item d-flex align-items-center justify-content-between flex-wrap item my-2">
    <img src="${item.avatar}" id='itemImage' class='itemImage img-thumbnail' alt="">
    <h6 id="itemName" class="text-capitalize itemName">${item.name}</h6>
    <div class="icons">

     <a href='#' class="itemIcon mx-2 edit-icon" data-id='${item.id}'>
      <i class="fas fa-edit"></i>
     </a>
     <a href='#' class="itemIcon mx-2 delete-icon" data-id='${item.id}'>
      <i class="fas fa-trash"></i>
     </a>
    </div>
   </li>`;
  });

  itemList.innerHTML=info;
  getIcons();

}

//POSTITEMAPI()

function PostItemAPI(input_val,img_val)
{
  const avatar='img/'+img_val+'.jpeg';
  const item_name=input_val;
  const url='https://600487de75860e0017c5bd71.mockapi.io/article';

  const ajax=new XMLHttpRequest();
  ajax.open('POST',url,true);//use POST 

ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');//imp to use setrequestheader()

  ajax.onload=function(event){
    event.preventDefault();
    if(this.status===200)
    {
      getItemsAPI(showItems);
    }
    else
    {
      this.onerror;
    }
  }

  ajax.onerror=function(){
    console.log("OOPS there was an error!!!");
  }

ajax.send(`avatar=${avatar}&name=${item_name}`);////send .........................
}


//getIcons() function

function getIcons()
{
  const editIcon=document.querySelectorAll('.edit-icon');
  const deleteIcon=document.querySelectorAll('.delete-icon');
//dlete icon functionality 
  deleteIcon.forEach(icon =>{

  const item_Id=icon.dataset.id;
  icon.addEventListener('click', function(event){
event.preventDefault();
    console.log(item_Id);
    deleteItemAPI(item_Id);//call delete item api function to delete an item from the list 
  });

  });
  //end of dlete icon functionality  block 



  //edit icon functionality 

  editIcon.forEach(icon =>{
const item_id=icon.dataset.id;//id of the current item element 
icon.addEventListener('click', function(event){
event.preventDefault();
const parent=event.target.parentElement.parentElement.parentElement;
const image=parent.querySelector('.itemImage').src;
const name=parent.querySelector('.itemName').textContent;
//console.log(parent,image,name,item_id);
editItemUI(parent,image,name,item_id);


});
  });

  //end of edit icon functionilty block 
}

//deleteItemAPI()

function deleteItemAPI(item_id)
{
  const url = `https://600487de75860e0017c5bd71.mockapi.io/article/${item_id}` ;
  const ajax = new XMLHttpRequest();
  ajax.open("DELETE", url, true);

  ajax.onload = function() {
    if (this.status === 200) {
  // console.log(this.responseText);
     getItemsAPI(showItems);
    } else {
      //console.log("something went wrong");
      this.onerror();
    }
  };
  ajax.onerror = function() {
    //console.log("hello");
    console.log("Woops !! something went wrong!!!");
  };
  ajax.send();

}

//edit UI

function editItemUI(parent,image,name,id)
{
  event.preventDefault();
  //ANCHOR remove the parent element from the list of  elements then add the edited one as fresh
  //itemList.removeChild(parent); 
console.log(parent,image,name,id);
const img_index=image.indexOf("img/");
const jpeg_index=image.indexOf(".jpeg");
console.log(img_index,jpeg_index);
const req_image=image.slice(img_index+4,jpeg_index);
console.log(req_image);

//now add the name and image in the inpout box 
itemInput.value=name.trim();//remove white spaces if any 
imageInput.value=req_image;

submitBtn.innerHTML='EDIT ITEM';
httpForm.removeEventListener('submit',submitForm);//remove the previous events by using remove evenet loistener 
edited_item_id=id;
httpForm.addEventListener('submit',editItemAPI);

}

//editItemAPI callback functiomn

function editItemAPI()
{
  event.preventDefault();
  const id=edited_item_id;
  const input_value=itemInput.value;
  const image_value=imageInput.value;
  if(input_value.length===0 || image_value.length===0)
  {
    showFeedback("Wrong and invalid input !!!");
  }
 else{
    const img=`img/${image_value}.jpeg`;
    const name=input_value;
    const url=`https://600487de75860e0017c5bd71.mockapi.io/article/${id}`;

    const ajax=new XMLHttpRequest();
    ajax.open('PUT',url,true);//use POST 
  
  ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');//imp to use setrequestheader()
  
    ajax.onload=function(event){
      
      if(this.status===200)
      {
        event.preventDefault();
        getItemsAPI(showItems);
      }
      else
      {
        this.onerror;
      }
    }
  
    ajax.onerror=function(){
      console.log("OOPS there was an error!!!");
    }
  
  ajax.send(`avatar=${img}&name=${name}`)

  }
}