window.onload = function () {

    let newtab = document.getElementById("newtab"),
        windowDiv = document.querySelector(".windowDiv"),
        submitBut = document.getElementById("submit"),
        titleInp = document.getElementById("title"),
        urlInp = document.getElementById("url"),
        imgUrlInp = document.getElementById("img_url"),
        //all tabs on page
        tabs = document.querySelectorAll(".tabs"),
        path = window.location.pathname.split("/")[2]; // category

    newtab.addEventListener("click", function () {
        windowDiv.style.display = "block";
    });

    submitBut.addEventListener("click", function () {
        let tab = new Tab(titleInp.value, urlInp.value, imgUrlInp.value);
        tab.create();
        tabs = document.querySelectorAll(".tabs");
        titleInp.value = "";
        urlInp.value = "";
        imgUrlInp.value = "";
    });

    class Tab {
        constructor(title, url, img_url) {
            this.title = title;
            this.url = url;
            this.imgUrl = img_url;
        }

        create() {
            let self = this,
                category = path;

            let data = JSON.stringify({
                title: this.title,
                url: this.url,
                imgUrl: this.imgUrl,
                category: category,
                counter: 0
            });

            console.log(data);

            let xhr = new XMLHttpRequest();
            xhr.open("POST", "/tab/create", true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(data);
            xhr.onreadystatechange = function () {
                if (xhr.readyState != 4) return;
                if (xhr.status != 200) {
                    console.log(xhr.status + ': ' + xhr.statusText);
                } else {
                    if (xhr.responseText == "OK") {
                        windowDiv.style.display = "none";
                        // append tab
                        self.appendTab(self.title, self.url, self.imgUrl);
                    }
                }
            }
        }

        appendTab(title, url, imgUrl) {
            let tab = document.createElement("div");
            tab.classList.add("tab");
            tab.setAttribute("data-url", url);

            let img = document.createElement("img");
            img.setAttribute("src", imgUrl);

            let titleDiv = document.createElement("div");
            titleDiv.classList.add("title");
            titleDiv.innerHTML = title;

            let counter = document.createElement("div");
            counter.classList.add("counter");
            counter.style.color = "#fff";
            counter.innerHTML = "0";

            tab.appendChild(img);
            tab.appendChild(titleDiv);
            tab.appendChild(counter);
            document.querySelector(".tabs").insertBefore(tab, newtab);

            function updateTabs() {
                let tabsWidth = $(".tabs").width();
                $("#newtab").height($(".tab").height());
                $("#newtab").width($(".tab").width());
                $("#newtab").css({
                    margin: $("#distance").val() + "px"
                });
                $(".tab").css({
                    width: (100 / $("#quantity").val()) - (100 * $("#distance").val() / tabsWidth) + "%"
                });
            }
            // update css of Tabs with 200 ms delay
            setTimeout(updateTabs, 200);
        }
    }


}