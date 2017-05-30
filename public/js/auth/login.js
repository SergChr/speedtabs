window.onload = function() {
    
    let login = document.querySelector(".login"),
        password = document.querySelector(".password"),
        submitBut = document.querySelector(".submit");
    
    window.onmousemove = function() {
        if(login.value.length <= 4 || password.value.length <= 6) {
            submitBut.disabled = true;
        } else {
            submitBut.disabled = false;
        }
    }
    submitBut.addEventListener("click", function(){
        let data = JSON.stringify({ login: login.value, password: password.value });
        
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/auth/login", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(data);
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;
            if (xhr.status != 200) {
                console.log(xhr.status + ': ' + xhr.statusText);
            } else {
                 if(xhr.responseText == "OK") {
                     window.location.href = "/mytabs/main";
                 } else {
                     document.querySelector(".errorBox").style.display = "block";
                     document.querySelector(".errorBox").innerHTML = xhr.responseText;
                     setTimeout(() => {
                         document.querySelector(".errorBox").style.display = "none";
                     }, 2500);
                 }          
            }

        }
    })
    
}