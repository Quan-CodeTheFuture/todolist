let postCreate = document.getElementById("post-create");
let postList = document.getElementsByClassName("post-list")[0];
let deleteAllCompleted = document.getElementById("delete-all-completed-button");
let selectAll = document.getElementById("select-all");
let buttonActive = document.getElementById("active-button");
let buttonAll = document.getElementById("all-button");
let buttonCompleted = document.getElementById("completed-button");
let itemLeft = document.getElementById("item-left");
let mode = "all";
let redundant = 0;
let leftItem = [];
(async ()=> {
    if(!localStorage.getItem("session")){
        await axios({
            method:"POST",
            url:"/",
            data:{
                request:"localStorage"
            }
        }).then(session =>{
            localStorage.setItem("session",session.data.sessionId);
        })
    }
})()

function moveCursorToEnd(el) {
    el.selectionStart = el.selectionEnd = el.value.length;
}

buttonActive.addEventListener("click", ()=>{
    mode = "active";
})

buttonCompleted.addEventListener("click", ()=>{
    mode = "completed"
})

buttonAll.addEventListener("click", ()=>{
    mode = "all";
})

setInterval(()=>{
    if(leftItem.length >= 0){
        let arr = [...postList.children];
        let arr2 = arr.map(child => {
            return child.children[1].children[0].tagName
        })
        let check = arr2.indexOf("S") !== -1 ? true : false;
        if(check === false){
            deleteAllCompleted.style.display = "none";
        } else {
            deleteAllCompleted.style.display = "inline";
        }
        if(arr.length === 0 || !postList){
            selectAll.style.display = "none";
            deleteAllCompleted.style.display = "none";
            buttonActive.style.display = "none";
            buttonAll.style.display = "none";
            buttonCompleted.style.display = "none";
            itemLeft.style.display = "none";
        } else {
            selectAll.style.display = "inline";
            buttonActive.style.display = "inline";
            buttonAll.style.display = "inline";
            buttonCompleted.style.display = "inline";
            itemLeft.style.display = "block";
        }

        arr.forEach(child =>{
            if(child.children[1].children[0].tagName === "P"){
                leftItem.push(null);
            }
        })
        itemLeft.innerHTML = (leftItem.length+redundant).toString() + " items left";
        leftItem = [];
    }
    //////////////////////
    if(mode === "all"){
        let arr = [...postList.children]
        arr.forEach((child) => {
            child.style.display = "flex";
        })
        buttonAll.className = "btn btn-lg btn-dark";
        buttonActive.className = "btn btn-danger"
        buttonCompleted.className = "btn btn-danger";
    } else if(mode === "completed") {
        let arr = [...postList.children];
        arr.forEach(child => {
            if(child.children[0].children[0].className !== "fas fa-check-circle"){
                child.style.display = "none";
            } else {
                child.style.display = "flex";
            };
        })
        buttonCompleted.className = "btn btn-lg btn-dark";
        buttonActive.className = "btn btn-danger";
        buttonAll.className = "btn btn-danger";
    } else if (mode === "active"){
        let arr = [...postList.children];
        arr.forEach(child => {
            if(child.children[0].children[0].className !== "far fa-circle"){
                child.style.display = "none";
            } else {
                child.style.display = "flex";
            };
        })
        buttonActive.className = "btn btn-lg btn-dark";
        buttonAll.className = "btn btn-danger"
        buttonCompleted.className = "btn btn-danger";
    }
},100);

