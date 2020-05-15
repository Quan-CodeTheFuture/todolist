let buttonSelectAll = document.getElementById("select-all");

function checkAllDone(){
    let check = true;
    for(let i = 0; i < buttonCheck.length; i++){
        if(buttonCheck[i].isDone === false){
            check = false;
            break;
        }
    }
    return check
}

function setAllDone(){
    for(let i = 0; i < buttonCheck.length; i++){
        buttonCheck[i].innerHTML = `<i class="fas fa-check-circle" aria-hidden="true"></i>`;
        textPostList[i].innerHTML = `<s>`+ textPostList[i].outerText + `</s>`
        buttonCheck[i].isDone = true;
        let data = {
            id:buttonCheck[i].id,
            title:textPostList[i].outerText,
            isDone:buttonCheck[i].isDone
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

}

function setAllNotDone(){
    for(let i = 0; i < buttonCheck.length; i++){
        buttonCheck[i].innerHTML = `<i class="far fa-circle" aria-hidden="true"></i>`;
        textPostList[i].innerHTML = `<p>`+ textPostList[i].outerText + `</p>`
        buttonCheck[i].isDone = false;
        let data = {
            id:buttonCheck[i].id,
            title:textPostList[i].outerText,
            isDone:buttonCheck[i].isDone
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
}
buttonSelectAll.addEventListener("click",()=>{
    let check = checkAllDone();
    if(check===false){
        setAllDone();
        return;
    }
    setAllNotDone();
})