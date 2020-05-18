(async()=>{
    await axios({
        method:"POST",
        url:'/sessionapi',
        data:{
            session:localStorage.getItem("session")
        }
    })
    window.location.replace("/");
})()