postCreate.addEventListener("keyup",async(event) => {
    let postList = event.target.parentElement.parentElement.children[1]
    if(event.keyCode === 13){
        if(postCreate.value===""){
            return;
        }
        let text = postCreate.value;
        postCreate.value = "";
        let textId = await axios({
            method:"POST",
            url:'/',
            data:{
                // content:text,
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
                <p>${text}</p>
            </span>
            <div class="delete-button">
                <i class="fas fa-times" id="${textId.data.id}"></i>
            </div>
        </div>
        `
        postListArr = [...postList.children];
        postListArr = postListArr.map((containerPost) => {
            let isDone = containerPost.children[0].children[0].className === "far fa-circle" ? false: true;
            return {
                id: containerPost.children[0].children[0].id,
                title:containerPost.children[1].children[0].outerText,
                isDone:isDone
            }
        })
        axios({
            method:"POST",
            url:"/",
            data:{
                request:"create exactly",
                tasksList:postListArr
            }
        })
    }
})

document.addEventListener("click",async(event)=>{
    let isDone = false;
    let containerTextPostList = event.target.parentElement.parentElement.children[1];
    if(event.target.tagName === "I"){
        if(event.target.className === "far fa-circle"){
            let text = containerTextPostList.children[0].outerText;    
            event.target.className = "fas fa-check-circle";
            containerTextPostList.innerHTML = "<s>"+text+"</s>";
            isDone = true;
        } else if (event.target.className === "fas fa-check-circle") {
            let text = containerTextPostList.children[0].outerText;    
            event.target.className = "far fa-circle";
            containerTextPostList.innerHTML = "<p>"+text+"</p>";
        }
        let postList = containerTextPostList.parentElement.parentElement
        postListArr = [...postList.children];
        postListArr = postListArr.map((containerPost) => {
            let isDone = containerPost.children[0].children[0].className === "far fa-circle" ? false: true;
            return {
                id: containerPost.children[0].children[0].id,
                title:containerPost.children[1].children[0].outerText,
                isDone:isDone
            }
        })
        axios({
            method:"POST",
            url:"/",
            data:{
                request:"edit",
                tasksList:postListArr
            }
        })
    }
})

document.addEventListener("click",()=>{
    if(event.target.tagName == "I"){
        if(event.target.className === "fas fa-times"){
            let containerPost = event.target.parentElement.parentElement;
            let postList = containerPost.parentElement;
            containerPost.remove();
            let children = postList.children;
            children = [...children];
            children = children.map((containerPost) => {
                let isDone = containerPost.children[0].children[0].className === "far fa-circle" ? false: true;
                return {
                    id: containerPost.children[0].children[0].id,
                    title:containerPost.children[1].children[0].outerText,
                    isDone:isDone
                }
            })
            axios({
                method: "POST",
                url:"/",
                data:{
                    request:"delete",
                    tasksList:children
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
        redundant = 1;
    } else if(event.target.tagName === "SPAN" && event.target.className === "text-post-list" && event.target.children[0].tagName === "P") {
        let textPostList = event.target;
        textPostList.innerHTML = `<input id="task" value="`+ textPostList.outerText + `"/>`;
        textPostList.children[0].focus();
        inputText = textPostList
        moveCursorToEnd(textPostList.children[0]);
        let buttonCheck = inputText.parentElement.children[0];
        buttonCheck.style.display = "none";
        redundant = 1;
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
            redundant = 0;
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
            redundant = 0;
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
            child.children[0].children[0].className = "far fa-circle";
        })
        allEqual.map((child) => {
            child.children[1].innerHTML = `<p>`+child.children[1].outerText+`</p>`;
        })
        allEqual = allEqual.map((child) => {
            return {
                title: child.children[1].outerText,
                isDone: false
            }
        })
        axios({
            method:"POST",
            url:'/',
            data:{
                request:'allDone',
                tasksList:allEqual
            }
        })
    } else {
        allEqual.map((child) => {
            child.children[0].children[0].className = "fas fa-check-circle";
        })
        allEqual.map((child) => {
            child.children[1].innerHTML = `<s>`+child.children[1].outerText+`</s>`;
        })
        allEqual = allEqual.map((child) => {
            return {
                title: child.children[1].outerText,
                isDone: true
            }
        })
        axios({
            method:"POST",
            url:'/',
            data:{
                request:'allDone',
                tasksList:allEqual
            }
        })
    }
})

deleteAllCompleted.addEventListener("click",()=>{
    let postListArr = [...postList.children];
    postListArr.forEach(containerPost => {
        if (containerPost.children[0].children[0].className === "fas fa-check-circle"){
            containerPost.remove();
        }
    })
    postListArr = [...postList.children];
    postListArr = postListArr.map((containerPost) => {
        let isDone = containerPost.children[0].children[0].className === "far fa-circle" ? false: true;
        return {
            id: containerPost.children[0].children[0].id,
            title:containerPost.children[1].children[0].outerText,
            isDone:isDone
        }
    })
    axios({
        method:"POST",
        url:"/",
        data:{
            request:"deleteMany",
            tasksList:postListArr
        }
    })
})