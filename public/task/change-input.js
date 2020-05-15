let text;
let inputText;

function moveCursorToEnd(el) {
    if (typeof el.selectionStart == "number") {
        el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange != "undefined") {
        el.focus();
        var range = el.createTextRange();
        range.collapse(false);
        range.select();
    }
}

function changeInput(i){
    text = textPostList[i].outerText;
    textPostList[i].innerHTML = `<input id="task" class="input-post-list" value="`+ textPostList[i].outerText + `"/>`
    buttonCheck[i].style.display = 'none';
    buttonCheck[i].isDone = "pending";
    inputText = document.querySelector('.text-post-list > input');
    inputText.focus();
    moveCursorToEnd(inputText);
}

function handleWhenClickOutside(i){
    document.addEventListener("click", (event)=>{
        if(textPostList[i]){
            let isClickInside = textPostList[i].contains(event.target);
            if(!isClickInside){
                buttonCheck[i].style.display = 'block';
                if(buttonCheck[i].isDone === "pending" && inputText){
                    textPostList[i].innerHTML = `<p>`+ inputText.value + `</p>`
                    let text = inputText.value;
                    inputText = undefined;
                    buttonCheck[i].isDone = false;
                    let data = {
                        id:buttonCheck[i].id,
                        title:text,
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
        }
    })
}

function handleWhenHitEnter(i){
    document.addEventListener("keyup", (event)=>{
        if(event.keyCode === 13){
            buttonCheck[i].style.display = 'block';
            if(event.target.tagName === "INPUT" && event.target.className === "input-post-list"){
                if(textPostList[i].innerHTML.indexOf("<input") !== -1 && inputText){
                    textPostList[i].innerHTML = `<p>`+ inputText.value + `</p>`
                    let text = inputText.value;
                    inputText = undefined;

                    buttonCheck[i].isDone = false;
                    let data = {
                        id:buttonCheck[i].id,
                        title:text,
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
            };
        }
    })
}
for(let i = 0; i < textPostList.length; i++) {
    textPostList[i].addEventListener("dblclick", ()=>{
        if(buttonCheck[i].isDone === false){
            changeInput(i)
            return;
        }
    })
    handleWhenClickOutside(i);
    handleWhenHitEnter(i);
}
