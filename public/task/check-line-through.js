let textPostList = document.getElementsByClassName("text-post-list");

function checkLineThrough(i){
    if(buttonCheck[i].isDone === true){
        textPostList[i].innerHTML = `<s>`+ textPostList[i].outerText + `</s>`
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
        return;
    }
    textPostList[i].innerHTML = `<p>`+ textPostList[i].outerText + `</p>`
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

for(let i = 0; i < buttonCheck.length; i++) {
    buttonCheck[i].addEventListener("click", ()=>{
        checkLineThrough(i);
    })
}
