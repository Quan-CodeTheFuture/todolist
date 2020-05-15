let buttonCheck = document.getElementsByClassName("button-check");

async function getAPI(url){
    let data = await fetch(url);
    return await data.json();
}

(async ()=>{
    let tasksDataList = await getAPI("/api");
    for(let i = 0; i < tasksDataList.length; i++){
        buttonCheck[i].isDone = tasksDataList[i].isDone;
        buttonCheck[i].id = tasksDataList[i].id;
    }
})()

function convert(i){
    if(buttonCheck[i].innerHTML.indexOf("fa-circle") !== -1){
        buttonCheck[i].innerHTML = `<i class="fas fa-check-circle" aria-hidden="true"></i>`;
        buttonCheck[i].isDone = true;
        return;
    }
    buttonCheck[i].innerHTML = `<i class="far fa-circle" aria-hidden="true"></i>`;
    buttonCheck[i].isDone = false;
}

for(let i = 0; i < buttonCheck.length; i++){
    buttonCheck[i].addEventListener("click",() => {
        convert(i);
    })
}

