setTimeout(function () {

    let windowDiv = document.querySelector(".windowDiv"),

        //all tabs on page
        tabs = document.querySelectorAll(".tabs"),
        contextmenu;

    for (let i = 0; i < tabs.length; i++) {
        // hang 'click' event on each tab element
        tabs[i].addEventListener("click", function (e) {
            if (e.target.parentElement.className == "tab") {
                window.open(e.target.parentElement.getAttribute("data-url"));

                // set counter +1
                let data = JSON.stringify({
                    url: e.target.parentElement.getAttribute("data-url")
                });
               
                let xhr = new XMLHttpRequest();
                xhr.open("POST", "/tab/setCounter", true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(data);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState != 4) return;
                    if (xhr.status != 200) {
                        console.log(xhr.status + ': ' + xhr.statusText);
                    } else {
                        if (xhr.responseText == "OK") {
                            // console.log(xhr.responseText);
                            editCounter(e.target.parentElement);
                        }
                    }
                }
            }
        });
        // if click right mouse button
        tabs[i].oncontextmenu = function(e){
            // if click was on 'tab' element
            if (e.target.parentElement.className == "tab") {
                e.preventDefault();
                // get mouse coordinates
                let coords = getPosition(e);
                // show context menu on particular coordinates
                // manually creating contextmenu with class "contextmenu"
                showTabContextMenu(coords);
                let edit = document.querySelector(".editTab"), // edit button in context menu
                    deleteDiv = document.querySelector(".deleteTab"); // delete button

                // if click on edit button
                edit.addEventListener("click", function () {
                    console.log("edit click");
                    let old_title = e.target.parentElement.querySelector(".title").innerHTML,
                        old_url = e.target.parentElement.getAttribute("data-url"),
                        old_img_url = e.target.parentElement.querySelector("img").getAttribute("src");
                    // show window for edit tab
                    showWindow(old_title.trim(), old_url.trim(), old_img_url.trim());
                    //if click on edit submit button
                    document.querySelector(".editsubmit").onclick = function(){
                        console.log("submit edit click");
                        let title = document.querySelector(".edittitle").value,
                            url = document.querySelector(".editurl").value,
                            img_url = document.querySelector(".editimg_url").value;

                        // send data to server
                        sendEdit(old_title.trim(), old_url.trim(), title.trim(), url.trim(), img_url.trim());
                        // edit tab via JS
                        editTab(e.target.parentElement, title.trim(), url.trim(), img_url.trim());
                    };
                });

                // if click on delete button in context menu
                deleteDiv.onclick = () => {
                    sendDelete(e.target.parentElement);
                };
            }
        };
    }

    function sendEdit(old_title, old_url, title, url, img_url) {
        let data = JSON.stringify({
            old_title: old_title,
            old_url: old_url,
            target_title: title,
            target_url: url,
            target_img_url: img_url
        });

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/tab/edit", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(data);
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;
            if (xhr.status != 200) {
                console.log(xhr.status + ': ' + xhr.statusText);
            } else {
                if (xhr.responseText == "OK") {
                    // hide edit menu
                    document.querySelector(".windowEditDiv").style.display = "none";
                }
            }
        }
    }
    
    function editCounter(target){
        let counter = target.querySelector(".counter").innerHTML;
        let value = Number(counter);
        target.querySelector(".counter").innerHTML = value+1;
    }

    function sendDelete(target) {
        let data = JSON.stringify({
                url: target.getAttribute("data-url")
            }),
            xhr = new XMLHttpRequest();
        xhr.open("POST", "/tab/delete", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
        xhr.onreadystatechange = function () {
            if (xhr.status != 200) {
                console.log(xhr.status + ":" + xhr.statusText);
            } else {
                if (xhr.responseText == "OK") {
                    // delete this tab
                    target.remove();
                }
            }
        }
    }

    function editTab(target, title, url, img_url) {
        console.log(target);
        console.log(title);
        target.setAttribute("data-url", url);
        target.querySelector(".title").innerHTML = title;
        target.querySelector("img").setAttribute("src", img_url);
    }

    function getPosition(e) {
        let posx = 0;
        let posy = 0;

        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft +
                document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop +
                document.documentElement.scrollTop;
        }

        return {
            x: posx,
            y: posy
        }
    }

    function showTabContextMenu(coords) {
        contextmenu = document.querySelector(".contextmenu");
        if (contextmenu != null) {
            contextmenu.remove();
        }

        window.addEventListener("click", function () {
            if (contextmenu != null) {
                contextmenu.remove();
            }
        });

        let div = document.createElement("div");
        div.classList.add("contextmenu");
        div.style.position = "absolute";
        div.style.left = coords.x + "px";
        div.style.top = coords.y + "px";

        let edit = document.createElement("div");
        edit.classList.add("editTab");
        edit.innerHTML = "Edit";

        let deleteDiv = document.createElement("div");
        deleteDiv.innerHTML = "Delete";
        deleteDiv.classList.add("deleteTab");
        div.appendChild(edit);
        div.appendChild(deleteDiv);
        document.body.appendChild(div);

        contextmenu = document.querySelector(".contextmenu");
    }

    function showWindow(title, url, img_url) {
        let div = document.querySelector(".windowEditDiv");
        div.style.display = "block";
        document.querySelector(".edittitle").value = title;
        document.querySelector(".editurl").value = url;
        document.querySelector(".editimg_url").value = img_url;

    }

}, 500);