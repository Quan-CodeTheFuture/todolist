let postCreate = document.getElementById("post-create");
let postList = document.getElementsByClassName("post-list")[0];
let deleteAllCompleted = document.getElementById("delete-all-completed-button");
let selectAll = document.getElementById("select-all");
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

postCreate.addEventListener("keyup",async(event) => {
    if(event.keyCode === 13){
        if(postCreate.value===""){
            return;
        }
        let textId = await axios({
            method:"POST",
            url:'/',
            data:{
                content:postCreate.value,
                request:"create"
            }
        })
        
        postList.innerHTML += `
        <div class="container-post">
            <div class="button-check">
                <i class="far fa-circle" id="${textId.data.id}">
                </i>
            </div>
            <span class="text-post-list">
                <p>${postCreate.value}</p>
            </span>
            <div class="delete-button">
                <i class="fas fa-times" id="${textId.data.id}"></i>
            </div>
        </div>
        `

        postCreate.value = "";
    }
})

document.addEventListener("click",async(event)=>{
    let isDone = false;
    if(event.target.tagName === "I"){
        if(event.target.className === "far fa-circle"){
            let containerTextPostList = event.target.parentElement.parentElement.children[1];
            let text = containerTextPostList.children[0].outerText;    
            event.target.className = "fas fa-check-circle";
            containerTextPostList.innerHTML = "<s>"+text+"</s>";
            isDone = true;
            axios({
                method: "POST",
                url:"/",
                data:{
                    request:"edit",
                    id:event.target.id,
                    isDone:isDone
                }
            })    
        } else if (event.target.className === "fas fa-check-circle") {
            let containerTextPostList = event.target.parentElement.parentElement.children[1];
            let text = containerTextPostList.children[0].outerText;    
            event.target.className = "far fa-circle";
            containerTextPostList.innerHTML = "<p>"+text+"</p>";
            axios({
                method: "POST",
                url:"/",
                data:{
                    request:"edit",
                    id:event.target.id,
                    isDone:isDone
                }
            })
        }
    }
})

document.addEventListener("click",()=>{
    if(event.target.tagName == "I"){
        if(event.target.className === "fas fa-times"){
            let containerPost = event.target.parentElement.parentElement;
            containerPost.remove();
            axios({
                method: "POST",
                url:"/",
                data:{
                    request:"delete",
                    id:event.target.id
                }
            })
        }
    }
})
let inputText;
document.addEventListener("dblclick",()=>{
    if(event.target.tagName == "P"){
        let textPostList = event.target.parentElement;
        textPostList.innerHTML = `<input id="task" value="`+ textPostList.outerText + `"/>`;
        textPostList.children[0].focus();
        inputText = textPostList
        moveCursorToEnd(textPostList.children[0]);
        let buttonCheck = inputText.parentElement.children[0];
        buttonCheck.style.display = "none";

    } else if(event.target.tagName === "SPAN" && event.target.className === "text-post-list" && event.target.children[0].tagName === "P") {
        let textPostList = event.target;
        textPostList.innerHTML = `<input id="task" value="`+ textPostList.outerText + `"/>`;
        textPostList.children[0].focus();
        inputText = textPostList
        moveCursorToEnd(textPostList.children[0]);
        let buttonCheck = inputText.parentElement.children[0];
        buttonCheck.style.display = "none";
    }
})

document.addEventListener("click",(event) => {
    if(inputText){
        let isClickInside = inputText.contains(event.target);
        if(!isClickInside){
            let text = inputText.children[0].value;
            inputText.innerHTML = `<p>`+text+`</p>`;
            let buttonCheck = inputText.parentElement.children[0];
            buttonCheck.style.display = "block";
            let id = buttonCheck.children[0].id;
            axios({
                method: "POST",
                url:"/",
                data:{
                    id:id,
                    request:"editTitle",
                    title:text
                }
            })

            inputText = undefined;
        };
    }
})
document.addEventListener("keyup",(event) => {
    if(event.keyCode === 13){
        if(event.target.tagName === "INPUT"&& event.target.id==="task"){
            let textPostList =event.target.parentElement;
            let id = event.target.parentElement.parentElement.children[0].children[0].id;
            textPostList.innerHTML = "<p>"+event.target.value+"</p>";
            let buttonCheck = inputText.parentElement.children[0];
            buttonCheck.style.display = "block";
            inputText = undefined;
            axios({
                method: "POST",
                url:"/",
                data:{
                    id:id,
                    request:"editTitle",
                    title:event.target.value
                }
            })
        }
    }
})

selectAll.addEventListener("click",() => {
    let allEqual = [...postList.children];
    let check = allEqual.every(child => child.children[0].children[0].className === "fas fa-check-circle");
    if(check){
        allEqual.map((child) => {
            return child.children[0].children[0].className = "far fa-circle";
        })
        allEqual.map((child) => {
            return child.children[1].innerHTML = `<p>`+child.children[1].outerText+`</p>`;
        })
        axios({
            method:"POST",
            url:'/',
            data:{
                request:'allNotDone',
            }
        })
    } else {
        allEqual.map((child) => {
            return child.children[0].children[0].className = "fas fa-check-circle";
        })
        allEqual.map((child) => {
            return child.children[1].innerHTML = `<s>`+child.children[1].outerText+`</s>`;
        })
        axios({
            method:"POST",
            url:'/',
            data:{
                request:'allDone',
            }
        })
    }
})

setInterval(()=>{
    let arr = [...postList.children]
    let arr2 = arr.map(child => {
        return child.children[1].children[0].tagName
    })
    let check = arr2.indexOf("S") !== -1 ? true : false;
    if(check === false){
        deleteAllCompleted.style.display = "none";
    } else {
        deleteAllCompleted.style.display = "block";
    }
    if(arr.length === 0 || !postList){
        selectAll.style.display = "none";
        deleteAllCompleted.style.display = "none";
    } else {
        selectAll.style.display = "inline";
    }
},1000);
deleteAllCompleted.addEventListener("click",()=>{
    let postListArr = [...postList.children];
    postListArr.forEach(child => {
        if (child.children[0].children[0].className === "fas fa-check-circle"){
            let id = child.children[0].children[0].id;
            child.remove();
            axios({
                method: "POST",
                url:"/",
                data:{
                    request:"delete",
                    id:id
                }
            })
        }
    })
})