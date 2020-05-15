let deleteButton = document.getElementsByClassName("delete-button");
let containerPost = document.getElementsByClassName("container-post");

function deletePost(i){
    containerPost[i].style.display = "none";
    let data = {
        id:buttonCheck[i].id,
        request:"delete"
    }

    fetch("/",{
        method:"POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    }).then(res => res.json()).then(a => console.log(a));
}

for(let i = 0; i < containerPost.length; i++){
    deleteButton[i].addEventListener("click", ()=>{
        deletePost(i);
    }); 
}