let postCreate = document.getElementById("post-create");
let postList = document.getElementsByClassName("post-list")[0];

function createPost(){
    postList.innerHTML += `
    <div class="container-post">
        <div class="button-check">
            <i class="far fa-circle"></i>
        </div>
        <span class="text-post-list">
            <p>${postCreate.value}</p>
        </span>
        <div class="delete-button">
            <i class="fas fa-times"></i>
        </div>
    </div>
    `

    buttonCheck[buttonCheck.length - 1].isDone = false;
    // console.log(buttonCheck.length);
    let data = {
        title:postCreate.value,
        isDone:false
    }

    fetch("/",{
        method:"POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    }).then(res => res.json()).then(a => {
        console.log(a)
        buttonCheck[buttonCheck.length - 1].id = a.id;
    });

}

async function init(){
    let tasksDataList = await getAPI("/api");
    for(let i = 0; i < tasksDataList.length; i++){
        buttonCheck[i].isDone = tasksDataList[i].isDone;
        buttonCheck[i].id = tasksDataList[i].id;
    }
}

postCreate.addEventListener("keyup",(event) => {
    if(event.keyCode===13){
        createPost();
        init();
        for(let i = 0; i < buttonCheck.length; i++){
            buttonCheck[i].addEventListener("click", ()=>{
                convert(i);
                checkLineThrough(i);
            })
            deleteButton[i].addEventListener("click", ()=>{
                deletePost(i);
            }); 
            textPostList[i].addEventListener("dblclick", ()=>{
                if(buttonCheck[i].isDone === false){
                    changeInput(i)
                    return;
                }
            })
            handleWhenClickOutside(i);
            handleWhenHitEnter(i);        
        }
    }
})