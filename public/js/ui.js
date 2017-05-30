$(document).ready(() => {

    let configIcon = document.createElement("i");
    configIcon.classList.add("configIcon");
    document.body.appendChild(configIcon);
    $(".configIcon").addClass("fa fa-2x fa-cog");
    $(".configIcon").click(() => {
        $(".configDiv").fadeToggle();
        updateValues();
    });

    function updateValues() {
        $("#newtab").height($(".tab").height());
        $("#newtab").width($(".tab").width());
        $("#newtab").css({
            margin: $("#distance").val() + "px"
        });
        $(".second").html($("#distance").val() + "px");
        $(".third").html($("#widthTabs").val() + "%");
    }

    $(".closeIcon").click(() => {
        $(".configDiv").hide();
    });
    let tabsWidth = $(".tabs").width();
    // default size - 5 columns
    let tabWidth;
    $(".tab").css({
        width: (100 / $("#quantity").val()) - (100 * $("#distance").val() / tabsWidth) + "%"
    });

    $("#quantity").change(() => {
        tabWidth = (100 / $("#quantity").val()) - (100 * $("#distance").val() / tabsWidth) + "%";
        $(".tab").css({
            width: tabWidth
        });
        post_settings();
        setTimeout(updateValues, 200);
    });

    $("#distance").change(() => {
        tabWidth = (100 / $("#quantity").val()) - (100 * $("#distance").val() / tabsWidth) + "%";
        $(".tab").css({
            margin: $("#distance").val() + "px"
        });
        $(".tab").css({
            width: tabWidth
        });
        post_settings();
        setTimeout(updateValues, 200);
    });

    $("#widthTabs").change(() => {
        $(".tabs").css({
            width: $("#widthTabs").val() + "%"
        });
        post_settings();
        setTimeout(updateValues, 200);
    });

    $(".closeWindow").click((e) => {
        e.target.parentElement.style.display = "none";
    });
    setTimeout(updateValues, 200);

    function post_settings() {
        let data = JSON.stringify({
            quantity: $("#quantity").val(),
            distance: $("#distance").val(),
            width: $("#widthTabs").val()
        });
        console.log(`${data}`);
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/settings/set", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(data);
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;
            if (xhr.status != 200) {
                console.log(xhr.status + ': ' + xhr.statusText);
            } else {
                // console.log(xhr.responseText);
            }
        }
    }

    function get_settings() {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/settings/get", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;
            if (xhr.status != 200) {
                console.log(xhr.status + ': ' + xhr.statusText);
            } else {
                let data = JSON.parse(xhr.responseText)["settings"];
                // update Tabs on page
                tabsWidth = $(".tabs").width();
                tabWidth = (100 / data[0]) - (100 * data[1] / tabsWidth) + "%";
                $(".tab").css({
                    width: tabWidth,
                    margin: data[1] + "px"
                });

                $(".tabs").css({
                    width: data[2] + "%"
                });
                $("#newtab").height($(".tab").height());
                $("#newtab").width($(".tab").width());
                $("#newtab").css({
                    margin: data[1] + "px"
                });
                $(".second").html(data[1] + "px");
                $(".third").html(data[2] + "%");
                // update input ranges
                $("#quantity").val(data[0]);
                $("#distance").val(data[1]);
                $("#widthTabs").val(data[2]);
            }
        }
    }
    get_settings();
    
    $("#createCollectionBut").click(() => {
        window.open("/mytabs/"+$("#createCollectionInp").val());
    });
});